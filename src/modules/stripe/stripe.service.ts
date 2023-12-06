import { Inject, Injectable } from '@nestjs/common';
import { IStripeCustomer, StripeModuleOptions } from 'src/common';
import Stripe from 'stripe';
import { MODULE_OPTIONS_TOKEN } from './builder';

@Injectable()
export class StripeService {
  public readonly stripe: Stripe;
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private stripeOptions: StripeModuleOptions,
  ) {
    const { apiKey, options } = this.stripeOptions;
    this.stripe = new Stripe(apiKey, options);
  }

  async createCustomer(payload: IStripeCustomer) {
    return this.stripe.customers.create(payload);
  }
}
