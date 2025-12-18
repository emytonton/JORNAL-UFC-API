import bcrypt from "bcrypt";
import { failure, Result, success } from "@wave-telecom/framework/core";

import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repository/UserRepository";
import { SignUpUserInput } from "../../schemas/sign-up-user-schema";

export interface SignUpUserOutput {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
  };
}

export class SignUpUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    input: SignUpUserInput
  ): Promise<Result<SignUpUserOutput, Error>> {
    try {
      // Verificar se o email já existe
      const existingUser = await this.userRepository.findByEmail(input.email);
      if (existingUser) {
        return failure(new Error("Email already registered"));
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Criar usuário
      const user = User.create({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: input.role,
      });

      // Salvar usuário
      await this.userRepository.save(user);

      return success({
        user: user.toJSON(),
      });
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to create user")
      );
    }
  }
}
