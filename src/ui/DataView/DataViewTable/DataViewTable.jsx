import React from "react";
import "./DataViewTable.scss";
import { flexRender } from "@tanstack/react-table";
import { CSSTransition } from "react-transition-group";

import { DataViewColumnControl } from "../DataViewColumnControl/DataViewColumnControl";
import { getVirtualItemStyle, useDataViewVirtualItems } from "../dataViewVirtualTools";


export const DataViewTable = (props)=>{
    const { controlProps, emptyLabel, renderRow, rows=[], say, table, virtual, view } = props;
    const colSpan = table.getAllLeafColumns().length || 1;
    const virtualItems = useDataViewVirtualItems({
        active:virtual?.active,
        count:rows.length,
        offset:virtual?.offset,
        transition:virtual?.transition
    });
    const renderDefaultCells = row=>(
        row.getVisibleCells().map(cell=>(
            <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
        ))
    );
    const renderBodyCells = row=>{
        return renderRow ? renderRow(row, { cells:row.getVisibleCells(), table, view }) : renderDefaultCells(row);
    };
    const renderBodyRow = (row, index)=>{
        const show = virtualItems.shouldRender(index);
        const visible = virtualItems.isVisible(index);
        const itemRef = virtualItems.bind(index);

        const bodyRow = (
            <tr
                key={row.id}
                ref={itemRef.ref}
                aria-hidden={!show}
                data-view-virtual={show ? "content" : "placeholder"}
                style={getVirtualItemStyle(virtualItems.transition)}
            >
                {show ? renderBodyCells(row) : (
                    <td colSpan={colSpan} className="DataViewVirtualPlaceholder">
                        <div style={{ height:virtualItems.getSize(index) }} />
                    </td>
                )}
            </tr>
        );

        if (!virtualItems.transition) { return bodyRow; }

        return (
            <CSSTransition
                key={row.id}
                nodeRef={itemRef.nodeRef}
                in={visible}
                timeout={virtualItems.transition}
                classNames="DataViewVirtual"
                appear
                onExited={virtualItems.onExited(index)}
            >
                {bodyRow}
            </CSSTransition>
        );
    };

    return (
        <div className="DataViewTable">
            <table>
                <thead>
                    {table.getHeaderGroups().map(group=>(
                        <tr key={group.id}>
                            {group.headers.map(header=>(
                                <th
                                    key={header.id}
                                    aria-sort={{ asc:"ascending", desc:"descending" }[header.column.getIsSorted()] || "none"}
                                >
                                    {header.isPlaceholder ? null : (
                                        <DataViewColumnControl
                                            {...controlProps}
                                            column={header.column}
                                            label={flexRender(header.column.columnDef.header, header.getContext())}
                                            say={say}
                                        />
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {rows.map(renderBodyRow)}
                    {rows.length ? null : (
                        <tr className="empty">
                            <td colSpan={colSpan}>{emptyLabel}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
