import { dev } from "../env";
import { generic } from "./generic";
import { isArray, isObject } from "../guards/object";
import { cast } from "../utils";

export const object = dev
  ? generic(isObject, (val) => `«${val}» is not an object`)
  : cast;

export const array = dev
  ? generic(isArray, (val) => `«${val}» is not an array`)
  : cast;
