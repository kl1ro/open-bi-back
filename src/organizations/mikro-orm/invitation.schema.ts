import { EntitySchema } from "@mikro-orm/postgresql";

import { USER_SCHEMA } from "../../users/mikro-orm/user.schema.js";
import type Invitation from "../invitation.js";
import { ORGANIZATION_SCHEMA } from "./organization.schema.js";

export const INVITATION_SCHEMA = new EntitySchema<Invitation>({
  name: "Invitation",
  tableName: "invitations",

  properties: {
    id: { type: "uuid", primary: true },

    organizationId: {
      kind: "m:1",
      type: ORGANIZATION_SCHEMA.meta.className,
      mapToPk: true,
      joinColumn: "organization_id",
      deleteRule: "cascade",
    },

    createdBy: {
      kind: "m:1",
      type: USER_SCHEMA.meta.className,
      mapToPk: true,
      joinColumn: "created_by",
    },

    createdAt: { type: "datetime" },
    singleUse: { type: "boolean" },
    expiresAt: { type: "datetime", nullable: true },

    usedBy: {
      kind: "m:1",
      type: USER_SCHEMA.meta.className,
      mapToPk: true,
      nullable: true,
      joinColumn: "used_by",
    },

    usedAt: { type: "datetime", nullable: true },
  },
});
