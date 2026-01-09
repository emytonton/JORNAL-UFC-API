import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Config } from "../../../../config";

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: "Authorization header is required" });
      return;
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      res.status(401).json({ error: "Invalid authorization header format" });
      return;
    }

    const token = parts[1];
    const config = Config.getInstance();

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
      req.userId = decoded.id;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
