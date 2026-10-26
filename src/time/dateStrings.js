import { format as formatFNS, parse } from "date-fns";


import jet from "@randajan/jet-core";
import { toInterval } from "./date.js";


const dateToStr = (date, format) => {
  if (!(date instanceof Date) || isNaN(date)) { return ""; }
  return formatFNS(date, format);
}
const strToDate = (str, format) => {
  if (str instanceof Date) { return str; }
  if (typeof str !== "string" || !str) { return; }
  const date = parse(str, format, new Date());
  if (!isNaN(date)) { return date; }
};

const _levels = "yMdhms";
class DateStringFormat {

  constructor(ascending, defaultSeparator, blockPattern) {
    const levels = {};

    for (let i = 0; i < _levels.length; i++) {
      const lvl = _levels[i];
      const ptrn = levels[lvl] = [];
      for (const [l, p] of blockPattern) { if (_levels.indexOf(l) >= i) { ptrn.push(p); } }
    }

    jet.prop.solid.all(this, {
      ascending,
      getSeparator: sep => sep != null ? sep : defaultSeparator != null ? defaultSeparator : "",
      getFormat: (sep, lvl = "y") => {
        if (levels[lvl]) { return levels[lvl].join(this.getSeparator(sep)); }
        throw Error(`DateStringFormat level '${lvl}' must be one of: '${_levels}'`);
      }
    });

  }

  to(date, sep, lvl = "y") { return dateToStr(date, this.getFormat(sep, lvl)); }
  from(str, sep, lvl = "y") { return strToDate(str, this.getFormat(sep, lvl)); }

  toInterval(strFrom, strTo, sep) { return toInterval(this.from(strFrom, sep), this.from(strTo, sep)); }

  toIntervalLabel(from, to, inSep, outSep, rangeSymbol = " - ") {
    const a = this.ascending;

    from = this.from(from, inSep);
    to = this.from(to, inSep);
    outSep = outSep != null ? outSep : inSep;

    let l = "s";

    if (from.getFullYear() !== to.getFullYear()) { l = "y"; }
    else if (from.getMonth() !== to.getMonth()) { l = "M"; }
    else if (from.getDate() !== to.getDate()) { l = "d"; }
    else if (from.getHours() !== to.getHours()) { l = "h"; }
    else if (from.getMinutes() !== to.getMinutes()) { l = "s"; }

    return this.to(from, outSep, a ? l : "y") + rangeSymbol + this.to(to, outSep, a ? "y" : l);
  }

}

const ymd = new DateStringFormat(false, "-", [["y", "yyyy"], ["M", "MM"], ["d", "dd"]]);
const dmy = new DateStringFormat(true, ".", [["d", "dd"], ["M", "MM"], ["y", "yyyy"]]);

const dateStrings = {
  ymd,
  dmy
}

export default dateStrings;
export {
  dmy,
  ymd
}
