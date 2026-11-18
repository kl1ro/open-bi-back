import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import type Invitation from "../invitation.js";
import {
  InvitationInsertFailedError,
  InvitationLoadByIdFailedError,
  InvitationRepository,
} from "../invitation.repository.js";
import { INVITATION_SCHEMA } from "./invitation.schema.js";

@Injectable()
export class MikroOrmInvitationRepository extends InvitationRepository {
  public constructor(private readonly entityManager: EntityManager) {
    super();
  }

  public async insertInvitation(invitation: Invitation) {
    try {
      await this.entityManager.insert(INVITATION_SCHEMA, invitation);
    } catch (error) {
      throw new InvitationInsertFailedError({ id: invitation.id, cause: error });
    }
  }

  public async findInvitationById(id: Invitation["id"]): Promise<Invitation | undefined> {
    try {
      const invitation = await this.entityManager.findOne(INVITATION_SCHEMA, { id });
      return invitation ?? undefined;
    } catch (error) {
      throw new InvitationLoadByIdFailedError({ id, cause: error });
    }
  }
}
