import { Router } from "express";
import { analyticsController } from "../../infrastructure/DIContainer/index";
import { authenticate } from "../middleware/auth-middleware";

export const createAnalyticsRouter = () => {
  const router = Router();

  router.get("/dashboard", authenticate, (req, res) =>
    analyticsController.getDashboardMetrics(req, res),
  );
  router.get("/trends", authenticate, (req, res) =>
    analyticsController.getRoomTrends(req, res),
  );

  return router;
};
