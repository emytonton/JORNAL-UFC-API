// Extensões de tipos do Express (ex: Request, Response)

import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
