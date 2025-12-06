import { RowDataPacket } from "mysql2";
import { pool } from "../../config/db";
import { ApiError } from "../../utils/ApiError";
import { CreateProductDTO, ListProductQueryDTO, UpdateProductDTO } from "./products.dto";

export async function getAllProducts() {
  const [rows] = await pool.query("SELECT * FROM products ORDER BY id DESC");
  return rows;
}

export async function getListProducts(query: ListProductQueryDTO) {
  const { page, per_page } = query;
  const offset = (page - 1) * per_page;

  const [countRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS total FROM products");
  const total = countRows[0].total as number;

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, name, stock FROM products ORDER BY id DESC LIMIT ? OFFSET ?",
    [per_page, offset]
  );

  return { rows, total, page, per_page };
}

export async function getProductById(id: number) {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM products WHERE id = ?", [id]);
  const products = rows;

  if (products.length === 0) {
    throw new ApiError(404, "Product not found");
  }

  return products[0];
}

export async function createProduct(data: CreateProductDTO) {
  if (!data.name || typeof data.stock !== "number") {
    throw new ApiError(400, "Invalid product data");
  }

  const [result] = await pool.query("INSERT INTO products (name, stock) VALUES (?, ?)", [
    data.name,
    data.stock,
  ]);

  return {
    id: (result as any).insertId,
    ...data,
  };
}

export async function updateProduct(id: number, data: UpdateProductDTO) {
  await getProductById(id);

  const fields: string[] = [];
  const values: any[] = [];

  if (data.name) {
    fields.push("name = ?");
    values.push(data.name);
  }

  if (typeof data.stock === "number") {
    fields.push("stock = ?");
    values.push(data.stock);
  }

  if (typeof data.price === "number") {
    fields.push("price = ?");
    values.push(data.price);
  }

  if (fields.length === 0) {
    throw new ApiError(400, "No fields to update");
  }

  values.push(id);

  await pool.query(`UPDATE products SET ${fields.join(", ")} WHERE id = ?`, values);

  return getProductById(id);
}

export async function deleteProduct(id: number) {
  const product = await getProductById(id);

  await pool.query("DELETE FROM products WHERE id = ?", [id]);

  return { product };
}
