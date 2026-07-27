import { Router } from "express";
import { OfferController } from "../controllers/offer-controller";
import { authenticate, authorize } from "../middleware/auth-middleware";
import { UserRole } from "../../shared/enums/SystemRoles.enum";

export const createOfferRouter = (controller: OfferController): Router => {
  const router = Router();
  router.use(authenticate);
  router.use(authorize(UserRole.ADMIN, UserRole.MANAGER, UserRole.SUPER_ADMIN));

  router.post("/", controller.create);
  router.get("/", controller.listForOwner);
  router.get("/:id", controller.getById);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.remove);

  return router;
};
