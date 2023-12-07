import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IQueryMessage } from 'src/common';
import { Product } from 'src/database';
import { StripeService } from '../stripe';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly ProductModel: Model<Product>,
    private readonly stripeService: StripeService,
  ) {}

  async getOne(id: string) {
    try {
      const product = await this.ProductModel.findOne({ id });
      if (!product) throw new NotFoundException();

      return product;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getListProduct(payload: IQueryMessage<Product>) {
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
        this.ProductModel.find(
          where,
          {},
          {
            sort,
            skip: (page - 1) * size,
            limit: size,
          },
        ),
        this.ProductModel.countDocuments(where),
      ]);

      return { results, total };
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createProduct(payload: Partial<Product>) {
    try {
      const { name } = payload;

      const checkExisted = await this.findProduct(name);

      if (checkExisted) throw new BadRequestException('Product existed');

      const { product, priceObj } =
        await this.stripeService.createProduct(payload);

      const newProduct = new this.ProductModel(
        Object.assign(payload, {
          stripeId: product.id,
          stripePriceId: priceObj.id,
        }),
      );

      return newProduct.save();
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findProduct(name: string) {
    try {
      return await this.ProductModel.findOne({ name });
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, payload: Partial<Product>) {
    try {
      const { name } = payload;
      const product = await this.getOne(id);

      if (name) {
        const checkExisted = await this.findProduct(name);
        if (checkExisted) throw new BadRequestException('Product existed');
      }

      await Promise.all([
        this.ProductModel.updateOne({ id }, payload),
        this.stripeService.updateProduct(product.stripeId, payload),
      ]);

      return true;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProduct(id: string) {
    try {
      const product = await this.getOne(id);
      await Promise.all([
        this.stripeService.deleteProduct(product.stripeId),
        this.ProductModel.deleteOne({ id }),
      ]);

      return true;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
