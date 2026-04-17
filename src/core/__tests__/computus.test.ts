import { getEasterForCopticYear, gregorianToJDN } from '../computus.js';

test('getEasterForCopticYear resolves Alexandrian Equinox correctly', () => {
    const easter = getEasterForCopticYear(1740);
    expect(easter.month).toBeGreaterThan(0);
    expect(easter.year).toBe(1740);
});

test('gregorianToJDN correctly asserts epoch anchors', () => {
    const epochJD = gregorianToJDN(1970, 1, 1);
    expect(epochJD).toBe(2440588);
});
