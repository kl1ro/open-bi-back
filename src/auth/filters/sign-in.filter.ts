import { Catch, UnauthorizedException, type ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import {
  resolveError,
  type ErrorResolvers,
} from "../../lib/domain-errors-to-http-exceptions.js";
import { InvalidCredentialsError } from "../auth.service.js";

const SIGN_IN_ERROR_RESOLVERS: ErrorResolvers = new Map([
  [InvalidCredentialsError, InvalidCredentialsToUnauthorized],
]);

@Catch(...SIGN_IN_ERROR_RESOLVERS.keys())
export class SignInFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(resolveError(error, SIGN_IN_ERROR_RESOLVERS), host);
  }
}

export function InvalidCredentialsToUnauthorized() {
  return new UnauthorizedException("Wrong email or password");
}
