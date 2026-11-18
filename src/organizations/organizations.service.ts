import { Injectable } from "@nestjs/common";
import type { Request } from "express";
import { v7 as uuidv7 } from "uuid";

import { getSessionUserId } from "../session.js";
import type User from "../users/user.js";
import type Membership from "./membership.js";
import type Organization from "./organization.js";
import type { OrganizationDetailsDto } from "./organization-details.dto.js";
import { OrganizationRepository } from "./organization.repository.js";

@Injectable()
export class OrganizationsService {
  public constructor(private readonly organizationRepository: OrganizationRepository) {}

  public async create(
    details: OrganizationDetailsDto,
    session: Request["session"],
  ): Promise<Organization> {
    const deps = { ownerId: getSessionUserId(session) };
    const organization = createOrganization(details, deps);
    const owner = createOwnerMembership(organization);
    await this.organizationRepository.insertOrganizationWithOwner(organization, owner);
    return organization;
  }

  public async getMine(session: Request["session"]): Promise<Organization[]> {
    const myId = getSessionUserId(session);
    return this.organizationRepository.findOrganizationsByMember(myId);
  }
}

function createOrganization(
  details: OrganizationDetailsDto,
  deps: CreateOrganizationDeps,
): Organization {
  return {
    id: uuidv7(),
    name: details.name,
    ownerId: deps.ownerId,
    createdAt: new Date(),
  };
}

interface CreateOrganizationDeps {
  ownerId: User["id"];
}

function createOwnerMembership(organization: Organization): Membership {
  return {
    organizationId: organization.id,
    userId: organization.ownerId,
    invitedBy: null,
    joinedAt: organization.createdAt,
  };
}
