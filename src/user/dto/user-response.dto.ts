import { Exclude, Expose } from 'class-transformer';
import { User } from '../entities/user.entity';

@Exclude()
export class UserResponseDto {
  constructor(user: User) {
    Object.assign(this, user);

    this.createdAt = Number(this.createdAt);
    this.updatedAt = Number(this.updatedAt);
  }

  @Expose()
  id: string;

  @Expose()
  login: string;

  @Expose()
  version: number;

  @Expose()
  createdAt: number;

  @Expose()
  updatedAt: number;
}
