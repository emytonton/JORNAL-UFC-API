import { User } from '../domain/entities/User';
import { UserRepository } from '../domain/repository/UserRepository';

export class UserRepositoryImpl implements UserRepository {
  private users: User[] = [];

  async save(user: User): Promise<void> {
    const existingIndex = this.users.findIndex((u) => u.id === user.id);
    if (existingIndex >= 0) {
      this.users[existingIndex] = user;
    } else {
      this.users.push(user);
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email.toLowerCase());
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }
}

