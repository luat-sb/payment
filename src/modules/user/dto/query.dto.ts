import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IQueryMessage, Sort } from 'src/common';
import { User } from 'src/database';

export class QueryFieldsUser implements Partial<User> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  fullName: string;
}

export class OrderFieldsUser implements Partial<Record<keyof User, Sort>> {
  @ApiProperty({ enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  id: Sort;

  @ApiProperty({ enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  username: Sort;

  @ApiProperty({ enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  createdAt: Sort;
}

export class QueryUserDto implements IQueryMessage<User> {
  @ApiProperty({ required: true, type: QueryFieldsUser })
  @IsObject()
  @ValidateNested()
  @Type(() => QueryFieldsUser)
  queryFields: QueryFieldsUser;

  @ApiProperty({ required: true, type: OrderFieldsUser })
  @IsObject()
  @ValidateNested()
  @Type(() => OrderFieldsUser)
  orderFields: OrderFieldsUser;
}
