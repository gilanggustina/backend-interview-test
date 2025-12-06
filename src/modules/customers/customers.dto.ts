import { z } from "zod";
import { MetaPagination } from "../../types/pagination";

export const CreateCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  city: z.string().min(1).optional(),
});

export const UpdateCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  city: z.string().min(1).optional(),
});

export const ListCustomerQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  per_page: z.coerce.number().int().positive().max(100).default(10),
});

export interface PaginationResult<T> {
  data: T[];
  meta: MetaPagination;
}

export type ListCustomerQueryDTO = z.infer<typeof ListCustomerQuerySchema>;
export type CreateCustomerDTO = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerDTO = z.infer<typeof UpdateCustomerSchema>;
