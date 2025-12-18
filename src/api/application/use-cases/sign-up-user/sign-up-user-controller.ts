import { Request, Response } from "express";
import { SignUpUserUseCase } from "./sign-up-user";
import { signUpUserSchema } from "../../schemas/sign-up-user-schema";

export class SignUpUserController {
  constructor(private signUpUserUseCase: SignUpUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      // Validar entrada
      const validationResult = signUpUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation error",
          details: validationResult.error.errors,
        });
      }

      // Executar use case
      const result = await this.signUpUserUseCase.execute(
        validationResult.data
      );

      if (!result.ok) {
        return res.status(400).json({
          error: result.error,
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
