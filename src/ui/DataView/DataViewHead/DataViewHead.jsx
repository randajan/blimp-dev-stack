import React from "react";
import "./DataViewHead.scss";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";

import { toClassName } from "../dataViewViewTools";
import { sayDataView } from "../dataViewSayTools";


const icons = {
    grid:GridViewOutlinedIcon,
    table:ViewListOutlinedIcon
};

export const DataViewHead = (props)=>{
    const {
        filterCount=0,
        forcedView,
        globalFilter,
        hasSettings,
        onSettings,
        say,
        searchPlaceholder,
        setGlobalFilter,
        setView,
        settingsActive,
        settingsLabel,
        view,
        views=[]
    } = props;
    const isForced = !!forcedView;
    const settingsTitle = filterCount ? `${settingsLabel} (${filterCount})` : settingsLabel;

    return (
        <header className="DataViewHead">
            <div className="DataViewHead-toolbar">
                <label className="DataViewSearch">
                    <SearchOutlinedIcon fontSize="small" />
                    <input
                        type="search"
                        value={globalFilter || ""}
                        placeholder={searchPlaceholder}
                        onChange={event=>setGlobalFilter(event.target.value)}
                    />
                </label>
                {views.length < 2 || isForced ? null : (
                    <div className="DataViewSwitch">
                        {views.map(name=>{
                            const Icon = icons[name];
                            const viewLabel = sayDataView(say, name === "grid" ? "GridViewLabel" : "TableViewLabel");

                            return (
                                <button
                                    key={name}
                                    type="button"
                                    aria-label={viewLabel}
                                    title={viewLabel}
                                    aria-pressed={view === name}
                                    className={toClassName([view === name && "-active"])}
                                    onClick={_=>setView(name)}
                                >
                                    {Icon ? <Icon fontSize="small" /> : name}
                                </button>
                            );
                        })}
                    </div>
                )}
                {!hasSettings ? null : (
                    <button
                        type="button"
                        aria-label={settingsTitle}
                        className={toClassName(["DataViewFilterTrigger", settingsActive && "-active"])}
                        title={settingsTitle}
                        onClick={onSettings}
                    >
                        <FilterAltOutlinedIcon fontSize="small" />
                        {!filterCount ? null : <span>{filterCount}</span>}
                    </button>
                )}
            </div>
        </header>
    );
};
