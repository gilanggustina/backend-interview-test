import { RowDataPacket } from "mysql2";
import { pool } from "../../config/db";
import { ListTopCustomerQueryDTO } from "./reports.dto";

export async function getTopCustomers(query: ListTopCustomerQueryDTO) {
  const { page, per_page, date } = query;
  const offset = (page - 1) * per_page;

  let baseSql = `
    FROM customers c
    JOIN orders o ON o.customer_id = c.id
    JOIN order_items oi ON oi.order_id = o.id
  `;

  const params: any[] = [];

  if (date) {
    baseSql += ` WHERE DATE(o.order_date) = ? `;
    params.push(date);
  }

  const [countRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT COUNT(*) AS total
    FROM (
      SELECT c.id
      ${baseSql}
      GROUP BY c.id
    ) AS grouped
    `,
    params
  );

  const total = countRows[0].total as number;

  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT 
      c.id AS customer_id,
      c.name AS customer_name,
      c.city,
      SUM(oi.qty * oi.price) AS total_spent
    ${baseSql}
    GROUP BY c.id, c.name, c.city
    ORDER BY total_spent DESC
    LIMIT ? OFFSET ?
    `,
    [...params, per_page, offset]
  );

  return { rows, total, page, per_page };
}
