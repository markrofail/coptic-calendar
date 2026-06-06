import {
    copticToJDN,
    jdnToCopticElements,
    gregorianToJDN,
    jsDateToCopticDate,
} from '../computus.js';

describe('Computus Unit', () => {
    it('should successfully roundtrip Coptic 1740-01-01 through JDN', () => {
        const jdn = copticToJDN(1740, 1, 1);
        const elements = jdnToCopticElements(jdn);
        expect(elements).toEqual({ year: 1740, month: 1, day: 1 });
    });

    it('should correctly assert the Unix Epoch JDN (1970-01-01)', () => {
        expect(gregorianToJDN(1970, 1, 1)).toBe(2440588);
    });

    it('should handle early Gregorian months (Jan/Feb) in gregorianToJDN', () => {
        // Feb 28, 2024 (Leap Year)
        expect(gregorianToJDN(2024, 2, 28)).toBe(2460369);
    });

    it('should handle jsDateToCopticDate for early months', () => {
        // Noon UTC on Jan 15 2024 — safely Jan 15 in every timezone
        const date = new Date(Date.UTC(2024, 0, 15, 12, 0, 0));
        const coptic = jsDateToCopticDate(date);
        expect(coptic.year).toBe(1740);
        expect(coptic.month).toBe(5); // Tobi
        expect(coptic.day).toBe(6);   // Jan 15 2024 = Tobi 6, 1740
    });

    it('should use UTC date, not local date, for conversion', () => {
        // Midnight UTC on Jan 16 2024 = Jan 15 in UTC-1 through UTC-12 timezones
        // Must return Jan 16 UTC (Tobi 7, 1740), not Jan 15
        const date = new Date(Date.UTC(2024, 0, 16, 0, 0, 0));
        const coptic = jsDateToCopticDate(date);
        expect(coptic.year).toBe(1740);
        expect(coptic.month).toBe(5); // Tobi
        expect(coptic.day).toBe(7);   // Jan 16 2024 UTC = Tobi 7, 1740
    });
});
