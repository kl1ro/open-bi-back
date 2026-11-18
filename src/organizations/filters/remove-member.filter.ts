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

const REMOVE_MEMBER_DOMAIN_TO_HTTP: DomainErrorToHttpExceptionMap = new Map([
  [NotSignedInError, NotSignedInToUnauthorized],
  [OrganizationNotFoundError, OrganizationNotFoundToNotFound],
  [NotOrganizationOwnerError, NotOrganizationOwnerToForbidden],
  [MembershipNotFoundError, MembershipNotFoundToNotFound],
  [OwnerCannotLeaveError, OwnerCannotLeaveToConflict],
]);

@Catch(...REMOVE_MEMBER_DOMAIN_TO_HTTP.keys())
export class RemoveMemberFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(
      convertDomainErrorToHttpException(error, REMOVE_MEMBER_DOMAIN_TO_HTTP),
      host,
    );
  }
}

export function MembershipNotFoundToNotFound() {
  return new NotFoundException("Member not found");
}
