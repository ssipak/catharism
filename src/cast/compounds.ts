import { toRecord } from "./../convert/compounds";
import { toArrayOf, toObjectOf } from "../convert/compounds";
import { dev } from "../env";
import { castCast } from "../utils";

export const arrayOf = dev ? toArrayOf : castCast;
export const objectOf = dev ? toObjectOf : castCast;
export const record = dev ? toRecord : castCast;