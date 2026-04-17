export { CopticDate, type DurationLike } from './core/CopticDate.js';
export { jsDateToCopticDate, getEasterForCopticYear } from './core/computus.js';
export { ALL_COPTIC_OCCASIONS, COPTIC_MONTH_NAMES, COPTIC_MONTHS, type CopticOccasion } from './core/constants.js';
export { RuleEngine, type Rule } from './core/RuleEngine.js';

// Plugins (Vertical Slices)
export * from './plugins/synaxarium/index.js';
export * from './plugins/occasions/index.js';
export * from './plugins/typicon/index.js';
