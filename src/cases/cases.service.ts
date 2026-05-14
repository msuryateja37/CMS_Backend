import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../system/storage.service';
import { NotificationsService } from '../notifications/notifications.service';
import { IncidentStatus } from '@prisma/client';

@Injectable()
export class CasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(userId: string, body: any) {
    // Validate required fields

    // Get user with department and building if buildingId not provided
    let buildingId = body.buildingId;

    if (!buildingId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          department: {
            include: {
              building: true,
            },
          },
        },
      });

      if (user?.department?.building?.id) {
        buildingId = user.department.building.id;
      } else {
        throw new BadRequestException(
          'Building ID is required. User has no associated building in their department.',
        );
      }
    }

    const incidentNumber = body.caseNumber ?? `INC-${Date.now()}`;

    const incident = await this.prisma.incident.create({
      data: {
        id: body.id,
        incidentNumber,
        type: body.type ?? 'INCIDENT',
        category: body.categoryId ?? 'others',
        severity: body.severityLevel ?? body.severity ?? 'medium',
        status: 'RAISED',
        description: body.description ?? '',
        occurredAt: body.occurredAt
          ? new Date(body.occurredAt as string)
          : new Date(),
        reportedById: userId,
        buildingId: buildingId,
        location: body.location,
        latitude: body.latitude
          ? parseFloat(body.latitude as string)
          : undefined,
        longitude: body.longitude
          ? parseFloat(body.longitude as string)
          : undefined,
        immediateActions: body.immediateActions
          ? JSON.stringify(body.immediateActions)
          : null,
        otherActions: body.otherActions,
        peopleImpacted: body.peopleImpacted ?? body.impactedPeople?.length ?? 0,
        impactedPeople:
          body.impactedPeople && body.impactedPeople.length > 0
            ? {
                create: body.impactedPeople.map((person: any) => ({
                  name: person.name,
                  email: person.email,
                  phone: person.phone,
                })),
              }
            : undefined,
        media:
          body.media && body.media.length > 0
            ? {
                create: body.media.map((m: any) => ({
                  fileUrl: m.url,
                  fileType: m.type || 'unknown',
                  uploaderRole: m.uploaderRole,
                  uploadedBy: m.uploadedById
                    ? { connect: { id: m.uploadedById } }
                    : undefined,
                })),
              }
            : undefined,
      },
      include: {
        reportedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        building: {
          select: {
            id: true,
            name: true,
            province: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        impactedPeople: true,
        media: true,
      },
    });

    // Log the incident creation
    await this.addActivity(incident.id, 'RAISED', 'Incident created', userId);

    // Notify all supervisors about the new case
    const supervisors = await this.prisma.user.findMany({
      where: { roles: { some: { role: { name: 'Supervisor' } } } },
      select: { id: true },
    });
    for (const sup of supervisors) {
      await this.notifications.create(
        sup.id,
        'New Case Reported',
        `Case ${incidentNumber} has been reported and requires review.`,
        'cases',
        incident.id,
      );
    }

    // Initialize SLA tracking if matching SLA rule exists
    const sla = await this.prisma.sLA.findFirst({
      where: {
        category: incident.category,
        severity: incident.severity,
      },
    });

    if (sla) {
      const now = new Date();
      await this.prisma.incidentSLATracking.create({
        data: {
          incidentId: incident.id,
          slaId: sla.id,
          responseDueAt: new Date(
            now.getTime() + sla.responseMinutes * 60 * 1000,
          ),
          resolutionDueAt: new Date(
            now.getTime() + sla.resolutionMinutes * 60 * 1000,
          ),
        },
      });
    }

    return incident;
  }

  async list(query: any) {
    const where: any = {};

    if (query.status) where.status = query.status;
    if (query.buildingId) where.buildingId = query.buildingId;
    if (query.reported_by) where.reportedById = query.reported_by;
    if (query.type) where.type = query.type;
    if (query.priorityLevel || query.severity) {
      where.severity = {
        equals: query.priorityLevel || query.severity,
        mode: 'insensitive',
      };
    }
    if (query.categoryId)
      where.category = { equals: query.categoryId, mode: 'insensitive' };
    if (query.isEscalated === 'true') where.isEscalated = true;

    if (query.assignedToId) {
      where.assignments = {
        some: {
          assignedToId: query.assignedToId,
        },
      };
    }

    const take = query.take ? Number(query.take) : 50;
    const skip = query.skip ? Number(query.skip) : 0;

    const [incidents, total] = await Promise.all([
      this.prisma.incident.findMany({
        where,
        include: {
          reportedBy: true,
          building: true,
          assignments: {
            include: { assignedTo: true },
            orderBy: { assignedAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.incident.count({ where }),
    ]);

    return {
      data: incidents.map((i) => this.transformIncident(i)),
      total,
    };
  }

  async getById(idOrNumber: string) {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrNumber,
      );
    const where = isUuid ? { id: idOrNumber } : { incidentNumber: idOrNumber };

    const c = await this.prisma.incident.findFirst({
      where,
      include: {
        reportedBy: true,
        building: {
          include: {
            province: true,
          },
        },
        department: true,
        media: {
          include: {
            uploadedBy: true,
          },
        },
        statusLogs: {
          include: {
            changedBy: true,
          },
          orderBy: { changedAt: 'desc' },
        },
        assignments: {
          include: { assignedTo: true },
          orderBy: { assignedAt: 'desc' },
          take: 1,
        },
        correctiveActions: true,
        approvals: {
          include: { uploadedBy: true, attachments: true },
        },
        comments: {
          include: {
            commentedBy: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!c) throw new NotFoundException('Case not found');

    // Transform for frontend compatibility (appends SAS tokens)
    return this.transformIncident(c);
  }

  async assign(id: string, assignedToId: string, assignedById: string) {
    if (!assignedToId)
      throw new BadRequestException('assignedToId is required');

    const assignedUser = await this.prisma.user.findUnique({
      where: { id: assignedToId },
      select: { name: true },
    });

    await this.prisma.incidentAssignment.create({
      data: {
        incidentId: id,
        assignedToId: assignedToId,
        assignedById: assignedById,
      },
    });

    await this.prisma.incident.update({
      where: { id },
      data: { status: 'ASSIGNED' },
    });

    await this.addActivity(
      id,
      'ASSIGNED',
      `Assigned to ${assignedUser?.name ?? 'practitioner'}`,
      assignedById,
    );

    // Notify the assigned practitioner
    const incident = await this.prisma.incident.findUnique({
      where: { id },
      select: { incidentNumber: true },
    });

    await this.notifications.create(
      assignedToId,
      'Case Assigned to You',
      `Case ${incident?.incidentNumber ?? id} has been assigned to you for investigation.`,
      'cases',
      id,
    );

    return this.getById(id);
  }

  async update(id: string, body: any, userId?: string) {
    const previous = await this.prisma.incident.findUnique({
      where: { id },
      select: { incidentPlan: true },
    });

    const updateData: any = {};
    if (body.severity) updateData.severity = body.severity;
    if (body.status) updateData.status = body.status;
    if (body.description) updateData.description = body.description;
    if (body.buildingId) updateData.buildingId = body.buildingId;
    if (body.departmentId) updateData.departmentId = body.departmentId;
    if (body.incidentPlan !== undefined) updateData.incidentPlan = body.incidentPlan;

    const incident = await this.prisma.incident.update({
      where: { id },
      data: updateData,
      include: {
        department: true,
        building: true,
      },
    });

    if (userId) {
      if (body.incidentPlan !== undefined) {
        const before = previous?.incidentPlan ?? '';
        const after = (body.incidentPlan as string) ?? '';
        if (before !== after) {
          const msg = !after.trim()
            ? 'Incident plan cleared'
            : !before.trim()
              ? 'Incident plan added'
              : 'Incident plan updated';
          await this.appendIncidentTimeline(id, userId, 'PLAN', msg);
        }
      }
      if (body.status) {
        await this.addActivity(
          id,
          body.status,
          `Status updated to ${body.status}`,
          userId,
        );
      }
      if (body.departmentId && incident.department) {
        await this.addActivity(
          id,
          incident.status,
          `Assigned to department: ${incident.department.name}`,
          userId,
        );
      }
    }

    return incident;
  }

  async updateStatus(id: string, status: any, userId?: string) {
    const incident = await this.prisma.incident.update({
      where: { id },
      data: { status },
    });

    if (userId) {
      await this.addActivity(id, status, `Status updated to ${status}`, userId);
    }

    // Notify supervisor when practitioner sends case back for review
    if (status === 'UNDER_REVIEW') {
      // Find the supervisor who last assigned this case
      const lastAssignment = await this.prisma.incidentAssignment.findFirst({
        where: { incidentId: id },
        orderBy: { assignedAt: 'desc' },
        include: { assignedBy: { select: { id: true, name: true } } },
      });
      if (lastAssignment?.assignedBy) {
        await this.notifications.create(
          lastAssignment.assignedBy.id,
          'Case Submitted for Review',
          `Case ${incident.incidentNumber} has been submitted back for your review.`,
          'cases',
          id,
        );
      }
    }

    return incident;
  }

  async escalate(
    id: string,
    userId: string,
    body: { assignedToId: string; reason: string },
  ) {
    const { assignedToId, reason } = body;
    if (!assignedToId)
      throw new BadRequestException('assignedToId is required');
    if (!reason) throw new BadRequestException('Escalation reason is required');

    // Get the escalating user's name for notification
    const escalatingUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    // Update incident with escalation flags
    await this.prisma.incident.update({
      where: { id },
      data: {
        isEscalated: true,
        escalatedAt: new Date(),
        escalationReason: reason,
      },
    });

    // Create new assignment to the peer practitioner
    await this.prisma.incidentAssignment.create({
      data: {
        incidentId: id,
        assignedToId,
        assignedById: userId,
      },
    });

    // Log escalation in activity timeline
    await this.addActivity(
      id,
      'ASSIGNED',
      `Case escalated by ${escalatingUser?.name ?? 'Unknown'}: ${reason}`,
      userId,
    );

    // Notify the new assignee
    const incident = await this.prisma.incident.findUnique({
      where: { id },
      select: { incidentNumber: true },
    });

    await this.notifications.create(
      assignedToId,
      'Case Escalated to You',
      `Case ${incident?.incidentNumber ?? id} has been escalated to you by ${escalatingUser?.name ?? 'a colleague'}. Reason: ${reason}`,
      'cases',
      id,
    );

    return this.getById(id);
  }

  async addEvidence(caseId: string, uploadedById: string, body: any) {
    const media = await this.prisma.incidentMedia.create({
      data: {
        incidentId: caseId,
        fileUrl: body.fileUrl ?? body.storagePath ?? body.path ?? body.url,
        fileType: body.fileType ?? 'unknown',
        uploaderRole: body.uploaderRole,
        uploadedById: uploadedById,
      },
    });
    return {
      ...media,
      fileUrl: this.storage.getAuthenticatedUrl(media.fileUrl),
    };
  }

  async listEvidence(caseId: string) {
    const evidence = await this.prisma.incidentMedia.findMany({
      where: { incidentId: caseId },
      orderBy: { uploadedAt: 'desc' },
    });
    return evidence.map((e) => ({
      ...e,
      fileUrl: this.storage.getAuthenticatedUrl(e.fileUrl),
    }));
  }

  async addCorrectiveAction(incidentId: string, actionText: string) {
    return this.prisma.correctiveAction.create({
      data: {
        incidentId,
        actionText,
      },
    });
  }

  async updateCorrectiveAction(
    incidentId: string,
    actionId: string,
    body: {
      actionText?: string;
      status?: string;
      dueDate?: string | null;
      notes?: string | null;
      completedAt?: string | null;
    },
  ) {
    await this.assertCorrectiveActionOnIncident(incidentId, actionId);
    const data: Record<string, unknown> = {};
    if (body.actionText !== undefined) data.actionText = body.actionText;
    if (body.status !== undefined) {
      data.status = body.status;
      if (body.status === 'completed' && body.completedAt === undefined) {
        data.completedAt = new Date();
      }
    }
    if (body.dueDate !== undefined) {
      data.dueDate = body.dueDate ? new Date(body.dueDate as string) : null;
    }
    if (body.notes !== undefined) data.notes = body.notes;
    if (body.completedAt !== undefined) {
      data.completedAt = body.completedAt
        ? new Date(body.completedAt as string)
        : null;
    }
    return this.prisma.correctiveAction.update({
      where: { id: actionId },
      data,
    });
  }

  private signApprovalRecord(a: any) {
    if (!a) return a;
    return {
      ...a,
      attachments: (a.attachments ?? []).map((att: any) => ({
        ...att,
        fileUrl: this.storage.getAuthenticatedUrl(att.fileUrl),
      })),
    };
  }

  private async assertCorrectiveActionOnIncident(
    incidentId: string,
    actionId: string,
  ) {
    const row = await this.prisma.correctiveAction.findFirst({
      where: { id: actionId, incidentId },
    });
    if (!row) throw new NotFoundException('Corrective action not found');
  }

  private async assertApprovalOnIncident(incidentId: string, approvalId: string) {
    const row = await this.prisma.approval.findFirst({
      where: { id: approvalId, incidentId },
    });
    if (!row) throw new NotFoundException('Approval not found');
  }

  async addApproval(incidentId: string, body: any, uploadedById: string) {
    const files =
      body.files ??
      (body.fileUrl || body.url
        ? [
            {
              fileUrl: body.fileUrl ?? body.url,
              fileName: body.fileName,
              fileType: body.fileType,
            },
          ]
        : []);
    if (!body.roleName)
      throw new BadRequestException('roleName is required');
    if (!Array.isArray(files) || files.length === 0) {
      throw new BadRequestException(
        'At least one file is required (upload files first, then submit)',
      );
    }

    const approval = await this.prisma.approval.create({
      data: {
        incidentId,
        roleName: body.roleName,
        recommenderName: body.recommenderName ?? null,
        recommendationText: body.recommendationText ?? null,
        uploadedById,
        attachments: {
          create: files.map((f: any) => ({
            fileUrl: f.fileUrl ?? f.url,
            fileName: f.fileName ?? null,
            fileType: f.fileType ?? null,
          })),
        },
      },
      include: { attachments: true, uploadedBy: true },
    });
    return this.signApprovalRecord(approval);
  }

  async updateApproval(incidentId: string, approvalId: string, body: any) {
    await this.assertApprovalOnIncident(incidentId, approvalId);
    const data: Record<string, unknown> = {};
    if (body.recommenderName !== undefined)
      data.recommenderName = body.recommenderName;
    if (body.recommendationText !== undefined)
      data.recommendationText = body.recommendationText;
    if (Object.keys(data).length === 0) {
      const existing = await this.prisma.approval.findFirst({
        where: { id: approvalId, incidentId },
        include: { attachments: true, uploadedBy: true },
      });
      if (!existing) throw new NotFoundException('Approval not found');
      return this.signApprovalRecord(existing);
    }
    const approval = await this.prisma.approval.update({
      where: { id: approvalId },
      data,
      include: { attachments: true, uploadedBy: true },
    });
    return this.signApprovalRecord(approval);
  }

  async addApprovalAttachment(
    incidentId: string,
    approvalId: string,
    body: any,
  ) {
    await this.assertApprovalOnIncident(incidentId, approvalId);
    const rawUrl = body.fileUrl ?? body.url;
    if (!rawUrl) throw new BadRequestException('fileUrl is required');
    const att = await this.prisma.approvalAttachment.create({
      data: {
        approvalId,
        fileUrl: rawUrl,
        fileName: body.fileName ?? null,
        fileType: body.fileType ?? null,
      },
    });
    return {
      ...att,
      fileUrl: this.storage.getAuthenticatedUrl(att.fileUrl),
    };
  }

  async deleteApprovalAttachment(
    incidentId: string,
    approvalId: string,
    attachmentId: string,
  ) {
    await this.assertApprovalOnIncident(incidentId, approvalId);
    const att = await this.prisma.approvalAttachment.findFirst({
      where: { id: attachmentId, approvalId },
    });
    if (!att) throw new NotFoundException('Attachment not found');
    await this.prisma.approvalAttachment.delete({ where: { id: attachmentId } });
    return { ok: true };
  }

  async deleteApproval(incidentId: string, approvalId: string) {
    await this.assertApprovalOnIncident(incidentId, approvalId);
    await this.prisma.approval.delete({ where: { id: approvalId } });
    return { ok: true };
  }

  async close(id: string, userId: string) {
    await this.addActivity(id, 'CLOSED', 'Closed by user ' + userId, userId);

    return this.updateStatus(id, 'CLOSED');
  }

  async listCategories() {
    const cats = await this.prisma.incident.findMany({
      distinct: ['category'],
      select: { category: true },
    });
    return cats.map((c) => ({ id: c.category, name: c.category }));
  }

  async createCategory(_body: any) {
    await Promise.resolve();
    return { message: 'Categories are dynamic' };
  }
  async updateCategory(_id: string, _body: any) {
    await Promise.resolve();
    return {};
  }
  async deleteCategory(_id: string) {
    await Promise.resolve();
    return {};
  }

  async softDelete(id: string) {
    return this.prisma.incident.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async createEscalationConfig(_caseId: string, _body: any) {
    await Promise.resolve();
    return {};
  }
  async getEscalationConfig(_caseId: string) {
    await Promise.resolve();
    return {};
  }
  async updateEscalationConfig(_caseId: string, _body: any) {
    await Promise.resolve();
    return {};
  }

  async addActivity(
    incidentId: string,
    status: any,
    comments: string,
    changedById?: string,
  ) {
    if (!changedById) return;

    // Try to map status to IncidentStatus enum, fallback to RAISED if invalid
    let newStatus: IncidentStatus = IncidentStatus.RAISED;

    // Convert string status to Enum if it matches
    const statusUpper =
      typeof status === 'string' ? status.toUpperCase() : status;

    if (Object.values(IncidentStatus).includes(statusUpper as IncidentStatus)) {
      newStatus = statusUpper as IncidentStatus;
    }

    // Get the current status of the incident to use as oldStatus
    const incident = await this.prisma.incident.findUnique({
      where: { id: incidentId },
      select: { status: true },
    });

    await this.prisma.incidentStatusLog.create({
      data: {
        incidentId,
        newStatus: newStatus,
        oldStatus: incident?.status || IncidentStatus.RAISED,
        comments: comments || '',
        userId: changedById,
      },
    });
  }

  private transformIncident(incident: any) {
    if (!incident) return incident;

    const media = incident.media
      ? incident.media.map((m: any) => ({
          ...m,
          fileUrl: this.storage.getAuthenticatedUrl(m.fileUrl),
        }))
      : [];

    const assignedTo =
      incident.assignments && incident.assignments.length > 0
        ? incident.assignments[0].assignedTo
        : undefined;

    const comments = incident.comments
      ? incident.comments.map((c: any) => ({
          id: c.id,
          comment: c.comment,
          user: c.commentedBy ?? { id: c.userId, name: 'Unknown' },
          createdAt: c.createdAt,
        }))
      : [];

    const approvals = incident.approvals
      ? incident.approvals.map((a: any) => this.signApprovalRecord(a))
      : [];

    return {
      ...incident,
      media,
      evidence: media,
      assignedTo,
      comments,
      approvals,
    };
  }

  async addComment(incidentId: string, userId: string, comment: string) {
    if (!comment?.trim()) throw new BadRequestException('Comment is required');

    const created = await this.prisma.incidentComment.create({
      data: {
        incidentId,
        userId,
        comment: comment.trim(),
      },
      include: {
        commentedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return {
      id: created.id,
      comment: created.comment,
      user: created.commentedBy,
      createdAt: created.createdAt,
    };
  }

  async getComments(incidentId: string) {
    const comments = await this.prisma.incidentComment.findMany({
      where: { incidentId },
      include: {
        commentedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return comments.map((c) => ({
      id: c.id,
      comment: c.comment,
      user: c.commentedBy,
      createdAt: c.createdAt,
    }));
  }

  /**
   * Structured timeline entry stored in IncidentStatusLog.comments as JSON
   * while oldStatus/newStatus mirror the current case status (no workflow change).
   */
  private async appendIncidentTimeline(
    incidentId: string,
    userId: string,
    kind: string,
    message: string,
  ) {
    const incident = await this.prisma.incident.findUnique({
      where: { id: incidentId },
      select: { status: true },
    });
    if (!incident) return;
    await this.prisma.incidentStatusLog.create({
      data: {
        incidentId,
        oldStatus: incident.status,
        newStatus: incident.status,
        comments: JSON.stringify({ tl: kind, m: message }),
        userId,
      },
    });
  }

  private parseTimelinePayload(
    comments: string | null | undefined,
  ): { tl: string; m: string } | null {
    const c = comments?.trim();
    if (!c?.startsWith('{')) return null;
    try {
      const o = JSON.parse(c) as { tl?: string; m?: string };
      if (o?.tl && typeof o.m === 'string') return { tl: o.tl, m: o.m };
    } catch {
      /* ignore */
    }
    return null;
  }

  async getActivityTimeline(idOrNumber: string) {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrNumber,
      );
    let incidentId = idOrNumber;

    if (!isUuid) {
      const incident = await this.prisma.incident.findUnique({
        where: { incidentNumber: idOrNumber },
        select: { id: true },
      });
      if (!incident) throw new NotFoundException('Case not found');
      incidentId = incident.id;
    }

    const [
      logs,
      comments,
      correctiveActions,
      approvals,
      mediaRows,
    ] = await Promise.all([
      this.prisma.incidentStatusLog.findMany({
        where: { incidentId },
        include: {
          changedBy: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { changedAt: 'asc' },
      }),
      this.prisma.incidentComment.findMany({
        where: { incidentId },
        include: {
          commentedBy: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.correctiveAction.findMany({
        where: { incidentId },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.approval.findMany({
        where: { incidentId },
        include: {
          uploadedBy: { select: { id: true, name: true, email: true } },
          attachments: { orderBy: { createdAt: 'asc' } },
        },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.incidentMedia.findMany({
        where: { incidentId },
        include: {
          uploadedBy: { select: { id: true, name: true, email: true } },
        },
        orderBy: { uploadedAt: 'asc' },
      }),
    ]);

    type Row = {
      id: string;
      category: string;
      type: string;
      description: string;
      user?: { id: string; name: string; email?: string } | null;
      timestamp: Date;
    };

    const rows: Row[] = [];

    for (const log of logs) {
      const payload = this.parseTimelinePayload(log.comments);
      if (payload) {
        rows.push({
          id: `tl-${log.id}`,
          category: payload.tl,
          type: payload.tl,
          description: payload.m,
          user: log.changedBy,
          timestamp: log.changedAt,
        });
        continue;
      }
      rows.push({
        id: `st-${log.id}`,
        category: 'STATUS',
        type: log.newStatus as string,
        description:
          log.comments?.trim() ||
          `Status set to ${String(log.newStatus).replace(/_/g, ' ')}`,
        user: log.changedBy,
        timestamp: log.changedAt,
      });
    }

    for (const c of comments) {
      rows.push({
        id: `cm-${c.id}`,
        category: 'COMMENT',
        type: 'COMMENT',
        description: c.comment,
        user: c.commentedBy ?? { id: c.userId, name: 'Unknown' },
        timestamp: c.createdAt,
      });
    }

    for (const ca of correctiveActions) {
      rows.push({
        id: `ca-c-${ca.id}`,
        category: 'CORRECTIVE_ACTION',
        type: 'CORRECTIVE_CREATED',
        description: ca.actionText,
        user: null,
        timestamp: ca.createdAt,
      });
      const createdMs = new Date(ca.createdAt).getTime();
      const updatedMs = new Date(ca.updatedAt).getTime();
      if (updatedMs - createdMs > 2000) {
        rows.push({
          id: `ca-u-${ca.id}`,
          category: 'CORRECTIVE_ACTION',
          type: 'CORRECTIVE_UPDATED',
          description: `Corrective action updated (status: ${ca.status}${ca.dueDate ? `, due ${ca.dueDate.toISOString().slice(0, 10)}` : ''})`,
          user: null,
          timestamp: ca.updatedAt,
        });
      }
    }

    for (const ap of approvals) {
      const who = ap.recommenderName?.trim() || 'Unnamed signatory';
      const n = ap.attachments.length;
      rows.push({
        id: `ap-c-${ap.id}`,
        category: 'APPROVAL',
        type: 'APPROVAL_RECORD',
        description: `${ap.roleName} — ${who} · ${n} file(s)`,
        user: ap.uploadedBy,
        timestamp: ap.createdAt,
      });
      const apCreated = new Date(ap.createdAt).getTime();
      for (const att of ap.attachments) {
        const attMs = new Date(att.createdAt).getTime();
        if (attMs - apCreated > 2000) {
          rows.push({
            id: `ap-f-${att.id}`,
            category: 'APPROVAL_FILE',
            type: 'APPROVAL_FILE_ADDED',
            description: `Additional file on ${ap.roleName}: ${att.fileName || 'Attachment'}`,
            user: ap.uploadedBy,
            timestamp: att.createdAt,
          });
        }
      }
      const apUp = new Date(ap.updatedAt).getTime();
      if (apUp - apCreated > 2000) {
        rows.push({
          id: `ap-u-${ap.id}`,
          category: 'APPROVAL',
          type: 'APPROVAL_UPDATED',
          description: `Approval / recommendation details updated (${ap.roleName})`,
          user: ap.uploadedBy,
          timestamp: ap.updatedAt,
        });
      }
    }

    for (const m of mediaRows) {
      rows.push({
        id: `ev-${m.id}`,
        category: 'EVIDENCE',
        type: 'EVIDENCE_UPLOAD',
        description: `Evidence uploaded${m.uploaderRole ? ` (${m.uploaderRole})` : ''}: ${m.fileType || 'file'}`,
        user: m.uploadedBy,
        timestamp: m.uploadedAt,
      });
    }

    rows.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return rows.map((r) => ({
      id: r.id,
      category: r.category,
      type: r.type,
      description: r.description,
      user: r.user ?? undefined,
      timestamp: r.timestamp.toISOString(),
    }));
  }

  async getSlaTracking() {
    const trackings = await this.prisma.incidentSLATracking.findMany({
      include: {
        incident: {
          select: {
            id: true,
            incidentNumber: true,
            category: true,
            severity: true,
            status: true,
            createdAt: true,
            isEscalated: true,
            assignments: {
              include: { assignedTo: { select: { id: true, name: true } } },
              orderBy: { assignedAt: 'desc' as const },
              take: 1,
            },
          },
        },
        sla: true,
      },
      orderBy: { resolutionDueAt: 'asc' },
    });

    const now = new Date();

    return trackings.map((t) => {
      const responseHoursLeft =
        (t.responseDueAt.getTime() - now.getTime()) / (1000 * 60 * 60);
      const resolutionHoursLeft =
        (t.resolutionDueAt.getTime() - now.getTime()) / (1000 * 60 * 60);
      const totalResolutionHours = t.sla.resolutionMinutes / 60;
      const elapsedHours = totalResolutionHours - resolutionHoursLeft;
      const progress = Math.min(
        100,
        Math.max(0, (elapsedHours / totalResolutionHours) * 100),
      );

      let slaStatus: string;
      if (t.resolutionBreached || resolutionHoursLeft < 0) {
        slaStatus = 'breached';
      } else if (resolutionHoursLeft < totalResolutionHours * 0.25) {
        slaStatus = 'warning';
      } else {
        slaStatus = 'on-track';
      }

      return {
        id: t.id,
        incidentId: t.incident.id,
        incidentNumber: t.incident.incidentNumber,
        category: t.incident.category,
        severity: t.incident.severity,
        status: t.incident.status,
        isEscalated: t.incident.isEscalated,
        assignedTo: t.incident.assignments[0]?.assignedTo ?? null,
        responseDueAt: t.responseDueAt,
        resolutionDueAt: t.resolutionDueAt,
        responseBreached: t.responseBreached,
        resolutionBreached: t.resolutionBreached,
        responseHoursLeft: Math.round(responseHoursLeft * 10) / 10,
        resolutionHoursLeft: Math.round(resolutionHoursLeft * 10) / 10,
        totalResolutionHours,
        progress: Math.round(progress),
        slaStatus,
      };
    });
  }

  async getKpiMetrics() {
    const total = await this.prisma.incident.count();
    return {
      totalCases: total,
      openCases: 0,
      inProgressCases: 0,
      escalatedCases: 0,
      closedCases: 0,
      activeCases: 0,
      avgResponseTime: 0,
      closureRate: 0,
    };
  }

  async getEmployeeStats(userId: string) {
    const total = await this.prisma.incident.count({
      where: { reportedById: userId },
    });
    return {
      activeCases: total,
      pendingActions: 0,
      resolvedCases: 0,
      activeCasesChange: '0%',
      pendingActionsChange: '0%',
      resolvedCasesChange: '0%',
    };
  }

  async getUpcomingHearings(_userId: string) {
    await Promise.resolve();
    return [];
  }
}
