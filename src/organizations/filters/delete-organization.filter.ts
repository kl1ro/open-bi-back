import { Catch, type ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import {
  convertDomainErrorToHttpException,
  type DomainErrorToHttpExceptionMap,
} from "../../lib/domain-errors-to-http-exceptions.js";
import { NotSignedInError } from "../../session.js";
import { NotSignedInToUnauthorized } from "../../users/filters/me.filter.js";
import { OrganizationNotFoundError } from "../organization.repository.js";
import { NotOrganizationOwnerError } from "../organizations.service.js";
import {
  NotOrganizationOwnerToForbidden,
  OrganizationNotFoundToNotFound,
} from "./update-organization.filter.js";

const DELETE_ORGANIZATION_DOMAIN_TO_HTTP: DomainErrorToHttpExceptionMap = new Map([
  [NotSignedInError, NotSignedInToUnauthorized],
  [OrganizationNotFoundError, OrganizationNotFoundToNotFound],
  [NotOrganizationOwnerError, NotOrganizationOwnerToForbidden],
]);

@Catch(...DELETE_ORGANIZATION_DOMAIN_TO_HTTP.keys())
export class DeleteOrganizationFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(
      convertDomainErrorToHttpException(error, DELETE_ORGANIZATION_DOMAIN_TO_HTTP),
      host,
    );
  }
}
