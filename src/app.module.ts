import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { StripeModuleOptions } from './common';
import configuration from './configuration';
import { AuthModule, StripeModule } from './modules/';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    StripeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get<StripeModuleOptions>('stripe'),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get<MongooseModuleFactoryOptions>('mongodb'),
    }),
    AuthModule,
  ],
})
export class AppModule {}
