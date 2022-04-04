import { dev } from "../env";
import { warn } from "../utils";
import { isNumber, isString } from "../guard/scalars";
import { toDateMsg } from "./../messages/scalars";

export function toDate(data: unknown, path: string = ""): Date {
  if (isString(data) || isNumber(data)) {
    const date = new Date(data);

    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  if (dev) {
    warn(toDateMsg(data), path);
  }
  return data as Date;
}
