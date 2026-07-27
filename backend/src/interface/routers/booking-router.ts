import { Router } from "express";
import { BookingController } from "../controllers/booking-controller";
import { authenticate, authorize } from "../middleware/auth-middleware";
import { UserRole } from "../../shared/enums/SystemRoles.enum";

export const createBookingRouter = (controller: BookingController): Router => {
  const router = Router();

  router.post("/", controller.create);
  router.post("/verify-payment", controller.verifyPayment);
  router.post("/webhook", controller.webhook);

  router.use(authenticate);
  router.use(authorize(UserRole.ADMIN, UserRole.MANAGER, UserRole.SUPER_ADMIN));

  router.get("/", controller.listForOwner);
  router.get("/:id", controller.getById);
  router.patch("/:id/confirm", controller.confirm);
  router.patch("/:id/reject", controller.reject);
  router.post("/:id/refund", controller.refund);

  return router;
};
