import { baseApi } from './baseApi';
import type {
  PublicBuildingCard,
  PublicBuildingDetail,
  PublicUnit,
  PublicUnitDetail,
  PublicFilters,
  PublicNearbyBuilding,
} from '@/types/platform';

interface PublicPage<T> { data: T[]; total: number; page: number; limit: number; totalPages: number }

export interface PublicBuildingFilter {
  city?: string;
  state?: string;
  type?: string;
  search?: string;
  minRent?: number;
  maxRent?: number;
  bedrooms?: number;
  sort?: 'newest' | 'rent_low' | 'rent_high';
  page?: number;
  limit?: number;
}

export interface NearbyBuildingParams {
  lat: number;
  lng: number;
  radiusKm?: number;
  limit?: number;
}

export const publicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicBuildings: builder.query<PublicPage<PublicBuildingCard>, PublicBuildingFilter | void>({
      query: (params) => ({ url: '/public/buildings', params: params ?? undefined }),
      providesTags: ['Public'],
    }),
    getFeaturedBuildings: builder.query<{ data: PublicBuildingCard[] }, { limit?: number } | void>({
      query: (params) => ({ url: '/public/buildings/featured', params: params ?? undefined }),
      providesTags: ['Public'],
    }),
    getPublicBuildingDetail: builder.query<{ data: PublicBuildingDetail }, string>({
      query: (id) => `/public/buildings/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Public', id }],
    }),
    getPublicBuildingUnits: builder.query<{ data: PublicUnit[] }, string>({
      query: (id) => `/public/buildings/${id}/units`,
      providesTags: (_r, _e, id) => [{ type: 'Public', id: `units-${id}` }],
    }),
    getPublicUnitDetail: builder.query<{ data: PublicUnitDetail }, string>({
      query: (id) => `/public/units/${id}`,
    }),
    getPublicFilters: builder.query<{ data: PublicFilters }, void>({
      query: () => '/public/filters',
    }),
    getNearbyBuildings: builder.query<{ data: PublicNearbyBuilding[] }, NearbyBuildingParams>({
      query: (params) => ({ url: '/public/nearby', params }),
      providesTags: ['Public'],
    }),
  }),
});

export const {
  useGetPublicBuildingsQuery,
  useGetFeaturedBuildingsQuery,
  useGetPublicBuildingDetailQuery,
  useGetPublicBuildingUnitsQuery,
  useGetPublicUnitDetailQuery,
  useGetPublicFiltersQuery,
  useGetNearbyBuildingsQuery,
  useLazyGetNearbyBuildingsQuery,
} = publicApi;
