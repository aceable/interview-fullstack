import type { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
  status?: number;
  code?: number;
}

export const errorHandler = (err: ErrorWithStatus, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  
  const status = err.status || err.code || 500;
  const message = err.message || 'Something went wrong';
  
  res.status(status).json({
    success: false,
    error: message
  });
};