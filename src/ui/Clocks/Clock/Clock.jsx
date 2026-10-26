import React from "react";
import "./Clock.scss";

import { Locale } from "../../../locale/Locale";


export const Clock = (props)=>{
    const { className, value, opt, trait, ...passProps } = props;
    const say = Locale.use();

    const clock = say.duration(value, opt);
   
    return (
        <span className={["Clock", className].filter(Boolean).join(" ")} {...passProps}>
            {trait ? trait(clock) : clock}
        </span>
    );
};
