import { z } from "zod";

export const ListTopCustomerQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  per_page: z.coerce.number().int().positive().max(100).default(10),
  date: z.string().optional(),
});

export type ListTopCustomerQueryDTO = z.infer<typeof ListTopCustomerQuerySchema>;
