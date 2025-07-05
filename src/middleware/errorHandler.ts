import { Request, Response, NextFunction } from 'express';
import { PostgrestError } from '@supabase/supabase-js';

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError | PostgrestError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if ('code' in err) {
    // Handle Supabase errors
    return res.status(500).json({
      error: 'Database error',
      message: err.message,
      details: err.details,
      hint: err.hint
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.name,
    message: err.message
  });
}; 