import React from "react";
import "./StatAlphaChoice.scss";

import { Locale } from "../../../../locale/Locale.jsx";
import { BalanceChart } from "../../../../graphs/index.js";
import { Block } from "@randajan/jet-react/dom/block";
import { getStatField } from "../../../../game/showStats.js";

export const StatAlphaChoice = (props) => {
    const { stats } = props;
    const say = Locale.use();

    const alphaGama = getStatField("alphaGama", stats, say);
    const alphaBeta = getStatField("alphaBeta", stats, say);

    return (
        <Block className="StatAlphaChoice" caption={say("profileStatsSectionAlphaChoice")}>
            <BalanceChart
                animateOnView
                className="rolesDecision"
                left={{ label:`${alphaGama.label}`, value:alphaGama.raw, color:"var(--cGama)" }}
                right={{ label:`${alphaBeta.label}`, value:alphaBeta.raw, color:"var(--cBeta)" }}
                width="100%"
            />
        </Block>
    );
};
