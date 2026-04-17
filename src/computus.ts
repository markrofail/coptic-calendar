import { CopticDate } from './CopticDate.js';

export function copticToJDN(year: number, month: number, day: number): number {
    const COPTIC_EPOCH_JDN = 1825030;
    const daysSinceEpoch =
        365 * (year - 1) + Math.floor(year / 4) + 30 * (month - 1) + (day - 1);
    return COPTIC_EPOCH_JDN + daysSinceEpoch;
}

export function jdnToCopticElements(jdn: number): { year: number; month: number; day: number } {
    const COPTIC_EPOCH_JDN = 1825030;
    const daysSinceEpoch = jdn - COPTIC_EPOCH_JDN;
    const year = Math.floor((4 * daysSinceEpoch + 1463) / 1461);
    const startOfYearJDN = COPTIC_EPOCH_JDN + 365 * (year - 1) + Math.floor(year / 4);
    const dayOfYear = jdn - startOfYearJDN + 1;
    const month = Math.floor((dayOfYear - 1) / 30) + 1;
    const day = ((dayOfYear - 1) % 30) + 1;
    return { year, month, day };
}

/**
 * Computes the Julian Day Number (JDN) from a standard Gregorian date.
 * JDN is a continuous integer count of days since January 1, 4713 BC.
 */
export function gregorianToJDN(year: number, month: number, day: number): number {
    if (month < 3) {
        year -= 1;
        month += 12;
    }

    const century = Math.floor(year / 100);
    const leapCenturyCorrection = 2 - century + Math.floor(century / 4);

    return (
        Math.floor(365.25 * (year + 4716)) +
        Math.floor(30.6001 * (month + 1)) +
        day +
        leapCenturyCorrection -
        1524
    );
}

export function jsDateToCopticDate(date: Date): CopticDate {
    const gregYear = date.getFullYear();
    const gregMonth = date.getMonth() + 1;
    const gregDay = date.getDate();
    const jdn = gregorianToJDN(gregYear, gregMonth, gregDay);
    const elements = jdnToCopticElements(jdn);
    return CopticDate.from(elements);
}

/**
 * Executes the Alexandrian Computus to resolve Easter mathematically against Julian/Gregorian offsets.
 */
export function getEasterForCopticYear(copticYear: number): CopticDate {
    const julianYear = copticYear + 284;
    const a = julianYear % 19;
    const b = julianYear % 4;
    const c = julianYear % 7;
    const d = (19 * a + 15) % 30;
    const e = (2 * b + 4 * c - d + 34) % 7;
    const month = Math.floor((d + e + 114) / 31);
    const day = ((d + e + 114) % 31) + 1;

    let y = julianYear;
    let m = month;
    if (m < 3) {
        y -= 1;
        m += 12;
    }
    const jdn = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day - 1524;

    // calculate Coptic Date properties directly using JDN
    const COPTIC_EPOCH_JDN = 1825030;
    const daysSinceEpoch = jdn - COPTIC_EPOCH_JDN;
    const yearOutput = Math.floor((4 * daysSinceEpoch + 1463) / 1461);
    const startOfYearJDN = COPTIC_EPOCH_JDN + 365 * (yearOutput - 1) + Math.floor(yearOutput / 4);
    const dayOfYear = jdn - startOfYearJDN + 1;
    const monthOutput = Math.floor((dayOfYear - 1) / 30) + 1;
    const dayOutput = ((dayOfYear - 1) % 30) + 1;

    return CopticDate.from({ year: yearOutput, month: monthOutput, day: dayOutput });
}
