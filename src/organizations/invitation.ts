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

const DEFAULT_INVITATION_LIFETIME = 24 * 60 * 60 * 1000;

export function getDefaultInvitationExpiry(): Date {
  return new Date(Date.now() + DEFAULT_INVITATION_LIFETIME);
}

export function convertInvitationToView(invitation: Invitation): InvitationView {
  return {
    id: invitation.id,
    singleUse: invitation.singleUse,
    expiresAt: invitation.expiresAt,
  };
}

export interface InvitationView {
  id: Invitation["id"];
  singleUse: Invitation["singleUse"];
  expiresAt: Invitation["expiresAt"];
}
