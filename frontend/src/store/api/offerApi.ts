import { baseApi } from "./baseApi";
import type { Offer, CreateOfferPayload } from "@/types/offer";

interface OfferListParams {
  buildingId?: string;
  unitId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

interface OfferListResult {
  data: Offer[];
  total: number;
  page: number;
  limit: number;
}

export const offerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOffers: builder.query<OfferListResult, OfferListParams | void>({
      query: (params) => ({ url: "/offers", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((o) => ({
                type: "Offer" as const,
                id: o._id,
              })),
              { type: "Offer" as const, id: "LIST" },
            ]
          : [{ type: "Offer" as const, id: "LIST" }],
    }),
    createOffer: builder.mutation<
      { message: string; data: Offer },
      CreateOfferPayload
    >({
      query: (body) => ({ url: "/offers", method: "POST", body }),
      invalidatesTags: [{ type: "Offer", id: "LIST" }],
    }),
    updateOffer: builder.mutation<
      { message: string; data: Offer },
      { id: string; data: Partial<CreateOfferPayload> & { isActive?: boolean } }
    >({
      query: ({ id, data }) => ({
        url: `/offers/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Offer", id },
        { type: "Offer", id: "LIST" },
      ],
    }),
    deleteOffer: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/offers/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Offer", id: "LIST" }],
    }),
  }),
});

export const {
  useGetOffersQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
} = offerApi;
