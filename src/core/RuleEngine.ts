/**
 * A prioritized Rule interface for the Coptic Liturgical Engine.
 * Rules with lower priority values are evaluated first (higher precedence).
 */
export interface Rule<TContext, TResult> {
    readonly name: string;
    readonly priority: number;
    condition: (ctx: TContext) => boolean;
    apply: (ctx: TContext) => TResult;
}

/**
 * Functional engine that resolves the highest priority matching rule for a given context.
 */
export class RuleEngine<TContext, TResult> {
    private readonly rules: Rule<TContext, TResult>[];

    constructor(rules: Rule<TContext, TResult>[]) {
        // Sort rules by priority once at construction (ascending)
        this.rules = [...rules].sort((a, b) => a.priority - b.priority);
    }

    /**
     * Finds and applies the first matching rule for the provided context.
     * Returns null if no rule matches.
     */
    resolve(ctx: TContext): TResult | null {
        /* istanbul ignore next */
        for (let i = 0; i < this.rules.length; i++) {
            const rule = this.rules[i];
            if (rule.condition(ctx)) {
                return rule.apply(ctx);
            }
        }
        return null;
    }
}
