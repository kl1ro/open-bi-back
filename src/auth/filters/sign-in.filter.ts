import { Catch, UnauthorizedException, type ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import {
  convertDomainErrorToHttpException,
  type DomainErrorToHttpExceptionMap,
} from "../../lib/domain-errors-to-http-exceptions.js";
import { InvalidCredentialsError } from "../auth.service.js";

const SIGN_IN_DOMAIN_TO_HTTP: DomainErrorToHttpExceptionMap = new Map([
  [InvalidCredentialsError, InvalidCredentialsToUnauthorized],
]);

@Catch(...SIGN_IN_DOMAIN_TO_HTTP.keys())
export class SignInFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(convertDomainErrorToHttpException(error, SIGN_IN_DOMAIN_TO_HTTP), host);
  }
}

export function InvalidCredentialsToUnauthorized() {
  return new UnauthorizedException("Wrong email or password");
}
