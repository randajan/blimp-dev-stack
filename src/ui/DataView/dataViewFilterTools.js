import {
    emptyValues,
    getColumnId,
    toDataViewKey,
    toDataViewText,
    toList
} from "./dataViewTextTools";

export const getColumnFilter = column=>{
    const raw = column?.filter;
    if (!raw) { return null; }
    const filter = typeof raw === "string" ? { type:raw } : raw;
    return { ...filter, options:filter.options ?? column.options };
};

const toBoolean = value=>{
    if (value === true || value === "true" || value === "1") { return true; }
    if (value === false || value === "false" || value === "0") { return false; }
    return "";
};

const normalizeNumberFilter = value=>{
    if (!value || typeof value !== "object") { return { min:value ?? "", max:value ?? "" }; }
    return { min:value.min ?? "", max:value.max ?? "" };
};

const normalizeFilterMap = {
    boolean:toBoolean,
    multiSelect:value=>toList(value).map(toDataViewKey).filter(Boolean),
    number:normalizeNumberFilter,
    select:toDataViewKey,
    text:toDataViewText
};

export const normalizeFilterValue = (value, type="text")=>{
    const normalize = normalizeFilterMap[type] || normalizeFilterMap.text;
    return normalize(value);
};

export const isEmptyFilter = value=>{
    if (Array.isArray(value)) { return !value.length; }
    if (!value || typeof value !== "object") { return emptyValues.includes(value); }
    return emptyValues.includes(value.min) && emptyValues.includes(value.max);
};

export const cleanFilters = (filters={}, columns=[])=>{
    const cols = new Map(columns.map(column=>[getColumnId(column), column]));

    return Object.entries(filters).reduce((out, [id, value])=>{
        const type = getColumnFilter(cols.get(id))?.type || "text";
        const nextValue = normalizeFilterValue(value, type);
        if (!isEmptyFilter(nextValue)) { out[id] = nextValue; }
        return out;
    }, {});
};

export const filtersToColumnFilters = filters=>{
    return Object.entries(filters).map(([id, value])=>({ id, value }));
};

const matchText = (value, filterValue)=>{
    return toDataViewKey(value).includes(toDataViewKey(filterValue));
};

const matchBoolean = (value, filterValue)=>{
    const expected = toBoolean(filterValue);
    if (expected === "") { return true; }
    return toBoolean(value) === expected;
};

const matchNumber = (value, filterValue={})=>{
    const num = Number(value);
    const min = Number(filterValue.min);
    const max = Number(filterValue.max);

    if (!Number.isFinite(num)) { return false; }
    if (filterValue.min !== "" && Number.isFinite(min) && num < min) { return false; }
    if (filterValue.max !== "" && Number.isFinite(max) && num > max) { return false; }
    return true;
};

const matchMultiSelect = (value, filterValue=[])=>{
    return toList(value).some(item=>filterValue.includes(toDataViewKey(item)));
};

const filterMap = {
    boolean:matchBoolean,
    multiSelect:matchMultiSelect,
    number:matchNumber,
    select:(value, filterValue)=>toDataViewKey(value) === filterValue,
    text:matchText
};

export const filterByType = (value, filterValue, type="text")=>{
    if (isEmptyFilter(filterValue)) { return true; }
    const filter = filterMap[type] || filterMap.text;
    return filter(value, filterValue);
};
