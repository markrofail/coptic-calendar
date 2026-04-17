import { CopticDate } from '../../core/CopticDate.js';
import { copticToJDN } from '../../core/computus.js';
import { getEasterForCopticYear } from './computus.js';
import { OCCASION_GENERATORS } from './rules.js';
import { FIXED_OCCASIONS, EASTER_OFFSETS, type CopticOccasion } from './constants.js';
import { type Locale } from '../../core/i18n.js';
import { translateOccasion } from './i18n.js';

export { getEasterForCopticYear };

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
            return CopticDate.from({ year, month: m ?? 1, day: d ?? 1 });
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

    // Fallback to Thout 1 if strictly not found (Nayrouz)
    return CopticDate.from({ year, month: 1, day: 1 });
}

declare module '../../core/CopticDate.js' {
    interface CopticDate {
        /**
         * Returns an array of liturgical occasions (feasts, fasts, etc.) for this date.
         * If locale is provided, returns localized names.
         */
        occasions(opts?: { locale?: Locale }): string[];

        /**
         * Returns the CopticDate of the given occasion in the same year as this date.
         */
        when(occasion: CopticOccasion): CopticDate;

        /**
         * Returns the next occurrence of the given occasion relative to this date.
         */
        next(occasion: CopticOccasion): CopticDate;
    }
}

/**
 * Injects liturgical methods into the CopticDate primitive.
 */
export function occasionsPlugin(CopticDateClass: typeof CopticDate): void {
    if (!CopticDateClass.prototype.occasions) {
        CopticDateClass.prototype.occasions = function (
            this: CopticDate,
            opts?: { locale?: Locale },
        ): string[] {
            const raw = getOccasions(this);
            if (opts?.locale) {
                const locale = opts.locale;
                return raw.map((occ) => translateOccasion(occ, locale));
            }
            return raw;
        };
    }

    if (!CopticDateClass.prototype.when) {
        CopticDateClass.prototype.when = function (
            this: CopticDate,
            occasion: CopticOccasion,
        ): CopticDate {
            return getOccasionForCopticYear(occasion, this.year);
        };
    }

    if (!CopticDateClass.prototype.next) {
        CopticDateClass.prototype.next = function (
            this: CopticDate,
            occasion: CopticOccasion,
        ): CopticDate {
            const thisYearOccasion = getOccasionForCopticYear(occasion, this.year);
            const thisJdn = copticToJDN(this.year, this.month, this.day);
            const occJdn = copticToJDN(
                thisYearOccasion.year,
                thisYearOccasion.month,
                thisYearOccasion.day,
            );

            if (occJdn > thisJdn) {
                return thisYearOccasion;
            }

            return getOccasionForCopticYear(occasion, this.year + 1);
        };
    }
}
