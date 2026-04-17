import { type CopticOccasion } from '../../core/constants.js';

export type Tune = 'Annual' | 'Kiahk' | 'Joyful' | 'Fasting' | 'Lenten' | 'PalmSunday' | 'HolyWeek' | 'Paramoun';

export interface LiturgicalRite {
    season: string;
    tune: Tune;
    hasMetanoias: boolean;
}

export const LORD_FEASTS: CopticOccasion[] = [
    'Nativity', 'Theophany', 'Annunciation', 'Ascension',
    'Circumcision', 'WeddingAtCana', 'EntranceToTemple',
    'FlightIntoEgypt', 'Transfiguration', 'CovenantThursday', 'ThomasSunday'
];
