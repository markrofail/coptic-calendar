import { CopticDate } from '../../core/CopticDate.js';
import { EPOCH_JDN, CALENDAR_UNITS } from '../../core/constants.js';
import { COMPUTUS_CONSTANTS } from './constants.js';

/**
 * Executes the Alexandrian Computus to resolve Easter mathematically against Julian/Gregorian offsets.
 *
 * Historical Attribution:
 * - Computed using the Alexandrian Paschalion rules established at the First Council of Nicaea (325 AD).
 * - Follows the cycle of 19 years (Metonic cycle) as established by the Patriarchs of Alexandria.
 * - Source: https://st-takla.org/Coptic-Faith-Creed-Dogma/Coptic-Rite-n-Ritual-Taks-Al-Kanisa/09-Coptic-Liturgical-Calendar__Al-Abakti-Al-Kibti/Coptic-Calendar-01-Introduction.html
 */
export function getEasterForCopticYear(copticYear: number): CopticDate {
    const julianYear = copticYear + COMPUTUS_CONSTANTS.JULIAN_YEAR_OFFSET;
    const a = julianYear % COMPUTUS_CONSTANTS.METONIC_CYCLE;
    const b = julianYear % CALENDAR_UNITS.LEAP_YEAR_CYCLE;
    const c = julianYear % COMPUTUS_CONSTANTS.WEEK_CYCLE;
    const d = (19 * a + 15) % COMPUTUS_CONSTANTS.LUNAR_MONTH_DAYS;
    const e = (2 * b + 4 * c - d + 34) % COMPUTUS_CONSTANTS.WEEK_CYCLE;
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
    const daysSinceEpoch = jdn - EPOCH_JDN.COPTIC;
    const yearOutput = Math.floor((4 * daysSinceEpoch + 1463) / 1461);
    const startOfYearJDN = EPOCH_JDN.COPTIC + 365 * (yearOutput - 1) + Math.floor(yearOutput / 4);
    const dayOfYear = jdn - startOfYearJDN + 1;
    const monthOutput = Math.floor((dayOfYear - 1) / 30) + 1;
    const dayOutput = ((dayOfYear - 1) % 30) + 1;

    return CopticDate.from({ year: yearOutput, month: monthOutput, day: dayOutput });
}
