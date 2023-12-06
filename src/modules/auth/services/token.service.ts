import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generateToken(username: string, userId: string): string {
    return this.jwtService.sign(
      { username, userId },
      {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.expire') + 's',
      },
    );
  }

  generateExpireDate(): Date {
    const expPeriod = Number(this.configService.get<string>('jwt.expire'));
    const exp = dayjs(new Date()).add(expPeriod, 'seconds').toDate();

    return exp;
  }
}
