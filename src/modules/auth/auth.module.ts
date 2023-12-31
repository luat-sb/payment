import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from 'src/database';
import { JwtStrategy, LocalStrategy } from 'src/middlewares';
import { UserModule } from '../user';
import { AuthController } from './auth.controller';
import { AuthService, TokenService } from './services';

const services = [TokenService, AuthService];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<number>('jwt.expire'),
        },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy, ...services],
})
export class AuthModule {}
