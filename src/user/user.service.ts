import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { isValidUUID } from 'src/utils';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/create-response.dto';

@Injectable()
export class UserSercvice {
  private users: Array<User> = [];

  getAll() {
    return this.users;
  }

  getById(id: string): UserResponseDto {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  createUser(login: string, password: string): UserResponseDto {
    const userExists = this.users.some((user) => user.login === login);

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const newUser = {
      id: uuidv4(),
      login,
      password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(newUser);

    return plainToInstance(UserResponseDto, newUser, {
      excludeExtraneousValues: true,
    });
  }

  updatePassword(id: string, { oldPassword, newPassword }: UpdatePasswordDto) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = this.getById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    user.password = newPassword;
    this.setUpdateUser(user);

    return user;
  }

  deleteUser(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const userIndex = this.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    this.users.splice(userIndex, 1);
  }

  private setUpdateUser(user: User) {
    user.version += 1;
    user.updatedAt = Date.now();
  }
}
