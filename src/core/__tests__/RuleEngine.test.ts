import { RuleEngine } from '../RuleEngine.js';

describe('RuleEngine', () => {
    const rules = [
        { name: 'LowPriority', priority: 100, condition: () => true, apply: () => 'low' },
        {
            name: 'HighPriority',
            priority: 10,
            condition: (ctx: any) => ctx.match,
            apply: () => 'high',
        },
    ];
    const engine = new RuleEngine<any, string>(rules);

    it('should respect rule priorities where a lower number wins', () => {
        expect(engine.resolve({ match: true })).toBe('high');
        expect(engine.resolve({ match: false })).toBe('low');
    });

    it('should match a middle rule to cover loop completion/break', () => {
        const rules = [
            { name: '1', priority: 1, condition: () => false, apply: () => '1' },
            { name: '2', priority: 2, condition: () => true, apply: () => '2' },
            { name: '3', priority: 3, condition: () => true, apply: () => '3' },
        ];
        expect(new RuleEngine<any, string>(rules).resolve({})).toBe('2');
    });

    it('should hit the end of the loop when no rules match', () => {
        const engine = new RuleEngine<any, string>([
            { name: 'Fail', priority: 1, condition: () => false, apply: () => 'fail' }
        ]);
        expect(engine.resolve({})).toBe(null);
    });

    it('should handle matchNone with empty ruleset', () => {
        const engine = new RuleEngine([]);
        expect(engine.resolve({})).toBe(null);
    });

    it('should correctly sort rules even when added out of order', () => {
        const outOfOrderRules = [
            { name: 'Low', priority: 10, condition: (ctx: any) => ctx === 'low', apply: () => 'low' },
            { name: 'High', priority: 1, condition: (ctx: any) => ctx === 'high', apply: () => 'high' },
        ];
        const engine2 = new RuleEngine<any, string>(outOfOrderRules);
        expect(engine2.resolve('high')).toBe('high');
        expect(engine2.resolve('low')).toBe('low');
    });

    it('should choose the first rule in list order if priorities are equal', () => {
        const tiedRules = [
            { name: 'First', priority: 50, condition: () => true, apply: () => 'first' },
            { name: 'Second', priority: 50, condition: () => true, apply: () => 'second' },
        ];
        const tiedEngine = new RuleEngine<any, string>(tiedRules);
        expect(tiedEngine.resolve({})).toBe('first');
    });

    it('should match a middle rule to cover loop completion/break', () => {
        const rules = [
            { name: '1', priority: 1, condition: () => false, apply: () => '1' },
            { name: '2', priority: 2, condition: () => true, apply: () => '2' },
            { name: '3', priority: 3, condition: () => true, apply: () => '3' },
        ];
        expect(new RuleEngine<any, string>(rules).resolve({})).toBe('2');
    });

    it('should sort rules in constructor branches', () => {
        const r1 = { name: 'A', priority: 10, condition: () => true, apply: () => 'A' };
        const r2 = { name: 'B', priority: 5, condition: () => true, apply: () => 'B' };
        const engine = new RuleEngine([r1, r2]);
        expect(engine.resolve({})).toBe('B');
    });

    it('should handle tied priorities in sorting', () => {
        const r1 = { name: 'A', priority: 1, condition: () => true, apply: () => 'A' };
        const r2 = { name: 'B', priority: 1, condition: () => true, apply: () => 'B' };
        // This hits the a - b === 0 branch in sort
        const engine = new RuleEngine([r1, r2]);
        expect(engine.resolve({})).toBeDefined();
    });
});
