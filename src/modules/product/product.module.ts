import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/database';
import { StripeModule } from '../stripe';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    StripeModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
