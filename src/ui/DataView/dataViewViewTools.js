import React from "react";

import { getColumnHeader } from "./dataViewTextTools";

export const toClassName = values=>{
    return values.filter(Boolean).join(" ");
};

export const getColumnSource = column=>{
    return column?.columnDef?.meta?.source || column || {};
};

export const getColumnControlLabel = (column, label)=>{
    const source = getColumnSource(column);
    if (label !== undefined) { return label; }
    if (source.filter?.label !== undefined) { return source.filter.label; }
    return getColumnHeader(source, column?.id);
};

export const hasColumnControl = column=>{
    return !!(column?.getCanSort?.() || getColumnSource(column).filter);
};

export const isEmptyRender = value=>{
    if (value === false || value === null || value === undefined) { return true; }
    if (value === "") { return true; }
    if (React.isValidElement(value) && value.type === React.Fragment) {
        return isEmptyRender(value.props.children);
    }
    return Array.isArray(value) && !value.length;
};
