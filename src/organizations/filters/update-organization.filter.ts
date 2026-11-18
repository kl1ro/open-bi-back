import {
  Catch,
  ForbiddenException,
  NotFoundException,
  type ArgumentsHost,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import {
  convertDomainErrorToHttpException,
  type DomainErrorToHttpExceptionMap,
} from "../../lib/domain-errors-to-http-exceptions.js";
import { NotSignedInError } from "../../session.js";
import { NotSignedInToUnauthorized } from "../../users/filters/me.filter.js";
import { OrganizationNotFoundError } from "../organization.repository.js";
import { NotOrganizationOwnerError } from "../organizations.service.js";

const DOMAIN_ERROR_TO_HTTP_EXCEPTION_MAP: DomainErrorToHttpExceptionMap = new Map([
  [NotSignedInError, NotSignedInToUnauthorized],
  [OrganizationNotFoundError, OrganizationNotFoundToNotFound],
  [NotOrganizationOwnerError, NotOrganizationOwnerToForbidden],
]);

@Catch(...DOMAIN_ERROR_TO_HTTP_EXCEPTION_MAP.keys())
export class UpdateOrganizationFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(
      convertDomainErrorToHttpException(error, DOMAIN_ERROR_TO_HTTP_EXCEPTION_MAP),
      host,
    );
  }
}

export function OrganizationNotFoundToNotFound() {
  return new NotFoundException("Organization not found");
}

export function NotOrganizationOwnerToForbidden() {
  return new ForbiddenException("Only the owner can do this");
}
