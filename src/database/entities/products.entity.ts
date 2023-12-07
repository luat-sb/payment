import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchemaLess } from '../base.entity';

@Schema({
  collection: 'product',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Product extends BaseSchemaLess {
  @Prop({ type: String })
  stripeId?: string;

  @Prop({ type: String })
  stripePriceId?: string;

  @Prop({ type: String, unique: true })
  name: string;

  @Prop({ type: Number })
  price: number;

  @Prop({ type: String })
  currency?: string;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
