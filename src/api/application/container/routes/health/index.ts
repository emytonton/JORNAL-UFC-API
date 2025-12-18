import { Router, Request, Response } from "express";

export function createHealthRoutes(): Router {
  const router = Router();

  router.get("/", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  return router;
}
