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
