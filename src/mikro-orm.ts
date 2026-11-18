import { Migrator } from "@mikro-orm/migrations";
import { defineConfig, type Options } from "@mikro-orm/postgresql";

import { INVITATION_SCHEMA } from "./organizations/mikro-orm/invitation.schema.js";
import { MEMBERSHIP_SCHEMA } from "./organizations/mikro-orm/membership.schema.js";
import { ORGANIZATION_SCHEMA } from "./organizations/mikro-orm/organization.schema.js";
import { USER_SCHEMA } from "./users/mikro-orm/user.schema.js";

export function createMikroOrmConfig(deps: CreateMikroOrmConfigDeps): Options {
  return defineConfig({
    clientUrl: deps.databaseUrl,
    entities: [USER_SCHEMA, ORGANIZATION_SCHEMA, MEMBERSHIP_SCHEMA, INVITATION_SCHEMA],
    extensions: [Migrator],

    migrations: {
      path: "dist/migrations",
      pathTs: "src/migrations",
    },
  });
}

export interface CreateMikroOrmConfigDeps {
  databaseUrl: string;
}
