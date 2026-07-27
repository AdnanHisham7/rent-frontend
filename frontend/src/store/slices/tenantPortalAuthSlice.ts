import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { tenantPortalStorage } from '@/lib/tenantPortalStorage';
import type { TenantPortalProfile } from '@/types/tenantPortal';

interface TenantPortalAuthState {
  tenant: TenantPortalProfile | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: TenantPortalAuthState = {
  tenant: tenantPortalStorage.getTenant<TenantPortalProfile>(),
  token: tenantPortalStorage.getToken(),
  isAuthenticated: !!tenantPortalStorage.getToken(),
};

const tenantPortalAuthSlice = createSlice({
  name: 'tenantPortalAuth',
  initialState,
  reducers: {
    setTenantPortalCredentials: (
      state,
      action: PayloadAction<{ tenant: TenantPortalProfile; token: string }>,
    ) => {
      state.tenant = action.payload.tenant;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      tenantPortalStorage.setToken(action.payload.token);
      tenantPortalStorage.setTenant(action.payload.tenant);
    },
    tenantPortalLogout: (state) => {
      state.tenant = null;
      state.token = null;
      state.isAuthenticated = false;
      tenantPortalStorage.clear();
    },
  },
});

export const { setTenantPortalCredentials, tenantPortalLogout } = tenantPortalAuthSlice.actions;
export default tenantPortalAuthSlice.reducer;
