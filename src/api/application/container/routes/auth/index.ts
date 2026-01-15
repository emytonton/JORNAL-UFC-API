import { Router } from "express";
import { SignUpUserController } from "../../../use-cases/sign-up-user/sign-up-user-controller";
import { SignInUserController } from "../../../use-cases/sign-in-user/sign-in-user-controller";
import { UpdateUserController } from "../../../use-cases/update-user/update-user-controller";
import { authMiddleware } from "../../middlewares/auth-middleware";

export function createAuthRoutes(
  signUpUserController: SignUpUserController,
  signInUserController: SignInUserController,
  updateUserController: UpdateUserController
): Router {
  const router = Router();

  router.post("/signup", (req, res) => signUpUserController.handle(req, res));
  router.post("/signin", (req, res) => signInUserController.handle(req, res));
  router.put("/me", authMiddleware, (req, res) => updateUserController.handle(req, res));

  return router;
}

