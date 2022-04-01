export {
  isBoolean,
  isNumber,
  isString,
  isExactly,
  isOneOf,
} from "./guards/scalars";
export { isObject, isArray, isDateLike } from "./guards/object";
export { isObjectOf, isRecord, isArrayOf } from "./guards/compounds";

export { generic } from "./purgers/generic";
export { boolean, number, string, exactly, oneOf } from "./purgers/scalars";
export { object, array } from "./purgers/object";
export { objectOf, record, arrayOf } from "./purgers/compounds";
export { either, nullable } from "./purgers/logical";

export { pushLogger, popLogger } from "./utils";
