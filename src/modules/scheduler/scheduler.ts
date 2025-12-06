import cron from "node-cron";
import { pool } from "../../config/db";
import { logger } from "../../utils/logger";

export function startScheduler() {
  logger.info("Scheduler executed");

  // Jalan tiap 1 menit
  cron.schedule("* * * * *", async () => {
    try {
      await pool.query("INSERT INTO scheduled_logs (message) VALUES (?)", ["Scheduler executed"]);
      console.log("[Scheduler] Log inserted");
    } catch (err) {
      console.error("[Scheduler] Error:", err);
    }
  });
}
