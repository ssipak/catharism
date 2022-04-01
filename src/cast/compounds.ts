import type { PropPurgers, Purger } from "../types";
import { dev } from "../env";
import { array as purgeArray, object as purgeObject } from "./object";
import { castCast, intercept, warn } from "../utils";

export const arrayOf = dev
  ? <T>(purger: Purger<T>): Purger<T[]> =>
      (val: unknown, path: string = "") => {
        const cbRes = intercept((anyWarnings) => {
          const array = purgeArray(val, path);

          if (!anyWarnings()) {
            array.forEach((v, i) => {
              purger(v, `${path}[${i}]`);
            });
          }

          return val as T[];
        });

        cbRes.warnings.forEach((w) => warn(w, path));

        return cbRes.result ?? (val as T[]);
      }
  : castCast;

export const objectOf = dev
  ? <T>(propPurgers: PropPurgers<T>): Purger<T> =>
      (val: unknown, path: string = ""): T => {
        const cbRes = intercept((anyWarnings) => {
          const object = purgeObject(val, path);

          if (!anyWarnings()) {
            for (const [field, purger] of Object.entries<Purger<T[keyof T]>>(
              propPurgers
            )) {
              purger(object[field], `${path}.${field}`);
            }
          }

          return val as T;
        });

        cbRes.warnings.forEach((w) => warn(w, path));

        return cbRes.result ?? (val as T);
      }
  : castCast;

export const record = dev
  ? <V>(valuePurger: Purger<V>): Purger<Record<string, V>> =>
      (val: unknown, path: string = "") => {
        const cbRes = intercept((anyWarnings) => {
          const object = purgeObject(val, path);

          if (!anyWarnings()) {
            for (const [field, value] of Object.entries(object)) {
              valuePurger(value, `${path}.${field}`);
            }
          }

          return val as Record<string, V>;
        });

        cbRes.warnings.forEach((w) => warn(w, path));

        return cbRes.result ?? (val as Record<string, V>);
      }
  : castCast;
