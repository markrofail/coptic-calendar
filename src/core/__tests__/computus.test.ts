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
        const date = new Date(2024, 0, 15); // Jan 15
        const coptic = jsDateToCopticDate(date);
        expect(coptic.year).toBe(1740);
        expect(coptic.month).toBe(5); // Tobi
    });
});
