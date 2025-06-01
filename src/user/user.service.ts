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

@Injectable()
export class UserSercvice {
  private users: Array<User> = [
    {
      id: uuidv4(),
      login: 'Jhon Doe',
      password: 'demo123',
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  getAll() {
    return this.users;
  }

  getById(id: string) {
    return this.users.find((user) => user.id === id);
  }

  createUser(login: string, password: string): User {
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
    return newUser;
  }

  updatePassword(id: string, { oldPassword, newPassword }: UpdatePasswordDto) {
    if (!this.isValidUUID(id)) {
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

  private setUpdateUser(user: User) {
    user.version += 1;
    user.updatedAt = Date.now();
  }

  private isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
}
