import { COPTIC_MONTHS } from '../../core/constants.js';

/**
 * Array of all valid Coptic occasions logically mapped by the library.
 */
export const ALL_COPTIC_OCCASIONS = [
    'Annunciation',
    'Nativity',
    'Theophany',
    'PalmSunday',
    'Easter',
    'Ascension',
    'Pentecost',
    'Circumcision',
    'EntranceToTemple',
    'FlightIntoEgypt',
    'WeddingAtCana',
    'Transfiguration',
    'CovenantThursday',
    'ThomasSunday',
    'Lent',
    'JonahsFast',
    'JonahsPassover',
    'ApostlesFast',
    'StMarysFast',
    'NativityFast',
    'Nayrouz',
    'FeastOfTheCross',
    'Paramoun',
] as const;

/**
 * Valid string literals mapping to Coptic Feasts and Fasting seasons.
 */
export type CopticOccasion = (typeof ALL_COPTIC_OCCASIONS)[number];

/**
 * Offsets in days from Easter for floating ecclesiastical events.
 */
export const EASTER_OFFSETS = {
    JONAHS_FAST_START: -69,
    JONAHS_FAST_END: -67,
    JONAHS_PASSOVER: -66,
    LENT: -55,
    PALM_SUNDAY: -7,
    COVENANT_THURSDAY: -3,
    THOMAS_SUNDAY: 7,
    ASCENSION: 39,
    PENTECOST: 49,
    APOSTLES_FAST: 50,
} as const;

export const FIXED_OCCASIONS: Record<string, CopticOccasion[]> = {
    [`${COPTIC_MONTHS.THOUT}-1`]: ['Nayrouz'],
    [`${COPTIC_MONTHS.THOUT}-17`]: ['FeastOfTheCross'],
    [`${COPTIC_MONTHS.KIAHK}-29`]: ['Nativity'],
    [`${COPTIC_MONTHS.TOBI}-6`]: ['Circumcision'],
    [`${COPTIC_MONTHS.TOBI}-11`]: ['Theophany'],
    [`${COPTIC_MONTHS.TOBI}-13`]: ['WeddingAtCana'],
    [`${COPTIC_MONTHS.TOBI}-13`]: ['WeddingAtCana'],
    [`${COPTIC_MONTHS.MESHIR}-8`]: ['EntranceToTemple'],
    [`${COPTIC_MONTHS.PAREMHAT}-29`]: ['Annunciation'],
    [`${COPTIC_MONTHS.PASHONS}-24`]: ['FlightIntoEgypt'],
    [`${COPTIC_MONTHS.MESORI}-13`]: ['Transfiguration'],
};

/**
 * Offsets and cycle constants for the Alexandrian Computus.
 */
export const COMPUTUS_CONSTANTS = {
    JULIAN_YEAR_OFFSET: 284, // Anno Martyrum
    METONIC_CYCLE: 19,
    WEEK_CYCLE: 7,
    LUNAR_MONTH_DAYS: 30,
} as const;
