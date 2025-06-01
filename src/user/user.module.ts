import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserSercvice } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserSercvice],
})
export class userModule {}
