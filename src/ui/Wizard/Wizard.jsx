import React, { Children, createContext, useContext, useEffect, useReducer } from 'react';
import "./Wizard.scss";
import jet from "@randajan/jet-react";


const _directions = ["toRight", "toLeft", "toUp", "toDown"];

const context = createContext(null);

export const Wizard = (props) => {
    const { children, onCancel, onComplete, direction, className } = props;

    const slides = Children.toArray(children).filter(Boolean);

    const lastSlide = slides.length-1;

    const [ currentRaw, set ] = useReducer((s, i)=> Math.max(0, Number.jet.to(i)), 0);
    const current = Number.jet.frame(currentRaw, 0, lastSlide);

    const ctrl = Object.freeze({
        current,
        set,
        next:()=>set(current+1),
        prev:()=>set(current-1),
        cancel:(onCancel || (()=>{}))
    });

    useEffect(_=>{
        if (currentRaw > lastSlide) { onComplete(); }
    }, [currentRaw]);

    const dir = _directions.includes(direction) ? direction : "toRight";

    return (
        <context.Provider value={ctrl}>
            <section className={jet.melt(["Wizard", dir, className], " ")} style={{"--currentSlide":current, "--lastSlide":lastSlide}}>
                <section className="slides">
                    {slides.map((s, key)=>{
                        const state = key > current ? "next" : key < current ? "before" : "current";
                        return (
                            <section
                                key={key}
                                inert={key !== current}
                                aria-hidden={key !== current}
                                className={`wizSlide ${state}`}
                                style={{"--slideIndex":key}}
                            >
                                {s}
                            </section>
                        )
                    })}
                </section>
            </section>
        </context.Provider>
    );
}

export const useWizard = () => useContext(context);
