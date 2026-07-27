import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import { API_URL } from './baseApi';
import { tenantPortalLogout } from '../slices/tenantPortalAuthSlice';
import type {
  TenantPortalAuthResult,
  TenantPortalDashboard,
} from '@/types/tenantPortal';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}/tenant-portal`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).tenantPortalAuth.token;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

export const tenantPortalApi = createApi({
  reducerPath: 'tenantPortalApi',
  baseQuery: async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
      api.dispatch(tenantPortalLogout());
    }
    return result;
  },
  tagTypes: ['TenantPortalDashboard'],
  endpoints: (builder) => ({
    tenantLogin: builder.mutation<{ message: string; data: TenantPortalAuthResult }, { email: string; password: string }>({
      query: (body) => ({ url: '/login', method: 'POST', body }),
    }),
    tenantSetPassword: builder.mutation<{ message: string; data: TenantPortalAuthResult }, { token: string; password: string }>({
      query: (body) => ({ url: '/set-password', method: 'POST', body }),
    }),
    getTenantDashboard: builder.query<{ data: TenantPortalDashboard }, void>({
      query: () => '/dashboard',
      providesTags: ['TenantPortalDashboard'],
    }),
  }),
});

export const {
  useTenantLoginMutation,
  useTenantSetPasswordMutation,
  useGetTenantDashboardQuery,
} = tenantPortalApi;
