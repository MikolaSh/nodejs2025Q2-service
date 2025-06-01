import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UserSercvice {
  private users: Array<User> = [
    {
      id: 'adssd',
      login: 'sdffds',
      password: 'adfsdf',
      version: 1,
      createdAt: 123,
      updatedAt: 123,
    },
  ];

  getAll() {
    return this.users;
  }

  getById(id: string) {
    return this.users.find((user) => user.id === id);
  }
}
