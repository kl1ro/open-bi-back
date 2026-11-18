import { Catch, type ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import {
  convertDomainErrorToHttpException,
  type DomainErrorToHttpExceptionMap,
} from "../../lib/domain-errors-to-http-exceptions.js";
import { NotSignedInError } from "../../session.js";
import { NotSignedInToUnauthorized } from "../../users/filters/me.filter.js";

const DOMAIN_ERROR_TO_HTTP_EXCEPTION_MAP: DomainErrorToHttpExceptionMap = new Map([
  [NotSignedInError, NotSignedInToUnauthorized],
]);

@Catch(...DOMAIN_ERROR_TO_HTTP_EXCEPTION_MAP.keys())
export class MyOrganizationsFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(
      convertDomainErrorToHttpException(error, DOMAIN_ERROR_TO_HTTP_EXCEPTION_MAP),
      host,
    );
  }
}
