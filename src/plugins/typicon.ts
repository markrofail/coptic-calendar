import { CopticDate } from '../CopticDate.js';
import { getOccasionsOnCopticDate } from './occasions.js';
import { getEasterForCopticYear, copticToJDN } from '../computus.js';
import { EASTER_OFFSETS, COPTIC_MONTHS, type CopticOccasion } from '../constants.js';

export type Tune = 'Annual' | 'Kiahk' | 'Joyful' | 'Fasting' | 'Lenten' | 'PalmSunday' | 'HolyWeek' | 'Paramoun';

export interface LiturgicalRite {
    season: string;
    tune: Tune;
    hasMetanoias: boolean;
}

export function getLiturgicalRite(date: CopticDate): LiturgicalRite {
    const occasions = getOccasionsOnCopticDate(date);
    const jdn = copticToJDN(date.year, date.month, date.day);
    const dayOfWeek = (jdn + 1) % 7; // 0 = Sunday, 6 = Saturday
    const isSunday = dayOfWeek === 0;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const easter = getEasterForCopticYear(date.year);
    const easterJdn = copticToJDN(easter.year, easter.month, easter.day);
    const diffDaysFromEaster = jdn - easterJdn;

    // 1. Highest Priority: Holy Week (Pascha)
    if (diffDaysFromEaster > EASTER_OFFSETS.PALM_SUNDAY && diffDaysFromEaster < 0) {
        return { season: 'HolyWeek', tune: 'HolyWeek', hasMetanoias: false };
    }

    // 2. Shaanini (Palm Sunday / Feast of the Cross)
    if (diffDaysFromEaster === EASTER_OFFSETS.PALM_SUNDAY) {
        return { season: 'PalmSunday', tune: 'PalmSunday', hasMetanoias: false };
    }
    if (occasions.includes('FeastOfTheCross')) {
        return { season: 'FeastOfTheCross', tune: 'PalmSunday', hasMetanoias: false };
    }

    // 3. Holy 50 Days (Pentecost - pure Joyful, no metanoias)
    if (diffDaysFromEaster >= 0 && diffDaysFromEaster <= EASTER_OFFSETS.PENTECOST) {
        return { season: 'Pentecost', tune: 'Joyful', hasMetanoias: false };
    }

    // 4. Feasts of the Lord (Major & Minor) - forcefully override fasts
    const lordFeasts: CopticOccasion[] = ['Nativity', 'Theophany', 'Annunciation', 'Ascension', 'Circumcision', 'WeddingAtCana', 'EntranceToTemple', 'FlightIntoEgypt', 'Transfiguration'];
    for (const feast of lordFeasts) {
        if (occasions.includes(feast)) {
            return { season: feast, tune: 'Joyful', hasMetanoias: false };
        }
    }

    // 5. 29th of the Month (Joyful commemoration of Annunciation/Nativity/Resurrection)
    if (date.day === 29 && date.month !== COPTIC_MONTHS.TOBI && date.month !== COPTIC_MONTHS.MESHIR) {
        return { season: 'CommemorationOfLord', tune: 'Joyful', hasMetanoias: false };
    }

    // 6. Nayrouz Phase (Feast of the New Year)
    if (occasions.includes('Nayrouz')) {
        return { season: 'Nayrouz', tune: 'Joyful', hasMetanoias: false };
    }

    // 7. Month of Kiahk (Kiahk Tune)
    if (date.month === COPTIC_MONTHS.KIAHK) {
        return { season: 'Kiahk', tune: 'Kiahk', hasMetanoias: !isSunday };
    }

    // 8. Jonah's Fast
    if (diffDaysFromEaster >= EASTER_OFFSETS.JONAHS_FAST_START && diffDaysFromEaster <= EASTER_OFFSETS.JONAHS_FAST_END) {
        return { season: 'JonahsFast', tune: 'Lenten', hasMetanoias: true };
    }
    if (diffDaysFromEaster === EASTER_OFFSETS.JONAHS_PASSOVER) { // Jonah's Passover
        return { season: 'JonahsPassover', tune: 'Annual', hasMetanoias: false };
    }

    // 9. Great Lent (excluding Holy Week)
    if (diffDaysFromEaster >= EASTER_OFFSETS.LENT && diffDaysFromEaster < EASTER_OFFSETS.PALM_SUNDAY) {
        if (isWeekend) {
            return { season: 'GreatLent', tune: 'Fasting', hasMetanoias: false };
        }
        return { season: 'GreatLent', tune: 'Lenten', hasMetanoias: true };
    }

    // 10. General Minor Fasts (Apostles, St Mary, Nativity Fast)
    const generalFasts: CopticOccasion[] = ['NativityFast', 'ApostlesFast', 'StMarysFast'];
    for (const fast of generalFasts) {
        if (occasions.includes(fast)) {
            return { season: fast, tune: 'Fasting', hasMetanoias: !isWeekend };
        }
    }

    // 11. Default Annual (Standard Tune)
    return { season: 'Annual', tune: 'Annual', hasMetanoias: !isSunday };
}

declare module '../CopticDate.js' {
    interface CopticDate {
        /**
         * Derives the active canonical Typicon configuration constraints automatically.
         */
        rite(): LiturgicalRite;
    }
}

/**
 * Injects the .rite() method into the CopticDate primitive.
 */
export function typiconPlugin(CopticDateClass: typeof CopticDate): void {
    if (!CopticDateClass.prototype.rite) {
        CopticDateClass.prototype.rite = function (this: CopticDate): LiturgicalRite {
            return getLiturgicalRite(this);
        };
    }
}
