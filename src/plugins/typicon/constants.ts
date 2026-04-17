import { type CopticOccasion } from '../occasions/constants.js';

export const TUNE_NAMES = [
    'Annual',
    'Kiahk',
    'Joyful',
    'Fasting',
    'Lenten',
    'PalmSunday',
    'HolyWeek',
    'Paramoun',
] as const;

export type Tune = (typeof TUNE_NAMES)[number];

export interface LiturgicalRite {
    season: string;
    tune: string;
    hasMetanoias: boolean;
}

export const LORD_FEASTS: CopticOccasion[] = [
    'Nativity',
    'Theophany',
    'Annunciation',
    'Ascension',
    'Circumcision',
    'WeddingAtCana',
    'EntranceToTemple',
    'FlightIntoEgypt',
    'Transfiguration',
    'CovenantThursday',
    'ThomasSunday',
];
