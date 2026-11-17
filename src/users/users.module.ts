import { Module } from "@nestjs/common";

import { MikroOrmUserRepository } from "./mikro-orm/user.repository.js";
import { UserRepository } from "./user.repository.js";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";

@Module({
  providers: [
    { provide: UserRepository, useClass: MikroOrmUserRepository },
    UsersService,
  ],
  exports: [UserRepository],
  controllers: [UsersController],
})
export class UsersModule {}
