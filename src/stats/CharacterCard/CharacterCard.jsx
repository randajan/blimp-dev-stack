import React from "react";
import "./CharacterCard.scss";
import jet from "@randajan/jet-react";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

import { Say } from "../../locale/consts.js";
import { Locale } from "../../locale/Locale.jsx";

import { ImgStore } from "../../ui/ImgStore/ImgStore.jsx";



const profileStates = {
    public: {
        className: "public",
        labelId: Say.id("profile", "character", "state", "public"),
        Icon: PublicOutlinedIcon
    },
    private: {
        className: "private",
        labelId: Say.id("profile", "character", "state", "private"),
        Icon: LockOutlinedIcon
    }
};

const getProfileState = profile => {
    const { alias, aliasKey, isPublic } = (profile || {});
    if (isPublic === false) { return profileStates.private; }
    return profileStates[(isPublic || aliasKey || alias) ? "public" : "private"];
};



export const CharacterCard = (props) => {
    const { profile, fullSize = false } = props;
    const say = Locale.use();

    const { alias, name, idn, stats } = (profile || {});
    const { grade, rankGrade, qualifyRate } = (stats || {});
    const gradeIcon = `userGrade${grade || 0}.svg`;
    const profileState = getProfileState(profile);
    const StatusIcon = profileState.Icon;
    const className = jet.melt(["CharacterCard", fullSize ? "fullSize" : "compact", qualifyRate >= 1 ? "qualified" : "noob"], " ");
    const displayName = alias || name || `id:${idn}`;


    return (
        <div className={className}>
            <ImgStore className="stamp" src={"userStamp.webp"} />
            <div className="alias">
                <ImgStore src={gradeIcon} forceSvg />
                <span>{displayName}</span>
            </div>
            <div className="underline"></div>
            <div className="details">
                <div className="detail rankLevel">
                    <ShieldOutlinedIcon className="detailIcon" />
                    <div className="detailText">
                        <span className="label">{say("profileCharacterRank")}</span>
                        <span className="value">
                            {rankGrade ? <span className="rankGrade">{rankGrade}.</span> : null}
                            {say(`profileGrade${grade}`)}
                        </span>
                    </div>
                </div>
                {
                    fullSize && (
                        <div className={jet.melt(["detail state", profileState.className], " ")}>
                            <StatusIcon className="detailIcon" />
                            <div className="detailText">
                                <span className="label">{say("profileCharacterVisibility")}</span>
                                <span className="value">{say(profileState.labelId)}</span>
                            </div>
                        </div>
                    )
                }
            </div>
        </div >
    );
};
