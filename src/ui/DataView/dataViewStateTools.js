import { useCallback, useMemo, useState } from "react";

import { cleanFilters } from "./dataViewFilterTools";
import { getColumnsDefaultSorting } from "./dataViewSortTools";
import { getColumnId } from "./dataViewTextTools";

export const dataViewDefaultViews = Object.freeze(["table", "grid"]);

const emptyFilters = Object.freeze({});
const emptySorting = Object.freeze([]);
const hasOwn = (value, key)=>Object.prototype.hasOwnProperty.call(value, key);

const getColumnsDefaultFilters = columns=>columns.reduce((filters, column)=>{
    if (column.filter && hasOwn(column, "defaultFilter")) {
        filters[getColumnId(column)] = column.defaultFilter;
    }
    return filters;
}, {});

const toViews = views=>{
    const values = Array.isArray(views) ? views : dataViewDefaultViews;
    const next = values.filter(view=>dataViewDefaultViews.includes(view));
    return next.length ? next : dataViewDefaultViews;
};

const toView = (view, views)=>{
    return views.includes(view) ? view : views[0];
};

const toForcedView = (view, views)=>{
    return views.includes(view) ? view : null;
};

export const useDataViewState = (props)=>{
    const {
        columns=[],
        data=[],
        defaultFilters,
        defaultSearch="",
        defaultSorting,
        defaultView="table",
        forceView,
        views=dataViewDefaultViews
    } = props;

    const rows = data || [];
    const activeViews = useMemo(()=>toViews(views), [views]);
    const firstView = useMemo(()=>toView(defaultView, activeViews), [activeViews, defaultView]);
    const initialFilters = useMemo(()=>defaultFilters ?? getColumnsDefaultFilters(columns), [columns, defaultFilters]);
    const initialSorting = useMemo(()=>defaultSorting ?? getColumnsDefaultSorting(columns), [columns, defaultSorting]);
    const [globalFilter, setGlobalFilter] = useState(defaultSearch);
    const [sorting, setSorting] = useState(initialSorting || emptySorting);
    const [filters, setFilters] = useState(()=>cleanFilters(initialFilters || emptyFilters, columns));
    const [view, setView] = useState(firstView);
    const forcedView = useMemo(()=>toForcedView(forceView, activeViews), [activeViews, forceView]);
    const activeView = forcedView || toView(view, activeViews);

    const onFilterChange = useCallback((id, value)=>{
        setFilters(prev=>cleanFilters({ ...prev, [id]:value }, columns));
    }, [columns]);

    const onFilterClear = useCallback(id=>{
        setFilters(prev=>{
            const next = { ...prev };
            delete next[id];
            return next;
        });
    }, []);

    const onSortChange = useCallback((id, dir)=>{
        setSorting(dir ? [{ id, desc:dir === "desc" }] : []);
    }, []);

    const resetControls = useCallback(_=>{
        setSorting(initialSorting || emptySorting);
        setFilters(cleanFilters(initialFilters || emptyFilters, columns));
    }, [columns, initialFilters, initialSorting]);

    const controlProps = useMemo(()=>({
        data:rows,
        filters,
        onFilterChange,
        onFilterClear,
        onSortChange
    }), [filters, onFilterChange, onFilterClear, onSortChange, rows]);

    return {
        activeView,
        activeViews,
        controlProps,
        filters,
        forcedView,
        globalFilter,
        resetControls,
        rows,
        setGlobalFilter,
        setSorting,
        setView,
        sorting
    };
};
