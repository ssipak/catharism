import type { Guard, PropGuards } from "../types";
import { isArray, isObject } from "./object";

export function isArrayOf<T>(guard: (val: unknown) => val is T) {
  return (val: unknown): val is T[] => {
    return isArray(val) && val.every((v) => guard(v));
  };
}

export function isRecord<V>(valueGuard: (val: unknown) => val is V) {
  return (val: unknown): val is Record<string, V> => {
    return isObject(val) && Object.values(val).every(valueGuard);
  };
}

export function isObjectOf<T>(propGuards: PropGuards<T>) {
  return function (val: unknown): val is T {
    if (!isObject(val)) {
      return false;
    }

    for (const [prop, guard] of Object.entries<Guard<T[keyof T]>>(propGuards)) {
      if (guard(val[prop])) {
        return false;
      }
    }

    return true;
  };
}
