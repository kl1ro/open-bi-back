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
import { OrganizationNotFoundError } from "../organization.repository.js";
import { NotOrganizationOwnerError } from "../organizations.service.js";

const UPDATE_ORGANIZATION_ERROR_RESOLVERS: ErrorResolvers = new Map([
  [NotSignedInError, NotSignedInToUnauthorized],
  [OrganizationNotFoundError, OrganizationNotFoundToNotFound],
  [NotOrganizationOwnerError, NotOrganizationOwnerToForbidden],
]);

@Catch(...UPDATE_ORGANIZATION_ERROR_RESOLVERS.keys())
export class UpdateOrganizationFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(resolveError(error, UPDATE_ORGANIZATION_ERROR_RESOLVERS), host);
  }
}

export function OrganizationNotFoundToNotFound() {
  return new NotFoundException("Organization not found");
}

export function NotOrganizationOwnerToForbidden() {
  return new ForbiddenException("Only the owner can do this");
}
