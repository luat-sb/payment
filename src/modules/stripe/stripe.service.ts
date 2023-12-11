import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ICheckoutSession,
  IPaymentIntent,
  IStripeCustomer,
  PAYMENT_INTENT,
  PAYMENT_INTENT_SUCCEED,
  StripeModuleOptions,
} from 'src/common';
import { Product } from 'src/database';
import Stripe from 'stripe';
import { PaymentHistoryService } from '../payment-history';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly currency: string = 'usd';
  private readonly feUrl: string;
  private readonly webhookSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly historyService: PaymentHistoryService,
  ) {
    const stripeOptions = this.configService.get<StripeModuleOptions>('stripe');
    this.currency = this.configService.get('stripeCurrency');
    this.webhookSecret = this.configService.get('stripeWebhookSecret');
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

      const [product, priceObj] = await Promise.all([
        this.stripe.products.create({ name }),
        this.stripe.prices.create({
          currency: this.currency,
          unit_amount: price,
        }),
      ]);

      if (!product || !priceObj)
        throw new BadRequestException('Something wrong');

      await this.stripe.products.update(product.id, {
        default_price: priceObj.id,
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
      console.log(error);
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createPaymentIntent(payload: IPaymentIntent) {
    try {
      const { amount, userStripeId, userId } = payload;

      const dataSession: Stripe.PaymentIntentCreateParams = {
        amount: amount * 100,
        currency: this.currency,
        automatic_payment_methods: { enabled: true },
      };

      if (userStripeId) Object.assign(dataSession, { customer: userStripeId });

      const session = await this.stripe.paymentIntents.create(dataSession);

      await this.historyService.createPaymentHistory({
        userId,
        amount,
        status: false,
        metadata: null,
        stripeId: session.id,
      });

      return session;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async handleIntent(payload: any) {
    const { id, status } = payload;

    const paymentStatus = status === PAYMENT_INTENT_SUCCEED;
    await this.historyService.updatePayment(id, {
      status: paymentStatus,
      metadata: payload,
    });
  }

  async handleHook(payload: any, sig: string | string[]) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        sig,
        this.webhookSecret,
      );

      const { data } = event;
      const { object }: any = data;

      const receiptFunc = {
        [PAYMENT_INTENT]: async () => this.handleIntent(object),
      }[object.object];

      receiptFunc && (await receiptFunc());

      return true;
    } catch (error) {
      console.log(error);
    }
  }
}
