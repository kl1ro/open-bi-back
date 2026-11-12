import { Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import { v7 as uuidv7 } from "uuid";

import type User from "../users/user.js";
import { UserRepository } from "../users/user.repository.js";
import type { CredentialsDto } from "./credentials.dto.js";

@Injectable()
export class AuthService {
  public constructor(private readonly userRepository: UserRepository) {}

  public async signUp(credentials: CredentialsDto): Promise<User> {
    const user = await createUser(credentials);
    await this.userRepository.insertUser(user);
    return user;
  }

  public async signIn(credentials: CredentialsDto): Promise<User> {
    const user = await this.userRepository.loadUserByEmail(credentials.email);
    const isPasswordCorrect = await verifyUserPassword(user, credentials.password);
    if (!user || !isPasswordCorrect) throw new InvalidCredentialsError();
    return user;
  }

  public async loadSignedInUser(id: User["id"]): Promise<User> {
    const user = await this.userRepository.loadUserById(id);
    if (!user) throw new SignedInUserNotFoundError({ id });
    return user;
  }
}

export class InvalidCredentialsError extends Error {
  public name = InvalidCredentialsError.name;

  public constructor(options?: ErrorOptions) {
    super("The email or the password is wrong", options);
  }
}

export class SignedInUserNotFoundError extends Error {
  public name = SignedInUserNotFoundError.name;
  public id: User["id"];

  public constructor(options: ErrorOptions & { id: User["id"] }) {
    super(`The signed-in user with id of ${options.id} doesn't exist`, options);
    this.id = options.id;
  }
}

async function createUser(credentials: CredentialsDto): Promise<User> {
  const passwordHash = await hashPassword(credentials.password);
  return { id: uuidv7(), email: credentials.email, passwordHash, createdAt: new Date() };
}

async function verifyUserPassword(user: User | undefined, password: string) {
  if (!user) return false;
  return argon2.verify(user.passwordHash, password);
}

async function hashPassword(password: string) {
  return argon2.hash(password);
}
