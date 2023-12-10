import Stripe from 'stripe';

export interface StripeModuleOptions {
  apiKey: string;
  options: Stripe.StripeConfig;
}

export interface IStripeCustomer {
  name: string;
  email: string;
}

export interface IChargePayload {
  amount: number;
  paymentMethodId: string;
  customerId?: string;
}

export interface ILineItem {
  price: string;
  quantity: number;
}

export interface ICheckoutSession {
  line_items: ILineItem[];
}

export interface IPaymentIntent {
  amount: number;
  userStripeId?: string
}