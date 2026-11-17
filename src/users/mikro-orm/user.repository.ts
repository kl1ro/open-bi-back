import { EntityManager, UniqueConstraintViolationException } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import type User from "../user.js";
import {
  EmailTakenError,
  UserInsertFailedError,
  UserLoadByEmailFailedError,
  UserLoadByIdFailedError,
  UserRepository,
} from "../user.repository.js";
import { USER_SCHEMA, USERS_EMAIL_UNIQUE } from "./user.schema.js";

@Injectable()
export class MikroOrmUserRepository extends UserRepository {
  public constructor(private readonly entityManager: EntityManager) {
    super();
  }

  public async findUserByEmail(email: User["email"]): Promise<User | undefined> {
    try {
      const user = await this.entityManager.findOne(USER_SCHEMA, { email });
      return user ?? undefined;
    } catch (error) {
      throw new UserLoadByEmailFailedError({ email, cause: error });
    }
  }

  public async findUserById(id: User["id"]): Promise<User | undefined> {
    try {
      const user = await this.entityManager.findOne(USER_SCHEMA, { id });
      return user ?? undefined;
    } catch (error) {
      throw new UserLoadByIdFailedError({ id, cause: error });
    }
  }

  public async insertUser(user: User) {
    try {
      await this.entityManager.insert(USER_SCHEMA, user);
    } catch (error) {
      throw interpretInsertUserError(error, user);
    }
  }
}

function interpretInsertUserError(error: unknown, user: User): Error {
  if (isEmailUniqueViolation(error))
    return new EmailTakenError({ email: user.email, cause: error });

  return new UserInsertFailedError({ id: user.id, cause: error });
}

function isEmailUniqueViolation(error: unknown) {
  return (
    error instanceof UniqueConstraintViolationException &&
    getViolatedConstraint(error) === USERS_EMAIL_UNIQUE
  );
}

function getViolatedConstraint(error: UniqueConstraintViolationException): unknown {
  return "constraint" in error ? error.constraint : undefined;
}
