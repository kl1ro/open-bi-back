import type Invitation from "./invitation.js";

export abstract class InvitationRepository {
  public abstract insertInvitation(invitation: Invitation): Promise<void>;
}

export class InvitationInsertFailedError extends Error {
  public name = InvitationInsertFailedError.name;
  public id: Invitation["id"];

  public constructor(options: ErrorOptions & { id: Invitation["id"] }) {
    super(`Failed to insert the invitation with id of ${options.id}`, options);
    this.id = options.id;
  }
}
