import { statsFields } from "./config.js";
import { Say } from "../locale/consts.js";

export const getStatField = (id, data, say)=>{
    const stat = statsFields[id];
    if (!stat) { return {}; }

    return {
        label:say(Say.id("profileStatsField", id)),
        raw:data?.[id],
        value:stat.format(data?.[id], say)
    };
};