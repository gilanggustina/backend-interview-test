import { z } from "zod";

export const OrderItemSchema = z.object({
  productId: z.number().int().positive(),
  qty: z.number().int().positive(),
});

export const CreateOrderSchema = z.object({
  customerId: z.number().int().positive(),
  items: z.array(OrderItemSchema).min(1),
});

export const ListOrderQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  per_page: z.coerce.number().int().positive().max(100).default(10),
});

export type ListOrderQueryDTO = z.infer<typeof ListOrderQuerySchema>;
export type OrderItemDTO = z.infer<typeof OrderItemSchema>;
export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;
