import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module.js";
import type Environment from "./env.js";
import { validateEnvironment } from "./env.js";
import { HealthModule } from "./health/health.module.js";
import { createMikroOrmConfig } from "./mikro-orm.js";
import { UsersModule } from "./users/users.module.js";
import { OrganizationsModule } from "./organizations/organizations.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ validate: validateEnvironment }),

    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createMikroOrmConfigFromEnvironment,
      driver: PostgreSqlDriver,
    }),

    HealthModule,
    UsersModule,
    AuthModule,
    OrganizationsModule,
  ],
})
export class AppModule {}

function createMikroOrmConfigFromEnvironment(config: ConfigService<Environment, true>) {
  const deps = { databaseUrl: config.get("databaseUrl", { infer: true }) };
  return createMikroOrmConfig(deps);
}
