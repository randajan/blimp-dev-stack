import React, { useState } from "react";
import "./ImgStore.scss";

import { Img } from "../Img/Img";
import { useImgStore } from "./ImgStoreContext";

export const buildImgUrl = (baseUrl, imgId, ext, version)=>{
    const url = `${baseUrl}/${imgId}.${ext}`;
    return version ? `${url}?v=${version}` : url;
};

export const ImgStore = (props)=>{
    const { allowCors, className, forceSvg, noFetch, normalizeSvg, src, ...selfProps } = props;
    const store = useImgStore();
    const [imgStatus, setImgStatus] = useState("pending");
    const [imgId, ext="png"] = src?.split(".") || [];
    const meta = store.images?.[imgId];
    const wrapClassName = ["ImgStore", className].filter(Boolean).join(" ");

    if (store.status === "pull" || !meta) {
        return <span {...selfProps} className={wrapClassName} data-status={imgStatus}/>;
    }

    const { version, fileSize, pressRatio } = meta;
    const preload = ext === "png" && fileSize >= 512 && pressRatio <= .2;
    const resolveUrl = store.resolveUrl || buildImgUrl;
    const toUrl = nextExt=>resolveUrl(store.baseUrl, imgId, nextExt, version, meta);
    const passProps = { allowCors, forceSvg, noFetch, normalizeSvg };

    return (
        <span {...selfProps} className={wrapClassName} data-status={imgStatus}>
            {preload ? <Img {...passProps} className="placeholder" src={toUrl("webp")} transition/> : null}
            <Img {...passProps} src={toUrl(ext)} onStatus={setImgStatus}/>
        </span>
    );
};
