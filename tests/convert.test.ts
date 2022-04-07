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

test("toArrayOf toObjectOf toDate", () => {
  type Student = { name: string; age: number; admittedAt: Date };

  const input = [
    { name: "Sasha", age: 20, admittedAt: "2004-01-01" },
    { name: "Zhenya", age: 35, admittedAt: 1649324377.192 },
  ];

  const output: Student[] = [
    { name: "Sasha", age: 20, admittedAt: new Date("2004-01-01") },
    { name: "Zhenya", age: 35, admittedAt: new Date("2022-04-07T09:39:37.192Z") },
  ];

  const convert: Cast<Student[]> = toArrayOf(
    toObjectOf({
      name: string,
      age: number,
      admittedAt: toDate,
    })
  );

  expect(convert(input)).toEqual(output);
});
