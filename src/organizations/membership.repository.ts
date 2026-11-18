import type User from "../users/user.js";
import type Invitation from "./invitation.js";
import type Membership from "./membership.js";
import type Organization from "./organization.js";

export abstract class MembershipRepository {
  public abstract findMembership(
    organizationId: Organization["id"],
    userId: User["id"],
  ): Promise<Membership | undefined>;

  public abstract findMembershipsByOrganization(
    organizationId: Organization["id"],
  ): Promise<Membership[]>;

  public abstract insertMembership(membership: Membership): Promise<void>;

  public abstract insertMembershipSpendingInvitation(
    membership: Membership,
    invitation: Invitation,
  ): Promise<void>;

  public abstract deleteMembership(membership: Membership): Promise<void>;

  public async getMembership(
    organizationId: Organization["id"],
    userId: User["id"],
  ): Promise<Membership> {
    const membership = await this.findMembership(organizationId, userId);
    if (!membership) throw new MembershipNotFoundError({ organizationId, userId });
    return membership;
  }
}

export class MembershipLoadFailedError extends Error {
  public name = MembershipLoadFailedError.name;
  public organizationId: Organization["id"];
  public userId: User["id"];

  public constructor(
    options: ErrorOptions & { organizationId: Organization["id"]; userId: User["id"] },
  ) {
    super(
      `Failed to load the membership of the user with id of ${options.userId} in the organization with id of ${options.organizationId}`,
      options,
    );

    this.organizationId = options.organizationId;
    this.userId = options.userId;
  }
}

export class MembershipsLoadByOrganizationFailedError extends Error {
  public name = MembershipsLoadByOrganizationFailedError.name;
  public organizationId: Organization["id"];

  public constructor(options: ErrorOptions & { organizationId: Organization["id"] }) {
    super(
      `Failed to load the memberships of the organization with id of ${options.organizationId}`,
      options,
    );

    this.organizationId = options.organizationId;
  }
}

export class MembershipNotFoundError extends Error {
  public name = MembershipNotFoundError.name;
  public organizationId: Organization["id"];
  public userId: User["id"];

  public constructor(
    options: ErrorOptions & { organizationId: Organization["id"]; userId: User["id"] },
  ) {
    super(
      `User with id of ${options.userId} isn't a member of the organization with id of ${options.organizationId}`,
      options,
    );

    this.organizationId = options.organizationId;
    this.userId = options.userId;
  }
}

export class MembershipExistsError extends Error {
  public name = MembershipExistsError.name;
  public organizationId: Organization["id"];
  public userId: User["id"];

  public constructor(
    options: ErrorOptions & { organizationId: Organization["id"]; userId: User["id"] },
  ) {
    super(
      `User with id of ${options.userId} is already a member of the organization with id of ${options.organizationId}`,
      options,
    );

    this.organizationId = options.organizationId;
    this.userId = options.userId;
  }
}

export class MembershipInsertFailedError extends Error {
  public name = MembershipInsertFailedError.name;
  public organizationId: Organization["id"];
  public userId: User["id"];

  public constructor(
    options: ErrorOptions & { organizationId: Organization["id"]; userId: User["id"] },
  ) {
    super(
      `Failed to insert the membership of the user with id of ${options.userId} in the organization with id of ${options.organizationId}`,
      options,
    );

    this.organizationId = options.organizationId;
    this.userId = options.userId;
  }
}

export class InvitationSpendFailedError extends Error {
  public name = InvitationSpendFailedError.name;
  public id: Invitation["id"];

  public constructor(options: ErrorOptions & { id: Invitation["id"] }) {
    super(`Failed to mark the invitation with id of ${options.id} as used`, options);
    this.id = options.id;
  }
}

export class MembershipDeleteFailedError extends Error {
  public name = MembershipDeleteFailedError.name;
  public organizationId: Organization["id"];
  public userId: User["id"];

  public constructor(
    options: ErrorOptions & { organizationId: Organization["id"]; userId: User["id"] },
  ) {
    super(
      `Failed to delete the membership of the user with id of ${options.userId} in the organization with id of ${options.organizationId}`,
      options,
    );

    this.organizationId = options.organizationId;
    this.userId = options.userId;
  }
}
