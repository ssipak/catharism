import { toThrowErrorDevOnly } from "./bootstrap";
import { number, oneOf, string } from "../src/purgers/scalars";
import { objectOf, arrayOf, record } from "../src/purgers/compounds";
import { either } from "../src/purgers/logical";

class A {
  prop = "cool";
}

interface Animal {
  species: "mouse" | "cat" | "dog" | "bird";
  name: string;
  age: number;
}

test("arrayOf objectOf", () => {
  const purger = arrayOf(
    objectOf({
      species: oneOf(["mouse", "cat", "dog", "bird"]),
      name: string,
      age: number,
    })
  );

  const erronousList = [
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

  for (const val of erronousList) {
    toThrowErrorDevOnly(() => purger(val));
  }

  expect(purger(correctVal)).toBe(correctVal);
});

test("record", () => {
  const purger = record(either(string, number));

  const erronousList = [
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

  for (const val of erronousList) {
    toThrowErrorDevOnly(() => purger(val));
  }

  const correctlist = [{ a: 1, b: "string" }, new A(), {}, []];

  for (const val of correctlist) {
    expect(purger(val)).toBe(val);
  }
});
