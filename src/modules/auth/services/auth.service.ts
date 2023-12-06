import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { comparePasswords } from 'src/common';
import { User } from 'src/database';
import { TokenService } from './token.service';
import { UserService } from './user.service';

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

    if (isCorrectPassword) return user;

    return null;
  }

  async login(username: string, userId: string) {
    try {
      const access_token = this.tokenService.generateToken(username, userId);
      const refresh_token = this.tokenService.generateToken(username, userId);
      const expired_date = this.tokenService.generateExpireDate();

      await this.userService.update(userId, {
        token: refresh_token,
        tokenExpiredDate: expired_date,
      });

      return {
        access_token,
        refresh_token,
        expire: expired_date,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async logout(userId: string): Promise<void> {
    try {
      await this.userService.update(userId, {
        token: null,
        tokenExpiredDate: null,
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async signup(payload: Partial<User>) {
    try {
      const { username } = payload;
      const checkExisted = await this.userService.findUser(username);

      if (checkExisted) throw new BadRequestException('Account existed');

      const newUser = await this.userService.createUser(payload);

      return newUser;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
