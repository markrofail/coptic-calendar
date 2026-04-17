import { CopticDate } from '../../core/CopticDate.js';
import { synaxariumPlugin } from '../synaxarium/index.js';
import { occasionsPlugin } from '../occasions/index.js';

test('Primitive operates naturally before plugin instantiation cleanly', () => {
    const coptic = CopticDate.from({ year: 1740, month: 1, day: 1 });
    // Any access to .occasions safely fails because the primitive restricts the type footprint.
    expect(typeof (coptic as unknown as Record<string, unknown>).occasions).toBe('undefined');
    expect(typeof (coptic as unknown as Record<string, unknown>).synaxarium).toBe('undefined');
});

test('synaxariumPlugin and occasionsPlugin independently inject routines properly', () => {
    const coptic = CopticDate.from({ year: 1740, month: 1, day: 1 });

    CopticDate.extend(synaxariumPlugin);
    expect(typeof coptic.synaxarium).toBe('function');

    CopticDate.extend(occasionsPlugin);
    expect(typeof coptic.occasions).toBe('function');

    const occasionsList = coptic.occasions();
    expect(occasionsList).toContain('Nayrouz');

    const saints = coptic.synaxarium();
    expect(saints.length).toBeGreaterThanOrEqual(1);
});
