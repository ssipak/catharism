import type { PropCasts, Cast } from "../types";
import { dev } from "../env";
import { array as castArray, object as castObject } from "./object";
import { castCast, intercept, warn } from "../utils";

export const arrayOf = dev
  ? <T>(cast: Cast<T>): Cast<T[]> =>
      (val: unknown, path: string = "") => {
        const cbRes = intercept((anyWarnings) => {
          const array = castArray(val, path);

          if (!anyWarnings()) {
            array.forEach((v, i) => {
              cast(v, `${path}[${i}]`);
            });
          }

          return val as T[];
        });

        cbRes.warnings.forEach((w) => warn(w, path));

        return cbRes.result ?? (val as T[]);
      }
  : castCast;

export const objectOf = dev
  ? <T>(propCasts: PropCasts<T>): Cast<T> =>
      (val: unknown, path: string = ""): T => {
        const cbRes = intercept((anyWarnings) => {
          const object = castObject(val, path);

          if (!anyWarnings()) {
            for (const [field, cast] of Object.entries<Cast<T[keyof T]>>(
              propCasts
            )) {
              cast(object[field], `${path}.${field}`);
            }
          }

          return val as T;
        });

        cbRes.warnings.forEach((w) => warn(w, path));

        return cbRes.result ?? (val as T);
      }
  : castCast;

export const record = dev
  ? <V>(valueCast: Cast<V>): Cast<Record<string, V>> =>
      (val: unknown, path: string = "") => {
        const cbRes = intercept((anyWarnings) => {
          const object = castObject(val, path);

          if (!anyWarnings()) {
            for (const [field, value] of Object.entries(object)) {
              valueCast(value, `${path}.${field}`);
            }
          }

          return val as Record<string, V>;
        });

        cbRes.warnings.forEach((w) => warn(w, path));

        return cbRes.result ?? (val as Record<string, V>);
      }
  : castCast;
