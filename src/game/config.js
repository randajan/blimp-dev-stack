import { toDate } from "date-fns";
import { msHour } from "../time/date.js";

export const maxPointsPerRound = 3;
export const noobRoundsLimit = 20;
export const noobMaxPenalty = 0.5;

export const gradeLimits = Object.freeze([
    [0.001, 8],
    [0.01, 7],
    [0.04, 6],
    [0.10, 5],
    [0.15, 4],
    [0.20, 3],
    [0.25, 2],
    [0.25, 1],
]);

export const gameRoles = Object.freeze([
    "alpha",
    "beta",
    "gama"
]);

export const collectRoundPoints = roundUser=>{
    if (!roundUser) { return 0; }
    return (roundUser.isSurvived ? 1 : 0) + (roundUser.isWinner ? 2 : 0);
};



export const statsTypes = {
    int: v=>(Number.jet.to(v).toFixed(0)),
    dur: (v, say)=>say.duration(v, { depth:2 }),
    prc: v=>`${(Number.jet.to(v)*100).toFixed()}%`,
    datetime: v=>toDate(v)
};

export const statsFields = Object.fromEntries([
    { id: "rounds", type: "int" }, //odehraných her
    { id: "points", type: "int" }, //celkem získaných bodů
    { id: "wins", type: "int" }, // počet výher
    { id: "survived", type: "int" }, //kolikrát přežil
    { id: "murdered", type: "int" }, //kolikrát byl zabit
    { id: "banished", type: "int" }, //kolikrát byl vyhozen z lodi
    { id: "beta", type: "int" }, //kolikrát byl beta (sabotér)
    { id: "gama", type: "int" }, //kolikrát byl gama (běžný hráč)
    { id: "alpha", type: "int" }, //kolikrát byl alpha (může si vybrat)
    { id: "alphaBeta", type: "int" }, //kolikrát si jako alpha vybral betu
    { id: "alphaGama", type: "int" }, //kolikrát si jako alpha vybral gamu
    { id: "livedMs", type: "dur" }, //kolik ms ve hře strávil opravami lodi
    { id: "talkedMs", type: "dur" }, //kolik ms ve hře strávil na meetingu
    { id: "totalMs", type: "dur" }, //kolik ms ve hře strávil celkem
    { id: "successRate", type: "prc" }, //kolik % bodů získal z toho kolik jich získat mohl celkem
    { id: "generalRate", type: "prc" }, //relativní honocení vycházející ze successRate a počtu odehraných her
    { id: "rankRate", type: "prc" }, //generalRate kde 100% = nejlepší hráč a 0% = nejhorší hráč
    { id: "rank", type: "int" }, // umístění v globálním žebříčku
    { id: "lastPresent", type:"datetime" },
    { id: "firstPresent", type:"datetime" },
    { id: "qualifyRate", type:"prc" },
    { id: "rankGrade", type:"int" },
    { id: "rankAbove", type:"int" },
].map(stat=>{
    const { id, type } = stat;
    stat.format = statsTypes[type];
    delete stat.id;
    return [id, stat];
}));
