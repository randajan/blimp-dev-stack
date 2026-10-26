import React from "react";
import "./StatSurvival.scss";

import { Locale } from "../../../../locale/Locale.jsx";
import { PieChart } from "../../../../graphs/index.js";
import { Block } from "@randajan/jet-react/dom/block";
import { getStatField } from "../../../../game/showStats.js";


const stateColors = {
    survived:"var(--cGreen)",
    murdered:"var(--cRed)",
    banished:"var(--cBlue)"
};

const stateIds = ["survived", "murdered", "banished"];

export const StatSurvival = (props)=>{
    const { stats } = props;
    const say = Locale.use();
    const stateData = stateIds.map(id=>{
        const field = getStatField(id, stats, say);
        return { id, value:stats?.[id], color:stateColors[id], label:field?.label, valueLabel:field?.value };
    });

    return (
        <Block className="StatSurvival" caption={say("profileStatsSectionSurvival")}>
            <PieChart animateOnView className="survivalGraph" data={stateData} innerRadius={40} legend legendDirection="vertical" legendPosition="bottom" outerRadius={60} width={132} height={132}/>
        </Block>
    );
};
