# Coptic Calendar

A lightning-fast, zero-dependency TypeScript library for comprehensive Coptic calendar conversions, ecclesiastical fast/feast spanning, and native Synaxarium lookups.

## Features

- **Julian Day Number Arithmetic**: Calculates exact leap year offsets and calendar drift purely mathematically (O(1) speeds naturally) without any external dependency limits.
- **Ecclesiastical Occasions Mapping**: Dynamically tracks both fixed feasts and calculates Alexandrian floating algorithms (Easter spans) to resolve Coptic fasts (Lent, Apostles, Jonah's, etc.) over continuous block spans flexibly!
- **365-Day English Synaxarium Canonical Match**: Integrated mappings containing the authentic comprehensive ecclesiastical names for the Saints commemorated daily, evaluated canonically from the church's core payloads securely.
- **Robust formatting & OOP methods**: Fluent immutable APIs to perform arithmetic gracefully (`.addDays()`) and formatting string tokens seamlessly natively (`.format("YYYY MMMM DD")`).
- **Fully ESM and Type-Safe**: Ships with explicit TS definitions natively optimized.

## Installation

```bash
npm install coptic-calendar
```

## Quick Start

```typescript
import { CopticDate } from 'coptic-calendar';

// Instantiate directly mapped from your native Timezone execution
const today = CopticDate.today();
console.log(today.format('DD MMMM YYYY')); // e.g: "29 Koiak 1740"

// Or explicitly instantiate from native Gregorian Dates natively
const jsDate = new Date('2024-01-08');
const coptic = CopticDate.fromJSDate(jsDate);

console.log(coptic.year); // 1740
console.log(coptic.month); // 4
console.log(coptic.day); // 29

// Convert seamlessly back to Native JS Dates
const backToGregorian = coptic.toJSDate();
```

## Immutable Native Math

Add or subtract days safely tracking Leap Year Coptic thresholds beautifully across the 13 months!

```typescript
const startOfLent = CopticDate.fromComponents(1740, 6, 2);
const dayIntoLent = startOfLent.addDays(15);
```

## Feast and Fast Evaluation

Track all ecclesiastical block bounds and dates natively via purely efficient evaluation wrappers!

```typescript
const checkingDate = CopticDate.fromComponents(1740, 6, 15);
const currentOccasions = checkingDate.occasions(); 
// Returns ['Lent'] successfully capturing elapsed tracking inside the internal range dynamically!
```

## Canonical Synaxarium Lookups

Effortlessly expose localized ecclesiastical memory data corresponding smoothly to daily commemorations!

```typescript
const nayrouz = CopticDate.fromComponents(1740, 1, 1);
const saints = nayrouz.synaxarium();
// ['Feast of El-Nayrouz (Beginning of the Blessed Coptic Year).', ...] 
```

## Running Tests

```bash
npm install
npm test
```

## License
MIT
