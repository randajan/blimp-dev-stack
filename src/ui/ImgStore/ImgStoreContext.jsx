import React, { createContext, useContext } from "react";

const defaultStore = Object.freeze({
    baseUrl:"/store/img",
    images:{},
    status:"ready"
});

const ImgStoreContext = createContext(defaultStore);

export const ImgStoreProvider = (props)=>{
    const { baseUrl, children, images, resolveUrl, status } = props;
    const value = {
        baseUrl:baseUrl ?? defaultStore.baseUrl,
        images:images ?? defaultStore.images,
        resolveUrl,
        status:status ?? defaultStore.status
    };

    return <ImgStoreContext.Provider value={value}>{children}</ImgStoreContext.Provider>;
};

export const useImgStore = ()=>useContext(ImgStoreContext);
