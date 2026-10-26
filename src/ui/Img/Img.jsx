import React, { useEffect, useState } from 'react';
import "./Img.scss";
import DOMPurify from "dompurify";

import { Img as ImgOriginal } from "@randajan/jet-react/dom/img";


const purifySvg = svg=>DOMPurify.sanitize(svg, {
    USE_PROFILES:{
        svg:true,
        svgFilters:true
    }
});

export const Img = (props)=>{
    const { noFetch, onStatus, transition, ...passProps } = props;

    const [status, setState] = useState("pending");

    const normalizeSvg = noFetch ? null : purifySvg;

    useEffect(_=>onStatus?.(status), [onStatus, status]);

    
    return (
        <ImgOriginal {...passProps} normalizeSvg={normalizeSvg} onLoad={_=>setState("loaded")} onError={_=>setState("error")} data-status={status} data-transition={transition} draggable="false"/>
    );
}
