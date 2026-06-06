# Fix: `getOccasionForCopticYear` Easter-relative key matching

**Date:** 2026-06-06
**Scope:** `src/plugins/occasions/index.ts` — single function, no API surface change

---

## Problem

`getOccasionForCopticYear` iterates `EASTER_OFFSETS` and compares keys against
`CopticOccasion` values using `.toLowerCase()`. Because `EASTER_OFFSETS` uses
SCREAMING_SNAKE_CASE (`PALM_SUNDAY`) and `CopticOccasion` uses camelCase
(`PalmSunday`), the underscore prevents matching. Only `Lent`, `Ascension`, and
`Pentecost` accidentally match. The other seven Easter-relative occasions silently
return Thout 1 (the fallback).

Affected occasions: `PalmSunday`, `CovenantThursday`, `ThomasSunday`,
`ApostlesFast`, `JonahsPassover`, `JonahsFast`\*, `NativityFast`\*,
`StMarysFast`\*.

\* These are date ranges with no single canonical date — out of scope for this fix.

---

## Constraints

- `EASTER_OFFSETS` stays unchanged (used as numeric constants elsewhere).
- No new exported symbols.
- No changes outside `index.ts` and its test file.

---

## Solution

Replace the broken `for` loop in `getOccasionForCopticYear` with a local
`Partial<Record<CopticOccasion, number>>` literal keyed by the camelCase occasion
names, using `EASTER_OFFSETS` values on the right-hand side:

```ts
const easterRelative: Partial<Record<CopticOccasion, number>> = {
    JonahsPassover:   EASTER_OFFSETS.JONAHS_PASSOVER,
    Lent:             EASTER_OFFSETS.LENT,
    PalmSunday:       EASTER_OFFSETS.PALM_SUNDAY,
    CovenantThursday: EASTER_OFFSETS.COVENANT_THURSDAY,
    ThomasSunday:     EASTER_OFFSETS.THOMAS_SUNDAY,
    Ascension:        EASTER_OFFSETS.ASCENSION,
    Pentecost:        EASTER_OFFSETS.PENTECOST,
    ApostlesFast:     EASTER_OFFSETS.APOSTLES_FAST,
};
const offset = easterRelative[occasion];
if (offset !== undefined) return easter.add({ days: offset });
```

`JonahsFast`, `NativityFast`, and `StMarysFast` are intentionally absent — they
are ranges and cannot be meaningfully resolved to a single date (tracked as bug #2).

The existing `Easter` special-case and Thout-1 fallback below this block are
unchanged.

---

## Tests

Add `.when()` assertions for each of the seven now-fixed occasions in
`src/plugins/occasions/__tests__/occasions.test.ts`, asserting the returned
`CopticDate` equals `easter.add({ days: offset })` for the relevant Coptic year.

| Occasion | Expected offset |
|---|---|
| `JonahsPassover` | −66 |
| `Lent` | −55 (already worked; add explicit test) |
| `PalmSunday` | −7 |
| `CovenantThursday` | −3 |
| `ThomasSunday` | +7 |
| `Ascension` | +39 |
| `Pentecost` | +49 (already worked; add explicit test) |
| `ApostlesFast` | +50 |

---

## Out of scope

- Span-based occasions (`JonahsFast`, `NativityFast`, `StMarysFast`) — need a
  separate API decision before implementation.
- No changes to `EASTER_OFFSETS`, `constants.ts`, or any plugin other than
  `occasions`.
