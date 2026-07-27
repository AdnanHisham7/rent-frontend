export interface IRazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

export interface IRazorpayRefund {
  id: string;
  status: string;
}

export interface IRazorpayService {
  createOrder(
    amountInRupees: number,
    receipt: string,
    notes?: Record<string, string>,
  ): Promise<IRazorpayOrder>;

  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string,
  ): boolean;

  verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean;

  createRefund(
    paymentId: string,
    amountInRupees?: number,
  ): Promise<IRazorpayRefund>;
}
