import { baseApi } from "./baseApi";
import type { DashboardMetrics, AnalyticsTrends } from "@/types/analytics";

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardMetrics: builder.query<{ data: DashboardMetrics }, void>({
      query: () => "/analytics/dashboard",
      providesTags: ["Analytics"],
    }),
    getRoomTrends: builder.query<{ data: AnalyticsTrends }, void>({
      query: () => "/analytics/trends",
      providesTags: ["Analytics"],
    }),
  }),
});

export const { useGetDashboardMetricsQuery, useGetRoomTrendsQuery } =
  analyticsApi;
