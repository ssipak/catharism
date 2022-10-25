import { toThrowErrorDevOnly } from "./bootstrap";
import { number, oneOf, string } from "../src/cast/scalars";
import { objectOf, arrayOf, record } from "../src/cast/compounds";
import { either } from "../src/cast/logical";

// noinspection JSUnusedGlobalSymbols
class A {
  prop = "cool";
}

interface Animal {
  species: "mouse" | "cat" | "dog" | "bird";
  name: string;
  age: number;
}

test("arrayOf objectOf", () => {
  const cast = arrayOf(
    objectOf({
      species: oneOf(["mouse", "cat", "dog", "bird"]),
      name: string,
      age: number,
    })
  );

  const erroneousList = [
    undefined,
    null,
    "string",
    "1",
    1,
    1n,
    true,
    () => "nice",
    {},
    new A(),
    { a: 1, b: "string" },
    [{ a: 1, b: "string" }, new A()],
  ];

  const correctVal: Animal[] = [
    {
      species: "cat",
      name: "Tom",
      age: 3,
    },
    {
      species: "mouse",
      name: "Jerry",
      age: 2,
    },
  ];

  for (const val of erroneousList) {
    toThrowErrorDevOnly(() => cast(val));
  }

  expect(cast(correctVal)).toBe(correctVal);
});

test("record", () => {
  const cast = record(either(string, number));

  const erroneousList = [
    undefined,
    null,
    "string",
    "1",
    1,
    1n,
    true,
    () => "nice",
    [{ a: 1, b: "string" }, new A()],
  ];

  for (const val of erroneousList) {
    toThrowErrorDevOnly(() => cast(val));
  }

  const correctList = [{ a: 1, b: "string" }, new A(), {}, []];

  for (const val of correctList) {
    expect(cast(val)).toEqual(val);
  }
});
