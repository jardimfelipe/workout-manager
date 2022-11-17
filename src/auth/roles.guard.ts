import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";
import { RolesEnum } from "./schemas/auth.schema";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()]
    );
    if (!requiredRoles) {
      return true;
    }
    const req = ctx.switchToHttp().getRequest();
    return requiredRoles.some((role) => req.user.role === role);
  }
}
