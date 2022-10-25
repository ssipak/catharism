import type { Guard } from "../types";

type GuardTypes<G, V = never> = G extends [Guard<infer T>, ...infer R]
  ? GuardTypes<R, V | T>
  : V;

export function isEither<T, G extends Guard<T>[]>(...guards: G) {
  return (v: unknown): v is GuardTypes<G> => {
    for (const guard of guards) {
      if (guard(v)) {
        return true;
      }
    }
    return false;
  };
}

export function isNullable<T>(guard: Guard<T>): Guard<T | null> {
  return (v: unknown): v is T | null => v === null || guard(v);
}
