import { Router } from "express";
import { TenantPortalController } from "../controllers/tenant-portal-controller";
import { authenticateTenant } from "../middleware/tenant-auth-middleware";

export const createTenantPortalRouter = (
  controller: TenantPortalController,
): Router => {
  const router = Router();

  router.post("/login", controller.login);
  router.post("/set-password", controller.setPassword);

  router.use(authenticateTenant);
  router.get("/dashboard", controller.getDashboard);

  return router;
};
