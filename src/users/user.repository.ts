import type User from "./user.js";

export abstract class UserRepository {
  public abstract findUserByEmail(email: User["email"]): Promise<User | undefined>;
  public abstract findUserById(id: User["id"]): Promise<User | undefined>;
  public abstract insertUser(user: User): Promise<void>;

  public async getUserById(id: User["id"]): Promise<User> {
    const user = await this.findUserById(id);
    if (!user) throw new UserNotFoundError({ id });
    return user;
  }
}

export class EmailTakenError extends Error {
  public name = EmailTakenError.name;
  public email: User["email"];

  public constructor(options: ErrorOptions & { email: User["email"] }) {
    super(`A user with the email ${options.email} already exists`, options);
    this.email = options.email;
  }
}

export class UserInsertFailedError extends Error {
  public name = UserInsertFailedError.name;
  public id: User["id"];

  public constructor(options: ErrorOptions & { id: User["id"] }) {
    super(`Failed to insert the user with id of ${options.id}`, options);
    this.id = options.id;
  }
}

export class UserLoadByEmailFailedError extends Error {
  public name = UserLoadByEmailFailedError.name;
  public email: User["email"];

  public constructor(options: ErrorOptions & { email: User["email"] }) {
    super(`Failed to load the user with the email ${options.email}`, options);
    this.email = options.email;
  }
}

export class UserLoadByIdFailedError extends Error {
  public name = UserLoadByIdFailedError.name;
  public id: User["id"];

  public constructor(options: ErrorOptions & { id: User["id"] }) {
    super(`Failed to load the user with id of ${options.id}`, options);
    this.id = options.id;
  }
}

export class UserNotFoundError extends Error {
  public name = UserNotFoundError.name;
  public id: User["id"];

  public constructor(options: ErrorOptions & { id: User["id"] }) {
    super(`User with id of ${options.id} doesn't exist`, options);
    this.id = options.id;
  }
}
