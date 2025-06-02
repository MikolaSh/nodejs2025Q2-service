import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { validate as isUUID } from 'uuid';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { isValidUUID } from 'src/utils';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  private users: User[] = [];

  clearAllUsers() {
    this.users = [];
  }

  getAll(): UserResponseDto[] {
    return this.users.map((u) =>
      plainToInstance(UserResponseDto, u, { excludeExtraneousValues: true }),
    );
  }

  getById(id: string): UserResponseDto {
    const user = this.findUserById(id);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  private findUserById(id: string): User {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  createUser(login: string, password: string): UserResponseDto {
    if (this.users.some((u) => u.login === login)) {
      throw new ConflictException('User already exists');
    }
    const now = Date.now();
    const user: User = {
      id: uuidv4(),
      login,
      password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(user);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  updatePassword(
    id: string,
    { oldPassword, newPassword }: UpdatePasswordDto,
  ): UserResponseDto {
    if (!isValidUUID(id)) throw new BadRequestException('Invalid ID');

    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('User not found');
    if (user.password !== oldPassword)
      throw new ForbiddenException('Old password');

    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  deleteUser(id: string): void {
    if (!isValidUUID(id)) throw new BadRequestException('Invalid ID');
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new NotFoundException('User not found');
    this.users.splice(index, 1);
  }
}
