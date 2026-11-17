import { Injectable } from "@nestjs/common";
import type { Request } from "express";

import { getSessionUserId } from "../session.js";
import type User from "./user.js";
import { UserRepository } from "./user.repository.js";

@Injectable()
export class UsersService {
  public constructor(private readonly userRepository: UserRepository) {}

  public async loadMe(session: Request["session"]): Promise<User> {
    const myId = getSessionUserId(session);
    return this.userRepository.getUserById(myId);
  }
}
