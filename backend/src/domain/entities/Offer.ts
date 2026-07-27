export type OfferDiscountType = "percentage" | "flat";

export interface IOffer {
  _id?: string;
  buildingId: string;
  unitId: string;
  ownerId: string;
  title: string;
  description?: string;
  discountType: OfferDiscountType;
  discountValue: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}
