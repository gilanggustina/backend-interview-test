import winston from "winston";
import fs from "fs";
import path from "path";

// Pastikan folder logs ada
const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Custom log format
const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}] ${stack || message}`;
});

// Winston logger instance
export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Tulis error saja ke file error.log
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),

    // Semua log ke file combined.log
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
});

// Tampilkan ke console juga (warna)
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        logFormat
      ),
    })
  );
}
