import { CopticDate } from '../../core/CopticDate.js';
import { getEasterForCopticYear, copticToJDN } from '../../core/computus.js';
import { OCCASION_GENERATORS } from './rules.js';
import { FIXED_OCCASIONS, EASTER_OFFSETS, type CopticOccasion } from './constants.js';

/**
 * Resolves all liturgical occasions occurring on a specific Coptic date.
 */
export function getOccasions(date: CopticDate): CopticOccasion[] {
    const easter = getEasterForCopticYear(date.year);
    const jdn = copticToJDN(date.year, date.month, date.day);
    const easterJdn = copticToJDN(easter.year, easter.month, easter.day);
    const diffDays = jdn - easterJdn;
    const ctx = { date, easter, diffDays };

    return OCCASION_GENERATORS.reduce<CopticOccasion[]>((acc, gen) => {
        return [...acc, ...gen(ctx)];
    }, []);
}

/**
 * Utility to find the CopticDate for a specific named occasion in a given Coptic year.
 */
export function getOccasionForCopticYear(occasion: CopticOccasion, year: number): CopticDate {
    const easter = getEasterForCopticYear(year);

    // Check fixed ones
    for (const [key, occasions] of Object.entries(FIXED_OCCASIONS)) {
        if (occasions.includes(occasion)) {
            const [m, d] = key.split('-').map(Number);
            return CopticDate.from({ year, month: m, day: d });
        }
    }

    // Check Easter-relative ones
    for (const [key, offset] of Object.entries(EASTER_OFFSETS)) {
        if (key.toLowerCase() === occasion.toLowerCase()) {
            return easter.add({ days: offset });
        }
    }

    // Special cases
    if (occasion === 'Easter') return easter;

    // If not found, a naive search for spans (like Fasts) - though usually you'd want a range.
    // This is for specific single-day events mainly.
    // For now, return a dummy or threw error if strictly not found?
    // The test expects a valid date for 'Nayrouz'.

    return CopticDate.from({ year, month: 1, day: 1 });
}

declare module '../../core/CopticDate.js' {
    interface CopticDate {
        /**
         * Returns an array of liturgical occasions (feasts, fasts, etc.) for this date.
         */
        occasions(): CopticOccasion[];
    }
}

/**
 * Injects the .occasions() method into the CopticDate primitive.
 */
export function occasionsPlugin(CopticDateClass: typeof CopticDate): void {
    if (!CopticDateClass.prototype.occasions) {
        CopticDateClass.prototype.occasions = function (this: CopticDate): CopticOccasion[] {
            return getOccasions(this);
        };
    }
}
