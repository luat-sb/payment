import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPayloadUpdateToken, IQueryMessage, encodePassword } from 'src/common';
import { User } from 'src/database';
import { StripeService } from '../stripe';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
    private readonly stripeService: StripeService,
  ) {}

  async onModuleInit() {
    try {
      const admin = this.configService.get<User>('adminUser');
      await this.initAdmin(admin);
      console.info('Initialized');
    } catch (error) {
      console.error(error.message || 'Init failed');
    }
  }

  async getOne(id: string) {
    try {
      const user = await this.userModel.findOne(
        { id },
        { password: 0, token: 0 },
      );

      return user;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async initAdmin(payload: Partial<User>) {
    try {
      const { password, username, fullName } = payload;
      if (!password) throw new BadRequestException('Empty password');

      const hashPwd = encodePassword(password);

      const newUser = new this.userModel(
        Object.assign(payload, { password: hashPwd }),
      );

      const checkExisted = await this.findUser(username);

      if (checkExisted) throw new BadRequestException('Account existed');

      return newUser.save();
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getListUser(payload: IQueryMessage<User>) {
    try {
      const { page, size, queryFields, orderFields } = payload;
      const [where, sort] = [{}, {}];

      const { id, ...restQuery } = queryFields;
      if (id) Object.assign(where, { id });
      for (const key in restQuery) {
        Object.assign(where, {
          [key]: { $regex: `${restQuery[key]}.*`, $options: 'i' },
        });
      }

      for (const key in orderFields) {
        Object.assign(sort, { [key]: orderFields[key] });
      }

      const [results, total] = await Promise.all([
        this.userModel.find(
          where,
          { id: 1, fullName: 1, username: 1, createdAt: 1 },
          {
            sort,
            skip: (page - 1) * size,
            limit: size,
          },
        ),
        this.userModel.countDocuments(where),
      ]);

      return { results, total };
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(payload: Partial<User>) {
    try {
      const { password, username, fullName } = payload;
      if (!password) throw new BadRequestException('Empty password');

      const hashPwd = encodePassword(password);

      const newUser = new this.userModel(
        Object.assign(payload, { password: hashPwd }),
      );

      const checkExisted = await this.findUser(username);

      if (checkExisted) throw new BadRequestException('Account existed');

      const stripeCustomer = await this.stripeService.createCustomer({
        name: fullName,
        email: username,
      });

      Object.assign(newUser, { stripeId: stripeCustomer.id });

      return newUser.save();
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUser(username: string) {
    try {
      return await this.userModel.findOne({ username });
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(userId: string, payload: Partial<User>) {
    try {
      const { password } = payload;

      if (password) {
        const hashPwd = encodePassword(password);
        Object.assign(payload, { password: hashPwd });
      }

      return await this.userModel.updateOne({ id: userId }, payload);
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateToken(userId: string, payload: IPayloadUpdateToken) {
    try {
      return await this.userModel.updateOne({ id: userId }, payload);
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: string) {
    try {
      return await this.userModel.deleteOne({ id });
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
