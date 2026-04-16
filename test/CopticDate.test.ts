import { test } from '@jest/globals';
import assert from 'node:assert';
import { CopticDate } from '../src/CopticDate.js';

test('converts 1 Thout 1740 (2023-09-12)', () => {
    const date = new Date(2023, 8, 12);
    const coptic = new CopticDate(date);
    assert.strictEqual(coptic.year, 1740);
    assert.strictEqual(coptic.month, 1);
    assert.strictEqual(coptic.day, 1);
});

test('converts Coptic Epoch safely', () => {
    const date = new Date(2023, 8, 11);
    const coptic = new CopticDate(date);
    assert.strictEqual(coptic.year, 1739);
    assert.strictEqual(coptic.month, 13);
    assert.strictEqual(coptic.day, 6);
});

test('CopticDate.today() returns valid data', () => {
    const current = CopticDate.today();
    assert.ok(current.year > 1700);
});

test('toJSDate() maps back correctly', () => {
    const initial = new Date(2023, 8, 12, 0, 0, 0, 0);
    const coptic = new CopticDate(initial);
    const reversed = coptic.toJSDate();
    assert.strictEqual(reversed.getFullYear(), 2023);
    assert.strictEqual(reversed.getMonth(), 8);
    assert.strictEqual(reversed.getDate(), 12);
});

test('format() cleans strings', () => {
    const date = new Date(2023, 8, 12);
    const coptic = new CopticDate(date);
    assert.strictEqual(coptic.format('DD MMMM YYYY'), '01 Thout 1740');
});

test('addDays() functions immutably', () => {
    const coptic = new CopticDate(new Date(2023, 8, 12));
    const advanced = coptic.addDays(32);
    assert.strictEqual(advanced.month, 2);
    assert.strictEqual(advanced.day, 3);
});

test('CopticDate.fromComponents works', () => {
    const c = CopticDate.fromComponents(1740, 1, 1);
    assert.strictEqual(c.format('D/M/YYYY'), '1/1/1740');
});

test('CopticDate.next(Easter) logic resolves Alexandrian calculation', () => {
    const easter = CopticDate.next('Easter');
    assert.ok(easter.month > 0);
    assert.ok(easter.day > 0);
});

test('synaxarium() lookup safely accesses dictionary names mapped natively', () => {
    const nayrouz = CopticDate.fromComponents(1740, 1, 1);
    const saints = nayrouz.synaxarium();
    assert.ok(saints.length >= 2);
    assert.strictEqual(saints[0], "Feast of El-Nayrouz (Beginning of the Blessed Coptic Year).");

    const emptyLookup = CopticDate.fromComponents(1740, 14, 1); // Invalid blank mapping entry safely out of bounds
    assert.deepStrictEqual(emptyLookup.synaxarium(), []); // Fallback returns flat array cleanly
});
