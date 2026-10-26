import React from "react";
import "./StatActivity.scss";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";

import { Locale } from "../../../../locale/Locale.jsx";

import { Block } from "@randajan/jet-react/dom/block";
import { getStatField } from "../../../../game/showStats.js";

const activityItems = [
    { id:"livedMs", Icon:AccessTimeOutlinedIcon },
    { id:"talkedMs", Icon:ForumOutlinedIcon }
];

export const StatActivity = (props)=>{
    const { stats } = props;
    const say = Locale.use();

    return (
        <Block className="StatActivity" caption={say("profileStatsSectionActivity")}>
            <div className="activityItems">
                {activityItems.map(item=>{
                    const field = getStatField(item.id, stats, say);
                    const Icon = item.Icon;

                    return (
                        <div className="activityItem" key={item.id}>
                            <Icon className="activityIcon" />
                            <span className="activityLabel">{field?.label}</span>
                            <span className="activityValue">{field?.value}</span>
                        </div>
                    );
                })}
            </div>
        </Block>
    );
};
