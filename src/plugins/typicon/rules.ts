import { CopticDate } from '../../core/CopticDate.js';
import { EASTER_OFFSETS, COPTIC_MONTHS, type CopticOccasion } from '../../core/constants.js';
import type { Rule } from '../../core/RuleEngine.js';
import { type LiturgicalRite, LORD_FEASTS } from './constants.js';

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
        condition: (ctx) => ctx.diffDaysFromEaster > EASTER_OFFSETS.PALM_SUNDAY && ctx.diffDaysFromEaster < 0,
        apply: () => ({ season: 'HolyWeek', tune: 'HolyWeek', hasMetanoias: false })
    },
    {
        name: 'PalmSunday',
        priority: 20,
        condition: (ctx) => ctx.diffDaysFromEaster === EASTER_OFFSETS.PALM_SUNDAY,
        apply: () => ({ season: 'PalmSunday', tune: 'PalmSunday', hasMetanoias: false })
    },
    {
        name: 'FeastOfTheCross',
        priority: 21,
        condition: (ctx) => ctx.occasions.includes('FeastOfTheCross'),
        apply: () => ({ season: 'FeastOfTheCross', tune: 'PalmSunday', hasMetanoias: false })
    },
    {
        name: 'Pentecost',
        priority: 30,
        condition: (ctx) => ctx.diffDaysFromEaster >= 0 && ctx.diffDaysFromEaster <= EASTER_OFFSETS.PENTECOST,
        apply: () => ({ season: 'Pentecost', tune: 'Joyful', hasMetanoias: false })
    },
    {
        name: 'MajorMinorFeasts',
        priority: 40,
        condition: (ctx: TypiconContext): boolean => {
            return LORD_FEASTS.some(f => ctx.occasions.includes(f));
        },
        apply: (ctx: TypiconContext): LiturgicalRite => {
            const activeFeast = LORD_FEASTS.find(f => ctx.occasions.includes(f)) ?? 'Annual';
            return { season: activeFeast, tune: 'Joyful', hasMetanoias: false };
        }
    },
    {
        name: 'CommemorationOfLord',
        priority: 50,
        condition: (ctx) => ctx.date.day === 29 && ctx.date.month !== COPTIC_MONTHS.TOBI && ctx.date.month !== COPTIC_MONTHS.MESHIR,
        apply: () => ({ season: 'CommemorationOfLord', tune: 'Joyful', hasMetanoias: false })
    },
    {
        name: 'Nayrouz',
        priority: 60,
        condition: (ctx) => ctx.occasions.includes('Nayrouz'),
        apply: () => ({ season: 'Nayrouz', tune: 'Joyful', hasMetanoias: false })
    },
    {
        name: 'Paramoun',
        priority: 65,
        condition: (ctx) => ctx.occasions.includes('Paramoun'),
        apply: () => ({ season: 'Paramoun', tune: 'Annual', hasMetanoias: true })
    },
    {
        name: 'Kiahk',
        priority: 70,
        condition: (ctx) => ctx.date.month === COPTIC_MONTHS.KIAHK,
        apply: (ctx) => ({ season: 'Kiahk', tune: 'Kiahk', hasMetanoias: !ctx.isSunday })
    },
    {
        name: 'JonahsFast',
        priority: 80,
        condition: (ctx) => ctx.diffDaysFromEaster >= EASTER_OFFSETS.JONAHS_FAST_START && ctx.diffDaysFromEaster <= EASTER_OFFSETS.JONAHS_FAST_END,
        apply: () => ({ season: 'JonahsFast', tune: 'Lenten', hasMetanoias: true })
    },
    {
        name: 'JonahsPassover',
        priority: 81,
        condition: (ctx) => ctx.diffDaysFromEaster === EASTER_OFFSETS.JONAHS_PASSOVER,
        apply: () => ({ season: 'JonahsPassover', tune: 'Annual', hasMetanoias: false })
    },
    {
        name: 'GreatLent',
        priority: 90,
        condition: (ctx) => ctx.diffDaysFromEaster >= EASTER_OFFSETS.LENT && ctx.diffDaysFromEaster < EASTER_OFFSETS.PALM_SUNDAY,
        apply: (ctx: TypiconContext): LiturgicalRite => {
            if (ctx.isWeekend) {
                return { season: 'GreatLent', tune: 'Fasting', hasMetanoias: false };
            }
            return { season: 'GreatLent', tune: 'Lenten', hasMetanoias: true };
        }
    },
    {
        name: 'GeneralFasts',
        priority: 100,
        condition: (ctx: TypiconContext): boolean => {
            const generalFasts: CopticOccasion[] = ['NativityFast', 'ApostlesFast', 'StMarysFast'];
            return generalFasts.some(f => ctx.occasions.includes(f));
        },
        apply: (ctx: TypiconContext): LiturgicalRite => {
            const generalFasts: CopticOccasion[] = ['NativityFast', 'ApostlesFast', 'StMarysFast'];
            const activeFast = generalFasts.find(f => ctx.occasions.includes(f)) ?? 'Annual';
            return { season: activeFast, tune: 'Fasting', hasMetanoias: !ctx.isWeekend };
        }
    },
    {
        name: 'Annual',
        priority: 1000,
        condition: () => true,
        apply: (ctx) => ({ season: 'Annual', tune: 'Annual', hasMetanoias: !ctx.isSunday })
    }
];
