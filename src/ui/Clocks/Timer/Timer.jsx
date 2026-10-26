import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./Timer.scss";

import { toDate } from "date-fns";

import { Locale } from "../../../locale/Locale";

import { Clock } from "../Clock/Clock";


export const Timer = (props)=>{
    const { value:raw, clockOpt={}, targetOpt } = props;
    const say = Locale.use();

    const value = useMemo(()=>toDate(raw), [raw]);

    const recalc = useCallback(_=>value - Date.now(), [value]);
    const [msDiff, setTimeDiff] = useState(recalc);

    const refreshInterval = clockOpt?.includeSeconds ? 50 : 1000;

    useEffect(_=>{
        const int = setInterval(_=>setTimeDiff(recalc), refreshInterval);
        return _=>clearInterval(int);
    }, [recalc, refreshInterval]);

    const mode = msDiff === 0 ? "Now" : msDiff < 0 ? "Past" : "Future";
    const resolvedClockOpt = mode === "Past" ? { ...clockOpt, unitIdSuffix:7 } : clockOpt;

    const displayTrait = useCallback(v=>mode === "Now" ? v : say(`date${mode}Wrap`).replace("$", v), [mode, say]);
    
    return (
        <div className={["Timer", `timer${mode}`].join(" ")}>
            {value && <Clock value={Math.abs(msDiff)} opt={resolvedClockOpt} trait={displayTrait}/>} 
            {(targetOpt && value) && <p className="targetDate">{say.dateTime(value, targetOpt)}</p>}
        </div>
    );
};

