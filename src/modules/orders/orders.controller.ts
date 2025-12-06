import { Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { createOrder, getListOrders } from "./orders.service";
import { CreateOrderSchema, ListOrderQuerySchema } from "./orders.dto";
import { buildPagination } from "../../utils/pagination";

export const listOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = ListOrderQuerySchema.parse(req.query);
  const { rows, total, page, per_page } = await getListOrders(query);

  const meta = buildPagination(page, per_page, total);
  return res.paginated(rows, meta, "Customer list fetched");
});

export const createOrderHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const dto = CreateOrderSchema.parse(req.body);

  const result = await createOrder(dto);
  return res.created(result, "Order created");
});
