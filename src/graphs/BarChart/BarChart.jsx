import React from "react";
import "./BarChart.scss";
import { Block } from "@randajan/jet-react/dom/block";
import { Caption } from "@randajan/jet-react/dom/caption";

import {
    getGraphClassName,
    getGraphStyle,
    getRatio,
    toNumber,
    useGraphInView,
    useTweenNumber
} from "../graphTools";
import { Ratio } from "../Ratio/Ratio";
import { GraphCounter, isGraphCounterValue } from "../GraphCounter/GraphCounter";


export const BarChart = (props)=>{
    const {
        animateOnView=false,
        caption,
        className,
        color,
        height=8,
        label,
        max=1,
        min=0,
        radius="2px",
        ratio,
        style,
        trackColor,
        transition=1000,
        value=0,
        width=100,
        ...pass
    } = props;

    const valueRatio = getRatio(value, min, max);
    const graphView = useGraphInView(animateOnView);
    const activeWidth = `${useTweenNumber(graphView.isActive ? valueRatio : 0, transition) * 100}%`;
    const graphStyle = getGraphStyle(style, {
        "--GraphActiveColor":color,
        "--GraphRadius":typeof radius === "number" ? `${radius}px` : radius,
        "--GraphTrackColor":trackColor,
        "--GraphTransition":`${Math.max(0, toNumber(transition))}ms`
    });
    const labelContent = label ?? `${(valueRatio * 100).toFixed()}%`;
    const showLabel = label !== false;
    const showFoot = ratio || showLabel;
    const labelElement = isGraphCounterValue(labelContent) ? (
        <GraphCounter animateOnView={animateOnView} duration={transition} value={labelContent}/>
    ) : labelContent;
    const renderSvg = svgProps=>(
        <svg
            height={height}
            ref={graphView.ref}
            width={width}
            {...svgProps}
        >
            <rect className="BarChart-track" height="100%" rx="var(--GraphRadius)" ry="var(--GraphRadius)" width="100%" x="0" y="0"/>
            <rect className="BarChart-value" height="100%" rx="var(--GraphRadius)" ry="var(--GraphRadius)" width={activeWidth} x="0" y="0"/>
        </svg>
    );

    if (!caption && !label && !ratio) {
        return renderSvg({
            ...pass,
            className:getGraphClassName("BarChart", className),
            style:graphStyle
        });
    }

    return (
        <Block
            {...pass}
            className={getGraphClassName("BarChart", [className, "-layout"])}
            style={graphStyle}
        >
            <div className="BarChart-head">
                {caption ? <Caption>{caption}</Caption> : null}
            </div>
            {renderSvg({ className:"BarChart-svg" })}
            {showFoot ? <div className="BarChart-foot">
                {ratio ? <Ratio animateOnView={animateOnView} transition={transition} {...ratio}/> : null}
                {showLabel ? <span className="BarChart-label">{labelElement}</span> : null}
            </div> : null}
        </Block>
    );
};
