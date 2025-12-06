import { Router } from "express";
import {
  listCustomers,
  getCustomer,
  createCustomerHandler,
  updateCustomerHandler,
  deleteCustomerHandler,
} from "./customers.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, listCustomers);
router.get("/:id", authMiddleware, getCustomer);
router.post("/", authMiddleware, createCustomerHandler);
router.put("/:id", authMiddleware, updateCustomerHandler);
router.delete("/:id", authMiddleware, deleteCustomerHandler);

export default router;
