import { randomUUID } from "node:crypto";

import { Injectable } from "@nestjs/common";
import type { Request } from "express";
import { v7 as uuidv7 } from "uuid";

import { getSessionUserId } from "../session.js";
import type User from "../users/user.js";
import type Invitation from "./invitation.js";
import type { InvitationOptionsDto } from "./invitation-options.dto.js";
import { InvitationRepository } from "./invitation.repository.js";
import type Membership from "./membership.js";
import { MembershipRepository } from "./membership.repository.js";
import type Organization from "./organization.js";
import { isOrganizationOwnedBy } from "./organization.js";
import type { OrganizationDetailsDto } from "./organization-details.dto.js";
import { OrganizationRepository } from "./organization.repository.js";

@Injectable()
export class OrganizationsService {
  public constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly invitationRepository: InvitationRepository,
  ) {}

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

  public async update(
    id: Organization["id"],
    details: OrganizationDetailsDto,
    session: Request["session"],
  ): Promise<Organization> {
    const myId = getSessionUserId(session);
    const organization = await this.organizationRepository.getOrganizationById(id);
    ensureOrganizationOwnedBy(organization, myId);
    const updated = getOrganizationWithDetails(organization, details);
    await this.organizationRepository.updateOrganization(updated);
    return updated;
  }

  public async delete(id: Organization["id"], session: Request["session"]) {
    const myId = getSessionUserId(session);
    const organization = await this.organizationRepository.getOrganizationById(id);
    ensureOrganizationOwnedBy(organization, myId);
    await this.organizationRepository.deleteOrganization(organization);
  }

  public async getMembers(
    id: Organization["id"],
    session: Request["session"],
  ): Promise<Membership[]> {
    const myId = getSessionUserId(session);
    await this.ensureMember(id, myId);
    return this.membershipRepository.findMembershipsByOrganization(id);
  }

  public async createInvitation(
    id: Organization["id"],
    options: InvitationOptionsDto,
    session: Request["session"],
  ): Promise<Invitation> {
    const myId = getSessionUserId(session);
    await this.ensureMember(id, myId);
    const deps = { organizationId: id, createdBy: myId };
    const invitation = createInvitation(options, deps);
    await this.invitationRepository.insertInvitation(invitation);
    return invitation;
  }

  private async ensureMember(organizationId: Organization["id"], userId: User["id"]) {
    await this.membershipRepository.getMembership(organizationId, userId);
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

function ensureOrganizationOwnedBy(organization: Organization, userId: User["id"]) {
  if (!isOrganizationOwnedBy(organization, userId))
    throw new NotOrganizationOwnerError({ organizationId: organization.id, userId });
}

export class NotOrganizationOwnerError extends Error {
  public name = NotOrganizationOwnerError.name;
  public organizationId: Organization["id"];
  public userId: User["id"];

  public constructor(
    options: ErrorOptions & { organizationId: Organization["id"]; userId: User["id"] },
  ) {
    super(
      `User with id of ${options.userId} doesn't own the organization with id of ${options.organizationId}`,
      options,
    );

    this.organizationId = options.organizationId;
    this.userId = options.userId;
  }
}

function getOrganizationWithDetails(
  organization: Organization,
  details: OrganizationDetailsDto,
): Organization {
  return { ...organization, name: details.name };
}

function createInvitation(
  options: InvitationOptionsDto,
  deps: CreateInvitationDeps,
): Invitation {
  return {
    id: randomUUID(),
    organizationId: deps.organizationId,
    createdBy: deps.createdBy,
    createdAt: new Date(),
    singleUse: options.singleUse,
    expiresAt: options.expiresAt,
    usedBy: null,
    usedAt: null,
  };
}

interface CreateInvitationDeps {
  organizationId: Organization["id"];
  createdBy: User["id"];
}
