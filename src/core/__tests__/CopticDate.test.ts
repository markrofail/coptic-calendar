import { CopticDate } from '../CopticDate.js';
import { jsDateToCopticDate } from '../computus.js';
import { COPTIC_MONTHS } from '../constants.js';

describe('CopticDate', () => {
    it('should convert 1 Thout 1740 (2023-09-12) correctly', () => {
        const date = new Date(2023, 8, 12);
        const coptic = jsDateToCopticDate(date);
        expect(coptic.year).toBe(1740);
        expect(coptic.month).toBe(1);
        expect(coptic.day).toBe(1);
    });

    it('should handle .from() with an existing CopticDate', () => {
        const d1 = CopticDate.from({ year: 1740, month: 1, day: 1 });
        const d2 = CopticDate.from(d1);
        expect(d2.equals(d1)).toBe(true);
        expect(d2).not.toBe(d1); // Should be a copy
    });

    it('should handle .from() with a native Date object', () => {
        const date = new Date(2023, 8, 12);
        const coptic = CopticDate.from(date);
        expect(coptic.year).toBe(1740);
        expect(coptic.month).toBe(1);
        expect(coptic.day).toBe(1);
    });

    it('should handle .from() with a numeric timestamp', () => {
        const timestamp = new Date(2023, 8, 12).getTime();
        const coptic = CopticDate.from(timestamp);
        expect(coptic.year).toBe(1740);
    });

    it('should handle .from() with an ISO string', () => {
        const coptic = CopticDate.from('2023-09-12');
        expect(coptic.year).toBe(1740);
        expect(coptic.month).toBe(1);
        expect(coptic.day).toBe(1);
    });

    it('should handle .from() with a Temporal-like object', () => {
        const instant = { epochMilliseconds: new Date(2023, 8, 12).getTime() };
        const coptic = CopticDate.from(instant);
        expect(coptic.year).toBe(1740);
    });

    it('should handle .from() with a custom object having .toJSDate()', () => {
        const custom = { toJSDate: () => new Date(2023, 8, 12) };
        const coptic = CopticDate.from(custom);
        expect(coptic.year).toBe(1740);
        expect(coptic.month).toBe(1);
        expect(coptic.day).toBe(1);
    });

    it('should throw TypeError on invalid .from() input with descriptive message', () => {
        expect(() => CopticDate.from(undefined)).toThrow(/Cannot convert undefined to CopticDate/);
        expect(() => CopticDate.from(null)).toThrow(/Cannot convert null to CopticDate/);
        expect(() => CopticDate.from({})).toThrow(/Cannot convert \[object Object\] to CopticDate/);
        expect(() => CopticDate.from('not-a-date')).toThrow(
            /Cannot convert not-a-date to CopticDate/,
        );
    });

    it('should identify leap years correctly (year % 4 === 3)', () => {
        const leap = CopticDate.from({ year: 1739, month: 13, day: 1 });
        const common = CopticDate.from({ year: 1740, month: 13, day: 1 });
        expect(leap.inLeapYear).toBe(true);
        expect(leap.daysInMonth).toBe(6);
        expect(leap.daysInYear).toBe(366);
        expect(common.inLeapYear).toBe(false);
        expect(common.daysInMonth).toBe(5);
        expect(common.daysInYear).toBe(365);
        expect(common.monthsInYear).toBe(13);

        // Non-Nasie month
        expect(CopticDate.from({ year: 1740, month: 1, day: 1 }).daysInMonth).toBe(30);
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

    it('should handle large month overflow in .add()', () => {
        const d = CopticDate.from({ year: 1740, month: 1, day: 1 });
        const result = d.add({ months: 26 }); // 2 years + 0 months
        expect(result.year).toBe(1742);
        expect(result.month).toBe(1);
    });

    it('should handle negative months (underflow) in .add()', () => {
        const d = CopticDate.from({ year: 1740, month: 1, day: 1 });
        const result = d.add({ months: -14 }); // -1 year - 1 month
        expect(result.year).toBe(1738);
        expect(result.month).toBe(COPTIC_MONTHS.NASIE);
    });

    it('should correctly roundtrip via fromJDN', () => {
        const d = CopticDate.from({ year: 1740, month: 8, day: 27 });
        const jdn = d.jdn;
        const roundtrip = CopticDate.fromJDN(jdn);
        expect(roundtrip.year).toBe(1740);
        expect(roundtrip.month).toBe(8);
        expect(roundtrip.day).toBe(27);
    });

    it('should return a valid string representation', () => {
        const d = CopticDate.from({ year: 1740, month: 1, day: 1 });
        expect(d.toString()).toBe('1740-01-01[u-ca=coptic]');
    });

    it('should handle .subtract() with all units', () => {
        const d = CopticDate.from({ year: 1740, month: 2, day: 10 });
        const res = d.subtract({ years: 1, months: 1, weeks: 1, days: 1 });
        // 1740-02-10 - 1y = 1739-02-10
        // - 1m = 1739-01-10
        // - 1w = 1739-01-03
        // - 1d = 1739-01-02
        expect(res.year).toBe(1739);
        expect(res.month).toBe(1);
        expect(res.day).toBe(2);
    });

    it('should handle addition with zero units', () => {
        const d = CopticDate.from({ year: 1740, month: 1, day: 1 });
        const res = d.add({});
        expect(res.equals(d)).toBe(true);
    });

    it('should constrain days when changing months with .with()', () => {
        const c = CopticDate.from({ year: 1740, month: 1, day: 30 });
        const nasie = c.with({ month: 13 });
        expect(nasie.month).toBe(13);
        expect(nasie.day).toBe(5); // 1740 is common

        // Nasie leap year
        const nasieLeap = CopticDate.from({ year: 1739, month: 1, day: 30 }).with({ month: 13 });
        expect(nasieLeap.day).toBe(6);

        // No changes
        expect(c.with({}).equals(c)).toBe(true);
    });

    it('should compare dates numerically with .compare()', () => {
        const c1 = CopticDate.from({ year: 1740, month: 1, day: 1 });
        const c2 = CopticDate.from({ year: 1740, month: 1, day: 2 });
        const c3 = CopticDate.from({ year: 1741, month: 1, day: 1 });
        const c4 = CopticDate.from({ year: 1740, month: 2, day: 1 });

        expect(CopticDate.compare(c1, c2)).toBe(-1);
        expect(CopticDate.compare(c2, c1)).toBe(1);
        expect(CopticDate.compare(c1, c1)).toBe(0);
        expect(CopticDate.compare(c1, c3)).toBe(-1);
        expect(CopticDate.compare(c3, c1)).toBe(1);
        expect(CopticDate.compare(c1, c4)).toBe(-1);
        expect(CopticDate.compare(c4, c1)).toBe(1);
    });

    it('should verify equality with .equals()', () => {
        const c1 = CopticDate.from({ year: 1740, month: 1, day: 1 });
        const c2 = CopticDate.from({ year: 1740, month: 1, day: 1 });
        expect(c1.equals(c2)).toBe(true);
    });

    it('should hit day constrain branch in .add()', () => {
        const d = CopticDate.from({ year: 1740, month: 1, day: 30 });
        const result = d.add({ months: 12 }); // Nasie (max 5)
        expect(result.day).toBe(5);
    });

    it('should hit optional days branch in .subtract()', () => {
        const d = CopticDate.from({ year: 1740, month: 1, day: 1 });
        expect(d.subtract({ years: 1 }).year).toBe(1739);
    });
});
