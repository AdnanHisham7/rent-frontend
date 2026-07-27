import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import { tenantPortalApi } from './api/tenantPortalApi';
import authReducer from './slices/authSlice';
import tenantPortalAuthReducer from './slices/tenantPortalAuthSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tenantPortalAuth: tenantPortalAuthReducer,
    ui: uiReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [tenantPortalApi.reducerPath]: tenantPortalApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(baseApi.middleware, tenantPortalApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
