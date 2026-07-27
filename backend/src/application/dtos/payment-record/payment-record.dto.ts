import {
  PaymentRecordMethod,
  PaymentRecordStatus,
} from "../../../domain/entities/PaymentRecord";

// ── Record a payment ─────────────────────────────────────────────────────────
export interface RecordPaymentDTO {
  periodDate?: string | Date;
  status?: PaymentRecordStatus;
  method?: PaymentRecordMethod;
  notes?: string;
  receiptUrl?: string;
  amount?: number;
}

// ── Update ────────────────────────────────────────────────────────────────────
export interface UpdatePaymentRecordDTO {
  status?: PaymentRecordStatus;
  method?: PaymentRecordMethod;
  notes?: string;
  receiptUrl?: string;
  amount?: number;
  paidAt?: Date | string;
}

// ── Response ──────────────────────────────────────────────────────────────────
export interface PaymentRecordResponseDTO {
  _id: string;
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