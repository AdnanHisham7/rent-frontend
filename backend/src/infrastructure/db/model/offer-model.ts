import mongoose, { Document, Schema } from "mongoose";
import { IOffer } from "../../../domain/entities/Offer";

export interface IOfferDocument extends Omit<IOffer, "_id">, Document {}

const OfferSchema = new Schema<IOfferDocument>(
  {
    buildingId: {
      type: Schema.Types.ObjectId,
      ref: "Building",
      required: true,
      index: true,
    } as any,
    unitId: {
      type: Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
      index: true,
    } as any,
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    } as any,
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null, trim: true },
    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true, index: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    } as any,
  },
  { timestamps: true },
);

OfferSchema.index({ unitId: 1, isActive: 1 });
OfferSchema.index({ unitId: 1, isActive: 1, startDate: 1, endDate: 1 });

export const OfferModel = mongoose.model<IOfferDocument>("Offer", OfferSchema);
