import React from "react";
import "./DataViewGrid.scss";
import { CSSTransition } from "react-transition-group";

import { getColumnCellValue } from "../dataViewTools";
import { getVirtualItemStyle, useDataViewVirtualItems } from "../dataViewVirtualTools";
import {
    getColumnControlLabel,
    getColumnSource,
    isEmptyRender,
    toClassName
} from "../dataViewViewTools";


const getCellValue = (cell, view)=>{
    return getColumnCellValue(
        getColumnSource(cell.column),
        cell.getValue(),
        cell.row.original,
        { ...cell.getContext(), view }
    );
};

export const DataViewGrid = (props)=>{
    const { emptyLabel, renderCard, rows=[], table, virtual, view } = props;
    const virtualItems = useDataViewVirtualItems({
        active:virtual?.active,
        count:rows.length,
        offset:virtual?.offset,
        transition:virtual?.transition
    });
    const renderDefaultContent = row=>{
        const fields = row.getVisibleCells().map(cell=>({
            cell,
            value:getCellValue(cell, view)
        })).filter(field=>!isEmptyRender(field.value));

        if (!fields.length) { return null; }

        return fields.map(({ cell, value })=>(
                <div key={cell.id} className="DataViewCard-field">
                    <span className="DataViewCard-label">{getColumnControlLabel(cell.column)}</span>
                    <div className="DataViewCard-value">
                        {value}
                    </div>
                </div>
        ));
    };
    const renderGridCard = (row, index)=>{
        const show = virtualItems.shouldRender(index);
        const visible = virtualItems.isVisible(index);
        const itemRef = virtualItems.bind(index);
        const content = show ? (renderCard ? renderCard(row, { cells:row.getVisibleCells(), table, view }) : renderDefaultContent(row)) : null;
        const cardStyle = getVirtualItemStyle(
            virtualItems.transition,
            !show ? { height:virtualItems.getSize(index) } : null
        );

        const card = (
            <article
                key={row.id}
                ref={itemRef.ref}
                aria-hidden={!show}
                className={toClassName(["DataViewCard", !show && "-placeholder"])}
                data-view-virtual={show ? "content" : "placeholder"}
                style={cardStyle}
            >
                {content}
            </article>
        );

        if (!virtualItems.transition) { return card; }

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
                {card}
            </CSSTransition>
        );
    };
    const cards = rows.map(renderGridCard);

    return (
        <div className="DataViewGrid">
            <div className="DataViewGrid-cards">
                {cards}
                {rows.length ? null : <div className="DataViewEmpty">{emptyLabel}</div>}
            </div>
        </div>
    );
};
