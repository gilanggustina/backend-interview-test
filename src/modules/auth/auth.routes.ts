import { Router } from "express";
import { loginPassword, loginApiKey, register, generateApiKeyHandler } from "./auth.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login/password", loginPassword);
router.post("/api-key/generate", authMiddleware, generateApiKeyHandler);
router.post("/login/api-key", loginApiKey);

export default router;
