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

export function isInvitationExpired(invitation: Invitation) {
  if (!invitation.expiresAt) return false;
  return invitation.expiresAt <= new Date();
}

export class InvitationExpiredError extends Error {
  public name = InvitationExpiredError.name;
  public id: Invitation["id"];

  public constructor(options: ErrorOptions & { id: Invitation["id"] }) {
    super(`Invitation with id of ${options.id} has expired`, options);
    this.id = options.id;
  }
}

export function isInvitationUsedUp(invitation: Invitation) {
  return invitation.singleUse && Boolean(invitation.usedBy);
}

export class InvitationUsedUpError extends Error {
  public name = InvitationUsedUpError.name;
  public id: Invitation["id"];

  public constructor(options: ErrorOptions & { id: Invitation["id"] }) {
    super(
      `Single-use invitation with id of ${options.id} has already been used`,
      options,
    );

    this.id = options.id;
  }
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
