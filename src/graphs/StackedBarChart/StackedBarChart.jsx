import React, { useId } from "react";
import "./StackedBarChart.scss";

import {
    clamp,
    getChartColor,
    getGraphClassName,
    getGraphStyle,
    getLegendDirection,
    getLegendPosition,
    toNumber,
    useGraphInView,
    useTweenNumbers
} from "../graphTools";
import { GraphLegend } from "../GraphLegend/GraphLegend";


const getTotal = (values, max)=>{
    const sum = values.reduce((all, value)=>all + value, 0);
    return Math.max(1, toNumber(max, sum || 1));
};

export const StackedBarChart = (props)=>{
    const {
        animateOnView=false,
        className,
        colors,
        data=[],
        height=8,
        legend=false,
        legendDirection,
        legendPosition="bottom",
        max,
        radius,
        style,
        trackColor,
        transition=1000,
        width=100,
        ...pass
    } = props;

    const viewWidth = Math.max(1, toNumber(width, 100));
    const viewHeight = Math.max(1, toNumber(height, 8));
    const round = clamp(radius ?? viewHeight / 2, 0, viewHeight / 2);
    const clipId = `StackedBarChartClip-${useId().replace(/:/g, "")}`;
    const values = data.map(item=>Math.max(0, toNumber(item?.value)));
    const graphView = useGraphInView(animateOnView);
    const animatedValues = useTweenNumbers(graphView.isActive ? values : values.map(_=>0), transition);
    const total = getTotal(values, max);
    const graphStyle = getGraphStyle(style, {
        "--GraphTrackColor":trackColor,
        "--GraphTransition":`${Math.max(0, toNumber(transition))}ms`
    });
    const position = getLegendPosition(legendPosition, "bottom");
    const direction = getLegendDirection(position, legendDirection);
    const rootClassName = getGraphClassName("StackedBarChart", [className, legend && "-legend", legend && `-legend-${position}`]);
    const renderLegendItem = typeof legend === "function" ? legend : null;
    const legendElement = legend ? (
        <GraphLegend animateOnView={animateOnView} colors={colors} data={data} direction={direction} duration={transition} renderItem={renderLegendItem}/>
    ) : null;
    let used = 0;

    return (
        <span {...pass} className={rootClassName} ref={graphView.ref} style={graphStyle}>
            {["top", "left"].includes(position) ? legendElement : null}
            <svg
                className="StackedBarChart-svg"
                height={height}
                preserveAspectRatio="none"
                viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                width={width}
            >
                <defs>
                    <clipPath id={clipId}>
                        <rect height={viewHeight} rx={round} width={viewWidth} x="0" y="0"/>
                    </clipPath>
                </defs>
                <rect className="StackedBarChart-track" height={viewHeight} rx={round} width={viewWidth} x="0" y="0"/>
                <g clipPath={`url(#${clipId})`}>
                    {data.map((item, index)=>{
                        const start = clamp(used / total);
                        const value = Math.max(0, animatedValues[index] || 0);
                        const end = clamp((used + value) / total);
                        const segment = {
                            width:(end - start) * viewWidth,
                            x:start * viewWidth
                        };

                        used += value;

                        if (segment.width <= 0) { return null; }

                        return (
                            <rect
                                key={item?.id ?? item?.key ?? index}
                                className="StackedBarChart-segment"
                                height={viewHeight}
                                style={{ "--GraphColor":getChartColor(item, index, colors) }}
                                width={segment.width}
                                x={segment.x}
                                y="0"
                            />
                        );
                    })}
                </g>
            </svg>
            {["bottom", "right"].includes(position) ? legendElement : null}
        </span>
    );
};
