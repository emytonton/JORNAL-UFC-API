import bcrypt from "bcrypt";
import { failure, Result, success } from "@wave-telecom/framework/core";
import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repository/UserRepository";
import { UpdateUserInput } from "../../schemas/update-user-schema";
import { Role } from "../../../domain/entities/enums/Role";

export interface UpdateUserOutput {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
  };
}

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    userId: string,
    input: UpdateUserInput
  ): Promise<Result<UpdateUserOutput, Error>> {
    try {
      // Verificar se o usuário existe
      const existingUser = await this.userRepository.findById(userId);
      if (!existingUser) {
        return failure(new Error("User not found"));
      }

      // Verificar se o email já está em uso por outro usuário (se estiver sendo alterado)
      if (input.email && input.email !== existingUser.email) {
        const email = String(input.email);
        const userWithEmail = await this.userRepository.findByEmail(email);
        if (userWithEmail && userWithEmail.id !== userId) {
          return failure(new Error("Email already registered"));
        }
      }

      // Preparar dados para atualização
      let hashedPassword = existingUser.password;
      if (input.password) {
        const password = String(input.password);
        hashedPassword = await bcrypt.hash(password, 10);
      }

      // Criar usuário atualizado
      const updatedUser = User.create({
        id: existingUser.id,
        name: input.name ? String(input.name) : existingUser.name,
        email: input.email
          ? String(input.email).toLowerCase()
          : existingUser.email,
        password: hashedPassword,
        role: (input.role as Role) || existingUser.role,
        createdAt: existingUser.createdAt,
      });

      // Salvar usuário atualizado
      await this.userRepository.save(updatedUser);

      return success({
        user: updatedUser.toJSON(),
      });
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to update user")
      );
    }
  }
}
