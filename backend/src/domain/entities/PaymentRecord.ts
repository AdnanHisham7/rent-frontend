export type PaymentRecordStatus = "pending" | "paid" | "overdue" | "waived";
export type PaymentRecordMethod =
  | "cash"
  | "bank_transfer"
  | "upi"
  | "cheque"
  | "card"
  | "other";

export interface IPaymentRecord {
  _id?: string;
  tenantId: string;
  buildingId: string;
  unitId?: string;
  periodLabel: string;
  periodStart: Date;
  periodEnd: Date;
  amount: number;
  status: PaymentRecordStatus;
  paidAt?: Date;
  method?: PaymentRecordMethod;
  notes?: string;
  receiptUrl?: string;
  recordedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}
