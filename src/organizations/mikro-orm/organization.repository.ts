import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import type User from "../../users/user.js";
import type Membership from "../membership.js";
import type Organization from "../organization.js";
import {
  OrganizationInsertFailedError,
  OrganizationRepository,
  OrganizationsLoadByMemberFailedError,
} from "../organization.repository.js";
import { MEMBERSHIP_SCHEMA } from "./membership.schema.js";
import { ORGANIZATION_SCHEMA } from "./organization.schema.js";

@Injectable()
export class MikroOrmOrganizationRepository extends OrganizationRepository {
  public constructor(private readonly entityManager: EntityManager) {
    super();
  }

  public async insertOrganizationWithOwner(
    organization: Organization,
    owner: Membership,
  ) {
    try {
      await this.entityManager.transactional(async (entityManager) => {
        await entityManager.insert(ORGANIZATION_SCHEMA, organization);
        await entityManager.insert(MEMBERSHIP_SCHEMA, owner);
      });
    } catch (error) {
      throw new OrganizationInsertFailedError({ id: organization.id, cause: error });
    }
  }

  public async findOrganizationsByMember(memberId: User["id"]): Promise<Organization[]> {
    try {
      const memberships = await this.entityManager.find(MEMBERSHIP_SCHEMA, {
        userId: memberId,
      });

      const ids = memberships.map((membership) => membership.organizationId);
      return await this.entityManager.find(ORGANIZATION_SCHEMA, { id: { $in: ids } });
    } catch (error) {
      throw new OrganizationsLoadByMemberFailedError({ memberId, cause: error });
    }
  }
}
