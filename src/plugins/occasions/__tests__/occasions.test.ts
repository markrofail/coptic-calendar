import { CopticDate } from '../../../core/CopticDate.js';
import { getOccasions, getOccasionForCopticYear, occasionsPlugin, getEasterForCopticYear } from '../index.js';

// Initialize plugin for prototype testing
occasionsPlugin(CopticDate);

describe('Occasions Plugin', () => {
    // 1. Fixed & Spans
    it('should resolve fixed feasts', () => {
        const d = CopticDate.from({ year: 1740, month: 4, day: 29 });
        expect(d.occasions()).toContain('Nativity');
    });

    it.each([1, 10, 15])('should include St Mary Fast span (Mesori %i)', (day) => {
        const d = CopticDate.from({ year: 1740, month: 12, day });
        expect(d.occasions()).toContain('StMarysFast');
    });

    it('should exclude St Mary Fast span (Mesori 16)', () => {
        const d = CopticDate.from({ year: 1740, month: 12, day: 16 });
        expect(d.occasions()).not.toContain('StMarysFast');
    });

    it.each([
        [3, 16], // Hathor 16
        [4, 28], // Kiahk 28
    ])('should include Nativity Fast span (Month %i, Day %i)', (month, day) => {
        const d = CopticDate.from({ year: 1740, month, day });
        expect(d.occasions()).toContain('NativityFast');
    });

    it('should exclude Nativity Fast span (Kiahk 29)', () => {
        const d = CopticDate.from({ year: 1740, month: 4, day: 29 });
        expect(d.occasions()).not.toContain('NativityFast');
    });

    // 2. Easter-Relative
    it('should resolve Easter 1740 accurately', () => {
        const easter = getOccasionForCopticYear('Easter', 1740);
        expect(easter.month).toBe(8);
        expect(easter.day).toBe(27);
    });

    it.each([
        [-69, 'JonahsFast'],
        [-55, 'Lent'],
        [49, 'Pentecost'],
        [50, 'ApostlesFast'],
    ])('should contain %s for offset %i relative to Easter', (offset: number, occasion: string) => {
        const easter = CopticDate.from({ year: 1740, month: 8, day: 27 });
        const target =
            offset < 0 ? easter.subtract({ days: Math.abs(offset) }) : easter.add({ days: offset });
        expect(target.occasions()).toContain(occasion);
    });

    // 3. Paramoun Sliding Window
    it.each([
        [1739, 4, 28, '1-day Paramoun (Sat feast)'],
        [1735, 4, 28, '2-day Paramoun (Mon feast - Sun)'],
        [1735, 4, 27, '2-day Paramoun (Mon feast - Sat)'],
        [1740, 4, 28, '3-day Paramoun (Sun feast - Sat)'],
        [1740, 4, 27, '3-day Paramoun (Sun feast - Fri)'],
        [1740, 4, 26, '3-day Paramoun (Sun feast - Thu)'],
    ])('should resolve %s', (year: number, month: number, day: number, title: string) => {
        const d = CopticDate.from({ year, month, day });
        expect(d.occasions()).toContain('Paramoun');
    });

    // 4. Internationalization
    it('should return raw tokens when no locale is provided', () => {
        const d = CopticDate.from({ year: 1740, month: 1, day: 1 }); // Nayrouz
        expect(d.occasions()).toContain('Nayrouz');
    });

    it('should return localized names when locale is provided', () => {
        const d = CopticDate.from({ year: 1740, month: 1, day: 1 });
        expect(d.occasions({ locale: 'ar' })).toContain('عيد النيروز');
        expect(d.occasions({ locale: 'en' })).toContain('Nayrouz');
        expect(d.occasions({ locale: 'cop' })).toContain('Ⲛⲓⲣⲟⲩⲱ');
    });

    // 5. when() and next()
    describe('when() and next()', () => {
        it('should return the occurrence in the current year using .when()', () => {
            const d = CopticDate.from({ year: 1740, month: 1, day: 1 });
            const nativity = d.when('Nativity');
            expect(nativity.year).toBe(1740);
            expect(nativity.month).toBe(4);
            expect(nativity.day).toBe(29);
        });

        it('should return the current year occurrence if ahead using .next()', () => {
            const d = CopticDate.from({ year: 1740, month: 1, day: 1 });
            const nextEaster = d.next('Easter');
            expect(nextEaster.year).toBe(1740);
            expect(nextEaster.month).toBe(8);
            expect(nextEaster.day).toBe(27);
        });

        it('should return the next year occurrence if already passed using .next()', () => {
            // Nativity AM 1740 is Kiahk 29 (4-29)
            const d = CopticDate.from({ year: 1740, month: 5, day: 1 }); // Tobi 1
            const nextNativity = d.next('Nativity');
            expect(nextNativity.year).toBe(1741);
            expect(nextNativity.month).toBe(4);
            expect(nextNativity.day).toBe(29);
        });

        it('should handle mobile feasts across years using .next()', () => {
            const d = CopticDate.from({ year: 1740, month: 9, day: 1 }); // After Easter 1740
            const nextEaster = d.next('Easter');
            // Easter 1741 is April 20 (Julian) -> 8-12
            expect(nextEaster.year).toBe(1741);
            expect(nextEaster.month).toBe(8);
            expect(nextEaster.day).toBe(12);
        });
    });

    it('should provide comprehensive coverage for sliding Paramoun windows', () => {
        // Nativity AM 1740 (Sunday) -> Paramoun is Fri, Sat
        expect(CopticDate.from({ year: 1740, month: 4, day: 26 }).occasions()).toContain('Paramoun');
        expect(CopticDate.from({ year: 1740, month: 4, day: 27 }).occasions()).toContain('Paramoun');

        // Epiphany AM 1740 (Wednesday) -> Paramoun is 1 day (Tue)
        // 11 Tobi 1740 = Jan 20, 2024 (Saturday)
        // Oops, let's pick 1739. 11 Tobi 1739 = Jan 19, 2023 (Thursday). Paramoun is Wednesday.
        expect(CopticDate.from({ year: 1739, month: 5, day: 10 }).occasions()).toContain('Paramoun');
    });

    it('should resolve all floating feasts relative to Easter', () => {
        const easter = getEasterForCopticYear(1740); // April 22, 2024 -> 2460423

        const testCase = (offset: number, expected: string) => {
            const d = CopticDate.fromJDN(easter.jdn + offset);
            expect(d.occasions()).toContain(expected);
        };

        testCase(-68, 'JonahsFast');
        testCase(-66, 'JonahsPassover');
        testCase(-7, 'PalmSunday');
        testCase(-3, 'CovenantThursday');
        testCase(7, 'ThomasSunday');
        testCase(39, 'Ascension');
        testCase(49, 'Pentecost');
        testCase(50, 'ApostlesFast');
    });

    it('should handle the end of the Apostles Fast', () => {
        // Apostles fast ends on 5 Abib (Epip)
        expect(CopticDate.from({ year: 1740, month: 11, day: 4 }).occasions()).toContain('ApostlesFast');
        expect(CopticDate.from({ year: 1740, month: 11, day: 5 }).occasions()).not.toContain('ApostlesFast');
    });

    it('should handle fasting spans (Nativity, St Mary)', () => {
        // Nativity Fast: 16 Hator (3-16) to 28 Kiahk (4-28). 29 Kiahk is the feast.
        expect(CopticDate.from({ year: 1740, month: 3, day: 16 }).occasions()).toContain('NativityFast');
        expect(CopticDate.from({ year: 1740, month: 4, day: 28 }).occasions()).toContain('NativityFast');
        expect(CopticDate.from({ year: 1740, month: 4, day: 29 }).occasions()).not.toContain('NativityFast');

        // St Mary's Fast: 1 Mesori (12-1) to 15 Mesori (12-15)
        expect(CopticDate.from({ year: 1740, month: 12, day: 1 }).occasions()).toContain('StMarysFast');
        expect(CopticDate.from({ year: 1740, month: 12, day: 15 }).occasions()).toContain('StMarysFast');
    });

    it('should hit getEasterForCopticYear branch', () => {
        expect(getEasterForCopticYear(1740)).toBeDefined();
    });

    it('should handle getOccasions directly with no options', () => {
        const d = CopticDate.from({ year: 1740, month: 1, day: 1 });
        expect(getOccasions(d)).toBeDefined();
    });
});
