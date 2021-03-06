import { toThrowErrorDevOnly } from "./bootstrap";
import {
  boolean,
  number,
  oneOf,
  string,
  exactly,
} from "../src/cast/scalars";

test("number", () => {
  for (const val of [undefined, null, "1", 1n, {}, true]) {
    toThrowErrorDevOnly(() => number(val));
  }

  expect(number(1)).toBe(1);
});

test("string", () => {
  for (const val of [undefined, null, 1, 1n, {}, true]) {
    toThrowErrorDevOnly(() => string(val));
  }
  expect(string("1")).toBe("1");
});

test("boolean", () => {
  for (const val of [undefined, null, "1", 1, 1n, {}]) {
    toThrowErrorDevOnly(() => boolean(val));
  }
  expect(boolean(true)).toBe(true);
  expect(boolean(false)).toBe(false);
});

test("value", () => {
  for (const val of [undefined, null, "1", 1, 1n, {}, true]) {
    expect(exactly(val)(val)).toBe(val);
  }
  toThrowErrorDevOnly(() => exactly({})({}));
});

test("oneOf", () => {
  const list = [1, "2"] as const;
  const cast = oneOf(list);

  for (const val of list) {
    expect(cast(val)).toBe(val);
  }

  for (const val of [2, "1"]) {
    toThrowErrorDevOnly(() => cast(val));
  }
});
