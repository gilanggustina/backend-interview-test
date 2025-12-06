import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { loginWithPassword, loginWithApiKey, registerUser, generateApiKey } from "./auth.service";
import {
  generateApiKeySchema,
  LoginApiKeySchema,
  LoginPasswordSchema,
  RegisterSchema,
} from "./auth.dto";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const dto = RegisterSchema.parse(req.body);

  const result = await registerUser(dto);

  return res.created(result, "User registered successfully");
});

export const loginPassword = asyncHandler(async (req: Request, res: Response) => {
  const dto = LoginPasswordSchema.parse(req.body);

  const result = await loginWithPassword(dto);
  return res.success(result, "Login with password success");
});

export const generateApiKeyHandler = asyncHandler(async (req, res) => {
  const dto = generateApiKeySchema.parse(req.body);
  const apiKey = await generateApiKey(dto);

  return res.success({ api_key: apiKey }, "API Key generated");
});

export const loginApiKey = asyncHandler(async (req: Request, res: Response) => {
  const dto = LoginApiKeySchema.parse(req.body);

  const result = await loginWithApiKey(dto);
  return res.success(result, "Login with API key success");
});
