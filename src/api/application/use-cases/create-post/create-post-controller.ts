import { Request, Response } from "express";
import { CreatePostUseCase } from "./create-post";
import { createPostSchema } from "../../schemas/create-post-schema";

export class CreatePostController {
  constructor(private createPostUseCase: CreatePostUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      // Verificar se userId está presente (deve ser setado pelo middleware de autenticação)
      if (!req.userId) {
        return res.status(401).json({
          error: "User ID not found in request",
        });
      }

      // Verificar se o arquivo foi enviado
      if (!req.file) {
        return res.status(400).json({
          error: "Media file is required",
        });
      }

      // Validar entrada (campos do body que não são o arquivo)
      const validationResult = createPostSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation error",
          details: validationResult.error.errors,
        });
      }

      // Executar use case
      const result = await this.createPostUseCase.execute(
        validationResult.data,
        req.userId,
        req.file
      );

      if (!result.ok) {
        return res.status(400).json({
          error: result.error.message,
        });
      }

      return res.status(201).json(result.value);
    } catch (error) {
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }
}
