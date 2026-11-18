import {
  Catch,
  ForbiddenException,
  NotFoundException,
  type ArgumentsHost,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import { resolveError, type ErrorResolvers } from "../../error-resolvers.js";
import { NotSignedInError } from "../../session.js";
import { NotSignedInToUnauthorized } from "../../users/filters/me.filter.js";
import { MembershipNotFoundError } from "../membership.repository.js";
import { OrganizationNotFoundError } from "../organization.repository.js";
import {
  MemberRemovalForbiddenError,
  OwnerCannotLeaveError,
} from "../organizations.service.js";
import { OwnerCannotLeaveToConflict } from "./leave-organization.filter.js";
import { OrganizationNotFoundToNotFound } from "./update-organization.filter.js";

const REMOVE_MEMBER_ERROR_RESOLVERS: ErrorResolvers = new Map([
  [NotSignedInError, NotSignedInToUnauthorized],
  [OrganizationNotFoundError, OrganizationNotFoundToNotFound],
  [MembershipNotFoundError, MembershipNotFoundToNotFound],
  [MemberRemovalForbiddenError, MemberRemovalForbiddenToForbidden],
  [OwnerCannotLeaveError, OwnerCannotLeaveToConflict],
]);

@Catch(...REMOVE_MEMBER_ERROR_RESOLVERS.keys())
export class RemoveMemberFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(resolveError(error, REMOVE_MEMBER_ERROR_RESOLVERS), host);
  }
}

export function MembershipNotFoundToNotFound() {
  return new NotFoundException("Member not found");
}

export function MemberRemovalForbiddenToForbidden() {
  return new ForbiddenException("Only the owner or the inviter can remove this member");
}
