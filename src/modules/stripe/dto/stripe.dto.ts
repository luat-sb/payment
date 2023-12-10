import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IChargePayload, ICheckoutSession, ILineItem, IPaymentIntent } from 'src/common';

export class ChargeDto implements IChargePayload {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;
}

export class LineItemDto implements ILineItem {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  price: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CheckoutSessionDto implements ICheckoutSession {
  @ApiProperty({ required: true, type: LineItemDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineItemDto)
  line_items: LineItemDto[];
}


export class PaymentIntentDto implements IPaymentIntent {
  @ApiProperty({ required: true })
  @IsNumber()
  amount: number;
}
