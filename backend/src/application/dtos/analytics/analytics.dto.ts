export interface TransactionRecord {
  _id: string;
  tenantId: string;
  tenantName: string;
  buildingId: string;
  buildingName?: string;
  unitId?: string;
  unitNumber?: string;
  periodLabel: string;
  periodStart: Date;
  periodEnd: Date;
  amount: number;
  status: string;
  paidAt?: Date;
  method?: string;
  notes?: string;
  createdAt?: Date;
}

export interface MonthlyTrendPointDTO {
  month: string;
  label: string;
  revenue: number;
  bookingsCreated: number;
  bookingsConfirmed: number;
}

export interface RoomTypeDemandDTO {
  bedrooms: number;
  totalUnits: number;
  occupiedUnits: number;
  occupancyRatePercentage: number;
  totalBookings: number;
  totalInquiries: number;
}

export interface TopUnitByRevenueDTO {
  unitId: string;
  unitNumber: string;
  buildingId: string;
  buildingName?: string;
  totalRevenue: number;
}

export interface AnalyticsTrendsDTO {
  monthlyTrend: MonthlyTrendPointDTO[];
  roomTypeDemand: RoomTypeDemandDTO[];
  topUnitsByRevenue: TopUnitByRevenueDTO[];
}

export interface DashboardMetricsDTO {
  totalRevenue: number;
  pendingRevenue: number;
  occupancyRate: {
    totalUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    ratePercentage: number;
  };
  revenueByBuilding: Array<{
    buildingId: string;
    revenue: number;
  }>;
  recentlyRentedUnits: Array<{
    unitId: string;
    buildingId: string;
    rentAmount: number;
    startDate: Date;
  }>;
  expiringAgreements: Array<{
    agreementId: string;
    unitId: string;
    tenantId: string;
    endDate: Date;
    monthlyRent: number;
  }>;
  pendingPayments: Array<{
    tenantId: string;
    tenantName: string;
    unitId?: string;
    amount: number;
    periodLabel: string;
    dueDate?: Date;
  }>;
  recentTransactions: TransactionRecord[];
}
