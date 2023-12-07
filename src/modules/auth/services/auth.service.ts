import { HttpException, Injectable } from '@nestjs/common';
import { comparePasswords } from 'src/common';
import { UserService } from '../../user';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  serviceName: string = AuthService.name;
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findUser(username);
    if (!user) return null;

    const isCorrectPassword = comparePasswords(password, user.password || '');

    if (isCorrectPassword) {
      const { id, username } = user;
      return { id, username };
    }

    return null;
  }

  async validateJwt(username: string) {
    const user = await this.userService.findUser(username);
    if (!user || !user.token) return null;

    const { id: userId, fullName } = user;
    return { userId, username, fullName };
  }

  async login(username: string, userId: string) {
    try {
      const access_token = this.tokenService.generateToken(username, userId);
      const expired_date = this.tokenService.generateExpireDate();

      await this.userService.updateToken(userId, {
        token: access_token,
        tokenExpiredDate: expired_date,
      });

      return {
        access_token,
        expire: expired_date,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async logout(userId: string) {
    try {
      await this.userService.updateToken(userId, {
        token: null,
        tokenExpiredDate: null,
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
