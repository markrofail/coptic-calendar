import type { Rule } from '../../core/RuleEngine.js';
import SYNAXARIUM_NAMES_EN from './locales/en.json' with { type: 'json' };

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
        // source: St-Takla
        // see: https://st-takla.org/Saints/Coptic-Orthodox-Saints-Biography/ (The Coptic Orthodox Daily Commemorative Registry)
        condition: () => true,
        apply: (ctx) =>
            (SYNAXARIUM_NAMES_EN as Record<string, string[]>)[`${ctx.month}-${ctx.day}`] || [],
    },
];
