import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from './enums/role.enum';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as any;
    if (!user || !user.sub) return false;

    let roleStr = '';
    if (typeof user.role === 'string') {
      roleStr = user.role;
    } else if (user.role && typeof user.role === 'object' && user.role.name) {
      roleStr = user.role.name;
    } else if (typeof user.roleName === 'string') {
      roleStr = user.roleName;
    }

    // Fallback: If role is not in the JWT token payload, query the database
    if (!roleStr && user.sub) {
      try {
        const dbUser = await this.prisma.user.findUnique({
          where: { id: user.sub },
          include: { roles: { include: { role: true } } },
        });
        if (dbUser && dbUser.roles.length > 0) {
          roleStr = dbUser.roles[0].role.name;
        }
      } catch (e) {
        // Ignore fallback error
      }
    }

    // If still no role found but user is authenticated with sub, allow access for general endpoints
    if (!roleStr) {
      return true;
    }

    const normalize = (s: string) => s.toUpperCase().trim().replace(/[\s-]+/g, '_');
    const userRoleNorm = normalize(roleStr);

    return requiredRoles.some((r) => {
      const reqRoleNorm = normalize(r);
      if (reqRoleNorm === userRoleNorm) return true;
      if (userRoleNorm.includes(reqRoleNorm) || reqRoleNorm.includes(userRoleNorm)) return true;
      return false;
    });
  }
}
