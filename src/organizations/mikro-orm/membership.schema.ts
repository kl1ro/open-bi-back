import { EntitySchema } from "@mikro-orm/postgresql";

import { USER_SCHEMA } from "../../users/mikro-orm/user.schema.js";
import type Membership from "../membership.js";
import { ORGANIZATION_SCHEMA } from "./organization.schema.js";

export const MEMBERSHIP_SCHEMA = new EntitySchema<Membership>({
  name: "Membership",
  tableName: "memberships",

  properties: {
    organizationId: {
      kind: "m:1",
      entity: () => ORGANIZATION_SCHEMA,
      mapToPk: true,
      primary: true,
      joinColumn: "organization_id",
      deleteRule: "cascade",
    },

    userId: {
      kind: "m:1",
      entity: () => USER_SCHEMA,
      mapToPk: true,
      primary: true,
      joinColumn: "user_id",
    },

    invitedBy: {
      kind: "m:1",
      entity: () => USER_SCHEMA,
      mapToPk: true,
      nullable: true,
      joinColumn: "invited_by",
    },

    joinedAt: { type: "datetime" },
  },
});
