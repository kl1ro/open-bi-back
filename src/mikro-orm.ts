import { Migrator } from "@mikro-orm/migrations";
import { defineConfig, type Options } from "@mikro-orm/postgresql";

import { USER_SCHEMA } from "./users/mikro-orm/user.schema.js";

export function createMikroOrmConfig(databaseUrl: string): Options {
  return defineConfig({
    clientUrl: databaseUrl,
    entities: [USER_SCHEMA],
    extensions: [Migrator],

    migrations: {
      path: "dist/migrations",
      pathTs: "src/migrations",
    },
  });
}
