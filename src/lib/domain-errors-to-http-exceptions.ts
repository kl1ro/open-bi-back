import type { HttpException } from "@nestjs/common";

export function convertDomainErrorToHttpException(
  error: Error,
  map: ReadonlyMap<unknown, DomainErrorToHttpException>,
) {
  const domainErrorToHttpException = map.get(error.constructor);
  return domainErrorToHttpException?.(error) ?? error;
}

export type DomainErrorToHttpException = (error: Error) => HttpException;

export type DomainErrorToHttpExceptionMap = ReadonlyMap<
  DomainErrorClass,
  DomainErrorToHttpException
>;

export type DomainErrorClass = new (...args: never[]) => Error;
