import React, { useEffect } from "react";
import "./DataView.scss";
import "./DataViewTransition.scss";
import { usePop } from "@randajan/jet-react/dom/modal";

import { DataViewGrid } from "./DataViewGrid/DataViewGrid";
import { DataViewHead } from "./DataViewHead/DataViewHead";
import { DataViewSettings } from "./DataViewSettings/DataViewSettings";
import { DataViewTable } from "./DataViewTable/DataViewTable";
import { useDataViewReactTable } from "./dataViewReactTableTools";
import { dataViewDefaultViews, useDataViewState } from "./dataViewStateTools";
import { getVirtualConfig } from "./dataViewVirtualTools";
import { hasColumnControl, toClassName } from "./dataViewViewTools";
import { sayDataView } from "./dataViewSayTools";


export const DataView = (props)=>{
    const {
        className,
        columns=[],
        data=[],
        defaultFilters,
        defaultSearch,
        defaultSorting,
        defaultView,
        emptyLabel,
        forceView,
        renderCard,
        renderRow,
        resetLabel,
        say,
        searchPlaceholder,
        transition=500,
        virtualAbove=-1,
        virtualOffset=.5,
        views=dataViewDefaultViews
    } = props;

    const state = useDataViewState({
        columns,
        data,
        defaultFilters,
        defaultSearch,
        defaultSorting,
        defaultView,
        forceView,
        views
    });
    const {
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
    } = state;
    const { bodyRows, table } = useDataViewReactTable({
        activeView,
        columns,
        filters,
        globalFilter,
        rows,
        setGlobalFilter,
        setSorting,
        sorting
    });
    const virtual = getVirtualConfig(bodyRows, virtualAbove, virtualOffset, transition);
    const settingsPop = usePop();
    const settingsLabel = sayDataView(say, "FilterLabel");
    const resolvedResetLabel = resetLabel ?? sayDataView(say, "ResetLabel");
    const filterCount = Object.keys(filters).length;
    const hasSettings = table.getAllLeafColumns().some(hasColumnControl);
    const settingsContent = (
        <DataViewSettings
            controlProps={controlProps}
            onReset={resetControls}
            resetLabel={resolvedResetLabel}
            say={say}
            table={table}
        />
    );

    useEffect(()=>{
        if (settingsPop.isUp()) { settingsPop.setState({ children:settingsContent }); }
    }, [settingsContent, settingsPop]);

    const openSettings = _=>settingsPop.up(settingsContent);

    return (
        <section className={toClassName(["DataView", `-${activeView}`, className])}>
            <DataViewHead
                filterCount={filterCount}
                forcedView={forcedView}
                globalFilter={globalFilter}
                hasSettings={hasSettings}
                onSettings={openSettings}
                say={say}
                searchPlaceholder={searchPlaceholder ?? sayDataView(say, "SearchPlaceholder")}
                setGlobalFilter={setGlobalFilter}
                setView={setView}
                settingsActive={!!(filterCount || sorting.length)}
                settingsLabel={settingsLabel}
                view={activeView}
                views={activeViews}
            />
            {activeView === "grid" ? (
                <DataViewGrid
                    emptyLabel={emptyLabel ?? sayDataView(say, "EmptyLabel")}
                    renderCard={renderCard}
                    rows={bodyRows}
                    table={table}
                    virtual={virtual}
                    view={activeView}
                />
            ) : (
                <DataViewTable
                    controlProps={controlProps}
                    emptyLabel={emptyLabel ?? sayDataView(say, "EmptyLabel")}
                    renderRow={renderRow}
                    rows={bodyRows}
                    say={say}
                    table={table}
                    virtual={virtual}
                    view={activeView}
                />
            )}
        </section>
    );
};
