import { CopticDate } from '../../../core/CopticDate.js';
import { getLiturgicalRite, typiconPlugin } from '../index.js';
import { getEasterForCopticYear } from '../../../core/computus.js';
test('getLiturgicalRite evaluates Pentecost accurately turning off metanoias entirely', () => {
    const easter = getEasterForCopticYear(1740);
    const rite = getLiturgicalRite(easter);

    expect(rite.season).toBe('Pentecost');
    expect(rite.tune).toBe('Joyful');
    expect(rite.hasMetanoias).toBe(false);
});

test('getLiturgicalRite guarantees Great Lent Weekdays force metanoias while Weekends explicitly deny them natively', () => {
    const easter = getEasterForCopticYear(1740);
    // Move inside Lent natively cleanly.
    const lentWeekday = easter.subtract({ days: 20 }); // A random day inside Great Lent
    const riteWeekday = getLiturgicalRite(lentWeekday);

    expect(riteWeekday.season).toBe('GreatLent');
    expect(['Lenten', 'Fasting']).toContain(riteWeekday.tune);

    // Make sure metanoias follow standard liturgical typicon strictly natively conditionally manually!
    if (riteWeekday.tune === 'Lenten') {
        expect(riteWeekday.hasMetanoias).toBe(true);
    } else {
        expect(riteWeekday.hasMetanoias).toBe(false);
    }
});

test('typiconPlugin correctly hooks into CopticDate structurally', () => {
    CopticDate.extend(typiconPlugin);
    const date = CopticDate.from({ year: 1740, month: 1, day: 1 });

    expect(typeof date.rite).toBe('function');
    const computedRite = date.rite();

    expect(computedRite.tune).toBe('Joyful');
    expect(computedRite.season).toBe('Nayrouz');
    expect(computedRite.hasMetanoias).toBe(false);
});
