# Catharism

Runtime type guards and checks for complex data structures.

# Overview

Have you ever been in a situation when you can't trust the backend side of your application to send valid data?
And you'd give up a bit of perfomance for a clue what on the Earth is wrong with
that seeminly correct massive nested data structure that you had received?
Start practicing `catharism` and your prayers will be answered!

The library provides a set of helpers that cast `unknown` data to the expected type
warning when the data doesn't match the type when built for development, being silent otherwise.

# Installation

```bash
npm install catharism
```

```bash
yarn add catharism
```

# Type guards

Consider having a type defined as follows:

```ts
interface Student {
  name: string;
  age: number;
}
```

With `catharism`'s primitve type guards and combinators you can define a type guard for an array of students in no time:

```ts
import type { Student } from "src/models/Student";
import { isNumber, isString, isArrayOf, isObjectOf } from "catharism";

const isListOfStudents = isArrayOf(
  isObjectOf({
    name: isString,
    age: isNumber,
  })
);

declare const data: unknown; // Received from untrusted source.

if (isListOfStudents(data)) {
  // `data` has pased all the checks,
  // so it is assignable to Student[] until the end of the 'if' block.
}
```

# Type casting

Want to be warned if data doesn't match the expected format during debugging but don't want the app to stop working in production environment? Combine type cast helpers the same way you did with type guards:

```ts
import { number, string, arrayOf, objectOf } from "catharism";

const listOfStudents = arrayOf(
  objectOf({
    name: string,
    age: number,
  })
);

declare const data: unknown;

const list = listOfStudents(data);
```

If built not for production, `listOfStudents` will warn you if the list is malformed or any item in the list is malformed. Otherwise no check will be done.

Type casting doesn't modify data. When there's need for modifying data, [type conversion](#type-conversion) comes in handy

# Type conversion

Sometimes there's a need to actually modify incoming data so that it matches a type not supported by JSON, like Date, BigInt or a custom type.
Unlike type casting, type conversion modifies incoming data so that it satisfies desired types. The only drawback is that for the compound types we need to use a different set of helpers, although their names follow the same pattern and signatures remain the same.

```ts
// types.ts

const Banana = Symbol("Banana");
const Orange = Symbol("Orange");
const Pineapple = Symbol("Pineapple");

type EdibleType = typeof Banana | typeof Orange | typeof Pineapple;

export interface Edible {
  type: EdibleType;
  count: number;
  expireAt: Date;
}
```

```ts
// cast.ts

// ...imports...

const toType: Cast<EdibleType> = (data: unknown, path = "") => {
  if (isString(data)) {
    switch (data) {
      case "banana":
        return Banana;
      case "orange":
        return Orange;
      case "pineapple":
        return Pineapple;
    }
  }

  warn(`«${data}» is not on the list, sorry`, path);
  return data as EdibleType; // We have to return something anyways.
};

// We used toArrayOf and toObjectOf instead of arrayOf and objectOf accordingly,
// so that on production it still runs all the needed conversions for the underlying data.
export const toEdibles: Cast<Edible[]> = toArrayOf(
  toObjectOf({
    type: toType,
    count: number,
    expiredAt: toDate,
  })
);
```

```ts
// somewhere in your-http-service.ts
// ...

function getEdibles(): Promise<Edible[]> {
  return toEdibles(await httpClient.get("edibles"));
}

// ...
```
