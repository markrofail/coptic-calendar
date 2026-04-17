import { CopticDate } from '../../core/CopticDate.js';
import { RuleEngine } from '../../core/RuleEngine.js';
import { SYNAXARIUM_RULES } from './rules.js';
import type { SynaxariumContext } from './rules.js';

const engine = new RuleEngine<SynaxariumContext, string[]>(SYNAXARIUM_RULES);

/**
 * Resolves the names of the Saints commemorated on a specific Coptic Month and Day.
 * Returns an empty array if no entry exists in the localized dictionary.
 */
export function getSynaxariumNames(month: number, day: number): string[] {
    return engine.resolve({ month, day }) || [];
}

declare module '../../core/CopticDate.js' {
    interface CopticDate {
        /**
         * Resolves the canonical Church readings corresponding exactly sequentially to this native date.
         */
        synaxarium(): string[];
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
