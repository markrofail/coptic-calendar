import { type Locale } from '../../core/i18n.js';
import TYPICON_EN from './locales/en.json' with { type: 'json' };
import TYPICON_AR from './locales/ar.json' with { type: 'json' };
import TYPICON_COP from './locales/cop.json' with { type: 'json' };

interface TypiconLocale {
    seasons: Record<string, string>;
    tunes: Record<string, string>;
}

export const TYPICON_I18N: Record<Locale, TypiconLocale> = {
    en: TYPICON_EN as TypiconLocale,
    ar: TYPICON_AR as TypiconLocale,
    cop: TYPICON_COP as TypiconLocale,
};

/**
 * Translates a liturgical season token.
 */
export function translateSeason(token: string, locale: Locale = 'en'): string {
    const dict = (TYPICON_I18N[locale] || TYPICON_I18N['en']).seasons;
    return dict[token] || token;
}

/**
 * Translates a liturgical tune token.
 */
export function translateTune(token: string, locale: Locale = 'en'): string {
    const dict = (TYPICON_I18N[locale] || TYPICON_I18N['en']).tunes;
    return dict[token] || token;
}
