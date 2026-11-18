import { Catch, type ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import { resolveError, type ErrorResolvers } from "../../error-resolvers.js";
import { NotSignedInError } from "../../session.js";
import { NotSignedInToUnauthorized } from "../../users/filters/me.filter.js";
import { MembershipNotFoundError } from "../membership.repository.js";
import { MembershipNotFoundToForbidden } from "./organization-members.filter.js";

const CREATE_INVITATION_ERROR_RESOLVERS: ErrorResolvers = new Map([
  [NotSignedInError, NotSignedInToUnauthorized],
  [MembershipNotFoundError, MembershipNotFoundToForbidden],
]);

@Catch(...CREATE_INVITATION_ERROR_RESOLVERS.keys())
export class CreateInvitationFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(resolveError(error, CREATE_INVITATION_ERROR_RESOLVERS), host);
  }
}
