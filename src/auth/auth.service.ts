import { randomUUID } from "node:crypto";

import { Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import type { Request } from "express";
import { v7 as uuidv7 } from "uuid";

import { getSessionUserId } from "../session.js";
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
    const user = await this.userRepository.findUserByEmail(credentials.email);
    const isPasswordCorrect = await verifyUserPassword(user, credentials.password);
    if (!user || !isPasswordCorrect) throw new InvalidCredentialsError();
    return user;
  }

  public async loadMe(session: Request["session"]): Promise<User> {
    const myId = getSessionUserId(session);
    const user = await this.userRepository.findUserById(myId);
    if (!user) throw new UserNotFoundError({ id: myId });
    return user;
  }
}

export class InvalidCredentialsError extends Error {
  public name = InvalidCredentialsError.name;

  public constructor(options?: ErrorOptions) {
    super("The email or the password is wrong", options);
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

async function createUser(credentials: CredentialsDto): Promise<User> {
  const passwordHash = await hashPassword(credentials.password);
  return { id: uuidv7(), email: credentials.email, passwordHash, createdAt: new Date() };
}

async function verifyUserPassword(user: User | undefined, password: string) {
  const passwordHash = user?.passwordHash ?? DUMMY_PASSWORD_HASH;
  return argon2.verify(passwordHash, password);
}

const DUMMY_PASSWORD_HASH = await hashPassword(randomUUID());

async function hashPassword(password: string) {
  return argon2.hash(password);
}
