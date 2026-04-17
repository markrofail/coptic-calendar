import { getOccasionForCopticYear } from '../index.js';

test('getOccasionForCopticYear routes properly', () => {
    const nayrouz = getOccasionForCopticYear('Nayrouz', 1740);
    expect(nayrouz.month).toBe(1);
    expect(nayrouz.day).toBe(1);
});
