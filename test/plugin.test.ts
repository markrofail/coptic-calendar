import { test } from '@jest/globals';
import assert from 'node:assert';
import { CopticDate } from '../src/CopticDate.js';
import { synaxariumPlugin, occasionsPlugin } from '../src/plugin.js';

test('Primitive operates naturally before plugin instantiation cleanly', () => {
    const coptic = CopticDate.from({ year: 1740, month: 1, day: 1 });
    // Any access to .occasions safely fails because the primitive restricts the type footprint.
    assert.strictEqual(typeof (coptic as unknown as Record<string, unknown>).occasions, 'undefined');
    assert.strictEqual(typeof (coptic as unknown as Record<string, unknown>).synaxarium, 'undefined');
});

test('synaxariumPlugin and occasionsPlugin independently inject routines properly', () => {
    const coptic = CopticDate.from({ year: 1740, month: 1, day: 1 });

    CopticDate.extend(synaxariumPlugin);
    assert.strictEqual(typeof coptic.synaxarium, 'function');

    CopticDate.extend(occasionsPlugin);
    assert.strictEqual(typeof coptic.occasions, 'function');

    const occasionsList = coptic.occasions();
    assert.ok(occasionsList.includes('Nayrouz'));

    const saints = coptic.synaxarium();
    assert.ok(saints.length >= 1);
});
