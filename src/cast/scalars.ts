import type { ObjectKey, Cast } from "../types";
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
import {
  booleanMsg,
  exactlyMsg,
  numberMsg,
  oneOfMsg,
  stringMsg,
} from "../messages/scalars";

export const number = dev ? generic(isNumber, numberMsg) : cast;
export const string = dev ? generic(isString, stringMsg) : cast;
export const boolean = dev ? generic(isBoolean, booleanMsg) : cast;

type ExactlyCombinator = <T>(sample: T) => Cast<typeof sample>;
export const exactly: ExactlyCombinator = dev
  ? (sample) => generic(isExactly(sample), exactlyMsg(sample))
  : castCast;

type OneOfCombinator = <T extends ObjectKey>(
  list: readonly T[]
) => Cast<typeof list[number]>;
export const oneOf: OneOfCombinator = dev
  ? (list) => generic(isOneOf(list), oneOfMsg(list))
  : castCast;
