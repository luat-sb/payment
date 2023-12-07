import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IQueryMessage, Sort } from 'src/common';
import { Product } from 'src/database';

export class QueryFieldsProduct implements Partial<Product> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class OrderFieldsProduct
  implements Partial<Record<keyof Product, Sort>>
{
  @ApiProperty({ enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  id: Sort;

  @ApiProperty({ enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  name: Sort;

  @ApiProperty({ enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  createdAt: Sort;

  @ApiProperty({ enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  price: Sort;
}

export class QueryProductDto implements IQueryMessage<Product> {
  @ApiProperty({ required: true, type: QueryFieldsProduct })
  @IsObject()
  @ValidateNested()
  @Type(() => QueryFieldsProduct)
  queryFields: QueryFieldsProduct;

  @ApiProperty({ required: true, type: OrderFieldsProduct })
  @IsObject()
  @ValidateNested()
  @Type(() => OrderFieldsProduct)
  orderFields: OrderFieldsProduct;
}
