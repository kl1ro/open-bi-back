import {
  Catch,
  UnauthorizedException,
  UseFilters,
  type ArgumentsHost,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import { NotSignedInError } from "../../session.js";
import { UserNotFoundError } from "../user.repository.js";

export function UseMeFilter() {
  return UseFilters(NotSignedInFilter);
}

@Catch(NotSignedInError, UserNotFoundError)
export class NotSignedInFilter extends BaseExceptionFilter {
  public catch(error: unknown, host: ArgumentsHost) {
    super.catch(new UnauthorizedException("Not signed in"), host);
  }
}
