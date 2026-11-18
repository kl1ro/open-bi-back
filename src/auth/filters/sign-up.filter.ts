import { Catch, ConflictException, type ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import {
  resolveError,
  type ErrorResolvers,
} from "../../lib/domain-errors-to-http-exceptions.js";
import { EmailTakenError } from "../../users/user.repository.js";

const SIGN_UP_ERROR_RESOLVERS: ErrorResolvers = new Map([
  [EmailTakenError, EmailTakenToConflict],
]);

@Catch(...SIGN_UP_ERROR_RESOLVERS.keys())
export class SignUpFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(resolveError(error, SIGN_UP_ERROR_RESOLVERS), host);
  }
}

export function EmailTakenToConflict() {
  return new ConflictException("This email is already taken");
}
