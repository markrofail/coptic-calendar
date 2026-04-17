import { COPTIC_MONTHS, type CopticOccasion } from '../../core/constants.js';

export const FIXED_OCCASIONS: Record<string, CopticOccasion[]> = {
    [`${COPTIC_MONTHS.THOUT}-1`]: ["Nayrouz"],
    [`${COPTIC_MONTHS.THOUT}-17`]: ["FeastOfTheCross"],
    [`${COPTIC_MONTHS.KIAHK}-29`]: ["Nativity"],
    [`${COPTIC_MONTHS.TOBI}-6`]: ["Circumcision"],
    [`${COPTIC_MONTHS.TOBI}-11`]: ["Theophany"],
    [`${COPTIC_MONTHS.TOBI}-13`]: ["WeddingAtCana"],
    [`${COPTIC_MONTHS.MESHIR}-8`]: ["EntranceToTemple"],
    [`${COPTIC_MONTHS.PAREMHAT}-29`]: ["Annunciation"],
    [`${COPTIC_MONTHS.PASHONS}-24`]: ["FlightIntoEgypt"],
    [`${COPTIC_MONTHS.MESORI}-13`]: ["Transfiguration"]
};
