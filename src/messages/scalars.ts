import type { MessageGn, ObjectKey } from "../types";

export const numberMsg: MessageGn = (val) => `«${val}» is not a number`;
export const stringMsg: MessageGn = (val) => `«${val}» is not a string`;
export const booleanMsg: MessageGn = (val) => `«${val}» is not a boolean`;
export const exactlyMsg: <T>(sample: T) => MessageGn = (sample) => (val) =>
  `«${val}» doesn't exactly match «${sample}»`;
export const oneOfMsg: <T extends ObjectKey>(list: readonly T[]) => MessageGn =
  (list) => (val) =>
    `«${val}» is not included in ${list.join(", ")}`;
export const toDateMsg: MessageGn = (val) =>
  `«${val}» is not convertable to Date`;
