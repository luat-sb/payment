import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPayloadCreateHistory, IQueryMessage } from 'src/common';
import { PaymentHistory, User } from 'src/database';

@Injectable()
export class PaymentHistoryService {
  constructor(
    @InjectModel(PaymentHistory.name)
    private readonly paymentHistoryModel: Model<PaymentHistory>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getOne(id: string) {
    try {
      const history = await this.paymentHistoryModel.findOne({ id });
      if (!history) throw new NotFoundException();

      return history;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getListPaymentHistory(payload: IQueryMessage<PaymentHistory>) {
    try {
      const { page, size, queryFields, orderFields } = payload;
      const [where, sort] = [{}, {}];

      for (const key in queryFields) {
        Object.assign(where, { [key]: queryFields[key] });
      }

      for (const key in orderFields) {
        Object.assign(sort, { [key]: orderFields[key] });
      }

      const [results, total] = await Promise.all([
        this.paymentHistoryModel
          .aggregate([
            { $match: where },
            { $project: { metadata: 0 } },
            { $sort: sort },
            { $skip: (page - 1) * size },
            { $limit: Number(size) },
            {
              $lookup: {
                from: 'user',
                localField: 'user',
                foreignField: 'id',
                as: 'user',
                pipeline: [{ $project: { id: 1, username: 1, fullName: 1 } }],
              },
            },
          ])
          .exec(),
        this.paymentHistoryModel.countDocuments(where),
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

  async createPaymentHistory(payload: IPayloadCreateHistory) {
    try {
      const { username } = payload;
      const user = await this.userModel.findOne({ username });
      if (!user) throw new NotFoundException('Not found user');

      const newPaymentHistory = new this.paymentHistoryModel(
        Object.assign(payload, { user: user.id }),
      );

      return newPaymentHistory.save();
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
