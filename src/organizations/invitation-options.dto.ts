import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsOptional } from "class-validator";

import type Invitation from "./invitation.js";
import { getDefaultInvitationExpiry } from "./invitation.js";

export class InvitationOptionsDto {
  @IsOptional()
  @IsBoolean()
  public singleUse: Invitation["singleUse"] = false;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  public expiresAt: Invitation["expiresAt"] = getDefaultInvitationExpiry();
}
