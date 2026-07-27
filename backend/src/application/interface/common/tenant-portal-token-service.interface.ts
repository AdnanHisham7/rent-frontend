export interface ITenantSetupTokenPayload {
  tenantId: string;
  purpose: "tenant_portal_setup";
}

export interface ITenantSessionTokenPayload {
  tenantId: string;
  purpose: "tenant_portal_session";
}

export interface ITenantPortalTokenService {
  generateSetupToken(tenantId: string): string;
  verifySetupToken(token: string): ITenantSetupTokenPayload;
  generateSessionToken(tenantId: string): string;
  verifySessionToken(token: string): ITenantSessionTokenPayload;
}
