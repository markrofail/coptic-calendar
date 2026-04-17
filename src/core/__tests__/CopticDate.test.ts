import { CopticDate } from '../CopticDate.js';
import { jsDateToCopticDate } from '../computus.js';

describe('CopticDate', () => {
    it('should convert 1 Thout 1740 (2023-09-12) correctly', () => {
        const date = new Date(2023, 8, 12);
        const coptic = jsDateToCopticDate(date);
        expect(coptic.year).toBe(1740);
        expect(coptic.month).toBe(1);
        expect(coptic.day).toBe(1);
    });

    it('should identify leap years correctly (year % 4 === 3)', () => {
        expect(CopticDate.from({ year: 1739, month: 1, day: 1 }).inLeapYear).toBe(true);
        expect(CopticDate.from({ year: 1740, month: 1, day: 1 }).inLeapYear).toBe(false);
    });

    it.each([
        { start: { year: 1740, month: 1, day: 1 }, add: { months: 1 }, expected: '1740-02-01' },
        { start: { year: 1740, month: 1, day: 1 }, add: { days: 30 }, expected: '1740-02-01' },
        { start: { year: 1740, month: 1, day: 1 }, add: { weeks: 1 }, expected: '1740-01-08' },
        { start: { year: 1739, month: 12, day: 30 }, add: { days: 1 }, expected: '1739-13-01' },
        { start: { year: 1739, month: 13, day: 6 }, add: { days: 1 }, expected: '1740-01-01' },
        { start: { year: 1740, month: 13, day: 5 }, add: { days: 1 }, expected: '1741-01-01' },
    ])('should correctly handle $add addition from $start', ({ start, add, expected }) => {
        const result = CopticDate.from(start).add(add);
        expect(result.toString()).toContain(expected);
    });

    it('should constrain days when changing months with .with()', () => {
        const c = CopticDate.from({ year: 1740, month: 1, day: 30 });
        const nasie = c.with({ month: 13 });
        expect(nasie.month).toBe(13);
        expect(nasie.day).toBe(5); // 1740 is common
    });

    it('should compare dates numerically with .compare()', () => {
        const c1 = CopticDate.from({ year: 1740, month: 1, day: 1 });
        const c2 = CopticDate.from({ year: 1740, month: 1, day: 2 });
        expect(CopticDate.compare(c1, c2)).toBe(-1);
        expect(CopticDate.compare(c2, c1)).toBe(1);
        expect(CopticDate.compare(c1, c1)).toBe(0);
    });

    it('should verify equality with .equals()', () => {
        const c1 = CopticDate.from({ year: 1740, month: 1, day: 1 });
        const c2 = CopticDate.from({ year: 1740, month: 1, day: 1 });
        expect(c1.equals(c2)).toBe(true);
    });
});
