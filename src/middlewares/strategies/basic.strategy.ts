import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() { // private authService: IAuthService, // @Inject('IAuthService')
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    // const user = await this.authService.validateUser(username, password);
    const user = null;
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
