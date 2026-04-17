import { CopticDate } from './CopticDate.js';
import { EPOCH_JDN, CALENDAR_UNITS } from './constants.js';

/**
 * Converts a Coptic date to a Julian Day Number (JDN).
 *
 * Mathematical Context:
 * - This implementation uses the epoch JDN of 1825030 (Aug 29, 284 AD in the Julian Calendar).
 */
export function copticToJDN(year: number, month: number, day: number): number {
    const daysSinceEpoch =
        CALENDAR_UNITS.DAYS_IN_YEAR * (year - 1) +
        Math.floor(year / CALENDAR_UNITS.LEAP_YEAR_CYCLE) +
        CALENDAR_UNITS.DAYS_IN_MONTH * (month - 1) +
        (day - 1);
    return EPOCH_JDN.COPTIC + daysSinceEpoch;
}

export function jdnToCopticElements(jdn: number): { year: number; month: number; day: number } {
    const daysSinceEpoch = jdn - EPOCH_JDN.COPTIC;
    // 1461 is the days in 4 years (365*4 + 1)
    const year = Math.floor((4 * daysSinceEpoch + 1463) / 1461);
    const startOfYearJDN =
        EPOCH_JDN.COPTIC +
        CALENDAR_UNITS.DAYS_IN_YEAR * (year - 1) +
        Math.floor(year / CALENDAR_UNITS.LEAP_YEAR_CYCLE);
    const dayOfYear = jdn - startOfYearJDN + 1;
    const month = Math.floor((dayOfYear - 1) / CALENDAR_UNITS.DAYS_IN_MONTH) + 1;
    const day = ((dayOfYear - 1) % CALENDAR_UNITS.DAYS_IN_MONTH) + 1;
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

