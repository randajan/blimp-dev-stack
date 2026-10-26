import React from "react";
import "./Gauge.scss";
import { arc } from "d3-shape";

import {
    clamp,
    getGraphClassName,
    getGraphStyle,
    getRatio,
    toNumber,
    useGraphInView,
    useTweenNumber
} from "../graphTools";


const labelPattern = /^([^-\d.,]*)(-?\d+(?:[.,]\d+)?)(.*)$/;

const getAnimatedLabel = (label, rate, ratio)=>{
    if (label === false) { return false; }
    if (label == null) { return `${(rate * 100).toFixed()}%`; }

    const match = String(label).trim().match(labelPattern);
    if (!match) { return label; }

    const target = toNumber(match[2].replace(",", "."));
    const progress = ratio ? rate / ratio : 0;
    return `${match[1]}${(target * progress).toFixed()}${match[3]}`;
};

export const Gauge = (props)=>{
    const {
        animateOnView=false,
        className,
        centerX,
        centerY,
        color,
        endAngle=Math.PI / 2,
        height=64,
        innerRadius,
        label,
        max=1,
        min=0,
        outerRadius,
        startAngle=-Math.PI / 2,
        style,
        trackColor,
        transition=1000,
        value=0,
        width=112,
        ...pass
    } = props;

    const viewWidth = Math.max(1, toNumber(width, 112));
    const viewHeight = Math.max(1, toNumber(height, 64));
    const maxRadius = Math.min(viewWidth / 2, viewHeight * .75);
    const outer = outerRadius === undefined ? maxRadius : Math.max(0, toNumber(outerRadius));
    const inner = clamp(innerRadius ?? outer * .7, 0, outer);
    const x = toNumber(centerX, viewWidth / 2);
    const y = toNumber(centerY, viewHeight - Math.max(2, outer * .125));
    const start = toNumber(startAngle);
    const end = toNumber(endAngle, Math.PI * 2);
    const ratio = getRatio(value, min, max);
    const graphView = useGraphInView(animateOnView);
    const rate = useTweenNumber(graphView.isActive ? ratio : 0, transition);
    const makeArc = arc().innerRadius(inner).outerRadius(outer);
    const activeEnd = start + (end - start) * rate;
    const backgroundPath = makeArc({ startAngle:start, endAngle:end }) || "";
    const activePath = rate > 0 ? makeArc({ startAngle:start, endAngle:activeEnd }) || "" : "";
    const labelContent = getAnimatedLabel(label, rate, ratio);

    return (
        <svg
            {...pass}
            className={getGraphClassName("Gauge", className)}
            height={height}
            ref={graphView.ref}
            style={getGraphStyle(style, {
                "--GraphActiveColor":color,
                "--GraphTrackColor":trackColor,
                "--GraphTransition":`${Math.max(0, toNumber(transition))}ms`
            })}
            viewBox={`0 0 ${viewWidth} ${viewHeight}`}
            width={width}
        >
            <g transform={`translate(${x} ${y})`}>
                <path className="Gauge-track" d={backgroundPath}/>
                <path className="Gauge-value" d={activePath}/>
            </g>
            {labelContent === false ? null : (
                <text className="Gauge-label" dominantBaseline="middle" textAnchor="middle" x={x} y={viewHeight - outer * .35}>
                    {labelContent}
                </text>
            )}
        </svg>
    );
};
