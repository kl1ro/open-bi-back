import { Catch, UnauthorizedException, type ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import {
  convertDomainErrorToHttpException,
  type DomainErrorToHttpExceptionMap,
} from "../../lib/domain-errors-to-http-exceptions.js";
import { InvalidCredentialsError } from "../auth.service.js";

const DOMAIN_ERROR_TO_HTTP_EXCEPTION_MAP: DomainErrorToHttpExceptionMap = new Map([
  [InvalidCredentialsError, InvalidCredentialsToUnauthorized],
]);

@Catch(...DOMAIN_ERROR_TO_HTTP_EXCEPTION_MAP.keys())
export class SignInFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(
      convertDomainErrorToHttpException(error, DOMAIN_ERROR_TO_HTTP_EXCEPTION_MAP),
      host,
    );
  }
}

export function InvalidCredentialsToUnauthorized() {
  return new UnauthorizedException("Wrong email or password");
}
