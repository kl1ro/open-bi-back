import type User from "../users/user.js";
import type Organization from "./organization.js";

export default interface Membership {
  organizationId: Organization["id"];
  userId: User["id"];
  invitedBy: User["id"] | null;
  joinedAt: Date;
}
