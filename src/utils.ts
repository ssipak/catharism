import { dev } from "./env";
import {
  warn as devWarn,
  pushLogger as devPushLogger,
  popLogger as devPopLogger,
} from "./devLoggerStack";

export const warn = dev ? devWarn : () => {};
export const pushLogger = dev ? devPushLogger : () => {};
export const popLogger = dev ? devPopLogger : () => {};

export const cast = <T>(x: unknown): T => x as T;
export const castCast = () => cast;

export const InterceptNoReturn = Symbol("intercept-no-return");

export function intercept<R>(
  cb: (anyWarnings: () => boolean) => R | typeof InterceptNoReturn
): { result: R; warnings: string[] } | { warnings: string[] } {
  const warnings = [] as string[];
  let lastCount = 0;

  const anyWarnings = () => {
    const countChanged = lastCount !== warnings.length;
    lastCount = warnings.length;
    return countChanged;
  };

  pushLogger(() => (msg) => {
    warnings.push(msg);
  });

  try {
    const result = cb(anyWarnings);
    return result === InterceptNoReturn ? { warnings } : { result, warnings };
  } finally {
    popLogger();
  }
}
