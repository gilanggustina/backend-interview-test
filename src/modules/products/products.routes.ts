import { Router } from "express";
import {
  listProducts,
  getProduct,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from "./products.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, listProducts);
router.get("/:id", authMiddleware, getProduct);
router.post("/", authMiddleware, createProductHandler);
router.put("/:id", authMiddleware, updateProductHandler);
router.delete("/:id", authMiddleware, deleteProductHandler);

export default router;
