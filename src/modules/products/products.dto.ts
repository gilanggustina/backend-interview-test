import { z } from "zod";
import { MetaPagination } from "../../types/pagination";

export const CreateProductSchema = z.object({
  name: z.string().min(1),
  stock: z.number().int().nonnegative(),
  price: z.number().nonnegative(),
});

export const UpdateProductSchema = z.object({
  name: z.string().min(1).optional(),
  stock: z
    .preprocess(
      (val) => (typeof val === "string" ? Number(val.trim()) : val),
      z.number().int().nonnegative()
    )
    .optional(),
  price: z
    .preprocess(
      (val) => (typeof val === "string" ? Number(val.trim()) : val),
      z.number().nonnegative()
    )
    .optional(),
});

export const ListProductQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  per_page: z.coerce.number().int().positive().max(100).default(10),
});

export interface PaginationResult<T> {
  data: T[];
  meta: MetaPagination;
}

export type ListProductQueryDTO = z.infer<typeof ListProductQuerySchema>;
export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;
