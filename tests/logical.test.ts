import { toThrowErrorDevOnly } from "./bootstrap";
import { nullable } from "../src/purgers/logical";
import { either } from "../src/purgers/logical";
import { number } from "../src/purgers/scalars";
import { array } from "../src/purgers/object";

class A {
  prop = "cool";
}

const scalarsExceptNumber = [undefined, null, "1", 1n, true, () => "nice"];
const scalarsExceptNull = [undefined, 1, "1", 1n, true, () => "nice"];
const compoundsExceptArray = [{}, { a: 1, b: "string" }, new A()];

test("either", () => {
  const numberOrArray = either(number, array);

  for (const val of [...scalarsExceptNumber, ...compoundsExceptArray]) {
    toThrowErrorDevOnly(() => numberOrArray(val));
  }

  for (const val of [1, []]) {
    expect(numberOrArray(val)).toBe(val);
  }
});

test("nullable", () => {
  const nullableArray = nullable(array);

  for (const val of [...scalarsExceptNull, ...compoundsExceptArray]) {
    toThrowErrorDevOnly(() => nullableArray(val));
  }

  for (const val of [null, []]) {
    expect(nullableArray(val)).toBe(val);
  }
});
