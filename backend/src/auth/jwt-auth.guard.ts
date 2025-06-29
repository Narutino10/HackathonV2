import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface JwtPayload {
  sub: number;
  email: string;
  role: 'CLIENT' | 'PRESTATAIRE';
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) return false;

    try {
      const payload: JwtPayload = this.jwtService.verify<JwtPayload>(token);
      (request as Request & { user?: JwtPayload }).user = payload;
      return true;
    } catch {
      return false;
    }
  }
}
