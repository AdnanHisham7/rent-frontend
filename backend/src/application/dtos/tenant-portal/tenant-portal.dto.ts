import { RentType, TenantStatus } from "../../../domain/entities/Tenant";
import { PaymentRecordStatus } from "../../../domain/entities/PaymentRecord";

export interface TenantLoginDTO {
  email: string;
  password: string;
}

export interface TenantSetPasswordDTO {
  token: string;
  password: string;
}

export interface TenantPortalUnitSummaryDTO {
  _id: string;
  unitNumber: string;
  floorNumber: string;
  bedrooms: number;
  bathrooms: number;
  amenities?: string[];
  images?: string[];
}

export interface TenantPortalBuildingSummaryDTO {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

export interface TenantPortalProfileDTO {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  status: TenantStatus;
  rentAmount: number;
  rentType: RentType;
  dueDate: number;
  moveInDate?: Date;
  unit?: TenantPortalUnitSummaryDTO;
  building?: TenantPortalBuildingSummaryDTO;
}

export interface TenantPortalAuthResultDTO {
  token: string;
  tenant: TenantPortalProfileDTO;
}

export interface TenantDueSummaryDTO {
  currentPeriodLabel: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  amountDue: number;
  isPaidForCurrentPeriod: boolean;
  lastPaymentDate?: Date;
}

export interface TenantPortalPaymentDTO {
  _id: string;
  periodLabel: string;
  amount: number;
  status: PaymentRecordStatus;
  paidAt?: Date;
  method?: string;
  receiptUrl?: string;
}

export interface TenantPortalAgreementDTO {
  _id: string;
  status: string;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  finalPdfUrl?: string;
}

export interface TenantPortalDocumentDTO {
  _id: string;
  title: string;
  type: string;
  fileUrl: string;
  expiryDate?: Date;
}

export interface TenantPortalDashboardDTO {
  profile: TenantPortalProfileDTO;
  dueSummary: TenantDueSummaryDTO;
  paymentHistory: TenantPortalPaymentDTO[];
  agreement?: TenantPortalAgreementDTO;
  documents: TenantPortalDocumentDTO[];
}
