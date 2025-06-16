import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { v4 as uuidv4, validate } from 'uuid';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    const transformed = users.map((user) => new UserResponseDto(user));

    return transformed;
  }

  async getById(id: string): Promise<UserResponseDto> {
    const user = await this.findUserById(id);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async getUserByLogin(login: string): Promise<User> {
    if (!login) {
      throw new BadRequestException('Invalid login');
    }

    const user = await this.userRepository.findOne({ where: { login } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async findUserById(id: string): Promise<User> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(login: string, password: string): Promise<UserResponseDto> {
    const existing = await this.userRepository.findOne({ where: { login } });
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const now = Date.now();
    const user = this.userRepository.create({
      id: uuidv4(),
      login,
      password: hashedPassword,
      version: 1,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.userRepository.save(user);
    return new UserResponseDto(saved);
  }

  async updatePassword(
    id: string,
    { oldPassword, newPassword }: UpdatePasswordDto,
  ): Promise<UserResponseDto> {
    const user = await this.findUserById(id);

    if (user.password !== oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    const updated = await this.userRepository.save(user);
    return new UserResponseDto(updated);
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
