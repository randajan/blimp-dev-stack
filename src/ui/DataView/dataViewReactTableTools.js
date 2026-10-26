import { useMemo } from "react";
import {
    columnFilteringFeature,
    columnVisibilityFeature,
    createFilteredRowModel,
    createSortedRowModel,
    globalFilteringFeature,
    rowSortingFeature,
    tableFeatures,
    useTable
} from "@tanstack/react-table";

import {
    dataViewGlobalFilter,
    filtersToColumnFilters,
    toTableColumn
} from "./dataViewTools";


const dataViewTableFeatures = tableFeatures({
    columnFilteringFeature,
    columnVisibilityFeature,
    globalFilteringFeature,
    rowSortingFeature,
    filteredRowModel:createFilteredRowModel(),
    sortedRowModel:createSortedRowModel()
});

export const useDataViewReactTable = (props)=>{
    const {
        activeView,
        columns=[],
        filters={},
        globalFilter,
        rows=[],
        setGlobalFilter,
        setSorting,
        sorting=[]
    } = props;

    const tableColumns = useMemo(()=>columns.map(column=>toTableColumn(column, activeView)), [activeView, columns]);
    const columnFilters = useMemo(()=>filtersToColumnFilters(filters), [filters]);
    const table = useTable({
        features:dataViewTableFeatures,
        data:rows,
        columns:tableColumns,
        state:{ columnFilters, globalFilter, sorting },
        onGlobalFilterChange:setGlobalFilter,
        onSortingChange:setSorting,
        globalFilterFn:dataViewGlobalFilter
    });

    return {
        bodyRows:table.getRowModel().rows,
        table
    };
};
