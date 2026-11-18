import type User from "../users/user.js";

export default interface Organization {
  id: string;
  name: string;
  ownerId: User["id"];
  createdAt: Date;
}

export function isOrganizationOwnedBy(organization: Organization, userId: User["id"]) {
  return organization.ownerId === userId;
}

export function convertOrganizationToView(organization: Organization): OrganizationView {
  return { id: organization.id, name: organization.name, ownerId: organization.ownerId };
}

export interface OrganizationView {
  id: Organization["id"];
  name: Organization["name"];
  ownerId: Organization["ownerId"];
}
