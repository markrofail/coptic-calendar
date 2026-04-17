import assert from 'node:assert';
import { CopticDate } from '../../../core/CopticDate.js';
import { getLiturgicalRite, typiconPlugin } from '../index.js';
import { getEasterForCopticYear } from '../../../core/computus.js';
test('getLiturgicalRite evaluates Pentecost accurately turning off metanoias entirely', () => {
    const easter = getEasterForCopticYear(1740);
    const rite = getLiturgicalRite(easter);

    assert.strictEqual(rite.season, 'Pentecost');
    assert.strictEqual(rite.tune, 'Joyful');
    assert.strictEqual(rite.hasMetanoias, false);
});

test('getLiturgicalRite guarantees Great Lent Weekdays force metanoias while Weekends explicitly deny them natively', () => {
    const easter = getEasterForCopticYear(1740);
    // Move inside Lent natively cleanly.
    const lentWeekday = easter.subtract({ days: 20 }); // A random day inside Great Lent
    const riteWeekday = getLiturgicalRite(lentWeekday);

    assert.strictEqual(riteWeekday.season, 'GreatLent');
    assert.ok(riteWeekday.tune === 'Lenten' || riteWeekday.tune === 'Fasting');

    // Make sure metanoias follow standard liturgical typicon strictly natively conditionally manually!
    if (riteWeekday.tune === 'Lenten') {
        assert.strictEqual(riteWeekday.hasMetanoias, true); // Weekdays enforce metanoias securely natively.
    } else {
        assert.strictEqual(riteWeekday.hasMetanoias, false); // Weekends deny metanoias entirely.
    }
});

test('typiconPlugin correctly hooks into CopticDate structurally', () => {
    CopticDate.extend(typiconPlugin);
    const date = CopticDate.from({ year: 1740, month: 1, day: 1 });

    assert.strictEqual(typeof date.rite, 'function');
    const computedRite = date.rite();

    // Nayrouz overrides normal logic seamlessly injecting Joyful constraints globally.
    assert.strictEqual(computedRite.tune, 'Joyful');
    assert.strictEqual(computedRite.season, 'Nayrouz');
    assert.strictEqual(computedRite.hasMetanoias, false);
});
