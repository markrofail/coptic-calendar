/**
 * Standard English names for the 13 Coptic Months.
 */
export const COPTIC_MONTH_NAMES = [
    '', // 1-indexed to match month numbers
    'Thout',
    'Paopi',
    'Hathor',
    'Koiak',
    'Tobi',
    'Meshir',
    'Paremhat',
    'Parmouti',
    'Pashons',
    'Paoni',
    'Epip',
    'Mesori',
    'Pi Kogi Enavot', // Also known as Nasie
];

/**
 * Numeric indices mapping directly to Coptic canonical months.
 */
export const COPTIC_MONTHS = {
    THOUT: 1,
    PAOPI: 2,
    HATHOR: 3,
    KIAHK: 4,
    TOBI: 5,
    MESHIR: 6,
    PAREMHAT: 7,
    PARMOUTI: 8,
    PASHONS: 9,
    PAONI: 10,
    EPIP: 11,
    MESORI: 12,
    NASIE: 13,
} as const;

/**
 * Epoch Julian Day Numbers.
 */
export const EPOCH_JDN = {
    COPTIC: 1825030,
    GREGORIAN_BASE: 1721426, // Reference for JDN algorithms
} as const;

/**
 * Fundamental calendar units.
 */
export const CALENDAR_UNITS = {
    DAYS_IN_YEAR: 365,
    DAYS_IN_LEAP_YEAR: 366,
    DAYS_IN_MONTH: 30,
    MONTHS_IN_YEAR: 13,
    LEAP_YEAR_CYCLE: 4,
    LEAP_YEAR_REMAINDER: 3, // Coptic leap year is year % 4 === 3
} as const;

/**
 * Offsets and cycle constants for the Alexandrian Computus.
 */
export const COMPUTUS_CONSTANTS = {
    JULIAN_YEAR_OFFSET: 284, // Anno Martyrum
    METONIC_CYCLE: 19,
    WEEK_CYCLE: 7,
    LUNAR_MONTH_DAYS: 30,
} as const;
