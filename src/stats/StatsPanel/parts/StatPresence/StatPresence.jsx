import React from "react";
import "./StatPresence.scss";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

import { Locale } from "../../../../locale/Locale.jsx";
import { Timer } from "../../../../ui/Clocks/Timer/Timer.jsx";
import { Block } from "@randajan/jet-react/dom/block";

const presenceItems = [
    { id:"first", labelId:"profileStatsPresenceFirst", field:"firstPresent" },
    { id:"last", labelId:"profileStatsPresenceLast", field:"lastPresent" }
];

export const StatPresence = (props)=>{
    const { stats } = props;
    const say = Locale.use();

    return (
        <Block className="StatPresence" caption={say("profileStatsSectionPresence")}>
            <div className="presenceItems">
                {presenceItems.map(item=>(
                    <div className="presenceItem" key={item.id}>
                        <EventOutlinedIcon className="presenceIcon" />
                        <span className="presenceLabel">{say(item.labelId)}</span>
                        <Timer value={stats?.[item.field]} clockOpt={{ depth:2 }} targetOpt={{}}/>
                    </div>
                ))}
            </div>
        </Block>
    );
};
