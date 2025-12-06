import { Router } from "express";
import { getExternalProducts } from "./external.controller";

const router = Router();

router.get("/products", getExternalProducts);

export default router;
