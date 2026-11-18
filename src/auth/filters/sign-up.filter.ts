import { Catch, ConflictException, type ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import {
  convertDomainErrorToHttpException,
  type DomainErrorToHttpExceptionMap,
} from "../../lib/domain-errors-to-http-exceptions.js";
import { EmailTakenError } from "../../users/user.repository.js";

const DOMAIN_ERROR_TO_HTTP_EXCEPTION_MAP: DomainErrorToHttpExceptionMap = new Map([
  [EmailTakenError, EmailTakenToConflict],
]);

@Catch(...DOMAIN_ERROR_TO_HTTP_EXCEPTION_MAP.keys())
export class SignUpFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(
      convertDomainErrorToHttpException(error, DOMAIN_ERROR_TO_HTTP_EXCEPTION_MAP),
      host,
    );
  }
}

export function EmailTakenToConflict() {
  return new ConflictException("This email is already taken");
}
