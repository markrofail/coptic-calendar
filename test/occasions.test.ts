import { test } from '@jest/globals';
import assert from 'node:assert';
import { getOccasionForCopticYear } from '../src/occasions.js';

test('getOccasionForCopticYear routes properly', () => {
    const nayrouz = getOccasionForCopticYear('Nayrouz', 1740);
    assert.strictEqual(nayrouz.month, 1);
    assert.strictEqual(nayrouz.day, 1);
});
