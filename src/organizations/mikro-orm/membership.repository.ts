import { EntityManager, UniqueConstraintViolationException } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import type User from "../../users/user.js";
import type Invitation from "../invitation.js";
import { InvitationUsedUpError } from "../invitation.js";
import type Membership from "../membership.js";
import {
  InvitationSpendFailedError,
  MembershipDeleteFailedError,
  MembershipExistsError,
  MembershipInsertFailedError,
  MembershipLoadFailedError,
  MembershipRepository,
  MembershipsLoadByOrganizationFailedError,
} from "../membership.repository.js";
import type Organization from "../organization.js";
import { INVITATION_SCHEMA } from "./invitation.schema.js";
import { MEMBERSHIP_SCHEMA } from "./membership.schema.js";

@Injectable()
export class MikroOrmMembershipRepository extends MembershipRepository {
  public constructor(private readonly entityManager: EntityManager) {
    super();
  }

  public async findMembership(
    organizationId: Organization["id"],
    userId: User["id"],
  ): Promise<Membership | undefined> {
    try {
      const filter = { organizationId, userId };
      const membership = await this.entityManager.findOne(MEMBERSHIP_SCHEMA, filter);
      return membership ?? undefined;
    } catch (error) {
      throw new MembershipLoadFailedError({ organizationId, userId, cause: error });
    }
  }

  public async findMembershipsByOrganization(
    organizationId: Organization["id"],
  ): Promise<Membership[]> {
    try {
      return await this.entityManager.find(MEMBERSHIP_SCHEMA, { organizationId });
    } catch (error) {
      throw new MembershipsLoadByOrganizationFailedError({
        organizationId,
        cause: error,
      });
    }
  }

  public async insertMembership(membership: Membership) {
    try {
      await this.entityManager.insert(MEMBERSHIP_SCHEMA, membership);
    } catch (error) {
      throw interpretInsertMembershipError(error, membership);
    }
  }

  public async insertMembershipSpendingInvitation(
    membership: Membership,
    invitation: Invitation,
  ) {
    await this.entityManager.transactional(async () => {
      await this.spendInvitation(invitation, membership);
      await this.insertMembership(membership);
    });
  }

  public async deleteMembership(membership: Membership) {
    const ids = { organizationId: membership.organizationId, userId: membership.userId };

    try {
      await this.entityManager.nativeDelete(MEMBERSHIP_SCHEMA, ids);
    } catch (error) {
      throw new MembershipDeleteFailedError({ ...ids, cause: error });
    }
  }

  private async spendInvitation(invitation: Invitation, membership: Membership) {
    const spentCount = await this.markInvitationUsed(invitation, membership);
    if (!spentCount) throw new InvitationUsedUpError({ id: invitation.id });
  }

  private async markInvitationUsed(
    invitation: Invitation,
    membership: Membership,
  ): Promise<number> {
    try {
      const filter = { id: invitation.id, usedBy: null };
      const changes = { usedBy: membership.userId, usedAt: membership.joinedAt };
      return await this.entityManager.nativeUpdate(INVITATION_SCHEMA, filter, changes);
    } catch (error) {
      throw new InvitationSpendFailedError({ id: invitation.id, cause: error });
    }
  }
}

function interpretInsertMembershipError(error: unknown, membership: Membership): Error {
  const ids = { organizationId: membership.organizationId, userId: membership.userId };

  if (error instanceof UniqueConstraintViolationException)
    return new MembershipExistsError({ ...ids, cause: error });

  return new MembershipInsertFailedError({ ...ids, cause: error });
}
