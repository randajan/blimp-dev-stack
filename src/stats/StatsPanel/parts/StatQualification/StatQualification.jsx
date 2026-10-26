import React from "react";
import "./StatQualification.scss";

import { Locale } from "../../../../locale/Locale.jsx";
import { BarChart } from "../../../../graphs/index.js";
import { noobRoundsLimit } from "../../../../game/config.js";
import { getStatField } from "../../../../game/showStats.js";


export const StatQualification = (props)=>{
    const { stats } = props;
    const say = Locale.use();
    const qualify = getStatField("qualifyRate", stats, say);

    return (
        <div className="StatQualification">
            {qualify.raw < 1 && <BarChart
                animateOnView
                caption={qualify?.label}
                label={qualify?.value}
                max={noobRoundsLimit}
                ratio={{
                    value:stats?.rounds || 0,
                    total:noobRoundsLimit,
                    unit:count=>say.unit("gameRounds", count)
                }}
                value={stats?.rounds || 0}
                width="100%"
            />}
        </div>
    );
};
