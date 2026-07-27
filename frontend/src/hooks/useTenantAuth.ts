import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { tenantPortalLogout } from '@/store/slices/tenantPortalAuthSlice';
import { tenantPortalApi } from '@/store/api/tenantPortalApi';

export function useTenantAuth() {
  const { tenant, token, isAuthenticated } = useAppSelector((s) => s.tenantPortalAuth);
  const dispatch = useAppDispatch();

  const logout = useCallback(() => {
    dispatch(tenantPortalLogout());
    dispatch(tenantPortalApi.util.resetApiState());
  }, [dispatch]);

  return { tenant, token, isAuthenticated, logout };
}
