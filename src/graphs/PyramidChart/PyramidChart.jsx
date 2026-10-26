import React from "react";
import "./PyramidChart.scss";

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


const equilateralRatio = Math.sqrt(3) / 2;

const getTotal = (values, max)=>{
    const sum = values.reduce((all, value)=>all + value, 0);
    return Math.max(1, toNumber(max, sum || 1));
};

const getShape = (width, height)=>{
    const side = Math.min(width, height / equilateralRatio);
    const shapeHeight = side * equilateralRatio;

    return {
        height:shapeHeight,
        width:side,
        x:(width - side) / 2,
        y:height - shapeHeight
    };
};

const getPoint = (shape, y, side)=>{
    const half = shape.width / 2;
    const offset = half * (y / shape.height);
    return `${shape.x + half + side * offset},${shape.y + y}`;
};

const getSegmentPoints = (shape, from, to)=>{
    const y0 = shape.height * Math.sqrt(clamp(from));
    const y1 = shape.height * Math.sqrt(clamp(to));

    return [
        getPoint(shape, y0, -1),
        getPoint(shape, y0, 1),
        getPoint(shape, y1, 1),
        getPoint(shape, y1, -1)
    ].join(" ");
};

export const PyramidChart = (props)=>{
    const {
        animateOnView=false,
        className,
        colors,
        data=[],
        height,
        legend=false,
        legendDirection,
        legendPercent=true,
        legendPosition="right",
        max,
        style,
        trackColor,
        transition=1000,
        width=100,
        ...pass
    } = props;

    const viewWidth = Math.max(1, toNumber(width, 100));
    const viewHeight = Math.max(1, toNumber(height, viewWidth * equilateralRatio));
    const svgHeight = height ?? viewHeight;
    const shape = getShape(viewWidth, viewHeight);
    const values = data.map(item=>Math.max(0, toNumber(item?.value)));
    const graphView = useGraphInView(animateOnView);
    const animatedValues = useTweenNumbers(graphView.isActive ? values : values.map(_=>0), transition);
    const hasValue = animatedValues.some(Boolean);
    const total = getTotal(values, max);
    const renderLegendItem = typeof legend === "function" ? legend : null;
    const position = getLegendPosition(legendPosition);
    const direction = getLegendDirection(position, legendDirection);
    const rootClassName = getGraphClassName("PyramidChart", [className, legend && "-legend", legend && `-legend-${position}`]);
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
    const graphStyle = getGraphStyle(style, {
        "--GraphTrackColor":trackColor,
        "--GraphTransition":`${Math.max(0, toNumber(transition))}ms`
    });
    let used = 0;

    return (
        <span {...pass} className={rootClassName} ref={graphView.ref} style={graphStyle}>
            {["top", "left"].includes(position) ? legendElement : null}
            <svg className="PyramidChart-svg" height={svgHeight} viewBox={`0 0 ${viewWidth} ${viewHeight}`} width={width}>
                <polygon
                    className="PyramidChart-track"
                    points={`${shape.x + shape.width / 2},${shape.y} ${shape.x + shape.width},${shape.y + shape.height} ${shape.x},${shape.y + shape.height}`}
                />
                {!hasValue ? null : data.map((item, index)=>{
                    const value = Math.max(0, animatedValues[index] || 0);
                    const from = used / total;
                    const to = (used + value) / total;

                    used += value;

                    if (value <= 0) { return null; }

                    return (
                        <polygon
                            key={item?.id ?? item?.key ?? index}
                            className="PyramidChart-segment"
                            points={getSegmentPoints(shape, from, to)}
                            style={{ "--GraphColor":getChartColor(item, index, colors) }}
                        />
                    );
                })}
            </svg>
            {["bottom", "right"].includes(position) ? legendElement : null}
        </span>
    );
};
