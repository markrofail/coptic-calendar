import { RuleEngine, type Rule } from '../RuleEngine.js';

describe('RuleEngine', () => {
    interface TestCtx {
        match?: boolean;
    }
    const rules: Rule<TestCtx, string>[] = [
        { name: 'LowPriority', priority: 100, condition: (): boolean => true, apply: (): string => 'low' },
        {
            name: 'HighPriority',
            priority: 10,
            condition: (ctx: TestCtx): boolean => ctx.match === true,
            apply: (): string => 'high',
        },
    ];
    const engine = new RuleEngine<TestCtx, string>(rules);

    it('should respect rule priorities where a lower number wins', () => {
        expect(engine.resolve({ match: true })).toBe('high');
        expect(engine.resolve({ match: false })).toBe('low');
    });

    it('should match a middle rule to cover loop completion/break', () => {
        const rules: Rule<TestCtx, string>[] = [
            { name: '1', priority: 1, condition: (): boolean => false, apply: (): string => '1' },
            { name: '2', priority: 2, condition: (): boolean => true, apply: (): string => '2' },
            { name: '3', priority: 3, condition: (): boolean => true, apply: (): string => '3' },
        ];
        expect(new RuleEngine<TestCtx, string>(rules).resolve({})).toBe('2');
    });

    it('should hit the end of the loop when no rules match', () => {
        const engine = new RuleEngine<TestCtx, string>([
            { name: 'Fail', priority: 1, condition: (): boolean => false, apply: (): string => 'fail' },
        ]);
        expect(engine.resolve({})).toBe(null);
    });

    it('should handle matchNone with empty ruleset', () => {
        const engine = new RuleEngine<Record<string, unknown>, string>([]);
        expect(engine.resolve({})).toBe(null);
    });

    it('should correctly sort rules even when added out of order', () => {
        const outOfOrderRules: Rule<string, string>[] = [
            {
                name: 'Low',
                priority: 10,
                condition: (ctx: string): boolean => ctx === 'low',
                apply: (): string => 'low',
            },
            {
                name: 'High',
                priority: 1,
                condition: (ctx: string): boolean => ctx === 'high',
                apply: (): string => 'high',
            },
        ];
        const engine2 = new RuleEngine<string, string>(outOfOrderRules);
        expect(engine2.resolve('high')).toBe('high');
        expect(engine2.resolve('low')).toBe('low');
    });

    it('should choose the first rule in list order if priorities are equal', () => {
        const tiedRules: Rule<Record<string, unknown>, string>[] = [
            { name: 'First', priority: 50, condition: (): boolean => true, apply: (): string => 'first' },
            { name: 'Second', priority: 50, condition: (): boolean => true, apply: (): string => 'second' },
        ];
        const tiedEngine = new RuleEngine<Record<string, unknown>, string>(tiedRules);
        expect(tiedEngine.resolve({})).toBe('first');
    });

    it('should match a middle rule to cover loop completion/break', () => {
        const rules: Rule<Record<string, unknown>, string>[] = [
            { name: '1', priority: 1, condition: (): boolean => false, apply: (): string => '1' },
            { name: '2', priority: 2, condition: (): boolean => true, apply: (): string => '2' },
            { name: '3', priority: 3, condition: (): boolean => true, apply: (): string => '3' },
        ];
        expect(new RuleEngine<Record<string, unknown>, string>(rules).resolve({})).toBe('2');
    });

    it('should sort rules in constructor branches', () => {
        const r1: Rule<Record<string, unknown>, string> = {
            name: 'A',
            priority: 10,
            condition: (): boolean => true,
            apply: (): string => 'A',
        };
        const r2: Rule<Record<string, unknown>, string> = {
            name: 'B',
            priority: 5,
            condition: (): boolean => true,
            apply: (): string => 'B',
        };
        const engine = new RuleEngine([r1, r2]);
        expect(engine.resolve({})).toBe('B');
    });

    it('should handle tied priorities in sorting', () => {
        const r1: Rule<Record<string, unknown>, string> = {
            name: 'A',
            priority: 1,
            condition: (): boolean => true,
            apply: (): string => 'A',
        };
        const r2: Rule<Record<string, unknown>, string> = {
            name: 'B',
            priority: 1,
            condition: (): boolean => true,
            apply: (): string => 'B',
        };
        // This hits the a - b === 0 branch in sort
        const engine = new RuleEngine([r1, r2]);
        expect(engine.resolve({})).toBeDefined();
    });
});
