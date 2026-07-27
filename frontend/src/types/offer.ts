export type OfferDiscountType = "percentage" | "flat";

export interface Offer {
  _id: string;
  buildingId: string;
  unitId: string;
  ownerId: string;
  title: string;
  description?: string;
  discountType: OfferDiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOfferPayload {
  buildingId: string;
  unitId: string;
  title: string;
  description?: string;
  discountType: OfferDiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
}
