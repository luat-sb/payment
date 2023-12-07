import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IChargePayload,
  ICheckoutSession,
  IStripeCustomer,
  STRIPE_PAYMENT_COMPLETED,
  StripeModuleOptions,
} from 'src/common';
import { Product } from 'src/database';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  public readonly stripe: Stripe;
  public readonly currency: string = 'usd';
  public readonly feUrl: string;
  constructor(private readonly configService: ConfigService) {
    const stripeOptions = this.configService.get<StripeModuleOptions>('stripe');
    this.currency = this.configService.get('stripeCurrency');
    this.feUrl = this.configService.get('feUrl');

    const { apiKey, options } = stripeOptions;
    this.stripe = new Stripe(apiKey, options);
  }

  async createCustomer(payload: IStripeCustomer) {
    try {
      return this.stripe.customers.create(payload);
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createProduct(payload: Partial<Product>) {
    try {
      const { name, price } = payload;

      const product = await this.stripe.products.create({
        name,
      });

      if (!product) throw new BadRequestException('Something wrong');

      const priceObj = await this.stripe.prices.create({
        currency: this.currency,
        unit_amount: price,
        product_data: {
          id: product.id,
          name: product.name,
        },
      });

      return { product, priceObj };
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProduct(id: string, payload: Partial<Product>) {
    try {
      return this.stripe.products.update(id, payload);
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProduct(id: string) {
    try {
      return this.stripe.products.del(id);
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async charge({ amount, paymentMethodId, customerId }: IChargePayload) {
    try {
      return this.stripe.paymentIntents.create({
        amount,
        customer: customerId,
        payment_method: paymentMethodId,
        currency: this.currency,
        confirm: false,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createCheckSession(payload: ICheckoutSession) {
    try {
      if (!this.feUrl) throw new BadRequestException('Missing FE domain');

      const { line_items } = payload;
      const dataSession: any = {
        mode: 'payment',
        line_items,
        success_url: `${this.feUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.feUrl}/canceled.html`,
      };

      const session = await this.stripe.checkout.sessions.create(dataSession);

      return session;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async handleHook(payload: any) {
    try {
      const { data, type } = payload;

      if (type === STRIPE_PAYMENT_COMPLETED)
        console.log(`🔔  Payment received!`, data);

      return true;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
