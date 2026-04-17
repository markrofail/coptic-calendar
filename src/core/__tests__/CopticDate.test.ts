import assert from 'node:assert';
import { CopticDate } from '../CopticDate.js';
import { jsDateToCopticDate } from '../computus.js';

test('converts 1 Thout 1740 (2023-09-12)', () => {
    const date = new Date(2023, 8, 12);
    const coptic = jsDateToCopticDate(date);
    assert.strictEqual(coptic.year, 1740);
    assert.strictEqual(coptic.month, 1);
    assert.strictEqual(coptic.day, 1);
});

test('converts Coptic Epoch safely', () => {
    const date = new Date(2023, 8, 11);
    const coptic = jsDateToCopticDate(date);
    assert.strictEqual(coptic.year, 1739);
    assert.strictEqual(coptic.month, 13);
    assert.strictEqual(coptic.day, 6);
});

test('CopticDate.from works securely', () => {
    const c = CopticDate.from({ year: 1740, month: 1, day: 1 });
    assert.strictEqual(c.toString(), '1740-01-01[u-ca=coptic]');
});

test('CopticDate.with() modifies fields immutably securely', () => {
    const c = CopticDate.from({ year: 1740, month: 1, day: 1 });
    const changed = c.with({ day: 15 });
    assert.strictEqual(changed.day, 15);
    assert.strictEqual(c.day, 1);
});

test('CopticDate.add() computes additions mapping months properly', () => {
    const c = CopticDate.from({ year: 1740, month: 1, day: 1 });
    const nextMonth = c.add({ months: 1, days: 5 });
    assert.strictEqual(nextMonth.month, 2);
    assert.strictEqual(nextMonth.day, 6);
});

test('CopticDate.add() calculates leap spans across years safely natively', () => {
    const c = CopticDate.from({ year: 1740, month: 1, day: 1 });
    const elapsed = c.add({ days: 32 });
    assert.strictEqual(elapsed.month, 2);
    assert.strictEqual(elapsed.day, 3);
});

test('CopticDate.subtract() works identically backwards', () => {
    const c = CopticDate.from({ year: 1740, month: 2, day: 3 });
    const before = c.subtract({ days: 32 });
    assert.strictEqual(before.month, 1);
    assert.strictEqual(before.day, 1);
});

test('CopticDate.equals compares cleanly exactly natively', () => {
    const c1 = CopticDate.from({ year: 1740, month: 1, day: 1 });
    const c2 = CopticDate.from({ year: 1740, month: 1, day: 1 });
    assert.ok(c1.equals(c2));
});
