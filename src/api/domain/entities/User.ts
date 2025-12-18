import { Role } from "./enums/Role";

export interface UserProps {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
}

export class User {
  private constructor(private props: UserProps) {}

  static create(
    props: Omit<UserProps, "id" | "createdAt"> & {
      id?: string;
      createdAt?: Date;
    }
  ): User {
    return new User({
      id: props.id || crypto.randomUUID(),
      name: props.name,
      email: props.email.toLowerCase(),
      password: props.password,
      role: props.role,
      createdAt: props.createdAt || new Date(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get role(): Role {
    return this.props.role;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toJSON(): Omit<UserProps, "password"> {
    return {
      id: this.props.id,
      name: this.props.name,
      email: this.props.email,
      role: this.props.role,
      createdAt: this.props.createdAt,
    };
  }
}
