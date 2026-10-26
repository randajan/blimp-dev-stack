import { _localesAllowed } from "./consts.js";

export const readLocaleCandidate = raw=>{
    if (raw == null || raw === "") { return { value:"" }; }
    if (typeof raw !== "string" && typeof raw !== "number") {
        return { value:"", error:"invalid_type", details:{ expected:"string" } };
    }

    const [value] = String(raw).trim().toLowerCase().split(/[-_]/);
    if (!value) { return { value:"" }; }
    if (!_localesAllowed.includes(value)) {
        return { value, error:"unsupported", details:{ allowed:_localesAllowed } };
    }
    return { value };
};

export const normalizeLocale = raw=>{
    const { value, error } = readLocaleCandidate(raw);
    if (error) { return; }
    return value || undefined;
};


export const strictLocale = (locale)=>{
    if (!_localesAllowed.includes(locale)) { throw new Error("Invalid locale"); }
    return locale;
}