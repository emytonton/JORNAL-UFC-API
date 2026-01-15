import { Request, Response } from "express";
import { UpdateUserUseCase } from "./update-user";
import { updateUserSchema } from "../../schemas/update-user-schema";

export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      // Verificar se userId está presente (deve ser setado pelo middleware de autenticação)
      if (!req.userId) {
        return res.status(401).json({
          error: "User ID not found in request",
        });
      }

      // Validar entrada
      const validationResult = updateUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation error",
          details: validationResult.error.errors,
        });
      }

      // Verificar se pelo menos um campo foi fornecido para atualizar
      if (
        !validationResult.data.name &&
        !validationResult.data.email &&
        !validationResult.data.password &&
        !validationResult.data.role
      ) {
        return res.status(400).json({
          error: "At least one field must be provided for update",
        });
      }

      // Executar use case
      const result = await this.updateUserUseCase.execute(
        req.userId,
        validationResult.data
      );

      if (!result.ok) {
        return res.status(400).json({
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
