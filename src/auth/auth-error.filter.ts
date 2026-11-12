import {
  Catch,
  ConflictException,
  UnauthorizedException,
  type ArgumentsHost,
  type HttpException,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import { EmailTakenError } from "../users/user.repository.js";
import { InvalidCredentialsError } from "./auth.service.js";

@Catch(EmailTakenError, InvalidCredentialsError)
export class AuthErrorFilter extends BaseExceptionFilter {
  public catch(error: EmailTakenError | InvalidCredentialsError, host: ArgumentsHost) {
    super.catch(convertAuthErrorToHttpException(error), host);
  }
}

function convertAuthErrorToHttpException(
  error: EmailTakenError | InvalidCredentialsError,
): HttpException {
  if (error instanceof EmailTakenError)
    return new ConflictException("This email is already taken");

  return new UnauthorizedException("Wrong email or password");
}
