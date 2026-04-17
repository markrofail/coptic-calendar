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

    it('should return null when no rules match', () => {
        const emptyEngine = new RuleEngine<any, string>([]);
        expect(emptyEngine.resolve({})).toBe(null);
    });

    it('should choose the first rule in list order if priorities are equal', () => {
        const tiedRules = [
            { name: 'First', priority: 50, condition: () => true, apply: () => 'first' },
            { name: 'Second', priority: 50, condition: () => true, apply: () => 'second' },
        ];
        const tiedEngine = new RuleEngine<any, string>(tiedRules);
        expect(tiedEngine.resolve({})).toBe('first');
    });
});
