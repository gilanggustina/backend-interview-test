import { Router } from "express";
import { createOrderHandler, listOrders } from "./orders.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, listOrders);
router.post("/", authMiddleware, createOrderHandler);

export default router;
