import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchemaLess } from '../base.entity';

@Schema({
  collection: 'payment_history',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class PaymentHistory extends BaseSchemaLess {
  @Prop({ type: String })
  user: string;

  @Prop({ type: String })
  stripeId: string;

  @Prop({ type: String })
  fullName: string;

  @Prop({ type: Number })
  amount: number;

  @Prop({ type: Boolean })
  status: boolean;

  @Prop({ type: Object })
  metadata?: object;
}
export const PaymentHistorySchema =
  SchemaFactory.createForClass(PaymentHistory);
