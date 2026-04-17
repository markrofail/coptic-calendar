import { getEasterForCopticYear } from '../computus.js';

describe('Occasions Computus', () => {
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
});
