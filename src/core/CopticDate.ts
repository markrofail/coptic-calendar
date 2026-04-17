export interface DurationLike {
    years?: number;
    months?: number;
    weeks?: number;
    days?: number;
}

export type CopticDatePlugin = (copticClass: typeof CopticDate) => void;

import { copticToJDN, jdnToCopticElements } from './computus.js';
import { COPTIC_MONTHS, CALENDAR_UNITS } from './constants.js';

export class CopticDate {
    public readonly year: number;
    public readonly month: number;
    public readonly day: number;

    private constructor(year: number, month: number, day: number) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    get inLeapYear(): boolean {
        return this.year % CALENDAR_UNITS.LEAP_YEAR_CYCLE === CALENDAR_UNITS.LEAP_YEAR_REMAINDER;
    }

    get daysInMonth(): number {
        if (this.month === COPTIC_MONTHS.NASIE) {
            return this.inLeapYear ? 6 : 5;
        }
        return CALENDAR_UNITS.DAYS_IN_MONTH;
    }

    get daysInYear(): number {
        return this.inLeapYear ? CALENDAR_UNITS.DAYS_IN_LEAP_YEAR : CALENDAR_UNITS.DAYS_IN_YEAR;
    }

    readonly monthsInYear = COPTIC_MONTHS.NASIE;

    static extend(plugin: CopticDatePlugin): typeof CopticDate {
        plugin(CopticDate);
        return CopticDate;
    }

    static from(item: unknown): CopticDate {
        if (item instanceof CopticDate) {
            return new CopticDate(item.year, item.month, item.day);
        }
        if (
            typeof item === 'object' &&
            item !== null &&
            'year' in item &&
            'month' in item &&
            'day' in item
        ) {
            const obj = item as { year: number; month: number; day: number };
            return new CopticDate(obj.year, obj.month, obj.day);
        }
        throw new TypeError('Invalid CopticDate item');
    }

    static compare(one: CopticDate, two: CopticDate): -1 | 0 | 1 {
        if (one.year !== two.year) return one.year < two.year ? -1 : 1;
        if (one.month !== two.month) return one.month < two.month ? -1 : 1;
        if (one.day !== two.day) return one.day < two.day ? -1 : 1;
        return 0;
    }

    with(fields: { year?: number; month?: number; day?: number }): CopticDate {
        const y = fields.year ?? this.year;
        const m = fields.month ?? this.month;
        let d = fields.day ?? this.day;

        const maxDays = m === COPTIC_MONTHS.NASIE ? (y % 4 === 3 ? 6 : 5) : 30;
        if (d > maxDays) d = maxDays;

        return new CopticDate(y, m, d);
    }

    add(durationOption: DurationLike): CopticDate {
        const { years = 0, months = 0, weeks = 0, days = 0 } = durationOption;

        // 1. Add years
        let y = this.year + years;
        let m = this.month;
        let d = this.day;

        // 2. Add months
        m += months;
        while (m > COPTIC_MONTHS.NASIE) {
            m -= COPTIC_MONTHS.NASIE;
            y++;
        }
        while (m < 1) {
            m += COPTIC_MONTHS.NASIE;
            y--;
        }

        // Constrain days before adding weeks/days
        const maxDays = m === COPTIC_MONTHS.NASIE ? (y % 4 === 3 ? 6 : 5) : 30;
        if (d > maxDays) d = maxDays;

        // 3. Add weeks & days
        const totalDaysToAdd = weeks * 7 + days;
        if (totalDaysToAdd === 0) return new CopticDate(y, m, d);

        const jdn = copticToJDN(y, m, d) + totalDaysToAdd;
        const elements = jdnToCopticElements(jdn);
        return new CopticDate(elements.year, elements.month, elements.day);
    }

    subtract(durationOption: DurationLike): CopticDate {
        return this.add({
            years: -(durationOption.years ?? 0),
            months: -(durationOption.months ?? 0),
            weeks: -(durationOption.weeks ?? 0),
            days: -(durationOption.days ?? 0),
        });
    }

    equals(other: CopticDate): boolean {
        return this.year === other.year && this.month === other.month && this.day === other.day;
    }

    toString(): string {
        const pad = (n: number, w: number): string => n.toString().padStart(w, '0');
        return `${pad(this.year, 4)}-${pad(this.month, 2)}-${pad(this.day, 2)}[u-ca=coptic]`;
    }
}
