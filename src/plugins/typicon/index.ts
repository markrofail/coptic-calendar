import { CopticDate } from '../../core/CopticDate.js';
import { getOccasions } from '../occasions/index.js';
import { getEasterForCopticYear, copticToJDN } from '../../core/computus.js';
import { RuleEngine } from '../../core/RuleEngine.js';
import { LORD_FEASTS, type LiturgicalRite } from './constants.js';
import { type Locale } from '../../core/i18n.js';
import { translateSeason, translateTune } from './i18n.js';

import { TYPICON_RULES, type TypiconContext } from './rules.js';

const engine = new RuleEngine<TypiconContext, LiturgicalRite>(TYPICON_RULES);

/**
 * Resolves the liturgical rite using the prioritized RuleEngine.
 */
export function getLiturgicalRite(date: CopticDate): LiturgicalRite {
    const jdn = copticToJDN(date.year, date.month, date.day);
    const easter = getEasterForCopticYear(date.year);
    const easterJdn = copticToJDN(easter.year, easter.month, easter.day);

    const context: TypiconContext = {
        date,
        occasions: getOccasions(date),
        jdn,
        dayOfWeek: (jdn + 1) % 7,
        isSunday: (jdn + 1) % 7 === 0,
        isWeekend: (jdn + 1) % 7 === 0 || (jdn + 1) % 7 === 6,
        diffDaysFromEaster: jdn - easterJdn,
    };

    const result = engine.resolve(context);
    if (!result) {
        return { season: 'Annual', tune: 'Annual', hasMetanoias: true };
    }
    return result;
}

declare module '../../core/CopticDate.js' {
    interface CopticDate {
        /**
         * Derives the active canonical Typicon configuration constraints automatically.
         */
        rite(opts?: { locale?: Locale }): LiturgicalRite;
    }
}

/**
 * Injects the .rite() method into the CopticDate primitive.
 */
export function typiconPlugin(CopticDateClass: typeof CopticDate): void {
    if (!CopticDateClass.prototype.rite) {
        CopticDateClass.prototype.rite = function (
            this: CopticDate,
            opts?: { locale?: Locale },
        ): LiturgicalRite {
            const rite = getLiturgicalRite(this);
            if (opts?.locale) {
                return {
                    ...rite,
                    season: translateSeason(rite.season, opts.locale),
                    tune: translateTune(rite.tune, opts.locale),
                };
            }
            return rite;
        };
    }
}
