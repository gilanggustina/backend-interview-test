import { RowDataPacket } from "mysql2";
import { pool } from "../../config/db";
import { ApiError } from "../../utils/ApiError";
import { CreateOrderDTO, ListOrderQueryDTO } from "./orders.dto";

export async function getListOrders(query: ListOrderQueryDTO) {
  const { page, per_page } = query;
  const offset = (page - 1) * per_page;

  const [countRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS total FROM orders");
  const total = countRows[0].total as number;

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT 
      o.id,
      o.order_code,
      o.order_date,
      cstmr.name AS customer_name,
      (
        SELECT SUM(oi.qty * oi.price)
        FROM order_items oi
        WHERE oi.order_id = o.id
      ) AS total_price
      FROM orders o
      JOIN customers cstmr ON o.customer_id = cstmr.id
      ORDER BY o.id DESC
      LIMIT ? OFFSET ?`,
    [per_page, offset]
  );

  return { rows, total, page, per_page };
}

export async function createOrder(data: CreateOrderDTO) {
  if (!data.items || data.items.length === 0) {
    throw new ApiError(400, "Order items required");
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // LOCK SEQUENCE
    const [seqRows] = await conn.query<RowDataPacket[]>(
      "SELECT id, current_value FROM sequence_counters WHERE name = ? FOR UPDATE",
      ["ORDER"]
    );

    if (seqRows.length === 0) throw new ApiError(500, "Sequence ORDER not found");

    const seq = seqRows[0];
    const nextValue = seq.current_value + 1;

    await conn.query("UPDATE sequence_counters SET current_value = ? WHERE id = ?", [
      nextValue,
      seq.id,
    ]);

    const year = new Date().getFullYear();
    const padded = String(nextValue).padStart(6, "0");
    const orderCode = `ORD-${year}-${padded}`;

    // INSERT ORDER
    const today = new Date();

    const [orderResult]: any = await conn.query(
      `INSERT INTO orders (customer_id, order_code, order_date)
       VALUES (?, ?, ?)`,
      [data.customerId, orderCode, today]
    );

    const orderId = orderResult.insertId as number;

    // INSERT ITEMS + UPDATE STOCK
    for (const item of data.items) {
      if (item.qty <= 0) {
        throw new ApiError(400, `Qty for product ${item.productId} must be > 0`);
      }

      const [productRows] = await conn.query<RowDataPacket[]>(
        "SELECT stock, price FROM products WHERE id = ? FOR UPDATE",
        [item.productId]
      );

      if (productRows.length === 0) {
        throw new ApiError(404, `Product id ${item.productId} not found`);
      }

      const product = productRows[0];

      if (product.stock < item.qty) {
        throw new ApiError(400, `Insufficient stock for product id ${item.productId}`);
      }

      await conn.query(
        `INSERT INTO order_items (order_id, product_id, qty, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.productId, item.qty, product.price]
      );

      await conn.query("UPDATE products SET stock = stock - ? WHERE id = ?", [
        item.qty,
        item.productId,
      ]);
    }

    await conn.commit();

    // FETCH ORDER DETAIL
    const [orderDetail] = await conn.query<RowDataPacket[]>(
      `SELECT id, customer_id, order_code, order_date
       FROM orders
       WHERE id = ?`,
      [orderId]
    );

    const [itemDetails] = await conn.query<RowDataPacket[]>(
      `SELECT 
         oi.id,
         oi.product_id,
         p.name AS product_name,
         oi.qty,
         oi.price
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    return {
      order: orderDetail[0],
      items: itemDetails,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
