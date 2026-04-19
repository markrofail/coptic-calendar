import { copticToJDN, jdnToCopticElements, gregorianToJDN } from './computus.js';
import { COPTIC_MONTHS, CALENDAR_UNITS } from './constants.js';
import { translateMonth, type Locale } from './i18n.js';

interface DurationLike {
    years?: number;
    months?: number;
    weeks?: number;
    days?: number;
}

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
        if (this.month !== COPTIC_MONTHS.NASIE) {
            return CALENDAR_UNITS.DAYS_IN_MONTH;
        }
        return this.inLeapYear ? 6 : 5;
    }

    /**
     * Returns the Julian Day Number (JDN) for this date.
     */
    get jdn(): number {
        return copticToJDN(this.year, this.month, this.day);
    }

    /**
     * Creates a CopticDate from a Julian Day Number (JDN).
     */
    static fromJDN(jdn: number): CopticDate {
        const { year, month, day } = jdnToCopticElements(jdn);
        return new CopticDate(year, month, day);
    }

    get daysInYear(): number {
        return this.inLeapYear ? CALENDAR_UNITS.DAYS_IN_LEAP_YEAR : CALENDAR_UNITS.DAYS_IN_YEAR;
    }

    readonly monthsInYear = COPTIC_MONTHS.NASIE;

    static extend(plugin: (copticClass: typeof CopticDate) => void): void {
        plugin(CopticDate);
    }

    static from(item: CopticDate
        | Date
        | string
        | number
        | { year: number; month: number; day: number }
        | { epochMilliseconds: number }
        | { toJSDate: () => Date };): CopticDate {
        if (item === null || item === undefined) {
            throw new TypeError("Cannot convert null or undefined to CopticDate");
        }

        // 1. Handle native Coptic shapes (Instance or { year, month, day })
        if (typeof item === 'object' && 'year' in item && 'month' in item && 'day' in item) {
            return new CopticDate(Number(item.year), Number(item.month), Number(item.day));
        }

        // 2. Normalize all other supported inputs into a JS Date
        let jsDate: Date;
        if (item instanceof Date) {
            jsDate = item;
        } else if (typeof item === 'string' || typeof item === 'number') {
            jsDate = new Date(item);
        } else if (typeof item === 'object' && 'epochMilliseconds' in item) {
            jsDate = new Date(Number(item.epochMilliseconds));
        } else if (typeof item === 'object' && 'toJSDate' in item && typeof item.toJSDate === 'function') {
            jsDate = item.toJSDate();
        } else {
            throw new TypeError(`Unrecognized date format: ${JSON.stringify(item)}`);
        }

        // 3. Validate the normalized Date
        if (isNaN(jsDate.getTime())) {
            throw new TypeError(`Invalid date value parsed from: ${JSON.stringify(item)}`);
        }

        // 4. Calculate and return
        const jdn = gregorianToJDN(jsDate.getUTCFullYear(), jsDate.getUTCMonth() + 1, jsDate.getUTCDate());
        const { year, month, day } = jdnToCopticElements(jdn);

        return new CopticDate(year, month, day);
    }
    static compare(one: CopticDate, two: CopticDate): -1 | 0 | 1 {
        if (one.year !== two.year) return one.year < two.year ? -1 : 1;
        if (one.month !== two.month) return one.month < two.month ? -1 : 1;
        if (one.day !== two.day) return one.day < two.day ? -1 : 1;
        return 0;
    }

    with(fields: { year?: number; month?: number; day?: number }): CopticDate {
        const { year: y, month: m, day: currentDay } = this;
        const targetYear = fields.year ?? y;
        const targetMonth = fields.month ?? m;
        let d = fields.day ?? currentDay;

        // Correctly calculate max days for the target month/year
        const maxDays =
            targetMonth === COPTIC_MONTHS.NASIE
                ? targetYear % CALENDAR_UNITS.LEAP_YEAR_CYCLE === CALENDAR_UNITS.LEAP_YEAR_REMAINDER
                    ? 6
                    : 5
                : CALENDAR_UNITS.DAYS_IN_MONTH;
        if (d > maxDays) d = maxDays;

        return new CopticDate(targetYear, targetMonth, d);
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

    toLocaleString(opts?: { locale?: Locale }): string {
        const locale = opts?.locale || 'en';
        const monthName = translateMonth(this.month, locale);
        return `${this.day} ${monthName} ${this.year}`;
    }
}
