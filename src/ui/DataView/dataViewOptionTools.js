import {
    getColumnFilterValue,
    getColumnValue
} from "./dataViewColumnTools";
import { getColumnFilter } from "./dataViewFilterTools";
import {
    toDataViewKey,
    toDataViewText,
    toList
} from "./dataViewTextTools";

const toOption = option=>{
    const value = option?.value ?? option;
    const label = option?.label ?? toDataViewText(value);
    return { value:toDataViewKey(value), label };
};

export const getFilterOptions = (data=[], column)=>{
    const fromConfig = getColumnFilter(column)?.options;
    if (fromConfig) { return fromConfig.map(toOption); }

    const values = new Map();

    data.forEach((row, index)=>{
        const value = getColumnValue(column, row, index);
        const filterValue = getColumnFilterValue(column, value, row, { index });

        toList(filterValue).forEach(value=>{
            const key = toDataViewKey(value);
            if (key) { values.set(key, toDataViewText(value)); }
        });
    });

    return Array.from(values, ([value, label])=>({ value, label }));
};
