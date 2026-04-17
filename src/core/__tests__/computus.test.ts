import {
    copticToJDN,
    jdnToCopticElements,
    gregorianToJDN,
} from '../computus.js';

describe('Computus Unit', () => {
    it('should successfully roundtrip Coptic 1740-01-01 through JDN', () => {
        const jdn = copticToJDN(1740, 1, 1);
        const elements = jdnToCopticElements(jdn);
        expect(elements).toEqual({ year: 1740, month: 1, day: 1 });
    });

    it('should correctly assert the Unix Epoch JDN (1970-01-01)', () => {
        expect(gregorianToJDN(1970, 1, 1)).toBe(2440588);
    });
});
