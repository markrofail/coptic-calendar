import { CopticDate } from '../CopticDate.js';

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
});
