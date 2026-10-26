import React, { createContext, useContext, useEffect } from 'react';

import { _defaultLexicon, _defaultSay } from "./consts.js";

import tab from "@randajan/jet-react/base/tab";

export class Locale {

    static context = createContext(_defaultSay);
    static current = _defaultSay;

    static Provider(props) {
        const { children, value } = props;

        const say = Locale.current = value || _defaultSay;

        useEffect(_=>{
            const html = document.getElementsByTagName("html")?.[0];
            if (!html) { return; }
            html.setAttribute("lang", say.locale.id);
            tab.set("title");
        }, [say.locale.id]);

        
        return (
            <Locale.context.Provider value={say}>
                {children}
            </Locale.context.Provider>
        )
    }

    static use() {
        return useContext(Locale.context);
    }

    static get() {
        return Locale.current || _defaultSay;
    }

    static select(localeId) {
        return _defaultLexicon.select(localeId);
    }

    static useId() {
        const say = Locale.use();
        return say.locale?.id;
    }

    static say(id, fallback=id) {
        return Locale.get().or(id, fallback);
    }

}
