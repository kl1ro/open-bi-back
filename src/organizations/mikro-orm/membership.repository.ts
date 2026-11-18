import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import type User from "../../users/user.js";
import type Membership from "../membership.js";
import {
  MembershipLoadFailedError,
  MembershipRepository,
  MembershipsLoadByOrganizationFailedError,
} from "../membership.repository.js";
import type Organization from "../organization.js";
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
}
