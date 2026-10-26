import React from "react";
import "./GraphLegend.scss";

import { getChartColor, toNumber } from "../graphTools";
import { GraphCounter, isGraphCounterValue } from "../GraphCounter/GraphCounter";


const getTotal = data=>data.reduce((all, item)=>all + Math.max(0, toNumber(item?.value)), 0);

const getPercent = (item, total)=>{
    const value = Math.max(0, toNumber(item?.value));
    return `(${(total ? value / total * 100 : 0).toFixed()}%)`;
};

export const GraphLegend = (props)=>{
    const {
        animateOnView=false,
        className,
        colors,
        data=[],
        direction="vertical",
        duration=1000,
        renderItem,
        showPercent=false
    } = props;
    const dir = direction === "horizontal" ? "horizontal" : "vertical";
    const total = getTotal(data);

    return (
        <span className={["GraphLegend", `-${dir}`, className].filter(Boolean).join(" ")}>
            {data.map((item, index)=>{
                const color = getChartColor(item, index, colors);
                const label = item?.label ?? item?.name ?? item?.id;
                const value = item?.valueLabel ?? item?.value;
                const percent = showPercent ? getPercent(item, total) : null;
                const content = renderItem?.(item, { color, index, label, percent, value }) ?? (
                    <>
                        <span className="GraphLegend-swatch"/>
                        <span className="GraphLegend-label">{label}</span>
                        {value === false ? null : (
                            <span className="GraphLegend-value">
                                {isGraphCounterValue(value) ? (
                                    <GraphCounter animateOnView={animateOnView} duration={duration} value={value}/>
                                ) : value}
                            </span>
                        )}
                        {percent ? (
                            <span className="GraphLegend-percent">
                                <GraphCounter animateOnView={animateOnView} duration={duration} value={percent}/>
                            </span>
                        ) : null}
                    </>
                );

                return (
                    <span
                        key={item?.id ?? item?.key ?? index}
                        className="GraphLegend-item"
                        style={{ "--GraphColor":color }}
                    >
                        {content}
                    </span>
                );
            })}
        </span>
    );
};
