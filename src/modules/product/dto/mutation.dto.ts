import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { Product } from 'src/database';

export class CreateProductDto implements Product {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  name: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
