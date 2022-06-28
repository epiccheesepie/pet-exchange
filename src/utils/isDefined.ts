// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDefined<T extends any>(something: T): something is NonNullable<T> {
  return something != null;
}
