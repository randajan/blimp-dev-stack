import jet from "@randajan/jet-core";
import { intervalToDuration } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

export const msExplode = ms=>{
    const r = intervalToDuration({ start:0, end:Number.jet.to(ms) });
    r.years = r.years || 0;
    r.months = r.months || 0;
    r.days = r.days || 0;
    r.minutes = r.minutes || 0;
    r.seconds = r.seconds || 0;
    return r;
}


export function makeDate(y, m, d, h = 0, min = 0, timeZone = 'Europe/Prague') {
    const naiveDate = new Date(y, m - 1, d, h, min);
    return fromZonedTime(naiveDate, timeZone);
}
