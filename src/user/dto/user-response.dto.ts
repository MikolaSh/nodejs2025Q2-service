import { Exclude } from 'class-transformer';
import { User } from '../entities/user.entity';

export class UserResponseDto implements Omit<User, 'password'> {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  @Exclude()
  password: string;
}
