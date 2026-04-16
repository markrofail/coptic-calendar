import { gregorianToJDN } from './computus.js';
import { COPTIC_MONTH_NAMES, type CopticOccasion } from './constants.js';
import { getOccasionForCopticYear, getOccasionsOnCopticDate } from './occasions.js';
import { getSynaxariumNames } from './synaxarium.js';

export class CopticDate {
    public year: number;
    public month: number;
    public day: number;

    constructor(date: Date = new Date()) {
        const gregYear = date.getFullYear();
        const gregMonth = date.getMonth() + 1;
        const gregDay = date.getDate();

        const jdn = gregorianToJDN(gregYear, gregMonth, gregDay);
        const COPTIC_EPOCH_JDN = 1825030;
        const daysSinceEpoch = jdn - COPTIC_EPOCH_JDN;

        this.year = Math.floor((4 * daysSinceEpoch + 1463) / 1461);

        const startOfYearJDN = COPTIC_EPOCH_JDN + 365 * (this.year - 1) + Math.floor(this.year / 4);
        const dayOfYear = jdn - startOfYearJDN + 1;

        this.month = Math.floor((dayOfYear - 1) / 30) + 1;
        this.day = ((dayOfYear - 1) % 30) + 1;
    }

    static today(): CopticDate {
        return new CopticDate();
    }

    static fromComponents(year: number, month: number, day: number): CopticDate {
        const cd = new CopticDate();
        cd.year = year;
        cd.month = month;
        cd.day = day;
        return cd;
    }

    static next(occasion: CopticOccasion): CopticDate {
        return CopticDate.today().next(occasion);
    }

    public next(occasion: CopticOccasion): CopticDate {
        let occDate = getOccasionForCopticYear(occasion, this.year);

        const thisJdn = this.toJSDate().getTime();
        const occJdn = occDate.toJSDate().getTime();

        if (thisJdn > occJdn) {
            occDate = getOccasionForCopticYear(occasion, this.year + 1);
        }

        return occDate;
    }

    public toJSDate(): Date {
        const daysSinceEpoch =
            365 * (this.year - 1) +
            Math.floor(this.year / 4) +
            30 * (this.month - 1) +
            (this.day - 1);
        const COPTIC_EPOCH_JDN = 1825030;
        const jdn = COPTIC_EPOCH_JDN + daysSinceEpoch;

        const JDN_1970_01_01 = 2440588;
        const daysSince1970 = jdn - JDN_1970_01_01;
        const utcDate = new Date(daysSince1970 * 86400000);

        const localDate = new Date();
        localDate.setFullYear(
            utcDate.getUTCFullYear(),
            utcDate.getUTCMonth(),
            utcDate.getUTCDate(),
        );
        localDate.setHours(0, 0, 0, 0);
        return localDate;
    }

    public occasions(): CopticOccasion[] {
        return getOccasionsOnCopticDate(this);
    }

    public synaxarium(): string[] {
        return getSynaxariumNames(this.month, this.day);
    }

    public format(pattern: string): string {
        const pad = (num: number): string => num.toString().padStart(2, '0');
        const monthName = COPTIC_MONTH_NAMES[this.month];
        const tokens: Record<string, string> = {
            YYYY: this.year.toString(),
            MMMM: monthName !== undefined ? monthName : '',
            MM: pad(this.month),
            M: this.month.toString(),
            DD: pad(this.day),
            D: this.day.toString(),
        };

        const sortedTokens = Object.keys(tokens).sort((a, b) => b.length - a.length);
        const regex = new RegExp(sortedTokens.join('|'), 'g');
        return pattern.replace(regex, (match) => tokens[match] || match);
    }

    public isLeapYear(): boolean {
        return this.year % 4 === 3;
    }

    public addDays(days: number): CopticDate {
        const jsDate = this.toJSDate();
        jsDate.setDate(jsDate.getDate() + days);
        return new CopticDate(jsDate);
    }
}
