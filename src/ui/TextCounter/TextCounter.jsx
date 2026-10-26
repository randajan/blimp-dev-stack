import React, { useEffect, useMemo, useRef, useState } from "react";
import "./TextCounter.scss";


const getNow = _=>typeof performance === "undefined" ? Date.now() : performance.now();

const requestFrame = callback=>{
    if (typeof requestAnimationFrame === "function") { return requestAnimationFrame(callback); }
    return setTimeout(_=>callback(getNow()), 16);
};

const cancelFrame = frame=>{
    if (typeof cancelAnimationFrame === "function") { return cancelAnimationFrame(frame); }
    clearTimeout(frame);
};

const toNumber = (value, fallback=0)=>{
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
};

const clamp = value=>Math.min(Math.max(toNumber(value), 0), 1);

const formatValue = (value, decimals)=>toNumber(value).toFixed(Math.max(0, toNumber(decimals)));

export const TextCounter = (props)=>{
    const { children, className, decimals=0, from=0, transition=1000, value=children } = props;
    const target = toNumber(value);
    const [current, setCurrent] = useState(toNumber(from));
    const currentRef = useRef(current);
    const classNames = ["TextCounter", className].filter(Boolean).join(" ");
    const output = useMemo(_=>formatValue(current, decimals), [current, decimals]);

    useEffect(_=>{
        const time = Math.max(0, toNumber(transition));

        if (!time) {
            currentRef.current = target;
            setCurrent(target);
            return undefined;
        }

        const start = getNow();
        const initial = currentRef.current;
        let frame;

        const tick = now=>{
            const rate = clamp((now - start) / time);
            const ease = rate * (2 - rate);
            const next = initial + (target - initial) * ease;

            currentRef.current = next;
            setCurrent(next);

            if (rate < 1) { frame = requestFrame(tick); }
        };

        frame = requestFrame(tick);

        return _=>cancelFrame(frame);
    }, [target, transition]);

    return <span className={classNames}>{output}</span>;
};
