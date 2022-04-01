import type { ObjectKey, Purger } from "../types";
import { dev } from "../env";
import {
  isBoolean,
  isExactly,
  isNumber,
  isOneOf,
  isString,
} from "../guard/scalars";
import { generic } from "./generic";
import { cast, castCast } from "../utils";

export const number = dev
  ? generic(isNumber, (val) => `«${val}» is not a number`)
  : cast;

export const string = dev
  ? generic(isString, (val) => `«${val}» is not a string`)
  : cast;

export const boolean = dev
  ? generic(isBoolean, (val) => `«${val}» is not a boolean`)
  : cast;

type ExactlyCombinator = <T>(sample: T) => Purger<typeof sample>;
export const exactly: ExactlyCombinator = dev
  ? (sample) =>
      generic(
        isExactly(sample),
        (val) => `«${val}» doesn't exactly match «${sample}»`
      )
  : castCast;

type OneOfCombinator = <T extends ObjectKey>(
  list: readonly T[]
) => Purger<typeof list[number]>;
export const oneOf: OneOfCombinator = dev
  ? (list) => generic(isOneOf(list))
  : castCast;
