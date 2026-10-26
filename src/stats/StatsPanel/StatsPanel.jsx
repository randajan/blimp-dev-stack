import React from "react";
import "./StatsPanel.scss";
import { Block } from "@randajan/jet-react/dom/block";

import { Locale } from "../../locale/Locale.jsx";
import { StatActivity } from "./parts/StatActivity/StatActivity";
import { StatPresence } from "./parts/StatPresence/StatPresence";
import { StatPerformance } from "./parts/StatPerformance/StatPerformance";
import { StatQualification } from "./parts/StatQualification/StatQualification";
import { StatRating } from "./parts/StatRating/StatRating";
import { StatRoles } from "./parts/StatRoles/StatRoles";
import { StatSurvival } from "./parts/StatSurvival/StatSurvival";
import { StatRankDetail } from "./parts/StatRankDetail/StatRankDetail";
import { StatAlphaChoice } from "./parts/StatAlphaChoice/StatAlphaChoice";


export const StatsPanel = (props) => {
    const { profile } = props;
    const say = Locale.use();
    const { stats } = (profile || {});

    if (!stats?.rounds) { return null; }

    return (
        <Block className="StatsPanel wall -dark -border -column -gaps" caption={say("profileStatsCaption")}>
                {
                    !(stats?.qualifyRate === 1) && <div className="statsRow grid1Col">
                        <StatQualification stats={stats} />
                    </div>
                }
                <div className="statsRow grid3Cols">
                    <StatRating stats={stats} />
                    <StatRankDetail stats={stats} />
                    <StatPerformance stats={stats} />
                    <StatSurvival stats={stats} />
                </div>
                <div className="statsRow grid2Cols">
                    <StatRoles stats={stats} />
                    <StatAlphaChoice stats={stats} />
                    <StatActivity stats={stats} />
                    <StatPresence stats={stats} />
                </div>
        </Block>
    );
};
