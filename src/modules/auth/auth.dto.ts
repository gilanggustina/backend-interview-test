import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 chars"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 chars"),
});

export const generateApiKeySchema = z.object({
  userId: z.number().int().positive(),
});

export const LoginPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

export const LoginApiKeySchema = z.object({
  api_key: z.string().min(5),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;
export type GenerateApiKeyDTO = z.infer<typeof generateApiKeySchema>;
export type LoginPasswordDTO = z.infer<typeof LoginPasswordSchema>;
export type LoginApiKeyDTO = z.infer<typeof LoginApiKeySchema>;
