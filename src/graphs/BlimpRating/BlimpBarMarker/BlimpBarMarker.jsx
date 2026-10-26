import React from 'react';
import "./BlimpBarMarker.scss";
import jet from "@randajan/jet-react";
import { ImgStore } from '../../../ui/ImgStore/ImgStore';

export const BlimpBarMarker = (props)=>{
    const {} = props;

    return (
        <div  className="BlimpBarMarker">
            {Array(5).fill(true).map((_, index)=><ImgStore key={index} src="logoMonochrome.svg"/>)}
        </div>
    )
}

