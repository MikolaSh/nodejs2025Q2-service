import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PUBLIC_ROUTES } from './public.routes';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtGuard: JwtAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const { method, url } = request;

    const isPublic = PUBLIC_ROUTES.some(
      (route) => route.path === url && route.method === method,
    );

    if (isPublic) {
      return true;
    }

    return this.jwtGuard.canActivate(context);
  }
}
