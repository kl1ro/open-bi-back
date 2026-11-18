import type Invitation from "./invitation.js";

export abstract class InvitationRepository {
  public abstract insertInvitation(invitation: Invitation): Promise<void>;

  public abstract findInvitationById(
    id: Invitation["id"],
  ): Promise<Invitation | undefined>;

  public async getInvitationById(id: Invitation["id"]): Promise<Invitation> {
    const invitation = await this.findInvitationById(id);
    if (!invitation) throw new InvitationNotFoundError({ id });
    return invitation;
  }
}

export class InvitationInsertFailedError extends Error {
  public name = InvitationInsertFailedError.name;
  public id: Invitation["id"];

  public constructor(options: ErrorOptions & { id: Invitation["id"] }) {
    super(`Failed to insert the invitation with id of ${options.id}`, options);
    this.id = options.id;
  }
}

export class InvitationLoadByIdFailedError extends Error {
  public name = InvitationLoadByIdFailedError.name;
  public id: Invitation["id"];

  public constructor(options: ErrorOptions & { id: Invitation["id"] }) {
    super(`Failed to load the invitation with id of ${options.id}`, options);
    this.id = options.id;
  }
}

export class InvitationNotFoundError extends Error {
  public name = InvitationNotFoundError.name;
  public id: Invitation["id"];

  public constructor(options: ErrorOptions & { id: Invitation["id"] }) {
    super(`Invitation with id of ${options.id} doesn't exist`, options);
    this.id = options.id;
  }
}
