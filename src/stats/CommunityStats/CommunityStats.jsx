import React, { useMemo } from "react";
import "./CommunityStats.scss";

import { getStatField } from "../../game/showStats.js";
import { statsTypes } from "../../game/config.js";
import { BlimpRating } from "../../graphs/BlimpRating/BlimpRating.jsx";
import { Locale } from "../../locale/Locale.jsx";
import { Timer } from "../../ui/Clocks/Timer/Timer.jsx";
import { DataView } from "../../ui/DataView/DataView.jsx";
import { CharacterCard } from "../CharacterCard/CharacterCard.jsx";


const renderRating = value=>(
    <BlimpRating value={value} from={0} to={1} step={1 / 10} />
);

const renderLastPresent = value=>value ? (
    <Timer value={value} clockOpt={{ depth:1 }} targetOpt={{ hour:"hide", minute:"hide" }} />
) : null;

const getStatLabel = (say, id)=>getStatField(id, {}, say).label;

const generateColumns = (say, renderProfileLink)=>[
    {
        id:"rank",
        header:getStatLabel(say, "rank"),
        accessAs:(_, profile)=>profile.stats?.rank,
        renderAs:value=>`${statsTypes.int(value)}.`
    },
    {
        id:"aliasKey",
        header:say("profileHeaderMember"),
        renderAs:(aliasKey, profile)=>{
            const card = <CharacterCard profile={profile} />;
            return renderProfileLink?.(profile, card, { aliasKey }) ?? card;
        }
    },
    {
        id:"rankRate",
        header:say("profileStatsSectionRating"),
        accessAs:(_, profile)=>profile.stats?.rankRate,
        renderAs:renderRating
    },
    {
        id:"rounds",
        header:getStatLabel(say, "rounds"),
        accessAs:(_, profile)=>profile.stats?.rounds,
        renderAs:statsTypes.int
    },
    {
        id:"betaTotal",
        header:getStatLabel(say, "beta"),
        accessAs:(_, profile)=>(profile.stats?.beta || 0) + (profile.stats?.alphaBeta || 0),
        renderAs:statsTypes.int
    },
    {
        id:"lastPresent",
        header:say("profileStatsPresenceLast"),
        accessAs:(_, profile)=>profile.stats?.lastPresent,
        sortAs:value=>new Date(value).getTime(),
        searchAs:value=>value ? say.dateTime(value) : "",
        renderAs:renderLastPresent
    }
];


export const CommunityStats = (props)=>{
    const contextSay = Locale.use();
    const {
        className,
        defaultView="table",
        renderProfileLink,
        say=contextSay,
        transition=250,
        users=[],
        virtualAbove=0,
        virtualOffset=-0.1,
        ...dataViewProps
    } = props;
    const columns = useMemo(
        ()=>generateColumns(say, renderProfileLink),
        [say, renderProfileLink]
    );

    return (
        <DataView
            {...dataViewProps}
            className={["CommunityStats", className].filter(Boolean).join(" ")}
            columns={columns}
            data={users}
            defaultView={defaultView}
            say={say}
            transition={transition}
            virtualAbove={virtualAbove}
            virtualOffset={virtualOffset}
        />
    );
};
