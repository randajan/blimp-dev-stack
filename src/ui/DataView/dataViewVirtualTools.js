import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
    getVirtualItemStyle,
    toNonNegative,
    toTransition,
    toVirtualOffset
} from "./dataViewVirtualBaseTools";
import {
    removeRenderedIndex,
    useBind,
    useCleanState,
    useFirstMeasure,
    useLatestRef,
    useObserveGate,
    useSizeObserver,
    useVisibleObserver
} from "./dataViewVirtualHookTools";

export { getVirtualItemStyle };

export const getVirtualConfig = (rows, virtualAbove=-1, virtualOffset=.5, transition=500)=>{
    const count = rows?.length || 0;
    const above = virtualAbove;

    return {
        active:above >= 0 && count > above,
        offset:toVirtualOffset(virtualOffset),
        transition:toTransition(transition)
    };
};

export const useDataViewVirtualItems = (props)=>{
    const { active=false, count=0, offset=.5, transition=500 } = props;

    const [visible, setVisible] = useState(()=>new Set());
    const [rendered, setRendered] = useState(()=>new Set());
    const [sizes, setSizes] = useState(()=>({ fallback:0, items:new Map() }));
    const [readyKey, setReadyKey] = useState(null);
    const [observeKey, setObserveKey] = useState(null);
    const nodesRef = useRef(new Map());
    const refsRef = useRef(new Map());
    const indexRef = useRef(new WeakMap());
    const resizeRef = useRef(null);
    const visibleRef = useLatestRef(visible);
    const hasObserver = typeof window !== "undefined" && typeof IntersectionObserver !== "undefined";
    const enabled = active && hasObserver;
    const transitionMs = enabled ? toTransition(transition, 0) : 0;
    const bind = useBind(nodesRef, refsRef, indexRef, resizeRef);
    const renderKey = `${active ? 1 : 0}:${count}`;
    const measured = enabled && readyKey === renderKey;
    const observerActive = measured && observeKey === renderKey;
    const calibrating = enabled && !observerActive;
    const firstRender = enabled && !measured;

    const isVisible = useCallback(index=>{
        if (!enabled) { return true; }
        if (calibrating) { return index === 0; }
        return visible.has(index);
    }, [calibrating, enabled, visible]);

    const shouldRender = useCallback(index=>{
        if (!enabled) { return true; }
        if (calibrating) { return index === 0; }
        return transitionMs > 0 ? rendered.has(index) : visible.has(index);
    }, [calibrating, enabled, rendered, transitionMs, visible]);

    const getSize = useCallback(index=>{
        return sizes.items.get(index) || sizes.fallback || undefined;
    }, [sizes]);

    const onExited = useCallback(index=>()=>{
        removeRenderedIndex(visibleRef, setRendered, index);
    }, [visibleRef]);

    useCleanState(count, setVisible, setRendered, setSizes);
    useFirstMeasure({ active:enabled, firstRender, nodesRef, renderKey, setReadyKey, setRendered, setSizes, setVisible });
    useObserveGate({ active:enabled, measured, renderKey, setObserveKey });
    useVisibleObserver({
        active:observerActive,
        hasObserver,
        indexRef,
        nodesRef,
        offset,
        setRendered,
        setVisible,
        transition:transitionMs
    });
    useSizeObserver({ active:enabled, indexRef, nodesRef, resizeRef, setSizes });

    useEffect(()=>{
        if (enabled) { return; }
        setReadyKey(null);
        setObserveKey(null);
        setVisible(new Set());
        setRendered(new Set());
    }, [enabled]);

    useEffect(()=>{
        if (!enabled || transitionMs > 0) { return; }
        setRendered(visible);
    }, [enabled, transitionMs, visible]);

    return useMemo(() => ({
        bind,
        getSize,
        isVisible,
        onExited,
        shouldRender,
        transition:transitionMs
    }), [bind, getSize, isVisible, onExited, shouldRender, transitionMs]);
};
