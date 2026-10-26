import { gradeLimits } from "./config.js";



const shareScale = Math.max(
    ...gradeLimits.map(([share])=>10 ** (String(share).split(".")[1]?.length || 0))
);

export const collectGradeRanges = (count) => {
    let shareTotal = 0;
    let limit = 0;

    return gradeLimits.slice(0, count).map(([share, grade], index, grades)=>{
        shareTotal += Math.round(share * shareScale);

        const spare = grades.length - index - 1;
        const expected = Math.ceil(count * shareTotal / shareScale);
        limit = Math.min(count - spare, Math.max(limit + 1, expected));

        return [limit, grade];
    });
};

export const attachUserGradeStats = (stats, ranges) => {
    const { rank, rounds } = stats;

    if (!rounds) {
        stats.grade = 0;
        stats.rankGrade = 0;
        return;
    }

    const index = ranges.findIndex(([limit]) => rank <= limit);
    const rangeIndex = index < 0 ? ranges.length : index;
    const range = ranges[rangeIndex] || [];
    const prevLimit = ranges[rangeIndex - 1]?.[0] ?? 0;
    
    stats.grade = range[1] ?? 1;
    stats.rankGrade = rank - prevLimit;

};
