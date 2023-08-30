import type { Cast, PropCasts } from "../types";
import { dev } from "../env";
import { warn } from "../utils";
import { isArray, isObject } from "../guard/object";
import { arrayMsg, objectMsg } from "../messages/object";

export const toArrayOf =
  <T>(cast: Cast<T>): Cast<T[]> =>
  (data: unknown, path: string = "") => {
    if (!isArray(data)) {
      if (dev) {
        warn(arrayMsg(data), path);
      }
      return data as T[];
    }

    data.forEach((v, i) => {
      data[i] = cast(v, `${path}[${i}]`);
    });

    return data as T[];
  };

export const toObjectOf =
  <T>(propCasts: PropCasts<T>): Cast<T> =>
  (data: unknown, path: string = ""): T => {
    if (!isObject(data)) {
      if (dev) {
        warn(objectMsg(data), path);
      }
      return data as T;
    }

    for (const [field, cast] of Object.entries<Cast<T[keyof T]>>(propCasts)) {
      data[field] = cast(data[field], `${path}.${field}`);
    }

    return data as T;
  };

export const toRecord =
  <V>(valueCast: Cast<V>): Cast<Record<string, V>> =>
  (data: unknown, path: string = "") => {
    if (!isObject(data)) {
      if (dev) {
        warn(objectMsg(data), path);
      }
      return data as Record<string, V>;
    }

    for (const [field, value] of Object.entries(data)) {
      data[field] = valueCast(value, `${path}.${field}`);
    }

    return data as Record<string, V>;
  };
