import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import configuration from './configuration';
import {
  AuthModule,
  PaymentHistoryModule,
  ProductModule,
  StripeModule,
  UserModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get<MongooseModuleFactoryOptions>('mongodb'),
    }),
    AuthModule,
    StripeModule,
    UserModule,
    ProductModule,
    PaymentHistoryModule,
  ],
})
export class AppModule {}
