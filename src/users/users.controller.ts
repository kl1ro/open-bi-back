import { Controller, Get, Req, UseFilters, UseGuards } from "@nestjs/common";
import type { Request } from "express";

import { SignedInGuard } from "../auth/guards/signed-in.guard.js";
import { MeFilter } from "./filters/me.filter.js";
import { convertUserToView, type UserView } from "./user.js";
import { UsersService } from "./users.service.js";

@Controller("users")
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @UseGuards(SignedInGuard)
  @UseFilters(MeFilter)
  public async getMe(@Req() request: Request): Promise<UserView> {
    const me = await this.usersService.getMe(request.session);
    return convertUserToView(me);
  }
}
