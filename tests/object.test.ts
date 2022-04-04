import { toThrowErrorDevOnly } from "./bootstrap";
import { object, array } from "../src/cast/object";

class A {
  prop = "cool";
}

test("object", () => {
  const invalidValues = [undefined, null, "1", 1, 1n, true, () => "nice"];
  const validValues = [{}, [], { a: 1, b: "string" }, new A()];

  for (const val of invalidValues) {
    toThrowErrorDevOnly(() => object(val));
  }

  for (const val of validValues) {
    expect(object(val)).toEqual(val);
  }
});

test("array", () => {
  for (const val of [
    undefined,
    null,
    "1",
    1,
    1n,
    true,
    () => "nice",
    {},
    new A(),
    { a: 1, b: "string" },
  ]) {
    toThrowErrorDevOnly(() => array(val))
  }

  for (const val of [[], [{ a: 1, b: "string" }, new A()]]) {
    expect(array(val)).toEqual(val);
  }
});
