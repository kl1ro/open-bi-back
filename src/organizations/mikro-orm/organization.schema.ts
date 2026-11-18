import { EntitySchema } from "@mikro-orm/postgresql";

import { USER_SCHEMA } from "../../users/mikro-orm/user.schema.js";
import type Organization from "../organization.js";

export const ORGANIZATION_SCHEMA = new EntitySchema<Organization>({
  name: "Organization",
  tableName: "organizations",

  properties: {
    id: { type: "uuid", primary: true },
    name: { type: "string" },

    ownerId: {
      kind: "m:1",
      type: USER_SCHEMA.meta.className,
      mapToPk: true,
      joinColumn: "owner_id",
    },

    createdAt: { type: "datetime", defaultRaw: "now()" },
  },
});
