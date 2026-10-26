import React from "react";
import "./DataViewColumnControl.scss";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

import { DataViewFilterInput } from "../DataViewFilterInput/DataViewFilterInput";
import { toClassName } from "../dataViewViewTools";
import { sayDataView } from "../dataViewSayTools";
import { getSortIcon, useDataViewColumnControl } from "./dataViewColumnControlTools";


const sortIcons = { asc:ArrowUpwardOutlinedIcon, desc:ArrowDownwardOutlinedIcon };

const ColumnTrigger = ({ Icon, activeFilter, onClick, sort, title })=>{
    const SortIcon = sort ? getSortIcon(sort, sortIcons) : null;

    return (
        <button
            type="button"
            className="DataViewColumnTrigger"
            aria-pressed={!!sort}
            title={title}
            onClick={onClick}
        >
            {Icon ? <Icon fontSize="small" /> : null}
            <span>{title}</span>
            {!activeFilter ? null : <FilterAltOutlinedIcon className="stateMark" fontSize="small" />}
            {!SortIcon ? null : <SortIcon className="stateMark" fontSize="small" />}
        </button>
    );
};

const SortSection = ({ say, setSort, sort, sortType })=>{
    const labelType = { date:"Date", number:"Number", text:"Text" }[sortType];

    return (
        <section>
            <span>{sayDataView(say, "SortLabel")}</span>
            <div className="sortActions">
                <button type="button" className={sort === "asc" ? "-active" : ""} onClick={_=>setSort("asc")}>
                    {sayDataView(say, `Sort${labelType}AscLabel`)}
                </button>
                <button type="button" className={sort === "desc" ? "-active" : ""} onClick={_=>setSort("desc")}>
                    {sayDataView(say, `Sort${labelType}DescLabel`)}
                </button>
            </div>
        </section>
    );
};

const FilterSection = (props)=>(
    <section>
        <span>{sayDataView(props.say, "FilterLabel")}</span>
        <DataViewFilterInput
            say={props.say}
            type={props.filterType}
            value={props.value}
            options={props.options}
            onChange={props.setFilter}
        />
        {!props.activeFilter ? null : (
            <button type="button" className="clearFilter" onClick={props.clearFilter}>
                {sayDataView(props.say, "ClearFilterLabel")}
            </button>
        )}
    </section>
);

const ColumnTitle = ({ Icon, activeFilter, sort, title })=>{
    const SortIcon = sort ? getSortIcon(sort, sortIcons) : null;

    return (
        <div className="DataViewColumnTitle">
            {Icon ? <Icon fontSize="small" /> : null}
            <strong>{title}</strong>
            {!activeFilter ? null : <FilterAltOutlinedIcon className="stateMark" fontSize="small" />}
            {!SortIcon ? null : <SortIcon className="stateMark" fontSize="small" />}
        </div>
    );
};

const ColumnMenu = props=>(
    <div className="DataViewColumnMenu">
        {!props.canSort ? null : <SortSection {...props} />}
        {!props.canFilter ? null : <FilterSection {...props} />}
    </div>
);

export const DataViewColumnControl = (props)=>{
    const { say } = props;
    const control = useDataViewColumnControl(props);
    const {
        Icon, activeFilter, canFilter, canSort, clearFilter, filterType,
        cycleSort, inline, options, setFilter, setSort,
        sort, sortType, title, value
    } = control;

    if (!inline && !canSort) {
        return <div className="DataViewColumnControl -plain"><span>{title}</span></div>;
    }

    const menuProps = {
        activeFilter,
        canFilter,
        canSort,
        clearFilter,
        filterType,
        options,
        say,
        setFilter,
        setSort,
        sort,
        sortType,
        value
    };

    if (inline) {
        return (
            <section className={toClassName(["DataViewColumnControl", "-inline", (sort || activeFilter) && "-active"])}>
                <ColumnTitle Icon={Icon} activeFilter={activeFilter} sort={sort} title={title} />
                <ColumnMenu {...menuProps} />
            </section>
        );
    }

    return (
        <div className={toClassName(["DataViewColumnControl", "-sortable", (sort || activeFilter) && "-active"])}>
            <ColumnTrigger Icon={Icon} activeFilter={activeFilter} onClick={cycleSort} sort={sort} title={title} />
        </div>
    );
};
