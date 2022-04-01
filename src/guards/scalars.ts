import type { ObjectKey } from "../types";

export function isNumber(val: unknown): val is number {
  return typeof val === "number";
}

export function isString(val: unknown): val is string {
  return typeof val === "string";
}

export function isBoolean(val: unknown): val is boolean {
  return typeof val === "boolean";
}

export function isExactly<T>(sample: T) {
  return (val: unknown): val is T => val === sample;
}

export function isOneOf<T extends ObjectKey>(list: readonly T[]) {
  return (val: unknown): val is T => list.includes(val as T);
}
