import { CopticDate } from '../../../core/CopticDate.js';
import { synaxariumPlugin } from '../index.js';

// Initialize plugin
CopticDate.extend(synaxariumPlugin);

describe('Synaxarium Plugin', () => {
    it.each([
        {
            month: 1,
            day: 1,
            expected: 'Feast of El-Nayrouz (Beginning of the Blessed Coptic Year).',
            title: 'Nayrouz',
        },
        {
            month: 4,
            day: 29,
            expected: 'The Feast of the Nativity of Our Lord Jesus Christ (Christmas).',
            title: 'Nativity',
        },
        {
            month: 5,
            day: 11,
            expected:
                'The Holy Theophany of Our Lord, God and Savior, Jesus Christ (Baptism of the Lord christ).',
            title: 'Epiphany',
        },
        {
            month: 8,
            day: 23,
            expected: 'The Martyrdom of St. George Prince of the Martyrs.',
            title: 'St. George',
        },
        {
            month: 9,
            day: 7,
            expected: 'The Departure of St. Athanasius the Apostolic the 20th. Pope of Alexandria.',
            title: 'St. Athanasius',
        },
        { month: 13, day: 6, expected: 'A Thanksgiving To God.', title: 'Leap Nasie' },
    ])(
        'should resolve commemoration for $title ($month-$day)',
        ({ month, day, expected }: { month: number; day: number; expected: string }) => {
            const date = CopticDate.from({ year: 1740, month, day });
            const commemorations = date.synaxarium();
            expect(commemorations).toContain(expected);
        },
    );

    it('should return an empty array for days with no recorded commemorations', () => {
        // Technically all dates in the current registry should have something,
        // but we test the fallback logic.
        const date = CopticDate.from({ year: 1740, month: 13, day: 10 });
        const commemorations = date.synaxarium();
        expect(commemorations).toEqual([]);
    });

    // 2. Internationalization
    it('should return localized entries (English default)', () => {
        const date = CopticDate.from({ year: 1740, month: 1, day: 1 });
        const entries = date.synaxarium({ locale: 'en' });
        expect(entries[0]).toContain('Feast of El-Nayrouz');
    });

    it('should fallback to English for unsupported Synaxarium locales', () => {
        const date = CopticDate.from({ year: 1740, month: 1, day: 1 });
        const entries = date.synaxarium({ locale: 'ar' });
        expect(entries[0]).toContain('Feast of El-Nayrouz');
    });
});
