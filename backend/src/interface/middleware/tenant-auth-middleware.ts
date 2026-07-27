import type { Request, Response, NextFunction } from "express";
import { ITenantSessionTokenPayload } from "../../application/interface/common/tenant-portal-token-service.interface";
import { TenantPortalTokenService } from "../../infrastructure/services/tenant-portal-token-service";

declare global {
  namespace Express {
    interface Request {
      tenant?: ITenantSessionTokenPayload;
    }
  }
}

const tenantPortalTokenService = new TenantPortalTokenService();

export const authenticateTenant = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Authentication failed: No token provided.",
        suggestion: "Please log in to the tenant portal.",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const payload = tenantPortalTokenService.verifySessionToken(token);
    req.tenant = payload;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Authentication failed: Invalid or expired session.",
      suggestion: "Please log in to the tenant portal again.",
    });
  }
};
