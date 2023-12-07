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

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      const admin = this.configService.get<User>('adminUser');
      await this.createUser(admin);
      console.info('Initialized');
    } catch (error) {
      console.error(error.message || 'Init failed');
    }
  }

  async getListUser(payload: IQueryMessage<User>) {
    try {
      const { page, size, queryFields, orderFields } = payload;
      const where = {};
      const sort = {};

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
          { id: 1, fullName: 1, username: 1 },
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
      console.log(error);

      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(payload: Partial<User>) {
    try {
      const { password, username } = payload;
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
