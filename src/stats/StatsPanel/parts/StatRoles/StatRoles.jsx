import React from "react";
import "./StatRoles.scss";

import { Locale } from "../../../../locale/Locale.jsx";
import { PyramidChart } from "../../../../graphs/index.js";
import { Block } from "@randajan/jet-react/dom/block";
import { getStatField } from "../../../../game/showStats.js";


const roleColors = {
    beta: "var(--cBeta)",
    gama: "var(--cGama)",
    alpha: "var(--cAlpha)"
};

const roleIds = ["alpha", "beta", "gama"];

export const StatRoles = (props) => {
    const { stats } = props;
    const say = Locale.use();
    const roleData = roleIds.map(id => {
        const field = getStatField(id, stats, say);
        const value = Number(stats?.[id]) || 0;
        return { id, value, color: roleColors[id], label:field?.label, valueLabel:field?.value };
    }).filter(item=>item.id !== "alpha" || item.value > 0);

    return (
        <Block className="StatRoles" caption={say("profileStatsSectionRoles")}>
            <PyramidChart animateOnView className="rolesGraph" data={roleData} height={112} legend width={130} />
        </Block>
    );
};
