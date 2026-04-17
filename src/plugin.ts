import { CopticDate } from './CopticDate.js';
import { getSynaxariumNames } from './synaxarium.js';
import { getOccasionsOnCopticDate } from './occasions.js';
import type { CopticOccasion } from './constants.js';

declare module './CopticDate.js' {
    interface CopticDate {
        /**
         * Resolves the canonical Church readings corresponding exactly sequentially to this native date.
         */
        synaxarium(): string[];

        /**
         * Resolves ecclesiastical Feasts natively dynamically tracking against Alexandrian formulas.
         */
        occasions(): CopticOccasion[];
    }
}

/**
 * Injects the .synaxarium() method into the CopticDate primitive.
 */
export function synaxariumPlugin(CopticDateClass: typeof CopticDate): void {
    if (!CopticDateClass.prototype.synaxarium) {
        CopticDateClass.prototype.synaxarium = function (this: CopticDate): string[] {
            return getSynaxariumNames(this.month, this.day);
        };
    }
}

/**
 * Injects the .occasions() method into the CopticDate primitive.
 */
export function occasionsPlugin(CopticDateClass: typeof CopticDate): void {
    if (!CopticDateClass.prototype.occasions) {
        CopticDateClass.prototype.occasions = function (this: CopticDate): CopticOccasion[] {
            return getOccasionsOnCopticDate(this);
        };
    }
}
