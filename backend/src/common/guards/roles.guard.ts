import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

interface JwtPayload {
  sub: number;
  email: string;
  role: 'CLIENT' | 'PRESTATAIRE' | 'ADMIN';
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const user = request.user as JwtPayload;

    return !!user && requiredRoles.includes(user.role);
  }
}
