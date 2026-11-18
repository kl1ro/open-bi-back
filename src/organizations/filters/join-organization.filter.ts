import {
  Catch,
  ConflictException,
  NotFoundException,
  type ArgumentsHost,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import { resolveError, type ErrorResolvers } from "../../error-resolvers.js";
import { NotSignedInError } from "../../session.js";
import { NotSignedInToUnauthorized } from "../../users/filters/me.filter.js";
import { InvitationExpiredError, InvitationUsedUpError } from "../invitation.js";
import { InvitationNotFoundError } from "../invitation.repository.js";
import { MembershipExistsError } from "../membership.repository.js";

const JOIN_ORGANIZATION_ERROR_RESOLVERS: ErrorResolvers = new Map([
  [NotSignedInError, NotSignedInToUnauthorized],
  [InvitationNotFoundError, InvitationNotFoundToNotFound],
  [InvitationExpiredError, InvitationExpiredToNotFound],
  [InvitationUsedUpError, InvitationUsedUpToNotFound],
  [MembershipExistsError, MembershipExistsToConflict],
]);

@Catch(...JOIN_ORGANIZATION_ERROR_RESOLVERS.keys())
export class JoinOrganizationFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(resolveError(error, JOIN_ORGANIZATION_ERROR_RESOLVERS), host);
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
