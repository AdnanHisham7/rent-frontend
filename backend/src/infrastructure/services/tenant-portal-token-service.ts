import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError, UnauthorizedError } from "../../shared/error/app-error";
import {
  ITenantPortalTokenService,
  ITenantSessionTokenPayload,
  ITenantSetupTokenPayload,
} from "../../application/interface/common/tenant-portal-token-service.interface";

export class TenantPortalTokenService implements ITenantPortalTokenService {
  private secret(): string {
    if (!env.JWT_TENANT_PORTAL_SECRET) {
      throw new AppError(
        "Tenant portal is not configured on this server.",
        500,
        "Contact support to enable the tenant portal.",
      );
    }
    return env.JWT_TENANT_PORTAL_SECRET;
  }

  generateSetupToken(tenantId: string): string {
    const payload: ITenantSetupTokenPayload = {
      tenantId,
      purpose: "tenant_portal_setup",
    };
    return jwt.sign(payload, this.secret(), {
      expiresIn: env.TENANT_PORTAL_SETUP_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  verifySetupToken(token: string): ITenantSetupTokenPayload {
    try {
      const payload = jwt.verify(
        token,
        this.secret(),
      ) as ITenantSetupTokenPayload;
      if (payload.purpose !== "tenant_portal_setup") {
        throw new Error("wrong purpose");
      }
      return payload;
    } catch {
      throw new UnauthorizedError(
        "This setup link is invalid or has expired.",
        "Ask your property manager to resend the portal setup link.",
      );
    }
  }

  generateSessionToken(tenantId: string): string {
    const payload: ITenantSessionTokenPayload = {
      tenantId,
      purpose: "tenant_portal_session",
    };
    return jwt.sign(payload, this.secret(), {
      expiresIn: env.TENANT_PORTAL_SESSION_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  verifySessionToken(token: string): ITenantSessionTokenPayload {
    try {
      const payload = jwt.verify(
        token,
        this.secret(),
      ) as ITenantSessionTokenPayload;
      if (payload.purpose !== "tenant_portal_session") {
        throw new Error("wrong purpose");
      }
      return payload;
    } catch {
      throw new UnauthorizedError(
        "Session is invalid or has expired.",
        "Please log in to the tenant portal again.",
      );
    }
  }
}
