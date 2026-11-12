import {
  Catch,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  type ArgumentsHost,
  type HttpException,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import { EmailTakenError } from "../users/user.repository.js";
import { InvalidCredentialsError } from "./auth.service.js";

@Catch(EmailTakenError, InvalidCredentialsError)
export class AuthErrorFilter extends BaseExceptionFilter {
  public catch(error: unknown, host: ArgumentsHost) {
    super.catch(convertAuthErrorToHttpException(error), host);
  }
}

function convertAuthErrorToHttpException(error: unknown): HttpException {
  if (error instanceof EmailTakenError)
    return new ConflictException("This email is already taken");

  if (error instanceof InvalidCredentialsError)
    return new UnauthorizedException("Wrong email or password");

  return new InternalServerErrorException();
}
