import { IsUUID } from "class-validator";

import type Invitation from "./invitation.js";

export class InvitationLinkDto {
  @IsUUID()
  public invitation: Invitation["id"];
}
