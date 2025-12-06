import { Response, Request, NextFunction } from "express";
import { MetaPagination } from "../types/pagination";

export function responseWrapper(_req: Request, res: Response, next: NextFunction) {
  res.success = function <T>(data: T, message = "Success") {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  };

  res.created = function <T>(data: T, message = "Created") {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  };

  res.paginated = function <T>(data: T[], meta: MetaPagination, message = "Success") {
    return res.status(200).json({
      success: true,
      message,
      data,
      meta,
    });
  };

  res.error = function (status, message, errors = null, details = null) {
    return res.status(status).json({
      success: false,
      message,
      errors,
      details,
    });
  };

  next();
}
