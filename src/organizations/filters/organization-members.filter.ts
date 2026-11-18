import { Catch, ForbiddenException, type ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import { resolveError, type ErrorResolvers } from "../../error-resolvers.js";
import { NotSignedInError } from "../../session.js";
import { NotSignedInToUnauthorized } from "../../users/filters/me.filter.js";
import { MembershipNotFoundError } from "../membership.repository.js";

const ORGANIZATION_MEMBERS_ERROR_RESOLVERS: ErrorResolvers = new Map([
  [NotSignedInError, NotSignedInToUnauthorized],
  [MembershipNotFoundError, MembershipNotFoundToForbidden],
]);

@Catch(...ORGANIZATION_MEMBERS_ERROR_RESOLVERS.keys())
export class OrganizationMembersFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(resolveError(error, ORGANIZATION_MEMBERS_ERROR_RESOLVERS), host);
  }
}

export function MembershipNotFoundToForbidden() {
  return new ForbiddenException("Not a member of this organization");
}
