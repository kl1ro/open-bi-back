import { Expose, plainToInstance, Type } from "class-transformer";
import {
  IsInt,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
  validateSync,
  type ValidationError,
} from "class-validator";

export default class Environment {
  @Expose({ name: "PORT" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  public port = 3000;

  @Expose({ name: "DATABASE_URL" })
  @IsUrl({ protocols: ["postgres", "postgresql"], require_tld: false })
  public databaseUrl: string;

  @Expose({ name: "REDIS_URL" })
  @IsUrl({ protocols: ["redis"], require_tld: false })
  public redisUrl: string;

  @Expose({ name: "SESSION_SECRET" })
  @IsString()
  @MinLength(32)
  public sessionSecret: string;
}

export function validateEnvironment(variables: Record<string, unknown>): Environment {
  const environment = convertVariablesToEnvironment(variables);
  const errors = getEnvironmentErrors(environment);
  if (errors.length) throw new InvalidEnvironmentError({ errors });
  return environment;
}

export class InvalidEnvironmentError extends Error {
  public name = InvalidEnvironmentError.name;
  public errors: ValidationError[];

  public constructor(options: ErrorOptions & { errors: ValidationError[] }) {
    super(`Environment variables are invalid:\n${options.errors.join("\n")}`, options);
    this.errors = options.errors;
  }
}

function convertVariablesToEnvironment(variables: Record<string, unknown>): Environment {
  return plainToInstance(Environment, variables, { exposeDefaultValues: true });
}

function getEnvironmentErrors(environment: Environment): ValidationError[] {
  return validateSync(environment);
}
