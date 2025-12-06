import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { getTopCustomers } from "./reports.service";
import { ListTopCustomerQuerySchema } from "./reports.dto";
import { buildPagination } from "../../utils/pagination";

export const topCustomers = asyncHandler(async (req: Request, res: Response) => {
  const query = ListTopCustomerQuerySchema.parse(req.query);
  const { rows, total, page, per_page } = await getTopCustomers(query);
  const meta = buildPagination(page, per_page, total);
  return res.paginated(rows, meta, "Top customers fetched");
});
