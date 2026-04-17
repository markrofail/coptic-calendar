import MONTH_NAMES_EN from './locales/en.json' with { type: 'json' };
import MONTH_NAMES_AR from './locales/ar.json' with { type: 'json' };
import MONTH_NAMES_COP from './locales/cop.json' with { type: 'json' };

/**
 * Core Localization registry for the Coptic Liturgical Calendar.
 * Supports English (en), Arabic (ar), and Coptic (cop).
 */
export type Locale = 'en' | 'ar' | 'cop';

export const MONTH_NAMES: Record<Locale, Record<string, string>> = {
    en: MONTH_NAMES_EN as Record<string, string>,
    ar: MONTH_NAMES_AR as Record<string, string>,
    cop: MONTH_NAMES_COP as Record<string, string>,
};

/**
 * Lightweight translation helper for months.
 */
export function translateMonth(month: number, locale: Locale = 'en'): string {
    const translations = MONTH_NAMES[locale] || MONTH_NAMES['en'];
    const key = String(month);
    return translations[key] || (MONTH_NAMES['en'][key] as string);
}
