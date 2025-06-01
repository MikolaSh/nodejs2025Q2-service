import { Controller, Get, Param } from '@nestjs/common';
import { UserSercvice } from './user.service';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserSercvice) {}

  @Get()
  getAllUsers() {
    return this.userService.getAll();
  }

  @Get(':id')
  getUser(@Param('id') id: string): User | { error: string } {
    const user = this.userService.getById(id);

    if (!user) {
      return { error: 'user not found' };
    }

    return user;
  }
}
