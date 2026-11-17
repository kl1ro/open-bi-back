import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Request, Response } from "express";

import { endUserSession, startUserSession } from "../session.js";
import { UseMeFilter } from "../users/filters/me.filter.js";
import { convertUserToView, type UserView } from "../users/user.js";
import { AuthService } from "./auth.service.js";
import { CredentialsDto } from "./credentials.dto.js";
import { UseSignInFilter } from "./filters/sign-in.filter.js";
import { UseSignUpFilter } from "./filters/sign-up.filter.js";
import { SignedInGuard } from "./guards/signed-in.guard.js";

@Controller("auth")
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  @UseSignUpFilter()
  public async signUp(
    @Body() credentials: CredentialsDto,
    @Req() request: Request,
  ): Promise<UserView> {
    const deps = { request };
    const user = await this.authService.signUp(credentials);
    await startUserSession(user, deps);
    return convertUserToView(user);
  }

  @Post("sign-in")
  @UseSignInFilter()
  @HttpCode(HttpStatus.OK)
  public async signIn(
    @Body() credentials: CredentialsDto,
    @Req() request: Request,
  ): Promise<UserView> {
    const deps = { request };
    const user = await this.authService.signIn(credentials);
    await startUserSession(user, deps);
    return convertUserToView(user);
  }

  @Post("sign-out")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async signOut(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const deps = { request, response };
    await endUserSession(deps);
  }

  @Get("me")
  @UseGuards(SignedInGuard)
  @UseMeFilter()
  public async getMe(@Req() request: Request): Promise<UserView> {
    const me = await this.authService.loadMe(request.session);
    return convertUserToView(me);
  }
}
