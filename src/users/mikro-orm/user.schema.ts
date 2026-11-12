import { EntitySchema } from "@mikro-orm/postgresql";

import type User from "../user.js";

export const USER_SCHEMA = new EntitySchema<User>({
  name: "User",
  tableName: "users",

  properties: {
    id: { type: "uuid", primary: true },
    email: { type: "string", unique: true },
    passwordHash: { type: "string" },
    createdAt: { type: "datetime" },
  },
});
