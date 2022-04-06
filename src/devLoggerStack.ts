import type { Logger } from "./types";
import { dev } from "./env";

const loggers: Logger[] = dev ? [console.warn.bind(console)] : [];

export function warn(message: string, path: string) {
  if (path) {
    message = `${path}: ${message}`;
  }
  loggers.at(-1)?.(message);
}

export function pushLogger(cb: (current: Logger | undefined) => Logger) {
  loggers.push(cb(loggers.at(-1)));
}

export function popLogger() {
  return loggers.pop();
}
