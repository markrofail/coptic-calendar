import { CopticDate } from '../CopticDate.js';
import { jsDateToCopticDate } from '../computus.js';

test('converts 1 Thout 1740 (2023-09-12)', () => {
    const date = new Date(2023, 8, 12);
    const coptic = jsDateToCopticDate(date);
    expect(coptic.year).toBe(1740);
    expect(coptic.month).toBe(1);
    expect(coptic.day).toBe(1);
});

test('converts Coptic Epoch safely', () => {
    const date = new Date(2023, 8, 11);
    const coptic = jsDateToCopticDate(date);
    expect(coptic.year).toBe(1739);
    expect(coptic.month).toBe(13);
    expect(coptic.day).toBe(6);
});

test('CopticDate.from works securely', () => {
    const c = CopticDate.from({ year: 1740, month: 1, day: 1 });
    expect(c.toString()).toBe('1740-01-01[u-ca=coptic]');
});

test('CopticDate.with() modifies fields immutably securely', () => {
    const c = CopticDate.from({ year: 1740, month: 1, day: 1 });
    const changed = c.with({ day: 15 });
    expect(changed.day).toBe(15);
    expect(c.day).toBe(1);
});

test('CopticDate.add() computes additions mapping months properly', () => {
    const c = CopticDate.from({ year: 1740, month: 1, day: 1 });
    const nextMonth = c.add({ months: 1, days: 5 });
    expect(nextMonth.month).toBe(2);
    expect(nextMonth.day).toBe(6);
});

test('CopticDate.add() calculates leap spans across years safely natively', () => {
    const c = CopticDate.from({ year: 1740, month: 1, day: 1 });
    const elapsed = c.add({ days: 32 });
    expect(elapsed.month).toBe(2);
    expect(elapsed.day).toBe(3);
});

test('CopticDate.subtract() works identically backwards', () => {
    const c = CopticDate.from({ year: 1740, month: 2, day: 3 });
    const before = c.subtract({ days: 32 });
    expect(before.month).toBe(1);
    expect(before.day).toBe(1);
});

test('CopticDate.equals compares cleanly exactly natively', () => {
    const c1 = CopticDate.from({ year: 1740, month: 1, day: 1 });
    const c2 = CopticDate.from({ year: 1740, month: 1, day: 1 });
    expect(c1.equals(c2)).toBe(true);
});
