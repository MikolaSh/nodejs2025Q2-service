import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { v4 as uuidv4, validate as isUUID } from 'uuid';
import { UpdatePasswordDto } from './dto/update-password.dto';
// import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    Logger.log('Fetched users from DB:', JSON.stringify(users));

    const transformed = users.map((user) => new UserResponseDto(user));
    Logger.log(`Запрос всех пользователей`, 'UserService');
    Logger.log(JSON.stringify(users), 'UserService');
    Logger.log('Transformed users:', JSON.stringify(transformed));

    return transformed;
  }

  async getById(id: string): Promise<UserResponseDto> {
    const user = await this.findUserById(id);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  private async findUserById(id: string): Promise<User> {
    if (!isUUID(id)) {
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

    const now = Date.now();
    const user = this.userRepository.create({
      id: uuidv4(),
      login,
      password,
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
    return plainToInstance(UserResponseDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
