import type { Rule } from '../../core/RuleEngine.js';
import { SYNAXARIUM_NAMES } from './constants.js';

export interface SynaxariumContext {
    /** Coptic month (1-13) */
    readonly month: number;
    /** Coptic day (1-30) */
    readonly day: number;
}

/**
 * Prioritized rules for Saint commemorations.
 * Currently defaults to a single high-priority daily lookup.
 */
export const SYNAXARIUM_RULES: Rule<SynaxariumContext, string[]>[] = [
    {
        name: 'DailyCommemorationLookup',
        priority: 100,
        condition: () => true,
        apply: (ctx) => SYNAXARIUM_NAMES[`${ctx.month}-${ctx.day}`] || []
    }
];
