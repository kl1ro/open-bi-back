import {
  Catch,
  ConflictException,
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
import { InvitationExpiredError, InvitationUsedUpError } from "../invitation.js";
import { InvitationNotFoundError } from "../invitation.repository.js";
import { MembershipExistsError } from "../membership.repository.js";

const DOMAIN_ERROR_TO_HTTP_EXCEPTION_MAP: DomainErrorToHttpExceptionMap = new Map([
  [NotSignedInError, NotSignedInToUnauthorized],
  [InvitationNotFoundError, InvitationNotFoundToNotFound],
  [InvitationExpiredError, InvitationExpiredToNotFound],
  [InvitationUsedUpError, InvitationUsedUpToNotFound],
  [MembershipExistsError, MembershipExistsToConflict],
]);

@Catch(...DOMAIN_ERROR_TO_HTTP_EXCEPTION_MAP.keys())
export class JoinOrganizationFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(
      convertDomainErrorToHttpException(error, DOMAIN_ERROR_TO_HTTP_EXCEPTION_MAP),
      host,
    );
  }
}

export function InvitationNotFoundToNotFound() {
  return new NotFoundException("Invitation not found");
}

export function InvitationExpiredToNotFound() {
  return new NotFoundException("Invitation not found");
}

export function InvitationUsedUpToNotFound() {
  return new NotFoundException("Invitation not found");
}

export function MembershipExistsToConflict() {
  return new ConflictException("Already a member of this organization");
}
