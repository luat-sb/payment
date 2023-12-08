import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentHistory,
  PaymentHistorySchema,
  User,
  UserSchema,
} from 'src/database';
import { PaymentHistoryModule } from '../payment-history';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';

@Module({
  imports: [
    ConfigModule,
    PaymentHistoryModule,
    MongooseModule.forFeature([
      { name: PaymentHistory.name, schema: PaymentHistorySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
