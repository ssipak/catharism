import type { Cast } from "../src/types";
import "./bootstrap";
import { string, number } from "../src/cast/scalars";
// import { numberMsg } from "../src/messages/scalars";
// import { warn } from "../src/utils";
import { toArrayOf, toObjectOf } from "../src/convert/compounds";
import { toDate } from "../src/convert/scalars";

// Despite lib.es5.d.ts parseFloat accepts any kind of datatype
// for any value it fails to convert it basically returns NaN
// declare function parseFloat(string: unknown): number;

// const toNumber: Cast<number> = (data: unknown, path = "") => {
//   const float = parseFloat(data);
//   if (isNaN(float)) {
//     warn(numberMsg(data), path);
//     return data as number;
//   }
//   return float;
// };

test("toArrayOf number", () => {
  type Student = { name: string; age: number; admittedAt: Date };

  const input = [
    { name: "Sasha", age: 20, admittedAt: "2004-01-01" },
    { name: "Zhenya", age: 35, admittedAt: "2012-12-01" },
  ];

  const output: Student[] = [
    { name: "Sasha", age: 20, admittedAt: new Date("2004-01-01") },
    { name: "Zhenya", age: 35, admittedAt: new Date("2012-12-01") },
  ];

  const cast: Cast<Student[]> = toArrayOf(
    toObjectOf({
      name: string,
      age: number,
      admittedAt: toDate,
    })
  );

  expect(cast(input)).toEqual(output);
});
