import { getColumnValue } from "./dataViewColumnTools";
import { emptyValues, getColumnId } from "./dataViewTextTools";

const sortDirections = Object.freeze({ asc:"asc", desc:"desc", dsc:"desc" });
const datePattern = /^\d{4}-\d{2}-\d{2}(?:[T\s]|$)/;

export const toSortDirection = value=>sortDirections[`${value}`.toLowerCase()] || null;

const isDateValue = value=>{
    if (value instanceof Date) { return !Number.isNaN(value.getTime()); }
    return typeof value === "string" && datePattern.test(value) && !Number.isNaN(Date.parse(value));
};

export const getColumnSortType = (source, data=[])=>{
    if (["date", "number", "text"].includes(source.sortType)) { return source.sortType; }

    for (let index=0; index<data.length; index++) {
        const value = getColumnValue(source, data[index], index);
        if (emptyValues.includes(value)) { continue; }
        if (isDateValue(value)) { return "date"; }
        return typeof value === "number" && Number.isFinite(value) ? "number" : "text";
    }

    return "text";
};

export const getColumnSortFirst = (source, data)=>{
    return toSortDirection(source.sortFirst) || (getColumnSortType(source, data) === "date" ? "desc" : "asc");
};

export const getNextSortDirection = (current, first)=>{
    if (!current) { return first; }
    if (current === first) { return first === "asc" ? "desc" : "asc"; }
    return null;
};

export const getColumnsDefaultSorting = (columns=[])=>{
    const column = columns.find(item=>item.enableSorting !== false && toSortDirection(item.defaultSort));
    const direction = toSortDirection(column?.defaultSort);
    return direction ? [{ id:getColumnId(column), desc:direction === "desc" }] : [];
};
