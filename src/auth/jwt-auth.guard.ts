import { Request } from 'express';
import * as crypto from 'crypto';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or malformed token');
    }

    const token = authHeader.replace('Bearer ', '');
    const secret = process.env.JWT_SECRET_KEY;

    try {
      console.log(token);
      console.log(secret);
      const payload = this.verifyJwt(token, secret);

      request['user'] = payload;
      return true;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private verifyJwt(token: string, secret: string): any {
    const [header, payload, signature] = token.split('.');
    const data = `${header}.${payload}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('base64url');

    console.log('expectedSignature', expectedSignature);

    if (expectedSignature !== signature) {
      throw new Error('Invalid signature');
    }

    const decodedPayload = JSON.parse(
      Buffer.from(payload, 'base64url').toString(),
    );

    if (decodedPayload.exp && Date.now() >= decodedPayload.exp * 1000) {
      throw new Error('Token expired');
    }

    return decodedPayload;
  }
}
