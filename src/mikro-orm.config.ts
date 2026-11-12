import "reflect-metadata";

import { validateEnvironment } from "./env.js";
import { createMikroOrmConfig } from "./mikro-orm.js";

const environment = validateEnvironment(process.env);
export default createMikroOrmConfig(environment.databaseUrl);
