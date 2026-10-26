import React from "react";
import "./BalanceChart.scss";

import {
    clamp,
    getGraphClassName,
    getGraphStyle,
    toNumber,
    useGraphInView,
    useTweenNumbers
} from "../graphTools";
import { GraphCounter } from "../GraphCounter/GraphCounter";
import { PyramidChart } from "../PyramidChart/PyramidChart";
import { StackedBarChart } from "../StackedBarChart/StackedBarChart";


const getSide = (side={}, fallbackColor)=>({
    color:side.color || fallbackColor,
    label:side.label || "",
    value:Math.max(0, toNumber(side.value))
});

export const BalanceChart = (props)=>{
    const {
        animateOnView=false,
        className,
        height,
        left,
        maxAngle=14,
        right,
        style,
        title,
        transition=1000,
        width,
        ...pass
    } = props;

    const viewWidth = Math.max(1, toNumber(width, 320));
    const leftSide = getSide(left, "var(--chartColor1, var(--cGama))");
    const rightSide = getSide(right, "var(--chartColor2, var(--cBeta))");
    const graphView = useGraphInView(animateOnView);
    const [leftValue, rightValue] = useTweenNumbers(graphView.isActive ? [leftSide.value, rightSide.value] : [0, 0], transition);
    const total = leftValue + rightValue;
    const balance = total ? clamp((rightValue - leftValue) / total, -1, 1) : 0;
    const angle = balance * Math.max(0, toNumber(maxAngle, 14));
    const pivotWidth = Math.min(30, viewWidth * .16);
    const beamData = [
        { id:"left", value:leftSide.value, color:leftSide.color },
        { id:"right", value:rightSide.value, color:rightSide.color }
    ];
    const pivotData = [
        { id:"right", value:rightSide.value, color:rightSide.color },
        { id:"left", value:leftSide.value, color:leftSide.color }
    ];
    const rootStyle = getGraphStyle(style, {
        "--BalanceAngle":`${angle}deg`,
        "--BalanceChartHeight":typeof height === "number" ? `${height}px` : height,
        "--BalanceChartWidth":typeof width === "number" ? `${width}px` : width,
        "--BalanceLeftColor":leftSide.color,
        "--BalanceRightColor":rightSide.color,
        "--GraphTransition":`${Math.max(0, toNumber(transition))}ms`
    });

    return (
        <span
            {...pass}
            className={getGraphClassName("BalanceChart", className)}
            ref={graphView.ref}
            style={rootStyle}
        >
            {title ? <span className="BalanceChart-title">{title}</span> : null}
            <span className="BalanceChart-stage">
                <span className="BalanceChart-beam">
                    <StackedBarChart
                        animateOnView={animateOnView}
                        className="BalanceChart-bar"
                        data={beamData}
                        height={6}
                        radius={3}
                        transition={transition}
                        width="100%"
                    />
                </span>
                <PyramidChart
                    animateOnView={animateOnView}
                    className="BalanceChart-pivot"
                    data={pivotData}
                    height={pivotWidth * Math.sqrt(3) / 2}
                    transition={transition}
                    width={pivotWidth}
                />
            </span>
            <span className="BalanceChart-sides">
                <span className="BalanceChart-side -left">
                    <span className="BalanceChart-value">
                        <GraphCounter duration={transition} value={graphView.isActive ? leftSide.value : 0}/>
                    </span>
                    <span className="BalanceChart-label">{leftSide.label}</span>
                </span>
                <span className="BalanceChart-side -right">
                    <span className="BalanceChart-value">
                        <GraphCounter duration={transition} value={graphView.isActive ? rightSide.value : 0}/>
                    </span>
                    <span className="BalanceChart-label">{rightSide.label}</span>
                </span>
            </span>
        </span>
    );
};
