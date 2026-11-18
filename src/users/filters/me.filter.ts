import { Catch, UnauthorizedException, type ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import {
  convertDomainErrorToHttpException,
  type DomainErrorToHttpExceptionMap,
} from "../../lib/domain-errors-to-http-exceptions.js";
import { NotSignedInError } from "../../session.js";
import { UserNotFoundError } from "../user.repository.js";

const ME_DOMAIN_TO_HTTP: DomainErrorToHttpExceptionMap = new Map([
  [NotSignedInError, NotSignedInToUnauthorized],
  [UserNotFoundError, UserNotFoundToUnauthorized],
]);

@Catch(...ME_DOMAIN_TO_HTTP.keys())
export class MeFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(convertDomainErrorToHttpException(error, ME_DOMAIN_TO_HTTP), host);
  }
}

export function NotSignedInToUnauthorized() {
  return new UnauthorizedException("Not signed in");
}

export function UserNotFoundToUnauthorized() {
  return new UnauthorizedException("Not signed in");
}
