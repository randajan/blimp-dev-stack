import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

const chartColors = [
    "var(--chartColor1, var(--cMain))",
    "var(--chartColor2, var(--cGreen))",
    "var(--chartColor3, var(--cWhite50))",
    "var(--chartColor4, var(--cMain80))",
    "var(--chartColor5, var(--cGreen))",
    "var(--chartColor6, var(--cWhite20))"
];

const getNow = _=>typeof performance === "undefined" ? Date.now() : performance.now();

const requestFrame = callback=>{
    if (typeof requestAnimationFrame === "function") { return requestAnimationFrame(callback); }
    return setTimeout(_=>callback(getNow()), 16);
};

const cancelFrame = frame=>{
    if (typeof cancelAnimationFrame === "function") { return cancelAnimationFrame(frame); }
    clearTimeout(frame);
};

export const toNumber = (value, fallback=0)=>{
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
};

export const clamp = (value, min=0, max=1)=>{
    const low = Math.min(min, max);
    const high = Math.max(min, max);
    return Math.min(Math.max(toNumber(value), low), high);
};

export const getRatio = (value, min=0, max=1)=>{
    const start = toNumber(min);
    const end = toNumber(max, 1);
    const span = end - start;

    if (!span) { return 0; }

    return clamp((toNumber(value) - start) / span);
};

export const getChartColor = (source, index, colors)=>{
    return source?.color || source?.fill || colors?.[index] || chartColors[index % chartColors.length];
};

export const getGraphClassName = (name, className)=>{
    const extra = Array.isArray(className) ? className.filter(Boolean).join(" ") : className;
    return ["Graph", name, extra].filter(Boolean).join(" ");
};

export const getGraphStyle = (style, vars={})=>{
    const graphStyle = Object.entries(vars).reduce((all, [key, value])=>{
        if (value !== undefined && value !== null) { all[key] = value; }
        return all;
    }, {});

    return style ? { ...graphStyle, ...style } : graphStyle;
};

export const getLegendPosition = (value, fallback="right")=>{
    return ["top", "bottom", "left", "right"].includes(value) ? value : fallback;
};

export const getLegendDirection = (position, value)=>{
    if (["horizontal", "vertical"].includes(value)) { return value; }
    return ["top", "bottom"].includes(position) ? "horizontal" : "vertical";
};

export const useGraphInView = (animateOnView=false)=>{
    const [ref, inView] = useInView({ skip:!animateOnView, threshold:1, triggerOnce:true });

    return {
        ref:animateOnView ? ref : undefined,
        isActive:!animateOnView || inView
    };
};

export const useTweenNumbers = (values=[], transition=0)=>{
    const valueKey = values.map(value=>toNumber(value)).join("|");
    const target = useMemo(_=>values.map(value=>toNumber(value)), [valueKey]);
    const currentRef = useRef(target);
    const [current, setCurrent] = useState(target);

    useEffect(_=>{
        const time = Math.max(0, toNumber(transition));

        if (!time) {
            currentRef.current = target;
            setCurrent(target);
            return undefined;
        }

        const from = currentRef.current;
        const length = Math.max(from.length, target.length);
        const startValues = Array.from({ length }, (_, i)=>toNumber(from[i]));
        const endValues = Array.from({ length }, (_, i)=>toNumber(target[i]));
        const start = getNow();
        let frame;

        const tick = now=>{
            const rate = clamp((now - start) / time);
            const ease = rate * (2 - rate);
            const next = endValues.map((end, i)=>startValues[i] + (end - startValues[i]) * ease);

            currentRef.current = next;
            setCurrent(next);

            if (rate < 1) { frame = requestFrame(tick); }
        };

        frame = requestFrame(tick);

        return _=>cancelFrame(frame);
    }, [target, transition]);

    return current;
};

export const useTweenNumber = (value, transition=0)=>{
    return useTweenNumbers([value], transition)[0] || 0;
};
