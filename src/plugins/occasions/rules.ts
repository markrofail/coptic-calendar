import { CopticDate } from '../../core/CopticDate.js';
import { COPTIC_MONTHS } from '../../core/constants.js';
import { copticToJDN } from '../../core/computus.js';
import { EASTER_OFFSETS, type CopticOccasion, FIXED_OCCASIONS } from './constants.js';

export interface OccasionContext {
    date: CopticDate;
    easter: CopticDate;
    diffDays: number;
}

export type OccasionGenerator = (ctx: OccasionContext) => CopticOccasion[];

export const OCCASION_GENERATORS: OccasionGenerator[] = [
    // source: St-Takla
    // see: https://st-takla.org/Saints/Coptic-Orthodox-Saints-Biography/ (Daily commemorative registry - Synaxarium)
    (ctx: OccasionContext): CopticOccasion[] =>
        FIXED_OCCASIONS[`${ctx.date.month}-${ctx.date.day}`] || [],

    // 2. Fixed Fasts (Spans)
    // source: SUS Copts
    // see: https://suscopts.org/coptic-orthodox-church/fasts/ (Standard fast durations)
    (ctx: OccasionContext): CopticOccasion[] => {
        const res: CopticOccasion[] = [];
        if (ctx.date.month === COPTIC_MONTHS.MESORI && ctx.date.day >= 1 && ctx.date.day <= 15)
            res.push('StMarysFast');
        if (
            (ctx.date.month === COPTIC_MONTHS.HATHOR && ctx.date.day >= 16) ||
            (ctx.date.month === COPTIC_MONTHS.KIAHK && ctx.date.day < 29)
        )
            res.push('NativityFast');
        return res;
    },

    // 3. Mathematical diff against Easter
    // source: SUS Copts
    // see: https://suscopts.org/coptic-orthodox-church/fasts/great-lent/ (Mathematical diff against Easter)
    (ctx: OccasionContext): CopticOccasion[] => {
        const res: CopticOccasion[] = [];
        const diff = ctx.diffDays;
        if (diff === 0) res.push('Easter');
        if (diff >= EASTER_OFFSETS.LENT && diff < 0) res.push('Lent');
        if (diff >= EASTER_OFFSETS.JONAHS_FAST_START && diff <= EASTER_OFFSETS.JONAHS_FAST_END)
            res.push('JonahsFast');
        if (diff === EASTER_OFFSETS.PALM_SUNDAY) res.push('PalmSunday');
        if (diff === EASTER_OFFSETS.COVENANT_THURSDAY) res.push('CovenantThursday');
        if (diff === EASTER_OFFSETS.THOMAS_SUNDAY) res.push('ThomasSunday');
        if (diff === EASTER_OFFSETS.ASCENSION) res.push('Ascension');
        if (diff === EASTER_OFFSETS.PENTECOST) res.push('Pentecost');

        if (
            diff >= EASTER_OFFSETS.APOSTLES_FAST &&
            (ctx.date.month < COPTIC_MONTHS.EPIP ||
                (ctx.date.month === COPTIC_MONTHS.EPIP && ctx.date.day < 5))
        ) {
            res.push('ApostlesFast');
        }
        return res;
    },

    // 4. Paramoun (Vigil) Logic
    // source: Coptic Heritage
    // see: https://www.copticheritage.org/paramoun-rite (1-3 day sliding Paramoun duration)
    (ctx: OccasionContext): CopticOccasion[] => {
        const res: CopticOccasion[] = [];
        const feasts = [
            { month: COPTIC_MONTHS.KIAHK, day: 29 }, // Nativity
            { month: COPTIC_MONTHS.TOBI, day: 11 }, // Epiphany
        ];

        for (const feast of feasts) {
            const feastJdn = copticToJDN(ctx.date.year, feast.month, feast.day);
            const currentJdn = copticToJDN(ctx.date.year, ctx.date.month, ctx.date.day);
            const feastDayOfWeek = (feastJdn + 1) % 7;

            const diff = feastJdn - currentJdn;

            if (diff === 1) {
                res.push('Paramoun');
            } else if (diff === 2) {
                if (feastDayOfWeek === 0 || feastDayOfWeek === 1) res.push('Paramoun');
            } else if (diff === 3) {
                if (feastDayOfWeek === 1) res.push('Paramoun');
            }
        }
        return res;
    },
];
