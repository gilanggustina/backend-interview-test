import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { fetchExternalProducts } from "./external.service";
import { ExternalQuerySchema } from "./external.dto";

export const getExternalProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = ExternalQuerySchema.parse(req.query);
  const limit = query.limit ?? 5;

  const result = await fetchExternalProducts(limit);
  return res.success(result, "External products fetched successfully");
});
