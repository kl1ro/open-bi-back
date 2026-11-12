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

export class InsertUserError extends Error {
  public name = InsertUserError.name;
  public id: User["id"];

  public constructor(options: ErrorOptions & { id: User["id"] }) {
    super(`Failed to insert the user with id of ${options.id}`, options);
    this.id = options.id;
  }
}

export class LoadUserError extends Error {
  public name = LoadUserError.name;

  public constructor(options: ErrorOptions) {
    super("Failed to load a user", options);
  }
}
