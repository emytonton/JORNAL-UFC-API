// Ponto de entrada da aplicação
// Configura o Express, middlewares, rotas e inicia o servidor

import express from "express";
import cors from "cors";
import { Config } from "./config";
import { logger } from "./logger";
import { UserRepositoryImpl } from "./api/infraestructure/UserRepositoryImpl";
import { UseCasesFactory } from "./api/application/container/factories/use-cases-factory";
import { SignUpUserController } from "./api/application/use-cases/sign-up-user/sign-up-user-controller";
import { SignInUserController } from "./api/application/use-cases/sign-in-user/sign-in-user-controller";
import { createRoutes } from "./api/application/container/routes";
import { createHealthRoutes } from "./api/application/container/routes/health";

async function bootstrap(): Promise<void> {
  const config = Config.getInstance();
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Repositório (in-memory)
  const userRepository = new UserRepositoryImpl();

  // Factory de use cases
  const useCasesFactory = new UseCasesFactory(userRepository, config.jwtSecret);

  // Controllers
  const signUpUserController = new SignUpUserController(
    useCasesFactory.createSignUpUserUseCase()
  );
  const signInUserController = new SignInUserController(
    useCasesFactory.createSignInUserUseCase()
  );

  // Rotas
  app.use("/health", createHealthRoutes());
  app.use("/api", createRoutes(signUpUserController, signInUserController));

  // Iniciar servidor
  app.listen(config.port, () => {
    logger.info(`Server is running on port ${config.port}`);
  });
}

bootstrap().catch((error) => {
  logger.error("Failed to start server:", error);
  process.exit(1);
});
