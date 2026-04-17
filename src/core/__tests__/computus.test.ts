import { copticToJDN, jdnToCopticElements, getEasterForCopticYear, gregorianToJDN } from '../computus.js';

describe('Computus Unit', () => {
    it('should successfully roundtrip Coptic 1740-01-01 through JDN', () => {
        const jdn = copticToJDN(1740, 1, 1);
        const elements = jdnToCopticElements(jdn);
        expect(elements).toEqual({ year: 1740, month: 1, day: 1 });
    });

    it('should compute Easter accurately for a leap year (AM 1739)', () => {
        const easter = getEasterForCopticYear(1739);
        expect(easter.year).toBe(1739);
        expect(easter.month).toBe(8);
        expect(easter.day).toBe(8); // April 16, 2023 (Julian)
    });

    it('should compute Easter accurately for a common year (AM 1740)', () => {
        const easter = getEasterForCopticYear(1740);
        expect(easter.year).toBe(1740);
        expect(easter.month).toBe(8);
        expect(easter.day).toBe(27); // May 5, 2024 (Gregorian)
    });

    it('should correctly assert the Unix Epoch JDN (1970-01-01)', () => {
        expect(gregorianToJDN(1970, 1, 1)).toBe(2440588);
    });
});
