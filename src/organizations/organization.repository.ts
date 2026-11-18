import type User from "../users/user.js";
import type Membership from "./membership.js";
import type Organization from "./organization.js";

export abstract class OrganizationRepository {
  public abstract insertOrganizationWithOwner(
    organization: Organization,
    owner: Membership,
  ): Promise<void>;

  public abstract findOrganizationsByMember(
    memberId: User["id"],
  ): Promise<Organization[]>;

  public abstract findOrganizationById(
    id: Organization["id"],
  ): Promise<Organization | undefined>;

  public abstract updateOrganization(organization: Organization): Promise<void>;
  public abstract deleteOrganization(organization: Organization): Promise<void>;

  public async getOrganizationById(id: Organization["id"]): Promise<Organization> {
    const organization = await this.findOrganizationById(id);
    if (!organization) throw new OrganizationNotFoundError({ id });
    return organization;
  }
}

export class OrganizationInsertFailedError extends Error {
  public name = OrganizationInsertFailedError.name;
  public id: Organization["id"];

  public constructor(options: ErrorOptions & { id: Organization["id"] }) {
    super(`Failed to insert the organization with id of ${options.id}`, options);
    this.id = options.id;
  }
}

export class OrganizationsLoadByMemberFailedError extends Error {
  public name = OrganizationsLoadByMemberFailedError.name;
  public memberId: User["id"];

  public constructor(options: ErrorOptions & { memberId: User["id"] }) {
    super(
      `Failed to load the organizations of the member with id of ${options.memberId}`,
      options,
    );

    this.memberId = options.memberId;
  }
}

export class OrganizationLoadByIdFailedError extends Error {
  public name = OrganizationLoadByIdFailedError.name;
  public id: Organization["id"];

  public constructor(options: ErrorOptions & { id: Organization["id"] }) {
    super(`Failed to load the organization with id of ${options.id}`, options);
    this.id = options.id;
  }
}

export class OrganizationNotFoundError extends Error {
  public name = OrganizationNotFoundError.name;
  public id: Organization["id"];

  public constructor(options: ErrorOptions & { id: Organization["id"] }) {
    super(`Organization with id of ${options.id} doesn't exist`, options);
    this.id = options.id;
  }
}

export class OrganizationUpdateFailedError extends Error {
  public name = OrganizationUpdateFailedError.name;
  public id: Organization["id"];

  public constructor(options: ErrorOptions & { id: Organization["id"] }) {
    super(`Failed to update the organization with id of ${options.id}`, options);
    this.id = options.id;
  }
}

export class OrganizationDeleteFailedError extends Error {
  public name = OrganizationDeleteFailedError.name;
  public id: Organization["id"];

  public constructor(options: ErrorOptions & { id: Organization["id"] }) {
    super(`Failed to delete the organization with id of ${options.id}`, options);
    this.id = options.id;
  }
}
