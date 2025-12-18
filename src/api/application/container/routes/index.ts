import { Router } from 'express';
import { createAuthRoutes } from './auth';
import { SignUpUserController } from '../../use-cases/sign-up-user/sign-up-user-controller';
import { SignInUserController } from '../../use-cases/sign-in-user/sign-in-user-controller';

export function createRoutes(
  signUpUserController: SignUpUserController,
  signInUserController: SignInUserController
): Router {
  const router = Router();

  router.use('/auth', createAuthRoutes(signUpUserController, signInUserController));

  return router;
}
