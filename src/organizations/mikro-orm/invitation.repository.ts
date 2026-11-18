import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import type Invitation from "../invitation.js";
import {
  InvitationInsertFailedError,
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
}
