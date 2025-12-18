import { Request, Response } from "express";
import { SignInUserUseCase } from "./sign-in-user";
import { signInUserSchema } from "../../schemas/sign-in-user-schema";

export class SignInUserController {
  constructor(private signInUserUseCase: SignInUserUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      // Validar entrada
      const validationResult = signInUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation error",
          details: validationResult.error.errors,
        });
      }

      // Executar use case
      const result = await this.signInUserUseCase.execute(
        validationResult.data
      );

      if (!result.ok) {
        return res.status(401).json({
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
