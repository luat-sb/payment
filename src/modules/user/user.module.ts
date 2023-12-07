import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/database';
import { StripeModule } from '../stripe';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    StripeModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
