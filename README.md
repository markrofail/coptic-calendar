<!-- Placeholder for logo -->
<div align="center">

  <!-- Logo placeholder -->
  <img src="docs/logo.png" alt="Logo" width="200" height="200">
  <h3>Coptic Calendar</h3>

</div>

high-precision, polymorphic library for the Coptic liturgical calendar, featuring advanced date arithmetic and a modular plugin system for the Synaxarium, liturgical feasts, and canonical rites.

<!-- Shields -->
<div align="center">

[![CI](https://img.shields.io/github/actions/workflow/status/markrofail/coptic-calendar/ci.yml?branch=main&label=CI&style=for-the-badge)](https://github.com/markrofail/coptic-calendar/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/coptic-calendar?style=for-the-badge)](https://www.npmjs.com/package/coptic-calendar?s)
[![License](https://img.shields.io/github/license/markrofail/coptic-calendar?style=for-the-badge)](LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/markrofail/coptic-calendar?style=for-the-badge)](https://github.com/markrofail/coptic-calendar/issues)
[![GitHub stars](https://img.shields.io/github/stars/markrofail/coptic-calendar?style=for-the-badge)](https://github.com/markrofail/coptic-calendar/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/markrofail/coptic-calendar/pulls)

</div>

<!-- Badges row end -->

## Features

- **Universal Polymorphism**: Convert from native `Date`, ISO strings, timestamps, elements, or custom Temporal-like objects.
- **Fluent Arithmetic**: Perform elegant date manipulations with `add`, `subtract`, and `with`.
- **Localization**: Full translation support for English, Arabic, and Coptic (Bohairic).
- **Extensible Architecture**: Modular plugin system allows lightweight core or full liturgical immersion.
- **TypeScript Native**: Zero-dependency, ESM-first library with strict type safety.

## Installation

```bash
npm install coptic-calendar
```

## Usage

### Basic Conversion

```typescript
import { CopticDate } from 'coptic-calendar';

// Polymorphic .from() supports Dates, strings, timestamps, and elements
const date = CopticDate.from({ year: 1740, month: 5, day: 23 });

// Access calendar components
console.log(`Coptic Date: ${date.year}-${date.month}-${date.day}`); // "1740-5-23"
console.log(`Is Leap Year: ${date.inLeapYear}`); // false

// Multi-language localization support
console.log(date.toLocaleString({ locale: 'en' })); // "23 Tobi 1740"
console.log(date.toLocaleString({ locale: 'ar' })); // "٢٣ طوبة ١٧٤٠"
```

### Date Arithmetic & Comparison

```typescript
const start = CopticDate.from('2024-01-01'); // 22 Kiahk 1740

// Addition and Subtraction
const nextMonth = start.add({ months: 1 }); // 22 Tobi 1740
const lastYear = start.subtract({ years: 1 }); // 22 Kiahk 1739

// Fluent modification
const specificDay = start.with({ day: 15 }); // 15 Kiahk 1740

// Comparison
if (start.equals(nextMonth)) { /* ... */ } // false
const order = CopticDate.compare(start, nextMonth); // -1 (start < nextMonth)
```

### Plugin System

The library is lightweight by default, but can be extended with specialized plugins for ecclesiastical data.

#### Synaxarium Plugin
Provides daily saint commemorations and historical readings.

```typescript
import { CopticDate } from 'coptic-calendar';
import { synaxariumPlugin } from 'coptic-calendar/plugins/synaxarium';

CopticDate.extend(synaxariumPlugin);

const date = CopticDate.from('2024-04-19'); // 12 Paremoude 1740
console.log(date.synaxarium({ locale: 'en' })); 
// ["The Departure of St. Alexander, Bishop of Jerusalem.", ...]
```

#### Occasions Plugin
Calculates all liturgical feasts and fasts, including the moving Paschal cycle.

```typescript
import { CopticDate } from 'coptic-calendar';
import { occasionsPlugin } from 'coptic-calendar/plugins/occasions';

CopticDate.extend(occasionsPlugin);

const date = CopticDate.from('2024-04-19');
console.log(date.occasions({ locale: 'en' })); // ["Great Lent"]

// Find specific occasions
const easter = date.when('Easter');
console.log(`Easter is on: ${easter.toString()}`); // "1740-8-27"
```

#### Typicon Plugin
Derives the active canonical Typicon configuration (season, tune, etc.) for any date.

```typescript
import { CopticDate } from 'coptic-calendar';
import { typiconPlugin } from 'coptic-calendar/plugins/typicon';

CopticDate.extend(typiconPlugin);

const date = CopticDate.from('2024-04-19');
const rite = date.rite({ locale: 'en' });

console.log(`Season: ${rite.season}`);   // "Great Lent"
console.log(`Tune: ${rite.tune}`);       // "Lenten"
console.log(`Metanoias: ${rite.hasMetanoias}`); // true
```

## Contribution

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under **The Unlicense** - see the [LICENSE](LICENSE) file for details.