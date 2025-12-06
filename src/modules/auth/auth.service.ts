import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/ApiError";
import { GenerateApiKeyDTO, LoginApiKeyDTO, LoginPasswordDTO, RegisterDTO } from "./auth.dto";
import { RowDataPacket } from "mysql2";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function registerUser(dto: RegisterDTO) {
  const [rows] = await pool.query("SELECT id FROM users WHERE email = ? LIMIT 1", [dto.email]);

  const exists = rows as any[];
  if (exists.length > 0) {
    throw new ApiError(400, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(dto.password, 10);

  const [result] = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [dto.name, dto.email, passwordHash]
  );

  const userId = (result as any).insertId;

  const token = jwt.sign({ sub: userId, email: dto.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return {
    token,
    user: {
      id: userId,
      name: dto.name,
      email: dto.email,
    },
  };
}

export async function loginWithPassword(dto: LoginPasswordDTO) {
  const [rows] = await pool.query(
    "SELECT id, email, password_hash, name FROM users WHERE email = ? LIMIT 1",
    [dto.email]
  );
  const users = rows as any[];
  if (users.length === 0) throw new ApiError(401, "Invalid credentials");

  const user = users[0];
  const match = await bcrypt.compare(dto.password, user.password_hash);
  if (!match) throw new ApiError(401, "Invalid credentials");

  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}

export async function generateApiKey(dto: GenerateApiKeyDTO) {
  const apiKey = crypto.randomBytes(32).toString("hex");

  await pool.query("INSERT INTO api_keys (user_id, api_key) VALUES (?, ?)", [dto.userId, apiKey]);

  return apiKey;
}

export async function loginWithApiKey(dto: LoginApiKeyDTO) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT u.id, u.email, u.name
    FROM api_keys ak
    JOIN users u ON ak.user_id = u.id
    WHERE ak.api_key = ? AND ak.is_active = 1
    LIMIT 1
    `,
    [dto.api_key]
  );

  const users = rows as any[];
  if (users.length === 0) {
    throw new ApiError(401, "Invalid API key");
  }

  const user = users[0];

  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}
