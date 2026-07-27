export type TenantStatus = 'active' | 'inactive' | 'blacklisted' | 'pending';
export type RentType = 'monthly' | 'quarterly' | 'half_yearly' | 'yearly' | 'custom';

export interface TenantPortalUnitSummary {
  _id: string;
  unitNumber: string;
  floorNumber: string;
  bedrooms: number;
  bathrooms: number;
  amenities?: string[];
  images?: string[];
}

export interface TenantPortalBuildingSummary {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

export interface TenantPortalProfile {
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
  moveInDate?: string;
  unit?: TenantPortalUnitSummary;
  building?: TenantPortalBuildingSummary;
}

export interface TenantDueSummary {
  currentPeriodLabel: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  amountDue: number;
  isPaidForCurrentPeriod: boolean;
  lastPaymentDate?: string;
}

export interface TenantPortalPayment {
  _id: string;
  periodLabel: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'waived';
  paidAt?: string;
  method?: string;
  receiptUrl?: string;
}

export interface TenantPortalAgreement {
  _id: string;
  status: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  finalPdfUrl?: string;
}

export interface TenantPortalDocument {
  _id: string;
  title: string;
  type: string;
  fileUrl: string;
  expiryDate?: string;
}

export interface TenantPortalDashboard {
  profile: TenantPortalProfile;
  dueSummary: TenantDueSummary;
  paymentHistory: TenantPortalPayment[];
  agreement?: TenantPortalAgreement;
  documents: TenantPortalDocument[];
}

export interface TenantPortalAuthResult {
  token: string;
  tenant: TenantPortalProfile;
}
