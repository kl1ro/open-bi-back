import type User from "../users/user.js";
import type Organization from "./organization.js";

export default interface Invitation {
  id: string;
  organizationId: Organization["id"];
  createdBy: User["id"];
  createdAt: Date;
  singleUse: boolean;
  expiresAt: Date | null;
  usedBy: User["id"] | null;
  usedAt: Date | null;
}
