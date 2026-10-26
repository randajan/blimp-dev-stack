import React from "react";
import "./GraphCounter.scss";

import { TextCounter } from "../../ui/TextCounter/TextCounter";
import { toNumber, useGraphInView } from "../graphTools";


const numberPattern = /^([^-\d.,]*)(-?\d+(?:[.,]\d+)?)(.*)$/;

const parseValue = value=>{
    if (typeof value === "number") {
        return { number:value, prefix:"", suffix:"" };
    }

    const match = String(value ?? 0).trim().match(numberPattern);
    if (!match) { return { number:0, prefix:"", suffix:String(value ?? "") }; }

    return {
        number:toNumber(match[2].replace(",", ".")),
        prefix:match[1],
        suffix:match[3]
    };
};

export const isGraphCounterValue = value=>{
    return typeof value === "number" || numberPattern.test(String(value ?? "").trim());
};

export const GraphCounter = (props)=>{
    const { animateOnView=false, className, decimals=0, duration, prefix, suffix, transition=duration ?? 1000, value } = props;
    const graphView = useGraphInView(animateOnView);
    const parsed = parseValue(value);
    const digits = Math.max(0, toNumber(decimals));
    const number = Number(parsed.number.toFixed(digits));

    return (
        <span className={["GraphCounter", className].filter(Boolean).join(" ")} ref={graphView.ref}>
            {prefix ?? parsed.prefix}
            <TextCounter decimals={digits} transition={transition} value={graphView.isActive ? number : 0}/>
            {suffix ?? parsed.suffix}
        </span>
    );
};
