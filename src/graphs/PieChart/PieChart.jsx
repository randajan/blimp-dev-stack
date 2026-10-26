import React from "react";
import "./PieChart.scss";
import { arc, pie } from "d3-shape";

import {
    clamp,
    getChartColor,
    getGraphClassName,
    getGraphStyle,
    getLegendDirection,
    getLegendPosition,
    toNumber,
    useGraphInView,
    useTweenNumber,
    useTweenNumbers
} from "../graphTools";
import { GraphLegend } from "../GraphLegend/GraphLegend";


export const PieChart = (props)=>{
    const {
        animateOnView=false,
        className,
        colors,
        data=[],
        height=100,
        innerRadius=0,
        legend=false,
        legendDirection,
        legendPercent=true,
        legendPosition="right",
        outerRadius,
        padAngle=0,
        style,
        transition=1000,
        width=100,
        ...pass
    } = props;

    const viewWidth = Math.max(1, toNumber(width, 100));
    const viewHeight = Math.max(1, toNumber(height, 100));
    const maxRadius = Math.min(viewWidth, viewHeight) / 2;
    const outer = clamp(outerRadius ?? maxRadius, 0, maxRadius);
    const inner = clamp(innerRadius, 0, outer);
    const values = data.map(item=>Math.max(0, toNumber(item?.value)));
    const graphView = useGraphInView(animateOnView);
    const animatedValues = useTweenNumbers(values, transition);
    const progress = useTweenNumber(graphView.isActive ? 1 : 0, transition);
    const hasValue = values.some(Boolean);
    const chartData = data.map((item, index)=>({ ...item, value:animatedValues[index] || 0 }));
    const makePie = pie().sort(null).value(item=>item.value).padAngle(toNumber(padAngle)).endAngle(Math.PI * 2 * progress);
    const makeArc = arc().innerRadius(inner).outerRadius(outer);
    const arcs = makePie(chartData);
    const renderLegendItem = typeof legend === "function" ? legend : null;
    const position = getLegendPosition(legendPosition);
    const direction = getLegendDirection(position, legendDirection);
    const rootClassName = getGraphClassName("PieChart", [className, legend && "-legend", legend && `-legend-${position}`]);
    const graphStyle = getGraphStyle(style, { "--GraphTransition":`${Math.max(0, toNumber(transition))}ms` });
    const legendElement = legend ? (
        <GraphLegend
            animateOnView={animateOnView}
            colors={colors}
            data={data}
            direction={direction}
            duration={transition}
            renderItem={renderLegendItem}
            showPercent={legendPercent}
        />
    ) : null;
    const svg = (
        <svg
            className="PieChart-svg"
            height={height}
            viewBox={`0 0 ${viewWidth} ${viewHeight}`}
            width={width}
        >
            <g transform={`translate(${viewWidth / 2} ${viewHeight / 2})`}>
                {!hasValue ? (
                    <path
                        className="PieChart-track"
                        d={makeArc({ startAngle:0, endAngle:Math.PI * 2 }) || ""}
                    />
                ) : arcs.map((part, index)=>{
                    const item = data[index];

                    return (
                        <path
                            key={item?.id ?? item?.key ?? index}
                            className="PieChart-segment"
                            d={part.data.value > 0 ? makeArc(part) || "" : ""}
                            style={{ "--GraphColor":getChartColor(item, index, colors) }}
                        />
                    );
                })}
            </g>
        </svg>
    );

    return (
        <span {...pass} className={rootClassName} ref={graphView.ref} style={graphStyle}>
            {["top", "left"].includes(position) ? legendElement : null}
            {svg}
            {["bottom", "right"].includes(position) ? legendElement : null}
        </span>
    );
};
