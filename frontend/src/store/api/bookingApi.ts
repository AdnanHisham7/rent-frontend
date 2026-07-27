import { baseApi } from './baseApi';
import type {
  Booking,
  BookingStatus,
  CreateBookingPayload,
  CreateBookingResult,
  VerifyBookingPaymentPayload,
} from '@/types/booking';

interface BookingListParams {
  buildingId?: string;
  unitId?: string;
  status?: BookingStatus;
  page?: number;
  limit?: number;
}

interface BookingListResult {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
}

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation<{ message: string; data: CreateBookingResult }, CreateBookingPayload>({
      query: (body) => ({ url: '/bookings', method: 'POST', body }),
    }),
    verifyBookingPayment: builder.mutation<{ message: string; data: Booking }, VerifyBookingPaymentPayload>({
      query: (body) => ({ url: '/bookings/verify-payment', method: 'POST', body }),
    }),
    getBookings: builder.query<BookingListResult, BookingListParams | void>({
      query: (params) => ({ url: '/bookings', params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [...result.data.map((b) => ({ type: 'Booking' as const, id: b._id })), { type: 'Booking' as const, id: 'LIST' }]
          : [{ type: 'Booking' as const, id: 'LIST' }],
    }),
    getBooking: builder.query<{ data: Booking }, string>({
      query: (id) => `/bookings/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Booking', id }],
    }),
    confirmBooking: builder.mutation<{ message: string; data: Booking }, string>({
      query: (id) => ({ url: `/bookings/${id}/confirm`, method: 'PATCH' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Booking', id }, { type: 'Booking', id: 'LIST' }],
    }),
    rejectBooking: builder.mutation<{ message: string; data: Booking }, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({ url: `/bookings/${id}/reject`, method: 'PATCH', body: { reason } }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Booking', id }, { type: 'Booking', id: 'LIST' }],
    }),
    refundBooking: builder.mutation<{ message: string; data: Booking }, string>({
      query: (id) => ({ url: `/bookings/${id}/refund`, method: 'POST' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Booking', id }, { type: 'Booking', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useVerifyBookingPaymentMutation,
  useGetBookingsQuery,
  useGetBookingQuery,
  useConfirmBookingMutation,
  useRejectBookingMutation,
  useRefundBookingMutation,
} = bookingApi;
