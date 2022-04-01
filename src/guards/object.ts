import { ObjectKey } from "../types";

export function isObject(val: unknown): val is Record<ObjectKey, unknown> {
  return val !== null && typeof val === "object";
}

export function isArray(val: unknown): val is unknown[] {
  return Array.isArray(val);
}

export function isDateLike(val: unknown): val is Date | string {
  return (
    typeof val === "string" || (typeof val === "object" && val instanceof Date)
  );
}
