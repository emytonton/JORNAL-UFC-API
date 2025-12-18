import { UserRepository } from '../../../domain/repository/UserRepository';
import { SignUpUserUseCase } from '../../use-cases/sign-up-user/sign-up-user';
import { SignInUserUseCase } from '../../use-cases/sign-in-user/sign-in-user';

export class UseCasesFactory {
  constructor(
    private userRepository: UserRepository,
    private jwtSecret: string
  ) {}

  createSignUpUserUseCase(): SignUpUserUseCase {
    return new SignUpUserUseCase(this.userRepository);
  }

  createSignInUserUseCase(): SignInUserUseCase {
    return new SignInUserUseCase(this.userRepository, this.jwtSecret);
  }
}

