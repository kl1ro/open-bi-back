import { Catch, UnauthorizedException, type ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import {
  resolveError,
  type ErrorResolvers,
} from "../../lib/domain-errors-to-http-exceptions.js";
import { NotSignedInError } from "../../session.js";
import { UserNotFoundError } from "../user.repository.js";

const ME_ERROR_RESOLVERS: ErrorResolvers = new Map([
  [NotSignedInError, NotSignedInToUnauthorized],
  [UserNotFoundError, UserNotFoundToUnauthorized],
]);

@Catch(...ME_ERROR_RESOLVERS.keys())
export class MeFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(resolveError(error, ME_ERROR_RESOLVERS), host);
  }
}

export function NotSignedInToUnauthorized() {
  return new UnauthorizedException("Not signed in");
}

export function UserNotFoundToUnauthorized() {
  return new UnauthorizedException("Not signed in");
}
