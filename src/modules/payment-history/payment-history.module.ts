import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentHistory,
  PaymentHistorySchema,
  User,
  UserSchema,
} from 'src/database';
import { PaymentHistoryController } from './payment-history.controller';
import { PaymentHistoryService } from './payment-history.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentHistory.name, schema: PaymentHistorySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PaymentHistoryController],
  providers: [PaymentHistoryService],
  exports: [PaymentHistoryService],
})
export class PaymentHistoryModule {}
