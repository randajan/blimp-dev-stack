import React from "react";
import "./StatPerformance.scss";

import { maxPointsPerRound } from "../../../../game/config.js";
import { Locale } from "../../../../locale/Locale.jsx";
import { Gauge, Ratio } from "../../../../graphs/index.js";
import { Block } from "@randajan/jet-react/dom/block";
import { getStatField } from "../../../../game/showStats.js";


export const StatPerformance = (props) => {
    const { stats } = props;
    const say = Locale.use();
    const { points=0, rounds=0, wins=0 } = (stats || {});
    const maxPoints = maxPointsPerRound * rounds;
    const winsRate = rounds ? wins / rounds : 0;
    const winsField = getStatField("wins", stats, say);
    const pointsField = getStatField("points", stats, say);
    const successField = getStatField("successRate", stats, say);

    return (
        <div className="StatPerformance">
            <Block className="performanceGauge" caption={winsField?.label}>
                <Gauge label={`${(winsRate * 100).toFixed()}%`} value={wins} max={rounds} animateOnView/>
                <Ratio animateOnView value={wins} total={rounds}/>
            </Block>
            <Block className="performanceGauge" caption={pointsField?.label}>
                <Gauge label={successField?.value} value={points} max={maxPoints || 1} animateOnView/>
                <Ratio animateOnView value={points} total={maxPoints || 1}/>
            </Block>
        </div>
    );
};
