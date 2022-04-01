import type { Guard } from "../types";
import { dev } from "../env";
import { castCast, warn } from "../utils";

type MsgGen = (val: unknown) => string;

export const generic = dev
  ? <T>(guard: Guard<T>, msg: MsgGen = String) =>
      (val: unknown, path = "") =>
        guard(val) ? val : (warn(msg(val), path), val as T)
  : castCast;
