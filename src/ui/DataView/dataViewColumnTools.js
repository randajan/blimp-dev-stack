import {
    emptyValues,
    formatCellValue,
    getColumnHeader,
    getColumnId,
    toDataViewKey,
    toDataViewText
} from "./dataViewTextTools";
import { filterByType, getColumnFilter } from "./dataViewFilterTools";

const callValueAs = (fn, value, row, ctx)=>{
    return fn ? fn(value, row, ctx) : value;
};

const getBaseValue = (column, row)=>{
    if (!column) { return undefined; }
    return row?.[column.id];
};

const getValueContext = (column, ctx={})=>{
    const id = getColumnId(column);
    return { column, id, ...ctx };
};

export const getColumnValue = (column, row, index)=>{
    return callValueAs(
        column?.accessAs,
        getBaseValue(column, row),
        row,
        getValueContext(column, { index })
    );
};

const getColumnValueAs = (column, name, value, row, ctx={})=>{
    return callValueAs(column?.[name], value, row, getValueContext(column, ctx));
};

const getSourceFromRow = (row, columnId)=>{
    const cell = row.getAllCells?.().find(cell=>cell.column.id === columnId);
    return cell?.column.columnDef.meta?.source;
};

const getColumnSortValue = (column, value, row, ctx)=>{
    return getColumnValueAs(column, "sortAs", value, row, ctx);
};

export const getColumnFilterValue = (column, value, row, ctx)=>{
    return getColumnValueAs(column, "filterAs", value, row, ctx);
};

const getColumnSearchValue = (column, value, row, ctx)=>{
    return getColumnValueAs(column, "searchAs", value, row, ctx);
};

const getColumnRenderValue = (column, value, row, ctx)=>{
    return callValueAs(column?.renderAs, value, row, ctx);
};

export const getColumnCellValue = (column, value, row, ctx)=>{
    const renderValue = getColumnRenderValue(column, value, row, ctx);
    return column?.renderAs ? renderValue : formatCellValue(renderValue);
};

export const dataViewGlobalFilter = (row, columnId, filterValue)=>{
    if (!filterValue) { return true; }
    const source = getSourceFromRow(row, columnId);
    const value = getColumnSearchValue(source, row.getValue(columnId), row.original, { row });
    return toDataViewKey(value).includes(toDataViewKey(filterValue));
};

const compareDataViewValues = (a, b)=>{
    const numA = Number(a);
    const numB = Number(b);

    if (emptyValues.includes(a) && emptyValues.includes(b)) { return 0; }
    if (emptyValues.includes(a)) { return -1; }
    if (emptyValues.includes(b)) { return 1; }
    if (Number.isFinite(numA) && Number.isFinite(numB)) { return numA - numB; }
    return toDataViewText(a).localeCompare(toDataViewText(b), undefined, { numeric:true, sensitivity:"base" });
};

export const toTableColumn = (column, view)=>{
    const id = getColumnId(column);
    const filter = getColumnFilter(column);
    const source = { ...column, id, filter };

    return {
        id,
        accessorFn:(row, index)=>getColumnValue(source, row, index),
        header:getColumnHeader(column, id),
        enableColumnFilter:!!filter,
        enableGlobalFilter:column.enableSearch !== false,
        enableSorting:column.enableSorting !== false,
        filterFn:(row, columnId, value)=>filterByType(
            getColumnFilterValue(source, row.getValue(columnId), row.original, { row }),
            value,
            filter?.type
        ),
        sortFn:column.sortFn || column.sortingFn || ((rowA, rowB, columnId)=>compareDataViewValues(
            getColumnSortValue(source, rowA.getValue(columnId), rowA.original, { row:rowA }),
            getColumnSortValue(source, rowB.getValue(columnId), rowB.original, { row:rowB })
        )),
        cell:ctx=>{
            return getColumnCellValue(source, ctx.getValue(), ctx.row.original, { ...ctx, view });
        },
        meta:{ source }
    };
};
