import { EntityManager, UniqueConstraintViolationException } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import type User from "../user.js";
import { EmailTakenError, UserRepository } from "../user.repository.js";
import { USER_SCHEMA } from "./user.schema.js";

@Injectable()
export class MikroOrmUserRepository extends UserRepository {
  public constructor(private readonly entityManager: EntityManager) {
    super();
  }

  public async loadUserByEmail(email: User["email"]): Promise<User | undefined> {
    const user = await this.entityManager.findOne(USER_SCHEMA, { email });
    return user ?? undefined;
  }

  public async loadUserById(id: User["id"]): Promise<User | undefined> {
    const user = await this.entityManager.findOne(USER_SCHEMA, { id });
    return user ?? undefined;
  }

  public async insertUser(user: User) {
    try {
      await this.entityManager.insert(USER_SCHEMA, user);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException)
        throw new EmailTakenError({ email: user.email, cause: error });

      throw error;
    }
  }
}
