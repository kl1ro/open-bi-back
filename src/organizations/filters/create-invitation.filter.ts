import { Catch, type ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import {
  convertDomainErrorToHttpException,
  type DomainErrorToHttpExceptionMap,
} from "../../lib/domain-errors-to-http-exceptions.js";
import { NotSignedInError } from "../../session.js";
import { NotSignedInToUnauthorized } from "../../users/filters/me.filter.js";
import { MembershipNotFoundError } from "../membership.repository.js";
import { MembershipNotFoundToForbidden } from "./organization-members.filter.js";

const CREATE_INVITATION_DOMAIN_TO_HTTP: DomainErrorToHttpExceptionMap = new Map([
  [NotSignedInError, NotSignedInToUnauthorized],
  [MembershipNotFoundError, MembershipNotFoundToForbidden],
]);

@Catch(...CREATE_INVITATION_DOMAIN_TO_HTTP.keys())
export class CreateInvitationFilter extends BaseExceptionFilter {
  public catch(error: Error, host: ArgumentsHost) {
    super.catch(
      convertDomainErrorToHttpException(error, CREATE_INVITATION_DOMAIN_TO_HTTP),
      host,
    );
  }
}
