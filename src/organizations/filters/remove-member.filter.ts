import { Catch, NotFoundException, type ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import {
  convertDomainErrorToHttpException,
  type DomainErrorToHttpExceptionMap,
} from "../../lib/domain-errors-to-http-exceptions.js";
import { NotSignedInError } from "../../session.js";
import { NotSignedInToUnauthorized } from "../../users/filters/me.filter.js";
import { MembershipNotFoundError } from "../membership.repository.js";
import { OrganizationNotFoundError } from "../organization.repository.js";
import {
  NotOrganizationOwnerError,
  OwnerCannotLeaveError,
} from "../organizations.service.js";
import { OwnerCannotLeaveToConflict } from "./leave-organization.filter.js";
import {
  NotOrganizationOwnerToForbidden,
  OrganizationNotFoundToNotFound,
} from "./update-organization.filter.js";

const DOMAIN_ERROR_TO_HTTP_EXCEPTION_MAP: DomainErrorToHttpExceptionMap = new Map([
  [NotSignedInError, NotSignedInToUnauthorized],
  [OrganizationNotFoundError, OrganizationNotFoundToNotFound],
  [NotOrganizationOwnerError, NotOrganizationOwnerToForbidden],
  [MembershipNotFoundError, MembershipNotFoundToNotFound],
  [OwnerCannotLeaveError, OwnerCannotLeaveToConflict],
]);

@Catch(...DOMAIN_ERROR_TO_HTTP_EXCEPTION_MAP.keys())
export class RemoveMemberFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(
      convertDomainErrorToHttpException(error, DOMAIN_ERROR_TO_HTTP_EXCEPTION_MAP),
      host,
    );
  }
}

export function MembershipNotFoundToNotFound() {
  return new NotFoundException("Member not found");
}
