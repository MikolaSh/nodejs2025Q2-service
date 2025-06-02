import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  login: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  password: string;
}
