import { CopticDate } from '../CopticDate.js';
import { EASTER_OFFSETS, COPTIC_MONTHS, type CopticOccasion } from '../constants.js';
import { getEasterForCopticYear, copticToJDN } from '../computus.js';

export function getOccasionForCopticYear(occasion: CopticOccasion, year: number): CopticDate {
    switch (occasion) {
        case 'Nayrouz': return CopticDate.from({ year, month: COPTIC_MONTHS.THOUT, day: 1 });
        case 'FeastOfTheCross': return CopticDate.from({ year, month: COPTIC_MONTHS.THOUT, day: 17 });
        case 'NativityFast': return CopticDate.from({ year, month: COPTIC_MONTHS.HATHOR, day: 16 });
        case 'Nativity': return CopticDate.from({ year, month: COPTIC_MONTHS.KIAHK, day: 29 });
        case 'Circumcision': return CopticDate.from({ year, month: COPTIC_MONTHS.TOBI, day: 6 });
        case 'Theophany': return CopticDate.from({ year, month: COPTIC_MONTHS.TOBI, day: 11 });
        case 'WeddingAtCana': return CopticDate.from({ year, month: COPTIC_MONTHS.TOBI, day: 13 });
        case 'EntranceToTemple': return CopticDate.from({ year, month: COPTIC_MONTHS.MESHIR, day: 8 });
        case 'Annunciation': return CopticDate.from({ year, month: COPTIC_MONTHS.PAREMHAT, day: 29 });
        case 'FlightIntoEgypt': return CopticDate.from({ year, month: COPTIC_MONTHS.PASHONS, day: 24 });
        case 'StMarysFast': return CopticDate.from({ year, month: COPTIC_MONTHS.MESORI, day: 1 });
        case 'Transfiguration': return CopticDate.from({ year, month: COPTIC_MONTHS.MESORI, day: 13 });

        case 'Easter': return getEasterForCopticYear(year);
        case 'JonahsFast': return getEasterForCopticYear(year).add({ days: EASTER_OFFSETS.JONAHS_FAST_START });
        case 'Lent': return getEasterForCopticYear(year).add({ days: EASTER_OFFSETS.LENT });
        case 'PalmSunday': return getEasterForCopticYear(year).add({ days: EASTER_OFFSETS.PALM_SUNDAY });
        case 'CovenantThursday': return getEasterForCopticYear(year).add({ days: EASTER_OFFSETS.COVENANT_THURSDAY });
        case 'ThomasSunday': return getEasterForCopticYear(year).add({ days: EASTER_OFFSETS.THOMAS_SUNDAY });
        case 'Ascension': return getEasterForCopticYear(year).add({ days: EASTER_OFFSETS.ASCENSION });
        case 'Pentecost': return getEasterForCopticYear(year).add({ days: EASTER_OFFSETS.PENTECOST });
        case 'ApostlesFast': return getEasterForCopticYear(year).add({ days: EASTER_OFFSETS.APOSTLES_FAST });

        default: throw new Error(`Unknown occasion: ${occasion}`);
    }
}

const FIXED_OCCASIONS: Record<string, CopticOccasion[]> = {
    "1-1": ["Nayrouz"],
    "1-17": ["FeastOfTheCross"],
    "4-29": ["Nativity"],
    "5-6": ["Circumcision"],
    "5-11": ["Theophany"],
    "5-13": ["WeddingAtCana"],
    "6-8": ["EntranceToTemple"],
    "7-29": ["Annunciation"],
    "9-24": ["FlightIntoEgypt"],
    "12-13": ["Transfiguration"]
};

export function getOccasionsOnCopticDate(date: CopticDate): CopticOccasion[] {
    const year = date.year;
    const month = date.month;
    const day = date.day;
    const results: CopticOccasion[] = [];

    // 1. O(1) Fixed Feasts Lookup
    const key = `${month}-${day}`;
    const fixedFeasts = FIXED_OCCASIONS[key];
    if (fixedFeasts) results.push(...fixedFeasts);

    // Fixed Fasts (Spans)
    if (month === COPTIC_MONTHS.MESORI && day >= 1 && day <= 15) results.push('StMarysFast');
    if ((month === COPTIC_MONTHS.HATHOR && day >= 16) || (month === COPTIC_MONTHS.KIAHK && day < 29)) results.push('NativityFast');

    // 2. Evaluate Floating Feasts (Mathematical diff against Easter)
    const easter = getEasterForCopticYear(year);
    const easterJdn = copticToJDN(easter.year, easter.month, easter.day);
    const currentJdn = copticToJDN(date.year, date.month, date.day);
    const diffDays = currentJdn - easterJdn;

    if (diffDays === 0) results.push('Easter');
    if (diffDays >= EASTER_OFFSETS.LENT && diffDays < 0) results.push('Lent');
    if (diffDays >= EASTER_OFFSETS.JONAHS_FAST_START && diffDays <= EASTER_OFFSETS.JONAHS_FAST_END) results.push('JonahsFast');
    if (diffDays === EASTER_OFFSETS.PALM_SUNDAY) results.push('PalmSunday');
    if (diffDays === EASTER_OFFSETS.COVENANT_THURSDAY) results.push('CovenantThursday');
    if (diffDays === EASTER_OFFSETS.THOMAS_SUNDAY) results.push('ThomasSunday');
    if (diffDays === EASTER_OFFSETS.ASCENSION) results.push('Ascension');
    if (diffDays === EASTER_OFFSETS.PENTECOST) results.push('Pentecost');

    // Apostles Fast (Pentecost + 1 until Epip 4)
    if (diffDays >= EASTER_OFFSETS.APOSTLES_FAST && (month < COPTIC_MONTHS.EPIP || (month === COPTIC_MONTHS.EPIP && day < 5))) results.push('ApostlesFast');

    return Array.from(new Set(results));
}

declare module '../CopticDate.js' {
    interface CopticDate {
        /**
         * Resolves ecclesiastical Feasts natively dynamically tracking against Alexandrian formulas.
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
            return getOccasionsOnCopticDate(this);
        };
    }
}
