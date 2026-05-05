import { AppError } from "@/utils/AppError";
import { ErrorRequestHandler } from "express";
import { success, ZodError } from "zod";
import z from "zod";

export const errorHandling: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof ZodError) {
    const flattenedErrors = z.flattenError(error);

    return res.status(400).json({ 
      success: false,
      message: "validation error",
      errors: flattenedErrors.fieldErrors,
     });
  }

  return res.status(500).json({ message: error.message || "Internal server error" });
};
