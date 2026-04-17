

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
    'ApostlesFast',
    'StMarysFast',
    'NativityFast',
    'Nayrouz',
    'FeastOfTheCross',
] as const;

/**
 * Valid string literals mapping to Coptic Feasts and Fasting seasons.
 */
export type CopticOccasion = (typeof ALL_COPTIC_OCCASIONS)[number];

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
    'Piikougi Enavot',
];
