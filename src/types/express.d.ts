import { PaginatedResponse } from "./response";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        email: string;
        created_at: Date;
      };
    }
    interface Response {
      success<T>(data: T, message?: string): Response;
      created<T>(data: T, message?: string): Response;
      paginated<T>(data: T[], meta: PaginatedResponse<T>["meta"], message?: string): Response;
      error(status: number, message: string, errors?: any, details?: any): Response;
    }
  }
}

export {};
