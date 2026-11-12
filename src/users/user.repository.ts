import type User from "./user.js";

export abstract class UserRepository {
  public abstract loadUserByEmail(email: User["email"]): Promise<User | undefined>;
  public abstract loadUserById(id: User["id"]): Promise<User | undefined>;
  public abstract insertUser(user: User): Promise<void>;
}

export class EmailTakenError extends Error {
  public name = EmailTakenError.name;
  public email: User["email"];

  public constructor(options: ErrorOptions & { email: User["email"] }) {
    super(`A user with the email ${options.email} already exists`, options);
    this.email = options.email;
  }
}
