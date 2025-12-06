import { Router } from "express";
import { topCustomers } from "./reports.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

router.get("/top-customers", authMiddleware, topCustomers);

export default router;
