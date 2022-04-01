import { dev } from "../src/env";
import { pushLogger } from "../src/utils";

pushLogger(() => (msg) => {
  // console.warn(msg)
  throw new Error(msg);
});

export function toThrowErrorDevOnly<T>(v: T) {
  if (dev) {
    expect(v).toThrow();
  } else {
    expect(v).not.toThrow();
  }
}
