import { dev } from "../env";
import { warn } from "../utils";
import { isNumber, isString } from "../guard/scalars";
import { toDateMsg } from "./../messages/scalars";

export function toDate(data: unknown, path: string = ""): Date {
  let date: Date | undefined;
  if (isString(data)) {
    date = new Date(data);
  } else if (isNumber(data)) {
    date = new Date(data * 1000);
  }

  if (!date || isNaN(date.getTime())) {
    if (dev) {
      warn(toDateMsg(data), path);
    }

    return data as Date;
  }

  return date;
}
