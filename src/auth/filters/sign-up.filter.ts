import { Catch, ConflictException, type ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import {
  convertDomainErrorToHttpException,
  type DomainErrorToHttpExceptionMap,
} from "../../lib/domain-errors-to-http-exceptions.js";
import { EmailTakenError } from "../../users/user.repository.js";

const SIGN_UP_DOMAIN_TO_HTTP: DomainErrorToHttpExceptionMap = new Map([
  [EmailTakenError, EmailTakenToConflict],
]);

@Catch(...SIGN_UP_DOMAIN_TO_HTTP.keys())
export class SignUpFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(convertDomainErrorToHttpException(error, SIGN_UP_DOMAIN_TO_HTTP), host);
  }
}

export function EmailTakenToConflict() {
  return new ConflictException("This email is already taken");
}
