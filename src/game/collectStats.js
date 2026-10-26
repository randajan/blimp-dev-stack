import { isAfter, isBefore, isFuture } from "date-fns";
import { maxPointsPerRound, noobRoundsLimit, collectRoundPoints, gameRoles, noobMaxPenalty } from "./config.js";
import { attachUserGradeStats, collectGradeRanges } from "./grades.js";


const toList = value => Array.isArray(value) ? value : [];

const createStats = () => ({
    rounds: 0,
    points: 0,
    wins: 0,
    survived: 0,
    murdered: 0,
    banished: 0,
    beta: 0,
    gama: 0,
    alpha: 0,
    alphaBeta: 0,
    alphaGama: 0,
    livedMs: 0,
    talkedMs: 0,
    totalMs: 0
});

const createUserWithStats = (sysUser, isMe) => ({
    ...Object.jet.exclude(sysUser, ["id"]),
    isMe,
    stats: {
        ...createStats(),
        successRate: 0,
        generalRate: 0,
        rank: 0,
        grade: 0,
        rankGrade: 0,
    }
});

const createRoundsStats = () => ({
    count: 0,
    users: 0,
    livedMs: 0,
    talkedMs: 0,
    totalMs: 0,
    gamaWon: 0,
    betaWon: 0,
});

const addRoundsStats = (roundsStats, round) => {
    const { totalMs, livedMs, talkedMs, gameRoundUsers, winner } = round;

    roundsStats.count++;
    roundsStats.users += gameRoundUsers.length;
    roundsStats.totalMs += totalMs;
    roundsStats.livedMs += livedMs;
    roundsStats.talkedMs += talkedMs;

    if (winner === "gama") { roundsStats.gamaWon++; }
    if (winner === "beta") { roundsStats.betaWon++; }
}

const addMemberStats = (stats, round, roundUser, points) => {
    const { isWinner, isSurvived, isMurdered, isBanished, role, birthRole } = roundUser;
    const { totalMs, livedMs, talkedMs, endedAt, startedAt } = round;

    stats.rounds++;
    stats.points += points;
    stats.wins += isWinner ? 1 : 0;
    stats.survived += isSurvived ? 1 : 0;
    stats.murdered += isMurdered ? 1 : 0;
    stats.banished += isBanished ? 1 : 0;
    stats.totalMs += totalMs;
    stats.livedMs += livedMs;
    stats.talkedMs += talkedMs;
    stats.firstPresent = (stats.firstPresent && isBefore(stats.firstPresent, startedAt)) ? stats.firstPresent : startedAt;
    stats.lastPresent = (stats.lastPresent && isAfter(stats.lastPresent, endedAt)) ? stats.lastPresent : endedAt;

    if (gameRoles.includes(role)) { stats[role]++; }
    if (birthRole === "alpha") {
        if (role === "beta") { stats.alphaBeta++; }
        if (role === "gama") { stats.alphaGama++; }
        stats.alpha++;
    }
};

const attachRates = (usersList, avgPointsPerRound) => {
    const noobReward = noobRoundsLimit * avgPointsPerRound;

    for (const user of usersList) {
        const { stats } = user;
        const { points, rounds } = stats;

        stats.successRate = rounds ? points / rounds / maxPointsPerRound : 0;

        stats.qualifyRate = Number.jet.frame(rounds / noobRoundsLimit, 0, 1);

        if (noobReward <= 0) { stats.generalRate = stats.successRate; continue; }

        const noobRewardRatio = (1 - noobMaxPenalty) + stats.qualifyRate * noobMaxPenalty;
        stats.generalRate = ((points + noobReward * noobRewardRatio) / (rounds + noobRoundsLimit)) / maxPointsPerRound;
    }

}

const compareUsers = (left, right) => {
    const ls = left.stats, rs = right.stats;
    if (rs.generalRate !== ls.generalRate) { return rs.generalRate - ls.generalRate; }
    if (rs.points !== ls.points) { return rs.points - ls.points; }
    if (rs.rounds !== ls.rounds) { return rs.rounds - ls.rounds; }
    return String(left.aliasKey).localeCompare(String(right.aliasKey));
};

export const collectGameStats = (rounds, { pairById = false, me = {} } = {}) => {
    const total = createStats();
    const publics = createStats();
    const anonynymous = createStats();
    const roundsStats = createRoundsStats();

    const usersMap = new Map();
    const iamMemberOf = me.gameRoundUsers;
    if (iamMemberOf) { usersMap.set("me", createUserWithStats(me, true)) }

    const roundsIndex = {};
    const roundsList = toList(rounds).map((roundOrig, listIndex) => {
        const round = { ...roundOrig };
        addRoundsStats(roundsStats, round);

        round.gameRoundUsers = toList(round.gameRoundUsers).filter(Boolean).map(gruOrig => {
            const gru = { ...gruOrig };
            const points = collectRoundPoints(gru);
            addMemberStats(total, round, gru, points);

            const isMe = iamMemberOf?.includes(gru.id);

            const msu = (isMe ? me : gru.sysUser) || {};
            const aliasKey = isMe ? "me" : msu.aliasKey;

            const group = aliasKey ? publics : anonynymous;
            addMemberStats(group, round, gru, points);

            delete gru.sysUser;
            const key = pairById ? msu.id : aliasKey;
            if (!key) { return gru; }
            gru.sysUser = { aliasKey };

            let user = usersMap.get(key);
            if (!user) { usersMap.set(key, user = createUserWithStats(msu, isMe)); }

            addMemberStats(user.stats, round, gru, points);

            return gru;
        });

        roundsIndex[round.id] = listIndex;
        return round;
    });

    let noobPoints = 0, noobRounds = 0;

    const usersList = [];

    for (const user of usersMap.values()) {
        const { aliasKey, isMe, stats } = user;

        const group = aliasKey ? publics : anonynymous;
        group.count = (group.count || 0) + 1;
        total.count = (total.count || 0) + 1;

        if (stats.rounds < noobRoundsLimit) {
            noobPoints += stats.points;
            noobRounds += stats.rounds;
        }

        if (aliasKey || isMe) { usersList.push(user); }
    }

    const avgRoundPoints = noobRounds ? (noobPoints / noobRounds) : total.rounds ? (total.points / total.rounds) : 0;

    //attach successsRate, qualifyRate, generalRate
    attachRates(usersList, avgRoundPoints);

    //sort by generalRate
    usersList.sort(compareUsers);

    const highRate = usersList[0]?.stats.generalRate;
    const lowRate = usersList[usersList.length - 1]?.stats.generalRate;
    const diffRate = highRate - lowRate;

    const gradeRanges = collectGradeRanges(usersList.length);
    const gradeRatings = {};

    const usersIndex = {};
    usersList.forEach((user, index) => {
        const { aliasKey, stats } = user;

        stats.rank = index + 1;
        stats.rankAbove = usersList.length-index-1;
        stats.rankRate = (stats.generalRate - lowRate) / diffRate;

        attachUserGradeStats(stats, gradeRanges);

        const bef = usersList[index - 1]?.stats;
        if (!bef) { gradeRatings[stats.grade] = { high: stats.generalRate }; }
        else if (bef.grade !== stats.grade) {
            gradeRatings[bef.grade].low = bef.generalRate;
            gradeRatings[stats.grade] = { high: stats.generalRate };
        }

        usersIndex[aliasKey] = index;
    });

    return {
        users: {
            list: usersList,
            index: usersIndex,
            stats: {
                total,
                publics,
                anonynymous,
            }
        },
        rounds: {
            list: roundsList,
            index: roundsIndex,
            stats: roundsStats
        }
    };
};
