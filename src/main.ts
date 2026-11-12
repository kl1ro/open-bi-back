import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";
import type Environment from "./env.js";
import { createSessionMiddleware } from "./session.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService<Environment, true>>(ConfigService);

  const deps = {
    redisUrl: config.get("redisUrl", { infer: true }),
    sessionSecret: config.get("sessionSecret", { infer: true }),
  };

  app.use(await createSessionMiddleware(deps));
  await app.listen(config.get("port", { infer: true }));
}

await bootstrap();
