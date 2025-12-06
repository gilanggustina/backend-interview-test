import { z } from "zod";

export interface ExternalProductDTO {
  id: number;
  title: string;
  price: number;
}

export const ExternalQuerySchema = z.object({
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export type ExternalQueryDTO = z.infer<typeof ExternalQuerySchema>;
