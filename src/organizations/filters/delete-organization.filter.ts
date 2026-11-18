import { Catch, type ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import { resolveError, type ErrorResolvers } from "../../error-resolvers.js";
import { NotSignedInError } from "../../session.js";
import { NotSignedInToUnauthorized } from "../../users/filters/me.filter.js";
import { OrganizationNotFoundError } from "../organization.repository.js";
import { NotOrganizationOwnerError } from "../organizations.service.js";
import {
  NotOrganizationOwnerToForbidden,
  OrganizationNotFoundToNotFound,
} from "./update-organization.filter.js";

const DELETE_ORGANIZATION_ERROR_RESOLVERS: ErrorResolvers = new Map([
  [NotSignedInError, NotSignedInToUnauthorized],
  [OrganizationNotFoundError, OrganizationNotFoundToNotFound],
  [NotOrganizationOwnerError, NotOrganizationOwnerToForbidden],
]);

@Catch(...DELETE_ORGANIZATION_ERROR_RESOLVERS.keys())
export class DeleteOrganizationFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(resolveError(error, DELETE_ORGANIZATION_ERROR_RESOLVERS), host);
  }
}
