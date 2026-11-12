import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import type { Request, Response } from "express";

import { clearSessionCookie, destroySession, regenerateSession } from "../session.js";
import type User from "../users/user.js";
import { convertUserToView, type UserView } from "../users/user.js";
import { AuthErrorFilter } from "./auth-error.filter.js";
import { AuthService } from "./auth.service.js";
import { CredentialsDto } from "./credentials.dto.js";
import { SignedInGuard, SignedInUserId } from "./signed-in.guard.js";

@Controller("auth")
@UseFilters(AuthErrorFilter)
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  public async signUp(
    @Body() credentials: CredentialsDto,
    @Req() request: Request,
  ): Promise<UserView> {
    const user = await this.authService.signUp(credentials);
    const deps = { request };
    await startUserSession(user, deps);
    return convertUserToView(user);
  }

  @Post("sign-in")
  @HttpCode(HttpStatus.OK)
  public async signIn(
    @Body() credentials: CredentialsDto,
    @Req() request: Request,
  ): Promise<UserView> {
    const user = await this.authService.signIn(credentials);
    const deps = { request };
    await startUserSession(user, deps);
    return convertUserToView(user);
  }

  @Post("sign-out")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async signOut(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await destroySession(request.session);
    clearSessionCookie(response);
  }

  @Get("me")
  @UseGuards(SignedInGuard)
  public async getSignedInUser(@SignedInUserId() id: User["id"]): Promise<UserView> {
    const user = await this.authService.loadSignedInUser(id);
    return convertUserToView(user);
  }
}

async function startUserSession(user: User, deps: StartUserSessionDeps) {
  await regenerateSession(deps.request.session);
  deps.request.session.userId = user.id;
}

interface StartUserSessionDeps {
  request: Request;
}
