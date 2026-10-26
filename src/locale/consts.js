import "@randajan/jet-core";
import { Say, Lexicon } from "@randajan/say";
import cs from "@randajan/say/cs";
import en from "@randajan/say/en";

import defaultTranslations from "./defaultTranslations.json";
import { msExplode } from "../time/msToClock.js";

export { Say };

const phraseIdParts = parts=>parts
    .flat(Infinity)
    .filter(part=>part != null && part !== "")
    .flatMap(part=>String(part).split("."))
    .filter(Boolean);

Say.id = (...parts)=>String.jet.camelCase(phraseIdParts(parts).join(" "));

export const _defaultLexicon = new Lexicon({
    locales:[en, cs],
    dateOptions:{ second:"hide" },
    translations:defaultTranslations
});

export const _localesAllowed = Object.freeze(_defaultLexicon.locales.map(locale=>locale.id));
export const _defaultSay = _defaultLexicon.select(_localesAllowed[0]);


const durationUnits = Object.freeze([
    "years",
    "months",
    "days",
    "hours",
    "minutes",
    "seconds"
]);

Say.prototype.unit = function(unitId, count, opt) {
    return this.num(Say.id("unit", unitId), count, opt);
}


Say.prototype.duration = function(ms, opt={}) {
    const { zeros=false, depth=0, includeSeconds=false, date="word", time="word", unitIdSuffix="" } = opt;
    const fragments = msExplode(ms); 
    const parts = [];
    let tooDeep = false;
    
    if (date === "word") {
        for (const unit of durationUnits) {
            if (unit === "hours" && time !== "word") { break; }
            if (unit === "seconds" && !includeSeconds) { break; }
            let count = fragments[unit];
            if (!count || count <= 0) {
                if (!zeros || !parts.length) { continue; }
                count = 0;
            }
            parts.push(this.unit(unit+unitIdSuffix, count, {}));
            if (depth>0 && parts.length >= depth) { tooDeep = true; break; }
        }
    }

    if (time === "digit" && !tooDeep) {
        const { hours, minutes, seconds } = fragments;
        let r = !parts.length ? "" : String(hours || 0);
        r += !r ? String(minutes || 0) : (":" + String(minutes || 0).padStart(2, "0"));
        if (includeSeconds) {
            r += !r ? String(seconds || 0) : (":" + String(seconds || 0).padStart(2, "0"));
        }
        parts.push(r);
    }

    return parts.join(" ");
}
