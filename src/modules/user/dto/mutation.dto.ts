import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';
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
export class DeleteUserDto {
  @ApiProperty({ required: true, isArray: true })
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}
