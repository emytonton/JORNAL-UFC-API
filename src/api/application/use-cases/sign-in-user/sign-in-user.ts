import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../../domain/repository/UserRepository";
import { SignInUserInput } from "../../schemas/sign-in-user-schema";
import { failure, Result, success } from "@wave-telecom/framework/core";

export interface SignInUserOutput {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export class SignInUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private jwtSecret: string
  ) {}

  async execute(
    input: SignInUserInput
  ): Promise<Result<SignInUserOutput, Error>> {
    try {
      // Buscar usuário por email
      const user = await this.userRepository.findByEmail(input.email);
      if (!user) {
        return failure(new Error("Invalid email or password"));
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(
        input.password,
        user.password
      );
      if (!isPasswordValid) {
        return failure(new Error("Invalid email or password"));
      }

      // Gerar token JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        this.jwtSecret,
        {
          expiresIn: "24h",
        }
      );

      return success({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to sign in")
      );
    }
  }
}
