import { Catch, ConflictException, type ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import { resolveError, type ErrorResolvers } from "../../error-resolvers.js";
import { NotSignedInError } from "../../session.js";
import { NotSignedInToUnauthorized } from "../../users/filters/me.filter.js";
import { MembershipNotFoundError } from "../membership.repository.js";
import { OrganizationNotFoundError } from "../organization.repository.js";
import { OwnerCannotLeaveError } from "../organizations.service.js";
import { MembershipNotFoundToForbidden } from "./organization-members.filter.js";
import { OrganizationNotFoundToNotFound } from "./update-organization.filter.js";

const LEAVE_ORGANIZATION_ERROR_RESOLVERS: ErrorResolvers = new Map([
  [NotSignedInError, NotSignedInToUnauthorized],
  [OrganizationNotFoundError, OrganizationNotFoundToNotFound],
  [MembershipNotFoundError, MembershipNotFoundToForbidden],
  [OwnerCannotLeaveError, OwnerCannotLeaveToConflict],
]);

@Catch(...LEAVE_ORGANIZATION_ERROR_RESOLVERS.keys())
export class LeaveOrganizationFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(resolveError(error, LEAVE_ORGANIZATION_ERROR_RESOLVERS), host);
  }
}

export function OwnerCannotLeaveToConflict() {
  return new ConflictException("The owner can't leave the organization");
}
