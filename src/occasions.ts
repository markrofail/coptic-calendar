import { CopticDate } from './CopticDate.js';
import type { CopticOccasion } from './constants.js';
import { getEasterForCopticYear } from './computus.js';

export function getOccasionForCopticYear(occasion: CopticOccasion, year: number): CopticDate {
    switch (occasion) {
        case 'Nayrouz': return CopticDate.fromComponents(year, 1, 1);
        case 'FeastOfTheCross': return CopticDate.fromComponents(year, 1, 17);
        case 'NativityFast': return CopticDate.fromComponents(year, 3, 16);
        case 'Nativity': return CopticDate.fromComponents(year, 4, 29);
        case 'Circumcision': return CopticDate.fromComponents(year, 5, 6);
        case 'Theophany': return CopticDate.fromComponents(year, 5, 11);
        case 'WeddingAtCana': return CopticDate.fromComponents(year, 5, 13);
        case 'EntranceToTemple': return CopticDate.fromComponents(year, 6, 8);
        case 'Annunciation': return CopticDate.fromComponents(year, 7, 29);
        case 'FlightIntoEgypt': return CopticDate.fromComponents(year, 9, 24);
        case 'StMarysFast': return CopticDate.fromComponents(year, 12, 1);
        case 'Transfiguration': return CopticDate.fromComponents(year, 12, 13);

        case 'Easter': return getEasterForCopticYear(year);
        case 'JonahsFast': return getEasterForCopticYear(year).addDays(-69);
        case 'Lent': return getEasterForCopticYear(year).addDays(-55);
        case 'PalmSunday': return getEasterForCopticYear(year).addDays(-7);
        case 'CovenantThursday': return getEasterForCopticYear(year).addDays(-3);
        case 'ThomasSunday': return getEasterForCopticYear(year).addDays(7);
        case 'Ascension': return getEasterForCopticYear(year).addDays(39);
        case 'Pentecost': return getEasterForCopticYear(year).addDays(49);
        case 'ApostlesFast': return getEasterForCopticYear(year).addDays(50);

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
    if (month === 12 && day >= 1 && day <= 15) results.push('StMarysFast');
    if ((month === 3 && day >= 16) || (month === 4 && day < 29)) results.push('NativityFast');

    // 2. Evaluate Floating Feasts (Mathematical diff against Easter)
    const easter = getEasterForCopticYear(year);
    const easterTime = easter.toJSDate().getTime();
    const currentTime = date.toJSDate().getTime();
    const diffDays = Math.round((currentTime - easterTime) / 86400000);

    if (diffDays === 0) results.push('Easter');
    if (diffDays >= -55 && diffDays < 0) results.push('Lent');
    if (diffDays >= -69 && diffDays <= -67) results.push('JonahsFast');
    if (diffDays === -7) results.push('PalmSunday');
    if (diffDays === -3) results.push('CovenantThursday');
    if (diffDays === 7) results.push('ThomasSunday');
    if (diffDays === 39) results.push('Ascension');
    if (diffDays === 49) results.push('Pentecost');

    // Apostles Fast (Pentecost + 1 until Epip 4)
    if (diffDays >= 50 && (month < 11 || (month === 11 && day < 5))) results.push('ApostlesFast');

    return Array.from(new Set(results));
}
