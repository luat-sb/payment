import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IQueryMessage, Sort } from 'src/common';
import { PaymentHistory } from 'src/database';

export class QueryFieldsPaymentHistory implements Partial<PaymentHistory> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  user: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}

export class OrderFieldsPaymentHistory
  implements Partial<Record<keyof PaymentHistory, Sort>>
{
  @ApiProperty({ enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  id: Sort;

  @ApiProperty({ enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  amount: Sort;

  @ApiProperty({ enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  createdAt: Sort;

  @ApiProperty({ enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  status: Sort;
}

export class QueryPaymentHistoryDto implements IQueryMessage<PaymentHistory> {
  @ApiProperty({ required: true, type: QueryFieldsPaymentHistory })
  @IsObject()
  @ValidateNested()
  @Type(() => QueryFieldsPaymentHistory)
  queryFields: QueryFieldsPaymentHistory;

  @ApiProperty({ required: true, type: OrderFieldsPaymentHistory })
  @IsObject()
  @ValidateNested()
  @Type(() => OrderFieldsPaymentHistory)
  orderFields: OrderFieldsPaymentHistory;
}
