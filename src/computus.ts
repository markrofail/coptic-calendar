import { CopticDate } from './CopticDate.js';

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

    const daysSince1970 = jdn - 2440588;
    const utcDate = new Date(daysSince1970 * 86400000);
    const localDate = new Date();
    localDate.setFullYear(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate());
    localDate.setHours(0, 0, 0, 0);

    return new CopticDate(localDate);
}
