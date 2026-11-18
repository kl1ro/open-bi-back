import { Catch, ForbiddenException, type ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import {
  convertDomainErrorToHttpException,
  type DomainErrorToHttpExceptionMap,
} from "../../lib/domain-errors-to-http-exceptions.js";
import { NotSignedInError } from "../../session.js";
import { NotSignedInToUnauthorized } from "../../users/filters/me.filter.js";
import { MembershipNotFoundError } from "../membership.repository.js";

const ORGANIZATION_MEMBERS_DOMAIN_TO_HTTP: DomainErrorToHttpExceptionMap = new Map([
  [NotSignedInError, NotSignedInToUnauthorized],
  [MembershipNotFoundError, MembershipNotFoundToForbidden],
]);

@Catch(...ORGANIZATION_MEMBERS_DOMAIN_TO_HTTP.keys())
export class OrganizationMembersFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(
      convertDomainErrorToHttpException(error, ORGANIZATION_MEMBERS_DOMAIN_TO_HTTP),
      host,
    );
  }
}

export function MembershipNotFoundToForbidden() {
  return new ForbiddenException("Not a member of this organization");
}
