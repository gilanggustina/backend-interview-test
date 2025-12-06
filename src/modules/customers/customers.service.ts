import { RowDataPacket } from "mysql2";
import { pool } from "../../config/db";
import { CreateCustomerDTO, ListCustomerQueryDTO, UpdateCustomerDTO } from "./customers.dto";
import { ApiError } from "../../utils/ApiError";

export async function getCustomers(query: ListCustomerQueryDTO) {
  const { page, per_page } = query;
  const offset = (page - 1) * per_page;

  const [countRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS total FROM customers");
  const total = countRows[0].total as number;
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, name, email, city FROM customers ORDER BY id DESC LIMIT ? OFFSET ?",
    [per_page, offset]
  );
  return { rows, total, page, per_page };
}

export async function getCustomerById(id: number) {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM customers WHERE id = ?", [id]);
  const customers = rows;

  if (customers.length === 0) {
    throw new ApiError(404, "Customer not found");
  }

  return customers[0];
}

export async function createCustomer(data: CreateCustomerDTO) {
  const [result] = await pool.query("INSERT INTO customers (name, email, city) VALUES (?, ?, ?)", [
    data.name,
    data.email,
    data.city || null,
  ]);
  return {
    id: (result as any).insertId,
    ...data,
  };
}

export async function updateCustomer(id: number, data: UpdateCustomerDTO) {
  await getCustomerById(id);

  const fields: string[] = [];
  const values: any[] = [];

  if (data.name) {
    fields.push("name = ?");
    values.push(data.name);
  }

  if (typeof data.email) {
    fields.push("email = ?");
    values.push(data.email);
  }

  if (typeof data.city !== "undefined") {
    fields.push("city = ?");
    values.push(data.city);
  }

  if (fields.length === 0) {
    throw new ApiError(400, "No fields to update");
  }

  values.push(id);

  await pool.query(`UPDATE customers SET ${fields.join(", ")} WHERE id = ?`, values);

  return getCustomerById(id);
}

export async function deleteCustomer(id: number) {
  const customer = await getCustomerById(id);
  await pool.query("DELETE FROM customers WHERE id = ?", [id]);

  return { customer };
}
