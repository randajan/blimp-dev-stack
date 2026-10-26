import { useMemo } from "react";

import {
    getFilterOptions,
    isEmptyFilter,
    normalizeFilterValue
} from "../dataViewTools";
import {
    getColumnSortFirst,
    getColumnSortType,
    getNextSortDirection
} from "../dataViewSortTools";
import { getColumnControlLabel, getColumnSource } from "../dataViewViewTools";

export const getSortIcon = (sort, icons)=>sort === "desc" ? icons.desc : icons.asc;

export const useDataViewColumnControl = props=>{
    const {
        column, data=[], filters={}, inline=false, label,
        onFilterChange, onFilterClear, onSortChange
    } = props;
    const source = getColumnSource(column);
    const value = filters[column.id];
    const sort = column.getIsSorted();
    const canSort = column.getCanSort();
    const canFilter = !!source.filter;
    const filterType = source.filter?.type || "text";
    const options = useMemo(()=>canFilter ? getFilterOptions(data, { ...source, id:column.id }) : [], [canFilter, column.id, data, source]);
    const sortFirst = getColumnSortFirst(source, data);

    return {
        Icon:source.icon,
        activeFilter:!isEmptyFilter(value),
        canFilter,
        canSort,
        clearFilter:_=>onFilterClear(column.id),
        filterType,
        inline,
        options,
        cycleSort:_=>onSortChange(column.id, getNextSortDirection(sort, sortFirst)),
        setFilter:value=>onFilterChange(column.id, normalizeFilterValue(value, filterType)),
        setSort:dir=>onSortChange(column.id, sort === dir ? null : dir),
        sort,
        sortType:getColumnSortType(source, data),
        title:getColumnControlLabel(column, label),
        value
    };
};
