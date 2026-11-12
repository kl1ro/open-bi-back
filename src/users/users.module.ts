import { Module } from "@nestjs/common";

import { MikroOrmUserRepository } from "./mikro-orm/mikro-orm-user.repository.js";
import { UserRepository } from "./user.repository.js";

@Module({
  providers: [{ provide: UserRepository, useClass: MikroOrmUserRepository }],
  exports: [UserRepository],
})
export class UsersModule {}
