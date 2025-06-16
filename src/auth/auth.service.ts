import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { UserService } from 'src/user/user.service';
import { createHmac } from 'crypto';
import { LoginDto } from './dto/login.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private ACCESS_SECRET = process.env.JWT_SECRET_KEY || 'access-secret';
  private REFRESH_SECRET =
    process.env.JWT_SECRET_REFRESH_KEY || 'refresh-secret';
  private TOKEN_EXPIRE_TIME = parseInt(process.env.TOKEN_EXPIRE_TIME) || 60;
  private TOKEN_REFRESH_EXPIRE_TIME =
    parseInt(process.env.TOKEN_REFRESH_EXPIRE_TIME) || 60 * 60 * 24;
  constructor(private readonly userService: UserService) {}

  async singup(dto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.createUser(dto.login, dto.password);
  }

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { login, password } = dto;

    if (typeof login !== 'string' || typeof password !== 'string') {
      throw new BadRequestException('Invalid login or password format');
    }

    const user = await this.userService.getUserByLogin(login);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ForbiddenException('Invalid credentials');
    }

    const payload = { userId: user.id, login: user.login };

    return {
      accessToken: this.signToken(
        payload,
        this.ACCESS_SECRET,
        this.TOKEN_EXPIRE_TIME,
      ),
      refreshToken: this.signToken(
        payload,
        this.REFRESH_SECRET,
        this.TOKEN_REFRESH_EXPIRE_TIME,
      ),
    };
  }

  private signToken(
    payload: object,
    secret: string,
    expiresIn: number,
  ): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const fullPayload = { ...payload, iat: now, exp: now + expiresIn };

    const encode = (data: object) =>
      Buffer.from(JSON.stringify(data))
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    const base64Header = encode(header);
    const base64Payload = encode(fullPayload);

    const signature = createHmac('sha256', secret)
      .update(`${base64Header}.${base64Payload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return `${base64Header}.${base64Payload}.${signature}`;
  }
}
