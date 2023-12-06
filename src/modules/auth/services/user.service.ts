import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPayloadUpdateToken } from 'src/common';
import { User } from 'src/database';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(payload: Partial<User>) {
    try {
      const newUser = new this.userModel(payload);
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

  async update(userId: string, payload: IPayloadUpdateToken) {
    try {
      return await this.userModel.updateOne({ id: userId }, payload);
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
