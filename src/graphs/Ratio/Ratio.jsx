import React from 'react';
import "./Ratio.scss";

import { GraphCounter } from "../GraphCounter/GraphCounter";

export const Ratio = (props) => {
    const { animateOnView=false, transition=1000, suffix, total, unit, value } = props;
    const safeTotal = Number(total) || 0;
    const safeValue = Math.min(Number(value) || 0, safeTotal);
    const totalLabel = typeof unit === "function" ? unit(safeTotal) : safeTotal;

    return (
        <span className="Ratio">
            <span className="ratioValue">
                <GraphCounter animateOnView={animateOnView} duration={transition} value={safeValue}/>
            </span>
            {" "}
            <span className="ratioSlash">/</span>
            {" "}
            <span className="ratioTotal">
                {totalLabel}
            </span>
            {!unit && suffix ? <span className="ratioSuffix">{suffix}</span> : null}
        </span>
    );
};
