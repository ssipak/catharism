export type ObjectKey = string | number | symbol;

export type Guard<T extends W, W = unknown> = (data: W) => data is T;
export type Purger<T, W = unknown> = (data: W, path?: string) => T;

export type PropGuards<T> = { [key in keyof T]: Guard<T[key]> };
export type PropPurgers<T> = { [key in keyof T]: Purger<T[key]> };

export type PurgersValues<A, I = never> = A extends [
  Purger<infer V>,
  ...infer Rest
]
  ? PurgersValues<Rest, I | V>
  : I;

export type Logger = (msg: string) => void;
