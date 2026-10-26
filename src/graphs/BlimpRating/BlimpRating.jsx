import React, { useRef } from 'react';
import "./BlimpRating.scss";
import jet from "@randajan/jet-react";
import { Bar } from '@randajan/jet-react/dom/form';
import { BlimpBarMarker } from './BlimpBarMarker/BlimpBarMarker';
import { useInView } from 'react-intersection-observer';

export const BlimpRating = (props)=>{
    const {} = props;

    const [ref, inView] = useInView({triggerOnce:true, threshold: 1});

    
    return (
        <div ref={ref} className={jet.melt(["BlimpRating", inView ? "inview" : ""], " ")}>
            <Bar  {...props} marker={<BlimpBarMarker/>}/>
        </div>
    )
}

