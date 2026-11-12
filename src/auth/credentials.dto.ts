import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

import type User from "../users/user.js";

export class CredentialsDto {
  @Transform(normalizeEmail)
  @IsEmail()
  public email: User["email"];

  @IsString()
  @MinLength(8)
  public password: string;
}

function normalizeEmail(params: { value: unknown }) {
  if (typeof params.value !== "string") return params.value;
  return params.value.trim().toLowerCase();
}
