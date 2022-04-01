import type { Purger, PurgersValues } from "../types";
import { dev } from "../env";
import { castCast, InterceptNoReturn } from "../utils";
import { intercept, warn } from "../utils";

export const either = dev
  ? <P extends Purger<unknown, W>[], W = unknown>(
        ...purgers: P
      ): Purger<PurgersValues<P>, W> =>
      (val: W, path = "") => {
        const cbRes = intercept((anyWarnings) => {
          for (const purger of purgers) {
            const pure = purger(val) as PurgersValues<P>;

            if (!anyWarnings()) {
              return pure;
            }
          }

          return InterceptNoReturn;
        });

        if ("result" in cbRes) {
          return cbRes.result ?? (val as PurgersValues<P>);
        }

        warn(`Value satisfies no purgers: ${cbRes.warnings.join(", ")}`, path);
        return val as PurgersValues<P>;
      }
  : castCast;

// Alternatively `nullable` function could be defined as follows:
//
// const isNull = (v: unknown): v is null => v === null;
// const purgeNull = (v: unknown) =>
//   isNull(v) ? v : PurgeError.throw(`${v} is not null`);
//
// export const nullable = <T, W = unknown>(
//   purger: Purger<T, W>
// ): Purger<T | null, W> => {
//   return either(purgeNull, purger);
// };
export const nullable = dev
  ? <T, W = unknown>(purger: Purger<T, W>): Purger<T | null, W> =>
      (val: W, path = "") => {
        return val === null ? null : purger(val, path);
      }
  : castCast;
