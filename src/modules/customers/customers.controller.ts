import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import {
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomers,
} from "./customers.service";
import { ApiError } from "../../utils/ApiError";
import {
  CreateCustomerSchema,
  ListCustomerQuerySchema,
  UpdateCustomerSchema,
} from "./customers.dto";
import { buildPagination } from "../../utils/pagination";

export const listCustomers = asyncHandler(async (req: Request, res: Response) => {
  const query = ListCustomerQuerySchema.parse(req.query);

  const { rows, total, page, per_page } = await getCustomers(query);

  const meta = buildPagination(page, per_page, total);

  return res.paginated(rows, meta, "Customer list fetched");
});

export const getCustomer = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) throw new ApiError(400, "Invalid customer id");

  const data = await getCustomerById(id);
  return res.success(data, "Customer detail");
});

export const createCustomerHandler = asyncHandler(async (req: Request, res: Response) => {
  const dto = CreateCustomerSchema.parse(req.body);

  const data = await createCustomer(dto);
  return res.created(data, "Customer created");
});

export const updateCustomerHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) throw new ApiError(400, "Invalid customer id");

  const dto = UpdateCustomerSchema.parse(req.body);

  const data = await updateCustomer(id, dto);
  return res.success(data, "Customer updated");
});

export const deleteCustomerHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) throw new ApiError(400, "Invalid customer id");

  const data = await deleteCustomer(id);
  return res.success(data, "Customer deleted");
});
