import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/database';

export class CreateUserDto implements Omit<User, 'isAdmin'> {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
