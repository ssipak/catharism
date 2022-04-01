import type { Cast, CastsValues } from "../types";
import { dev } from "../env";
import { castCast, InterceptNoReturn } from "../utils";
import { intercept, warn } from "../utils";

export const either = dev
  ? <P extends Cast<unknown, W>[], W = unknown>(
        ...casts: P
      ): Cast<CastsValues<P>, W> =>
      (val: W, path = "") => {
        const cbRes = intercept((anyWarnings) => {
          for (const cast of casts) {
            const pure = cast(val) as CastsValues<P>;

            if (!anyWarnings()) {
              return pure;
            }
          }

          return InterceptNoReturn;
        });

        if ("result" in cbRes) {
          return cbRes.result ?? (val as CastsValues<P>);
        }

        warn(`Value can't be casted as ${cbRes.warnings.join(", ")}`, path);
        return val as CastsValues<P>;
      }
  : castCast;

export const nullable = dev
  ? <T, W = unknown>(cast: Cast<T, W>): Cast<T | null, W> =>
      (val: W, path = "") => {
        return val === null ? null : cast(val, path);
      }
  : castCast;
