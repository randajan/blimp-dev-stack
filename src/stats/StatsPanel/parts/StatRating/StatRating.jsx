import React from "react";
import "./StatRating.scss";

import { Locale } from "../../../../locale/Locale.jsx";
import { BlimpRating } from "../../../../graphs/BlimpRating/BlimpRating.jsx";
import { Block } from "@randajan/jet-react/dom/block";

export const StatRating = (props)=>{
    const { stats } = props;
    const say = Locale.use();

    return (
        <Block className="StatRating" caption={say("profileStatsSectionRating")}>
            <BlimpRating value={stats?.rankRate} from={0} to={1} step={1 / 10}/>
        </Block>
    );
};
