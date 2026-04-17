import { CopticDate } from '../../../core/CopticDate.js';
import { getLiturgicalRite, typiconPlugin } from '../index.js';
import { occasionsPlugin, getEasterForCopticYear } from '../../occasions/index.js';

// Initialize plugin
CopticDate.extend(typiconPlugin);

describe('Typicon Plugin', () => {
    it.each([
        // Priority 10: Holy Week
        {
            offset: -3,
            season: 'HolyWeek',
            tune: 'HolyWeek',
            metanoias: false,
            title: 'Holy Wednesday',
        },
        // Priority 20: Palm Sunday
        {
            offset: -7,
            season: 'PalmSunday',
            tune: 'PalmSunday',
            metanoias: false,
            title: 'Palm Sunday',
        },
        // Priority 21: Feast of the Cross (Tut 17)
        {
            date: { year: 1740, month: 1, day: 17 },
            season: 'FeastOfTheCross',
            tune: 'PalmSunday',
            metanoias: false,
            title: 'Feast of the Cross',
        },
        // Priority 30: Pentecost (Holy 50 Days)
        {
            offset: 10,
            season: 'Pentecost',
            tune: 'Joyful',
            metanoias: false,
            title: '10th day of Pentecost',
        },
        // Priority 40: Major/Minor Feasts (Nativity)
        {
            date: { year: 1740, month: 4, day: 29 },
            season: 'Nativity',
            tune: 'Joyful',
            metanoias: false,
            title: 'Nativity',
        },
        // Priority 50: Commemoration of the Lord (29th)
        {
            date: { year: 1740, month: 1, day: 29 },
            season: 'CommemorationOfLord',
            tune: 'Joyful',
            metanoias: false,
            title: '29th of Tut',
        },
        // Priority 60: Nayrouz
        {
            date: { year: 1740, month: 1, day: 1 },
            season: 'Nayrouz',
            tune: 'Joyful',
            metanoias: false,
            title: 'Nayrouz',
        },
        // Priority 65: Paramoun
        {
            date: { year: 1740, month: 4, day: 28 },
            season: 'Paramoun',
            tune: 'Annual',
            metanoias: true,
            title: 'Nativity Paramoun',
        },
        // Priority 70: Kiahk (Weekday vs Sunday)
        {
            date: { year: 1740, month: 4, day: 15 },
            season: 'Kiahk',
            tune: 'Kiahk',
            metanoias: true,
            title: 'Kiahk Weekday',
        },
        {
            date: { year: 1740, month: 4, day: 7 },
            season: 'Kiahk',
            tune: 'Kiahk',
            metanoias: false,
            title: 'Kiahk Sunday',
        },
        // Priority 80: Jonah's Fast
        {
            offset: -68,
            season: 'JonahsFast',
            tune: 'Lenten',
            metanoias: true,
            title: "Jonah's Fast",
        },
        // Priority 81: Jonah's Passover
        {
            offset: -66,
            season: 'JonahsPassover',
            tune: 'Annual',
            metanoias: false,
            title: "Jonah's Passover",
        },
        // Priority 90: Great Lent (Weekday vs Weekend)
        {
            offset: -20,
            season: 'GreatLent',
            tune: 'Lenten',
            metanoias: true,
            title: 'Lent Weekday',
        },
        {
            offset: -15,
            season: 'GreatLent',
            tune: 'Fasting',
            metanoias: false,
            title: 'Lent Saturday',
        },
        // Priority 100: General Fasts (St Mary)
        {
            date: { year: 1740, month: 12, day: 10 },
            season: 'StMarysFast',
            tune: 'Fasting',
            metanoias: true,
            title: 'St Mary Fast Weekday',
        },
        // Priority 1000: Annual (Baba 1)
        {
            date: { year: 1740, month: 2, day: 1 },
            season: 'Annual',
            tune: 'Annual',
            metanoias: true,
            title: 'Annual Weekday',
        },
        {
            date: { year: 1740, month: 2, day: 4 },
            season: 'Annual',
            tune: 'Annual',
            metanoias: false,
            title: 'Annual Sunday',
        },
    ])(
        'should correctly resolve the rite for $title',
        (item: {
            date?: { year: number; month: number; day: number };
            offset?: number;
            season: string;
            tune: string;
            metanoias: boolean;
            title: string;
        }) => {
            const { date, offset, season, tune, metanoias } = item;
            let testDate: CopticDate;
            if (offset !== undefined) {
                const easter = getEasterForCopticYear(1740);
                testDate =
                    offset < 0
                        ? easter.subtract({ days: Math.abs(offset) })
                        : easter.add({ days: offset });
            } else {
                testDate = CopticDate.from(date!);
            }

            const rite = testDate.rite();
            expect(rite.season).toBe(season);
            expect(rite.tune).toBe(tune);
            expect(rite.hasMetanoias).toBe(metanoias);
        },
    );

    it('should evaluate Pentecost accurately and disable metanoias', () => {
        const easter = getEasterForCopticYear(1740);
        const rite = easter.rite();

        expect(rite.season).toBe('Pentecost');
        expect(rite.tune).toBe('Joyful');
        expect(rite.hasMetanoias).toBe(false);
    });

    it('should return raw rite when no locale is provided', () => {
        const date = CopticDate.from({ year: 1740, month: 4, day: 1 }); // Kiahk
        const rite = date.rite();
        expect(rite.season).toBe('Kiahk');
        expect(rite.tune).toBe('Kiahk');
    });

    it('should return localized rite names when locale is provided', () => {
        const date = CopticDate.from({ year: 1740, month: 4, day: 1 });
        const rite = date.rite({ locale: 'ar' });
        expect(rite.season).toBe('كيهك');
        expect(rite.tune).toBe('كيهكي');
    });
});
