import { dev } from "../env";
import { generic } from "./generic";
import { isArray, isObject } from "../guard/object";
import { arrayMsg, objectMsg } from "../messages/object";
import { cast } from "../utils";

export const object = dev ? generic(isObject, objectMsg) : cast;
export const array = dev ? generic(isArray, arrayMsg) : cast;
