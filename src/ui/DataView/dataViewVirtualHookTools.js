import { useCallback, useEffect, useRef } from "react";
import { observe } from "react-intersection-observer";

import {
    cleanSet,
    cleanSizes,
    getNodeHeight,
    getScrollRoot,
    hasWindow,
    removeIndex,
    setInitialSize,
    shouldMeasure,
    toMargin,
    useBrowserLayoutEffect
} from "./dataViewVirtualBaseTools";

const applyVisible = (set, changes)=>{
    let next = null;

    changes.forEach(([index, visible])=>{
        if (set.has(index) === visible) { return; }
        next = next || new Set(set);
        visible ? next.add(index) : next.delete(index);
    });

    return next || set;
};

const applyRendered = (set, changes, transition)=>{
    let next = null;

    changes.forEach(([index, visible])=>{
        const rendered = visible || (transition > 0 && set.has(index));
        if (set.has(index) === rendered) { return; }
        next = next || new Set(set);
        rendered ? next.add(index) : next.delete(index);
    });

    return next || set;
};

export const useLatestRef = value=>{
    const ref = useRef(value);
    useEffect(()=>{ ref.current = value; }, [value]);
    return ref;
};

export const useCleanState = (count, setVisible, setRendered, setSizes)=>{
    useEffect(()=>{
        setVisible(prev=>cleanSet(prev, count));
        setRendered(prev=>cleanSet(prev, count));
        setSizes(prev=>{
            const items = cleanSizes(prev.items, count);
            if (items === prev.items) { return prev; }
            return { fallback:prev.fallback, items };
        });
    }, [count, setRendered, setSizes, setVisible]);
};

export const useBind = (nodesRef, refsRef, indexRef, resizeRef)=>{
    const bindNode = useCallback((index, node)=>{
        const prev = nodesRef.current.get(index);
        if (prev && prev !== node) {
            resizeRef.current?.unobserve(prev);
            indexRef.current.delete(prev);
        }

        if (!node) {
            nodesRef.current.delete(index);
            return;
        }

        nodesRef.current.set(index, node);
        indexRef.current.set(node, index);
        resizeRef.current?.observe(node);
    }, [indexRef, nodesRef, resizeRef]);

    return useCallback(index=>{
        const cached = refsRef.current.get(index);
        if (cached) { return cached; }

        const nodeRef = { current:null };
        const ref = node=>{
            nodeRef.current = node;
            bindNode(index, node);
        };
        const entry = { nodeRef, ref };
        refsRef.current.set(index, entry);
        return entry;
    }, [bindNode, refsRef]);
};

export const useFirstMeasure = (props)=>{
    const { active, firstRender, nodesRef, renderKey, setReadyKey, setRendered, setSizes, setVisible } = props;

    useBrowserLayoutEffect(()=>{
        const node = nodesRef.current.get(0);
        if (!active || !firstRender || !node) { return; }

        let frame = null;
        let observer = null;
        let done = false;
        const finish = height=>{
            if (done || !setInitialSize(setSizes, 0, height)) { return; }
            done = true;
            setVisible(new Set([0]));
            setRendered(new Set([0]));
            setReadyKey(renderKey);
            observer?.disconnect();
        };

        frame = window.requestAnimationFrame(_=>finish(getNodeHeight(node)));
        if (typeof ResizeObserver !== "undefined") {
            observer = new ResizeObserver(entries=>finish(getNodeHeight(entries[0]?.target)));
            observer.observe(node);
        }

        return _=>{
            done = true;
            window.cancelAnimationFrame(frame);
            observer?.disconnect();
        };
    }, [active, firstRender, nodesRef, renderKey, setReadyKey, setRendered, setSizes, setVisible]);
};

export const useObserveGate = ({ active, measured, renderKey, setObserveKey })=>{
    useBrowserLayoutEffect(()=>{
        if (!active || !measured) { return; }
        const frame = window.requestAnimationFrame(_=>setObserveKey(renderKey));
        return _=>window.cancelAnimationFrame(frame);
    }, [active, measured, renderKey, setObserveKey]);
};

export const useVisibleObserver = (props)=>{
    const { active, hasObserver, indexRef, nodesRef, offset, setRendered, setVisible, transition } = props;

    useBrowserLayoutEffect(()=>{
        if (!active || !hasObserver) { return; }

        const root = getScrollRoot(nodesRef.current.values().next().value);
        const options = { root, rootMargin:toMargin(offset), threshold:0 };
        const unobserve = Array.from(nodesRef.current.values()).map(node=>observe(node, inView=>{
            const index = indexRef.current.get(node);
            if (index === undefined) { return; }
            const changes = [[index, inView]];
            setVisible(prev=>applyVisible(prev, changes));
            setRendered(prev=>applyRendered(prev, changes, transition));
        }, options));

        return _=>unobserve.forEach(stop=>stop());
    }, [active, hasObserver, indexRef, nodesRef, offset, setRendered, setVisible, transition]);
};

export const useSizeObserver = ({ active, indexRef, nodesRef, resizeRef, setSizes })=>{
    useEffect(()=>{
        if (!active || !hasWindow() || typeof ResizeObserver === "undefined") { return; }

        resizeRef.current = new ResizeObserver(entries=>{
            entries.forEach(entry=>{
                const height = getNodeHeight(entry.target);
                if (!shouldMeasure(entry.target)) { return; }
                setSizes(prev=>{
                    const index = indexRef.current.get(entry.target);
                    if (index === undefined || height <= 0) { return prev; }
                    if (Math.abs((prev.items.get(index) || 0) - height) < .5) { return prev; }
                    const items = new Map(prev.items);
                    items.set(index, height);
                    return { fallback:prev.fallback, items };
                });
            });
        });

        nodesRef.current.forEach(node=>resizeRef.current.observe(node));
        return _=>{
            resizeRef.current?.disconnect();
            resizeRef.current = null;
        };
    }, [active, indexRef, nodesRef, resizeRef, setSizes]);
};

export const removeRenderedIndex = (visibleRef, setRendered, index)=>{
    if (visibleRef.current.has(index)) { return; }
    setRendered(prev=>removeIndex(prev, index));
};
