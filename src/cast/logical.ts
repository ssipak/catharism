import { dev } from "../env";
import { toEither } from "../convert/logical";
import { toNullable } from "./../convert/logical";
import { castCast } from "../utils";

export const either = dev ? toEither : castCast;
export const nullable = dev ? toNullable : castCast;
