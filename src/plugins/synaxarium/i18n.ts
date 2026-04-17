import { type Locale } from '../../core/i18n.js';
import SYNAXARIUM_NAMES_EN from './locales/en.json' with { type: 'json' };

/**
 * Delegated i18n dictionary for Synaxarium (currently only English in constants).
 * In a real implementation, this would point to separate registries.
 */
export const SYNAXARIUM_I18N: Record<Locale, Record<string, string[]>> = {
    en: SYNAXARIUM_NAMES_EN as Record<string, string[]>,
    ar: {}, // Placeholder
    cop: {}, // Placeholder
};

/**
 * Localized lookup for Synaxarium entries.
 */
export function translateSynaxarium(month: number, day: number, locale: Locale = 'en'): string[] {
    const key = `${month}-${day}`;
    const translations = SYNAXARIUM_I18N[locale] || {};
    const results = translations[key];

    if (results && results.length > 0) return results;

    // Fallback to English
    return SYNAXARIUM_I18N['en'][key] || [];
}
