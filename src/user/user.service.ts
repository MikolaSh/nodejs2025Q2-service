import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserSercvice {
  private users: Array<User> = [
    {
      id: uuidv4(),
      login: 'Jhon Doe',
      password: 'demo123',
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }
}
