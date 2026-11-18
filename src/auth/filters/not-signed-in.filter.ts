import { Catch, UnauthorizedException, type ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import { NotSignedInError } from "../../session.js";

@Catch(NotSignedInError)
export class NotSignedInFilter extends BaseExceptionFilter {
  public catch(error: unknown, host: ArgumentsHost) {
    super.catch(new UnauthorizedException("Not signed in"), host);
  }
}
