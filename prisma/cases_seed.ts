import { PrismaClient, IncidentStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting Cases Seeding Script...");

    // 1. Clear all existing case-related data in dependency order
    console.log("🧹 Clearing all case-related tables...");
    await prisma.incidentSLATracking.deleteMany();
    await prisma.incidentAssignment.deleteMany();
    await prisma.incidentComment.deleteMany();
    await prisma.incidentStatusLog.deleteMany();
    await prisma.investigation.deleteMany();
    await prisma.incidentMedia.deleteMany();
    await prisma.impactedPerson.deleteMany();
    await prisma.invoiceAction.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.approvalAttachment.deleteMany();
    await prisma.approval.deleteMany();
    await prisma.correctiveAction.deleteMany();
    await prisma.incident.deleteMany();
    console.log("🗑️ Case-related tables cleared!");

    // 2. Fetch the reporting employee
    let employee = await prisma.user.findFirst({
        where: { email: { startsWith: "employee" } },
    });

    if (!employee) {
        throw new Error(`No employee user found. Please ensure core seeds have run.`);
    }

    // Ensure employee has department and province set
    const firstDept = await prisma.department.findFirst();
    const gautengProvince = await prisma.province.findFirst({ where: { name: "Gauteng" } });

    if (!employee.departmentId || !employee.provinceId) {
        employee = await prisma.user.update({
            where: { id: employee.id },
            data: {
                departmentId: employee.departmentId ?? firstDept?.id,
                provinceId: employee.provinceId ?? gautengProvince?.id,
            },
        });
        console.log("👤 Employee department & province synchronized.");
    }

    // 3. Fetch resources for relationship associations
    const buildings = await prisma.building.findMany();
    if (buildings.length === 0) {
        throw new Error("No buildings found in the database. Please seed buildings first.");
    }

    const ohsPractitioner = await prisma.user.findFirst({
        where: { email: { startsWith: "ohspractitioner" } },
    });
    const thandiNkosi = await prisma.user.findFirst({
        where: { email: { contains: "free" } }, // Free State practitioner
    }) || ohsPractitioner;
    const supervisor = await prisma.user.findFirst({
        where: { email: { startsWith: "supervisor" } },
    });

    // 4. Define Case Data (10 highly realistic incidents)
    const casesToSeed = [
        {
            incidentNumber: "INC-10001",
            category: "safety",
            severity: "medium",
            status: IncidentStatus.NEW,
            description: "An employee slipped and fell near the main entrance lobby due to a wet floor that had no warning signage posted by the cleaning staff.",
            location: "Main Entrance Lobby, Ground Floor",
            peopleImpacted: 1,
            impactedPersonName: "Lerato Modise",
            impactedPersonEmail: "lerato.modise@dlrrd.gov.za",
            occurredAtDaysAgo: 2,
            immediateActions: ["first_aid", "management"],
            otherActions: "Spill dry powder applied and warning cones placed immediately.",
            impact: "Minor sprain to the left wrist, treated with first aid on-site.",
            latitude: -25.7461,
            longitude: 28.1881,
        },
        {
            incidentNumber: "INC-10002",
            category: "equipment",
            severity: "critical",
            status: IncidentStatus.ASSIGNED,
            description: "Main server room air conditioning unit has failed. Temperature has risen to 32 degrees Celsius, causing server fans to run at maximum speed and posing a high risk of equipment damage or fire.",
            location: "Server Room, 3rd Floor",
            peopleImpacted: 0,
            occurredAtDaysAgo: 1,
            immediateActions: ["isolated", "maintenance_alerted"],
            otherActions: "Portable fans deployed temporarily and non-essential backup servers shut down to reduce heat load.",
            impact: "Possibility of database corruption and hardware degradation if not resolved within hours.",
            latitude: -25.7455,
            longitude: 28.1890,
            assignee: ohsPractitioner,
        },
        {
            incidentNumber: "INC-10003",
            category: "environmental",
            severity: "high",
            status: IncidentStatus.UNDER_INVESTIGATION,
            description: "Multiple containers of industrial cleaning agents and solvents were found stored upright but unsecured on top-tier shelves, violating liquid storage safety protocols.",
            location: "Facilities Chemical Store, Basement",
            peopleImpacted: 0,
            occurredAtDaysAgo: 3,
            immediateActions: ["area_secured", "environment_team"],
            otherActions: "Lowered containers to ground-level chemical cabinets with secondary containment bunds.",
            impact: "Risk of chemical spill, toxic vapor inhalation, and soil contamination if shelf collapsed.",
            latitude: -26.2041,
            longitude: 28.0473,
            assignee: thandiNkosi,
        },
        {
            incidentNumber: "INC-10004",
            category: "security",
            severity: "high",
            status: IncidentStatus.UNDER_PSSC_RECOMMENDATION,
            description: "An external contractor was found browsing files in the restricted land deeds records archive without an escort or authorization badge.",
            location: "Land Deeds Archive Room, 1st Floor",
            peopleImpacted: 0,
            occurredAtDaysAgo: 4,
            immediateActions: ["access_revoked", "security_team"],
            otherActions: "Contractor escorted off the premises and access card temporarily deactivated pending supervisor review.",
            impact: "Potential data breach or loss of physical land title records.",
            latitude: -29.0852,
            longitude: 26.1596,
            assignee: ohsPractitioner,
        },
        {
            incidentNumber: "INC-10005",
            category: "safety",
            severity: "critical",
            status: IncidentStatus.NEW,
            description: "The main breaker panel cover in the corridor adjacent to the training room was left hanging open, exposing live 220V wires within reach of passersby.",
            location: "East Wing Corridor, 2nd Floor",
            peopleImpacted: 0,
            occurredAtDaysAgo: 0, // Today
            immediateActions: ["cordoned", "emergency"],
            otherActions: "Maintenance contacted and electrical panel locked using temporary padlock.",
            impact: "Severe risk of electrocution to employees and visitors.",
            latitude: -33.9249,
            longitude: 18.4241,
        },
        {
            incidentNumber: "INC-10006",
            category: "health",
            severity: "low",
            status: IncidentStatus.ASSIGNED,
            description: "HVAC ventilation extract fan in the male and female ablution blocks has stopped functioning, leading to stagnant air, foul odor, and condensation buildup on walls.",
            location: "Central Ablution Facilities, 4th Floor",
            peopleImpacted: 25,
            occurredAtDaysAgo: 5,
            immediateActions: ["management", "other"],
            otherActions: "Opened windows manually to facilitate natural cross-ventilation.",
            impact: "Unsanitary working conditions and respiratory discomfort for employees.",
            latitude: -29.8587,
            longitude: 31.0218,
            assignee: thandiNkosi,
        },
        {
            incidentNumber: "INC-10007",
            category: "safety",
            severity: "critical",
            status: IncidentStatus.UNDER_INVESTIGATION,
            description: "The push-bar panic latch on the northern emergency escape stairwell door is cracked and does not open when pressure is applied, blockading a key egress route.",
            location: "Northern Fire Escape Stairwell, Ground Floor",
            peopleImpacted: 0,
            occurredAtDaysAgo: 6,
            immediateActions: ["cordoned", "management"],
            otherActions: "Placed warning sign on door advising alternate exit route and alerted security.",
            impact: "Serious fire safety code violation; potential entrapment during evacuation.",
            latitude: -25.7461,
            longitude: 28.1881,
            assignee: ohsPractitioner,
        },
        {
            incidentNumber: "INC-10008",
            category: "health",
            severity: "medium",
            status: IncidentStatus.CLOSED,
            description: "Strong chemical odors and toxic fumes from floor varnishing in the adjacent office caused three employees to experience dizziness, nausea, and headaches.",
            location: "Open Plan Office Cubicles, 3rd Floor",
            peopleImpacted: 3,
            impactedPersonName: "Johan Botha",
            impactedPersonEmail: "johan.botha@dlrrd.gov.za",
            occurredAtDaysAgo: 8,
            immediateActions: ["first_aid", "isolated_person"],
            otherActions: "Evacuated affected staff to fresh air area and paused varnishing work until after hours.",
            impact: "Three employees sent home on sick leave; temporary disruption to regional operations.",
            latitude: -33.9249,
            longitude: 18.4241,
            assignee: ohsPractitioner,
        },
        {
            incidentNumber: "INC-10009",
            category: "environmental",
            severity: "medium",
            status: IncidentStatus.CLOSED,
            description: "A slow drip-leak was identified on the fuel line of the outdoor emergency backup generator, pooling approximately 2 liters of diesel onto the unpaved gravel area.",
            location: "Generator Yard, Outer Perimeter",
            peopleImpacted: 0,
            occurredAtDaysAgo: 10,
            immediateActions: ["contain_spill", "isolated_source"],
            otherActions: "Placed drip tray under the leak and applied absorbent sand to the contaminated gravel.",
            impact: "Minor diesel contamination of soil, posing low fire risk and minor environmental impact.",
            latitude: -26.2041,
            longitude: 28.0473,
            assignee: thandiNkosi,
        },
        {
            incidentNumber: "INC-10010",
            category: "safety",
            severity: "low",
            status: IncidentStatus.CLOSED,
            description: "The 4.5kg dry chemical powder fire extinguisher is missing from its wall bracket in the canteen kitchenette. Only the empty bracket remains.",
            location: "Canteen Kitchenette, Ground Floor",
            peopleImpacted: 0,
            occurredAtDaysAgo: 12,
            immediateActions: ["management"],
            otherActions: "Requisition submitted to safety officer for a replacement fire extinguisher.",
            impact: "Temporary lack of immediate fire suppression capability in a high-risk cooking zone.",
            latitude: -25.7455,
            longitude: 28.1890,
            assignee: ohsPractitioner,
        },
    ];

    console.log(`🚀 Seeding ${casesToSeed.length} cases...`);

    for (let index = 0; index < casesToSeed.length; index++) {
        const item = casesToSeed[index];
        
        // Pick a random building and its department
        const building = buildings[index % buildings.length];
        
        const occurredAt = new Date();
        occurredAt.setDate(occurredAt.getDate() - item.occurredAtDaysAgo);

        // Create Incident
        const incident = await prisma.incident.create({
            data: {
                incidentNumber: item.incidentNumber,
                type: "INCIDENT",
                description: item.description,
                category: item.category,
                severity: item.severity,
                immediateActions: JSON.stringify(item.immediateActions),
                otherActions: item.otherActions,
                impact: item.impact,
                location: item.location,
                peopleImpacted: item.peopleImpacted,
                status: item.status,
                buildingId: building.id,
                departmentId: employee.departmentId,
                reportedById: employee.id,
                latitude: item.latitude,
                longitude: item.longitude,
                occurredAt: occurredAt,
            },
        });

        console.log(`✔️ Created Incident ${incident.incidentNumber} (${incident.category})`);

        // Create Impacted Person if specified
        if (item.peopleImpacted > 0 && item.impactedPersonName) {
            await prisma.impactedPerson.create({
                data: {
                    name: item.impactedPersonName,
                    email: item.impactedPersonEmail || "",
                    incidentId: incident.id,
                },
            });
        }

        // Add Initial NEW Status Log
        await prisma.incidentStatusLog.create({
            data: {
                incidentId: incident.id,
                newStatus: IncidentStatus.NEW,
                oldStatus: IncidentStatus.NEW,
                comments: "Initial incident reported by employee.",
                userId: employee.id,
                changedAt: occurredAt,
            },
        });

        // Handle Assignment details
        if (item.assignee) {
            const assignedBy = supervisor ? supervisor.id : employee.id;
            
            // Create Assignment
            await prisma.incidentAssignment.create({
                data: {
                    incidentId: incident.id,
                    assignedToId: item.assignee.id,
                    assignedById: assignedBy,
                    assignedAt: occurredAt,
                },
            });

            // Add ASSIGNED Status Log
            await prisma.incidentStatusLog.create({
                data: {
                    incidentId: incident.id,
                    newStatus: IncidentStatus.ASSIGNED,
                    oldStatus: IncidentStatus.NEW,
                    comments: `Assigned to ${item.assignee.name} for OHS investigation.`,
                    userId: assignedBy,
                    changedAt: occurredAt,
                },
            });

            // Seed an investigation record
            await prisma.investigation.create({
                data: {
                    incidentId: incident.id,
                    practitionerId: item.assignee.id,
                    notes: `Initial investigation scheduled for ${incident.location}`,
                    startedAt: occurredAt,
                },
            });

            // Seed Corrective Actions for active/completed cases
            if (item.status === IncidentStatus.UNDER_INVESTIGATION || item.status === IncidentStatus.CLOSED) {
                const actionStatus = item.status === IncidentStatus.UNDER_INVESTIGATION ? "in_progress" : "completed";
                const completedAt = actionStatus === "completed" ? new Date() : null;
                
                await prisma.correctiveAction.create({
                    data: {
                        incidentId: incident.id,
                        actionText: `Perform technical inspection and rectify findings at ${item.location}.`,
                        status: actionStatus,
                        notes: `Assigned under standard operating procedure.`,
                        completedAt: completedAt,
                        dueDate: new Date(occurredAt.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days later
                    },
                });
            }
        }

        // Add additional transition logs for completed/closed cases
        if (item.status === IncidentStatus.UNDER_PSSC_RECOMMENDATION) {
            await prisma.incidentStatusLog.create({
                data: {
                    incidentId: incident.id,
                    newStatus: IncidentStatus.UNDER_PSSC_RECOMMENDATION,
                    oldStatus: IncidentStatus.ASSIGNED,
                    comments: "Investigation report submitted. Awaiting supervisor review.",
                    userId: item.assignee?.id || employee.id,
                },
            });
        } else if (item.status === IncidentStatus.CLOSED) {
            const resolverId = item.assignee?.id || employee.id;
            
            await prisma.incidentStatusLog.create({
                data: {
                    incidentId: incident.id,
                    newStatus: IncidentStatus.CLOSED,
                    oldStatus: IncidentStatus.ASSIGNED,
                    comments: "Resolution actions completed, validated, and case officially closed.",
                    userId: resolverId,
                },
            });
        }
    }

    console.log("🎉 Cases seeding finished successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed with error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
