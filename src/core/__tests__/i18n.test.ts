import { CopticDate } from '../CopticDate.js';
import { translateMonth, MONTH_NAMES } from '../i18n.js';

describe('toLocaleString', () => {
    it.each([
        { month: 1, locale: 'en' as const, expected: '1 Thout 1740' },
        { month: 1, locale: 'ar' as const, expected: '1 توت 1740' },
        { month: 1, locale: 'cop' as const, expected: '1 Ⲑⲱⲟⲩⲧ 1740' },
        { month: 13, locale: 'cop' as const, expected: '1 Ⲡⲓⲕⲟⲩϫⲓ ⲛ̀ⲁ̀ⲃⲟⲧ 1740' },
    ])(
        'should correctly format month $month for locale $locale',
        ({ month, locale, expected }: { month: number; locale: string; expected: string }) => {
            const date = CopticDate.from({ year: 1740, month, day: 1 });
            expect(date.toLocaleString({ locale: locale as any })).toBe(expected);
        },
    );

    it('should default to English for unknown locales', () => {
        const date = CopticDate.from({ year: 1740, month: 1, day: 1 });
        // @ts-ignore
        expect(date.toLocaleString({ locale: 'fr' })).toBe('1 Thout 1740');
    });

    it('should return the token itself for unknown months', () => {
        // @ts-ignore
        const date = CopticDate.from({ year: 1740, month: 99, day: 1 });
        expect(date.toLocaleString()).toContain('99');
    });

    it('should handle translateMonth with default locale', () => {
        expect(translateMonth(1)).toBe('Thout');
    });

    it('should handle translateMonth with a locale missing specific months', () => {
        // Mock a locale that has no month names to hit englishFallback branch
        const originalLocaleAr = MONTH_NAMES['ar'];
        // @ts-ignore
        MONTH_NAMES['ar'] = {}; // Temporarily empty
        expect(translateMonth(1, 'ar')).toBe('Thout');
        // @ts-ignore
        MONTH_NAMES['ar'] = originalLocaleAr;
    });

    it('should handle translateMonth total fallback (unknown key in all locales)', () => {
        // @ts-ignore
        expect(translateMonth(99, 'en')).toBe('99');
    });
});
