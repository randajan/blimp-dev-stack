import { useEffect, useLayoutEffect } from "react";

export const hasWindow = _=>typeof window !== "undefined";
export const useBrowserLayoutEffect = hasWindow() ? useLayoutEffect : useEffect;

export const toNonNegative = (value, fallback=0)=>{
    const num = Number(value);
    return Number.isFinite(num) && num >= 0 ? num : fallback;
};

export const toTransition = (value, fallback=500)=>{
    const num = Number(value);
    return Number.isFinite(num) ? Math.max(0, num) : fallback;
};

export const toVirtualOffset = (value, fallback=.5)=>{
    const num = Number(value);
    if (!Number.isFinite(num)) { return fallback; }
    return Math.max(num, -.49);
};

export const toMargin = offset=>{
    return `${toVirtualOffset(offset) * 100}% 0px`;
};

export const getScrollRoot = node=>{
    if (!hasWindow() || !node) { return null; }

    let root = node.parentElement;
    while (root && root !== document.body && root !== document.documentElement) {
        const style = window.getComputedStyle(root);
        const scrollable = /(auto|scroll|overlay)/.test(`${style.overflowY} ${style.overflow}`);
        if (scrollable && root.scrollHeight > root.clientHeight) { return root; }
        root = root.parentElement;
    }

    return null;
};

export const getNodeHeight = node=>{
    return node?.offsetHeight || node?.getBoundingClientRect?.().height || 0;
};

export const cleanSet = (set, count)=>{
    const next = new Set();
    let changed = false;

    set.forEach(index=>{
        if (index < count) { next.add(index); }
        else { changed = true; }
    });

    return changed ? next : set;
};

export const cleanSizes = (sizes, count)=>{
    const next = new Map();
    let changed = false;

    sizes.forEach((size, index)=>{
        if (index < count) { next.set(index, size); }
        else { changed = true; }
    });

    return changed ? next : sizes;
};

export const removeIndex = (set, index)=>{
    if (!set.has(index)) { return set; }
    const next = new Set(set);
    next.delete(index);
    return next;
};

export const shouldMeasure = node=>{
    return node?.dataset?.viewVirtual !== "placeholder";
};

export const setInitialSize = (setSizes, index, height)=>{
    if (index === undefined || height <= 0) { return false; }

    setSizes({
        fallback:height,
        items:new Map([[index, height]])
    });

    return true;
};

export const getVirtualItemStyle = (transition, style)=>{
    const transitionStyle = transition ? { "--DataViewTransition":`${transition}ms` } : null;
    if (!transitionStyle && !style) { return null; }
    return { ...(transitionStyle || {}), ...(style || {}) };
};
