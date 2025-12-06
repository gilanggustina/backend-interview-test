import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import productRoutes from "../modules/products/products.routes";
import customerRoutes from "../modules/customers/customers.routes";
import orderRoutes from "../modules/orders/orders.routes";
import reportRoutes from "../modules/reports/reports.routes";
import externalRoutes from "../modules/external/external.routes";

const router = Router();

// Prefix routing
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/customers", customerRoutes);
router.use("/orders", orderRoutes);
router.use("/reports", reportRoutes);
router.use("/external", externalRoutes);

export default router;
