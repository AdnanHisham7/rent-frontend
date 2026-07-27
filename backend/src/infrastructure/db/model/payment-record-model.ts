import mongoose, { Document, Schema } from "mongoose";
import {
  IPaymentRecord,
  PaymentRecordStatus,
  PaymentRecordMethod,
} from "../../../domain/entities/PaymentRecord";

export type { IPaymentRecord, PaymentRecordStatus };
export type PaymentMethod = PaymentRecordMethod;

export interface IPaymentRecordDocument
  extends Omit<IPaymentRecord, "_id">, Document {}

const PaymentRecordSchema = new Schema<IPaymentRecordDocument>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    } as any,
    buildingId: {
      type: Schema.Types.ObjectId,
      ref: "Building",
      required: true,
      index: true,
    } as any,
    unitId: { type: Schema.Types.ObjectId, ref: "Unit", default: null } as any,
    periodLabel: { type: String, required: true, trim: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "overdue", "waived"],
      default: "pending",
      index: true,
    },
    paidAt: { type: Date, default: null },
    method: {
      type: String,
      enum: ["cash", "bank_transfer", "upi", "cheque", "card", "other"],
      default: null,
    },
    notes: { type: String, default: null, trim: true },
    receiptUrl: { type: String, default: null },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    } as any,
  },
  { timestamps: true },
);

// Enforce one record per tenant per period at the database level
PaymentRecordSchema.index(
  { tenantId: 1, periodStart: 1, periodEnd: 1 },
  { unique: true },
);
PaymentRecordSchema.index({ buildingId: 1, periodStart: 1 });

export const PaymentRecordModel = mongoose.model<IPaymentRecordDocument>(
  "PaymentRecord",
  PaymentRecordSchema,
);