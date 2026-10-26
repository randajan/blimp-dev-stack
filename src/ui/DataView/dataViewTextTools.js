export const emptyValues = Object.freeze([undefined, null, ""]);

export const getColumnId = column=>{
    return column?.id || column?.key || column?.header;
};

export const getColumnHeader = (column, fallback)=>{
    return column?.header === undefined ? fallback : column.header;
};

export const toList = value=>{
    if (Array.isArray(value)) { return value; }
    if (emptyValues.includes(value)) { return []; }
    return [value];
};

export const toDataViewText = value=>{
    if (emptyValues.includes(value)) { return ""; }
    if (value instanceof Date) { return value.toISOString(); }
    if (Array.isArray(value)) { return value.map(toDataViewText).join(" "); }
    if (typeof value === "object") { return Object.values(value).map(toDataViewText).join(" "); }
    return `${value}`;
};

export const toDataViewKey = value=>{
    return toDataViewText(value).trim().toLowerCase();
};

export const formatCellValue = value=>{
    if (emptyValues.includes(value)) { return ""; }
    if (value instanceof Date) { return value.toLocaleString(); }
    if (typeof value === "object") { return toDataViewText(value); }
    return value;
};
