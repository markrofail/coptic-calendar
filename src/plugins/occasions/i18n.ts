import { type Locale } from '../../core/i18n.js';
import OCCASION_NAMES_EN from './locales/en.json' with { type: 'json' };
import OCCASION_NAMES_AR from './locales/ar.json' with { type: 'json' };
import OCCASION_NAMES_COP from './locales/cop.json' with { type: 'json' };

export const OCCASION_NAMES: Record<Locale, Record<string, string>> = {
    en: OCCASION_NAMES_EN as Record<string, string>,
    ar: OCCASION_NAMES_AR as Record<string, string>,
    cop: OCCASION_NAMES_COP as Record<string, string>,
};

/**
 * Translates an occasion token.
 */
export function translateOccasion(token: string, locale: Locale = 'en'): string {
    const dict = OCCASION_NAMES[locale] || OCCASION_NAMES['en'];
    return dict[token] || token;
}
