export type ObjectKey = string | number | symbol;

export type Guard<T extends W, W = unknown> = (data: W) => data is T;
export type Cast<T, W = unknown> = (data: W, path?: string) => T;

export type PropGuards<T> = { [key in keyof T]: Guard<T[key]> };
export type PropCasts<T> = { [key in keyof T]: Cast<T[key]> };

export type CastsValues<A, I = never> = A extends [Cast<infer V>, ...infer Rest]
  ? CastsValues<Rest, I | V>
  : I;

export type Logger = (msg: string) => void;
