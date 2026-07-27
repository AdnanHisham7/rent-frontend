import { OfferDiscountType } from "../../../domain/entities/Offer";

export interface CreateOfferDTO {
  buildingId: string;
  unitId: string;
  title: string;
  description?: string;
  discountType: OfferDiscountType;
  discountValue: number;
  startDate: string | Date;
  endDate: string | Date;
}

export interface UpdateOfferDTO {
  title?: string;
  description?: string;
  discountType?: OfferDiscountType;
  discountValue?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  isActive?: boolean;
}

export interface OfferResponseDTO {
  _id: string;
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
