import type User from "../users/user.js";
import type Organization from "./organization.js";

export default interface Membership {
  organizationId: Organization["id"];
  userId: User["id"];
  invitedBy: User["id"] | null;
  joinedAt: Date;
}

export function convertMembershipToView(membership: Membership): MembershipView {
  return {
    userId: membership.userId,
    invitedBy: membership.invitedBy,
    joinedAt: membership.joinedAt,
  };
}

export interface MembershipView {
  userId: Membership["userId"];
  invitedBy: Membership["invitedBy"];
  joinedAt: Membership["joinedAt"];
}
