import { CopticDate } from '../../core/CopticDate.js';
import { COPTIC_MONTHS } from '../../core/constants.js';
import { type CopticOccasion, EASTER_OFFSETS } from '../occasions/constants.js';
import type { Rule } from '../../core/RuleEngine.js';
import { type LiturgicalRite } from './index.js';
import { LORD_FEASTS } from './constants.js';

export interface TypiconContext {
    date: CopticDate;
    occasions: CopticOccasion[];
    jdn: number;
    dayOfWeek: number;
    isSunday: boolean;
    isWeekend: boolean;
    diffDaysFromEaster: number;
}

export const TYPICON_RULES: Rule<TypiconContext, LiturgicalRite>[] = [
    {
        name: 'HolyWeek',
        priority: 10,
        // source: Tasbeha.org
        // see: https://tasbeha.org/hymn_library/view/10 (Metanoia suppression and specific Holy Week tunes)
        condition: (ctx) =>
            ctx.diffDaysFromEaster > EASTER_OFFSETS.PALM_SUNDAY && ctx.diffDaysFromEaster < 0,
        apply: () => ({ season: 'HolyWeek', tune: 'HolyWeek', hasMetanoias: false }),
    },
    {
        name: 'PalmSunday',
        priority: 20,
        // source: SUS Copts
        // see: https://suscopts.org/scs/spiritual/index.php?option=com_content&view=article&id=516&Itemid=561 (Lordly Feasts - Major)
        condition: (ctx) => ctx.diffDaysFromEaster === EASTER_OFFSETS.PALM_SUNDAY,
        apply: () => ({ season: 'PalmSunday', tune: 'PalmSunday', hasMetanoias: false }),
    },
    {
        name: 'FeastOfTheCross',
        priority: 21,
        // source: SUS Copts
        // see: https://suscopts.org/scs/spiritual/index.php?option=com_content&view=article&id=516&Itemid=561 (Feast of the Cross - Minor Lordly Feast)
        condition: (ctx) => ctx.occasions.includes('FeastOfTheCross'),
        apply: () => ({ season: 'FeastOfTheCross', tune: 'PalmSunday', hasMetanoias: false }),
    },
    {
        name: 'Pentecost',
        priority: 30,
        // source: Tasbeha.org
        // see: https://tasbeha.org/hymn_library/view/630 (The Holy 50 Days - Joyful tune, no metanoias)
        condition: (ctx) =>
            ctx.diffDaysFromEaster >= 0 && ctx.diffDaysFromEaster <= EASTER_OFFSETS.PENTECOST,
        apply: () => ({ season: 'Pentecost', tune: 'Joyful', hasMetanoias: false }),
    },
    {
        name: 'MajorMinorFeasts',
        priority: 40,
        // source: SUS Copts
        // see: https://suscopts.org/scs/spiritual/index.php?option=com_content&view=article&id=516&Itemid=561 (7 Major, 7 Minor Feasts)
        condition: (ctx: TypiconContext): boolean => {
            return LORD_FEASTS.some((f) => ctx.occasions.includes(f));
        },
        apply: (ctx: TypiconContext): LiturgicalRite => {
            const activeFeast = LORD_FEASTS.find((f) => ctx.occasions.includes(f)) ?? 'Annual';
            return { season: activeFeast, tune: 'Joyful', hasMetanoias: false };
        },
    },
    {
        name: 'CommemorationOfLord',
        priority: 50,
        // source: LACopts
        // see: https://lacopts.org/rite/rite-of-the-29th-of-the-month/ (Rite of the 29th - Exclude Tobi/Meshir)
        condition: (ctx) =>
            ctx.date.day === 29 &&
            ctx.date.month !== COPTIC_MONTHS.TOBI &&
            ctx.date.month !== COPTIC_MONTHS.MESHIR,
        apply: () => ({ season: 'CommemorationOfLord', tune: 'Joyful', hasMetanoias: false }),
    },
    {
        name: 'Nayrouz',
        priority: 60,
        // source: SUS Copts
        // see: https://suscopts.org/scs/spiritual/index.php?option=com_content&view=article&id=516&Itemid=561 (Nayrouz - Coptic New Year)
        condition: (ctx) => ctx.occasions.includes('Nayrouz'),
        apply: () => ({ season: 'Nayrouz', tune: 'Joyful', hasMetanoias: false }),
    },
    {
        name: 'Paramoun',
        priority: 65,
        // source: Coptic Heritage
        // see: https://www.copticheritage.org/paramoun-rite (The Paramoun Rite)
        condition: (ctx) => ctx.occasions.includes('Paramoun'),
        apply: () => ({ season: 'Paramoun', tune: 'Annual', hasMetanoias: true }),
    },
    {
        name: 'Kiahk',
        priority: 70,
        // source: LACopts
        // see: https://lacopts.org/rite/the-rite-of-kiahk/ (The Rite of Kiahk)
        condition: (ctx) => ctx.date.month === COPTIC_MONTHS.KIAHK,
        apply: (ctx) => ({ season: 'Kiahk', tune: 'Kiahk', hasMetanoias: !ctx.isSunday }),
    },
    {
        name: 'JonahsFast',
        priority: 80,
        // source: SUS Copts
        // see: https://suscopts.org/coptic-orthodox-church/fasts/ (Jonah's Fast)
        condition: (ctx) =>
            ctx.diffDaysFromEaster >= EASTER_OFFSETS.JONAHS_FAST_START &&
            ctx.diffDaysFromEaster <= EASTER_OFFSETS.JONAHS_FAST_END,
        apply: () => ({ season: 'JonahsFast', tune: 'Lenten', hasMetanoias: true }),
    },
    {
        name: 'JonahsPassover',
        priority: 81,
        // source: SUS Copts
        // see: https://suscopts.org/coptic-orthodox-church/fasts/ (Jonah's Passover)
        condition: (ctx) => ctx.diffDaysFromEaster === EASTER_OFFSETS.JONAHS_PASSOVER,
        apply: () => ({ season: 'JonahsPassover', tune: 'Annual', hasMetanoias: false }),
    },
    {
        name: 'GreatLent',
        priority: 90,
        // source: SUS Copts
        // see: https://suscopts.org/coptic-orthodox-church/fasts/great-lent/ (Great Lent)
        condition: (ctx) =>
            ctx.diffDaysFromEaster >= EASTER_OFFSETS.LENT &&
            ctx.diffDaysFromEaster < EASTER_OFFSETS.PALM_SUNDAY,
        apply: (ctx: TypiconContext): LiturgicalRite => {
            if (ctx.isWeekend) {
                return { season: 'GreatLent', tune: 'Fasting', hasMetanoias: false };
            }
            return { season: 'GreatLent', tune: 'Lenten', hasMetanoias: true };
        },
    },
    {
        name: 'GeneralFasts',
        priority: 100,
        // source: St-Takla
        // see: https://st-takla.org/Saints/Coptic-Orthodox-Saints-Biography/Saints-Story_239.html (Apostles Fast end Epip 5)
        condition: (ctx: TypiconContext): boolean => {
            const generalFasts: CopticOccasion[] = ['NativityFast', 'ApostlesFast', 'StMarysFast'];
            return generalFasts.some((f) => ctx.occasions.includes(f));
        },
        apply: (ctx: TypiconContext): LiturgicalRite => {
            const generalFasts: CopticOccasion[] = ['NativityFast', 'ApostlesFast', 'StMarysFast'];
            const activeFast = generalFasts.find((f) => ctx.occasions.includes(f)) ?? 'Annual';
            return { season: activeFast, tune: 'Fasting', hasMetanoias: !ctx.isWeekend };
        },
    },
    {
        name: 'Annual',
        priority: 1000,
        // source: LACopts
        // see: https://lacopts.org/rites/ (Standard Annual Rite)
        condition: () => true,
        apply: (ctx) => ({ season: 'Annual', tune: 'Annual', hasMetanoias: !ctx.isSunday }),
    },
];
