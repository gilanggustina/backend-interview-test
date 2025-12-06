import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface AuthRequest extends Request {
  user?: { id: number; name: string; email: string; created_at: Date };
}

export const authMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized");
  }

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      created_at: new Date(payload.created_at),
    };
    next();
  } catch {
    throw new ApiError(401, "Invalid token");
  }
};
