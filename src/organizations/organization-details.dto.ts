import { IsNotEmpty, IsString, MaxLength } from "class-validator";

import type Organization from "./organization.js";

export class OrganizationDetailsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  public name: Organization["name"];
}
