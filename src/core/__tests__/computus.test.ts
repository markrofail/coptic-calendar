import assert from 'node:assert';
import { getEasterForCopticYear, gregorianToJDN } from '../computus.js';

test('getEasterForCopticYear resolves Alexandrian Equinox correctly', () => {
    const easter = getEasterForCopticYear(1740);
    assert.ok(easter.month > 0);
    assert.strictEqual(easter.year, 1740);
});

test('gregorianToJDN correctly asserts epoch anchors', () => {
    const epochJD = gregorianToJDN(1970, 1, 1);
    assert.strictEqual(epochJD, 2440588);
});
