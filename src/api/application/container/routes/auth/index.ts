import { Router } from "express";
import { SignUpUserController } from "../../../use-cases/sign-up-user/sign-up-user-controller";
import { SignInUserController } from "../../../use-cases/sign-in-user/sign-in-user-controller";

export function createAuthRoutes(
  signUpUserController: SignUpUserController,
  signInUserController: SignInUserController
): Router {
  const router = Router();

  router.post("/signup", (req, res) => signUpUserController.handle(req, res));
  router.post("/signin", (req, res) => signInUserController.handle(req, res));

  return router;
}

