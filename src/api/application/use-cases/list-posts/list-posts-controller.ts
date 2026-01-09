import { Request, Response } from "express";
import { ListPostsUseCase } from "./list-posts";

export class ListPostsController {
  constructor(private listPostsUseCase: ListPostsUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      // Executar use case
      const result = await this.listPostsUseCase.execute();

      if (!result.ok) {
        return res.status(500).json({
          error: result.error.message,
        });
      }

      return res.status(200).json(result.value);
    } catch (error) {
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }
}
