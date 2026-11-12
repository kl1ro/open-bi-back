import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import type Environment from "./env.js";
import { validateEnvironment } from "./env.js";
import { HealthModule } from "./health/health.module.js";
import { createMikroOrmConfig } from "./mikro-orm.js";
import { UsersModule } from "./users/users.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ validate: validateEnvironment }),

    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: createMikroOrmConfigFromEnvironment,
      driver: PostgreSqlDriver,
    }),

    HealthModule,
    UsersModule,
  ],
})
export class AppModule {}

function createMikroOrmConfigFromEnvironment(config: ConfigService<Environment, true>) {
  return createMikroOrmConfig(config.get("databaseUrl", { infer: true }));
}
