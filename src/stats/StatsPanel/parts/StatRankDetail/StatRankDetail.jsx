import React from 'react';
import "./StatRankDetail.scss";

import { Locale } from '../../../../locale/Locale.jsx';
import { Say } from "../../../../locale/consts.js";
import { GraphCounter } from '../../../../graphs/index.js';
import { ImgStore } from '../../../../ui/ImgStore/ImgStore.jsx';
import { Block } from '@randajan/jet-react/dom/block';
import { getStatField } from '../../../../game/showStats.js';


export const StatRankDetail = (props) => {
    const { stats } = props;
    const say = Locale.use();
    const rank = getStatField("rank", stats, say);
    const rankGrade = getStatField("rankGrade", stats, say);
    const rankTotal = (Number(stats?.rank) || 0) + (Number(stats?.rankAbove) || 0);
    const rankTotalLabel = say("profileStatsRankTotalOf").replace("$", rankTotal);
    const gradeId = stats?.grade ?? 0;
    const gradeIcon = `userGrade${gradeId}.svg`;
    const grade = say(Say.id("profile", `grade${stats?.grade ?? 0}`));

    return (
        <Block className="StatRankDetail" caption={rank?.label}>
            <ImgStore aria-hidden="true" className="rankGradeSymbol" inert="" role="presentation" src={gradeIcon} forceSvg tabIndex={-1} />
            <div className="flex -column">
                <span className="rankScore">
                    <span className="rankValue"><GraphCounter animateOnView value={rank?.value} /></span>
                    <span className="rankTotal">{rankTotalLabel}</span>
                </span>
                <span className="rankGrade"><GraphCounter animateOnView value={rankGrade?.value} />. {grade}</span>
            </div>
        </Block>
    )
}
