import { EntitySchema } from "@mikro-orm/postgresql";

import type User from "../user.js";

export const USERS_EMAIL_UNIQUE = "users_email_unique";

export const USER_SCHEMA = new EntitySchema<User>({
  name: "User",
  tableName: "users",

  properties: {
    id: { type: "uuid", primary: true },
    email: { type: "string", unique: USERS_EMAIL_UNIQUE },
    passwordHash: { type: "string" },
    createdAt: { type: "datetime" },
  },
});
