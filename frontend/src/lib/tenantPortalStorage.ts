const TOKEN_KEY = 'roomport_tenant_portal_token';
const TENANT_KEY = 'roomport_tenant_portal_profile';

export const tenantPortalStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  getTenant: <T,>(): T | null => {
    const raw = localStorage.getItem(TENANT_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as T; } catch { return null; }
  },
  setTenant: (tenant: unknown) => localStorage.setItem(TENANT_KEY, JSON.stringify(tenant)),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TENANT_KEY);
  },
};
