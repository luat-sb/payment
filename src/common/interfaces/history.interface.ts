export interface IPayloadCreateHistory {
  userId: string;
  fullName?: string;
  amount: number;
  status: boolean;
  metadata: any;
  stripeId: string;
}
