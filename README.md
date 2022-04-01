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
    name: string
    age: number
}
```

With `catharism`'s primitve type guards and combinators you can define a type guard for an array of students in no time:
```ts
import type { Student } from 'src/models/Student'
import { isNumber, isString, isArrayOf, isObjectOf } from 'catharism'

const isListOfStudents = isArrayOf(isObjectOf({
    name: isString,
    age: isNumber
}));

declare data: unknown; // Received from untrusted source

if (isListOfStudents(data)) {
    // `data` has pased all the checks,
    // so it is assignable to Student[] until the end of the 'if' block
}
```

# Type checkers

Want to be warned if data doesn't match the expected format whilst debugging but don't want the app to stop working in production environment? Combine type checkers the same way you did with type guards:
```ts
import { number, string, arrayOf, objectOf } from 'catharism'

const listOfStudents = arrayOf(objectOf({
    name: string,
    age: number
}));

declare data: unknown;

const list = listOfStudents(data)
```
If built not for production, `listOfStudents` will warn you if the list is malformed or any item in the list is malformed. Otherwise no check will be done.
