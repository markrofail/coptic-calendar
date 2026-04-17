# Coptic Calendar

A lightning-fast, zero-dependency TypeScript library for comprehensive Coptic calendar conversions, ecclesiastical fast/feast spanning, and native Synaxarium lookups.

## Features

- **Julian Day Number Arithmetic**: Calculates exact leap year offsets and calendar drift purely mathematically (O(1) speeds naturally) without any external dependency limits.
- **Ecclesiastical Occasions Mapping**: Dynamically tracks both fixed feasts and calculates Alexandrian floating algorithms (Easter spans) to resolve Coptic fasts (Lent, Apostles, Jonah's, etc.) over continuous block spans flexibly!
- **365-Day English Synaxarium Canonical Match**: Integrated mappings containing the authentic comprehensive ecclesiastical names for the Saints commemorated daily, evaluated canonically from the church's core payloads securely.
- **Robust formatting & OOP methods**: Fluent immutable APIs to perform arithmetic gracefully (`.addDays()`) and formatting string tokens seamlessly natively (`.format("YYYY MMMM DD")`).
- **Fully ESM and Type-Safe**: Ships with explicit TS definitions natively optimized.
- **Canonical & Historical Purity**: Extensively cited and attributed to the Council of Nicaea (325 AD) and modern Diocesan authorities (SUS Copts, LACopts).

## Installation

```bash
npm install coptic-calendar
```

## Quick Start

```typescript
import { CopticDate, jsDateToCopticDate } from 'coptic-calendar';

// Instantiate directly mapped from your native Timezone execution
const jsDate = new Date();
const today = jsDateToCopticDate(jsDate);
console.log(today.toString()); // "1740-04-29[u-ca=coptic]"

// Or instantiate from explicit components via the Temporal API signature
const coptic = CopticDate.from({ year: 1740, month: 4, day: 29 });

console.log(coptic.year); // 1740
console.log(coptic.month); // 4
console.log(coptic.day); // 29
```

## Immutable Temporal API Interfaces

Add or subtract safely tracking Leap Year Coptic thresholds natively properly properly beautifully matching `Temporal.PlainDate`!

```typescript
const startOfLent = CopticDate.from({ year: 1740, month: 6, day: 2 });
const dayIntoLent = startOfLent.add({ days: 15 });
const beforeLent = startOfLent.subtract({ weeks: 1 });
```

## Feast and Fast Evaluation

Track all ecclesiastical block bounds and dates natively via pure function wrappers without prototype bloat!

```typescript
import { getOccasionsOnCopticDate } from 'coptic-calendar';

const checkingDate = CopticDate.from({ year: 1740, month: 6, day: 15 });
const currentOccasions = getOccasionsOnCopticDate(checkingDate); 
// Returns ['Lent'] successfully capturing elapsed tracking inside the internal range dynamically!
```

## Canonical Synaxarium Lookups

Effortlessly expose localized ecclesiastical memory data corresponding smoothly to daily commemorations!

```typescript
import { getSynaxariumNames } from 'coptic-calendar';

const nayrouz = CopticDate.from({ year: 1740, month: 1, day: 1 });
const saints = getSynaxariumNames(nayrouz.month, nayrouz.day);
// ['Feast of El-Nayrouz (Beginning of the Blessed Coptic Year).', ...] 
```

## Plugin Extension (For Maximum Convenience)

If you prefer to attach the ecclesiastical features directly onto the `CopticDate` prototype (similar to standard legacy usage or libraries like `Day.js`), you can explicitly opt-in using the plugin securely without violating the generic standard interface inherently for others!

```typescript
import { CopticDate, synaxariumPlugin, occasionsPlugin, typiconPlugin } from 'coptic-calendar';

// 1. Extend the Primitive independently
CopticDate.extend(synaxariumPlugin).extend(occasionsPlugin).extend(typiconPlugin);

// 2. Enjoy native method convenience directly flawlessly!
const nayrouz = CopticDate.from({ year: 1740, month: 1, day: 1 });
const saints = nayrouz.synaxarium();
const occasions = nayrouz.occasions();
const rite = nayrouz.rite(); // { season: 'Nayrouz', tune: 'Joyful', hasMetanoias: false }
```

## Typicon / Rite Rules Engine

`coptic-calendar` provides a standalone zero-dependency Typicon evaluation engine! This solves the incredible headache of resolving complex Coptic Liturgical rules (such as overriding Fasts with Joyful Feasts or tracking when Metanoias are suppressed).

Use the pure function, or simply install the `typiconPlugin` as seen above!

```typescript
import { getLiturgicalRite } from 'coptic-calendar';

const lentWeekday = CopticDate.from({ year: 1740, month: 6, day: 20 });
const rite = getLiturgicalRite(lentWeekday);

console.log(rite);
// { season: 'GreatLent', tune: 'Lenten', hasMetanoias: true }
```

## Canonical Foundations

This library's credibility is built on authoritative ecclesiastical and historical sources:

| Authority | Area of Influence |
| :--- | :--- |
| **Council of Nicaea (325 AD)** | The Alexandrian Computus algorithm used for Easter calculations. |
| **SUS Copts Diocese** | Definitions of Lordly Feasts and Fasting durations. |
| **LACopts Diocese** | Precise Typicon rules for the 29th commemoration of the Lord. |
| **St-Takla.org** | Fixed feast dates and daily Synaxarium registry. |
| **Pope Shenouda III** | Standardized fasting durations (Lent, Nativity, Apostles). |

## Running Tests

```bash
npm install
npm test
```

## License
MIT
