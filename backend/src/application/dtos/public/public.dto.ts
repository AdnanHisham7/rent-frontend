import { BuildingResponseDTO } from "../building/building.dto";
import { FloorResponseDTO } from "../floor/floor.dto";
import { UnitResponseDTO } from "../unit/unit.dto";
import { OfferDiscountType } from "../../../domain/entities/Offer";

export interface PublicUnitOfferDTO {
  _id: string;
  title: string;
  description?: string;
  discountType: OfferDiscountType;
  discountValue: number;
  endDate: Date;
}

export interface PublicUnitDTO extends UnitResponseDTO {
  activeOffer?: PublicUnitOfferDTO;
  effectiveRent: number;
}

export interface PublicBuildingCardDTO extends BuildingResponseDTO {
  availableUnitsCount: number;
  occupiedUnitsCount: number;
  minRent: number | null;
  maxRent: number | null;
}

export interface PublicBuildingDetailDTO extends PublicBuildingCardDTO {
  floors: (FloorResponseDTO & {
    availableUnitsCount: number;
    occupiedUnitsCount: number;
  })[];
}

export interface PublicUnitDetailDTO extends PublicUnitDTO {
  building: {
    _id: string;
    name: string;
    slug?: string;
    type: string;
    location: BuildingResponseDTO["location"];
    amenities?: string[];
    images?: string[];
  };
}

export interface PublicNearbyBuildingDTO extends PublicBuildingCardDTO {
  distanceKm: number;
}

export interface PublicFiltersDTO {
  cities: string[];
  types: string[];
}
