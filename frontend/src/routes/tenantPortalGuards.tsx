import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTenantAuth } from '@/hooks/useTenantAuth';

export function TenantPortalProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useTenantAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/tenant-portal/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}

export function TenantPortalGuestRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useTenantAuth();
  if (isAuthenticated) {
    return <Navigate to="/tenant-portal" replace />;
  }
  return <>{children}</>;
}
