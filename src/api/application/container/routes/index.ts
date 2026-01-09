import { Router } from "express";
import { createAuthRoutes } from "./auth";
import { SignUpUserController } from "../../use-cases/sign-up-user/sign-up-user-controller";
import { SignInUserController } from "../../use-cases/sign-in-user/sign-in-user-controller";
import { CreatePostController } from "../../use-cases/create-post/create-post-controller";
import { ListPostsController } from "../../use-cases/list-posts/list-posts-controller";
import { authMiddleware } from "../middlewares/auth-middleware";
import { Multer } from "../../../infraestructure/upload/multer-config";

export function createRoutes(
  signUpUserController: SignUpUserController,
  signInUserController: SignInUserController,
  createPostController: CreatePostController,
  listPostsController: ListPostsController
): Router {
  const router = Router();

  router.use(
    "/auth",
    createAuthRoutes(signUpUserController, signInUserController)
  );

  // Configurar multer para upload de imagem (limite de 10MB)
  const upload = Multer.getUploader(10).single("media");

  // Rotas de posts protegidas com autenticação
  router.post("/posts", authMiddleware, upload, (req, res) => {
    createPostController.handle(req, res);
  });
  router.get("/posts", (req, res) => listPostsController.handle(req, res));

  return router;
}
