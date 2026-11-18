import type { HttpException } from "@nestjs/common";

export function resolveError(
  error: Error,
  resolvers: ReadonlyMap<unknown, ErrorResolver>,
) {
  const resolver = resolvers.get(error.constructor);
  return resolver?.(error) ?? error;
}

export type ErrorResolver = (error: Error) => HttpException;
export type ErrorResolvers = ReadonlyMap<ErrorClass, ErrorResolver>;
export type ErrorClass = new (...args: never[]) => Error;
