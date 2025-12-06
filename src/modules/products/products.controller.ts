import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import {
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getListProducts,
} from "./products.service";
import { ApiError } from "../../utils/ApiError";
import { CreateProductSchema, ListProductQuerySchema, UpdateProductSchema } from "./products.dto";
import { buildPagination } from "../../utils/pagination";

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = ListProductQuerySchema.parse(req.query);

  const { rows, total, page, per_page } = await getListProducts(query);

  const meta = buildPagination(page, per_page, total);

  return res.paginated(rows, meta, "Product list fetched");
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) throw new ApiError(400, "Invalid product id");

  const data = await getProductById(id);
  return res.success(data, "Product detail");
});

export const createProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const dto = CreateProductSchema.parse(req.body);

  const data = await createProduct(dto);
  return res.created(data, "Product created");
});

export const updateProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) throw new ApiError(400, "Invalid product id");

  const dto = UpdateProductSchema.parse(req.body);

  const data = await updateProduct(id, dto);
  return res.success(data, "Product updated");
});

export const deleteProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) throw new ApiError(400, "Invalid product id");

  const data = await deleteProduct(id);
  return res.success(data, "Product deleted");
});
