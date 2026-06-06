# Fix Bugs #3 and #4: Duplicate Key and Local-Time Usage

**Date:** 2026-06-06
**Scope:** Two independent one-line fixes in separate files, one commit.

---

## Bug #4 — Duplicate key in `FIXED_OCCASIONS`

**File:** `src/plugins/occasions/constants.ts`

**Problem:** The key `${COPTIC_MONTHS.TOBI}-13` (resolves to `"5-13"`, WeddingAtCana) appears
twice. The second entry silently overwrites the first with the same value. No observable
runtime effect, but is a copy-paste error that could mask a real mistake if the entries
ever diverged.

**Fix:** Delete the duplicate line (the second `[${COPTIC_MONTHS.TOBI}-13]: ['WeddingAtCana']`
entry, currently line 60).

**Tests:** No new test needed — the value is identical in both entries and the behavior is
already covered by existing occasion tests.

---

## Bug #3 — `jsDateToCopticDate` uses local time instead of UTC

**File:** `src/core/computus.ts`

**Problem:** `jsDateToCopticDate` reads `date.getFullYear()`, `date.getMonth()`, and
`date.getDate()` (local timezone). `CopticDate.from(Date)` correctly uses
`getUTCFullYear()`, `getUTCMonth()`, and `getUTCDate()`. A caller in UTC−5 passing a
`Date` at 23:00 local time (= 04:00 UTC next day) would get a different Coptic date from
`jsDateToCopticDate` than from `CopticDate.from()`.

**Fix:** Replace the three local-time getters with their UTC equivalents:

```typescript
const gregYear  = date.getUTCFullYear();
const gregMonth = date.getUTCMonth() + 1;
const gregDay   = date.getUTCDate();
```

**Tests:** Add one test in `src/core/__tests__/computus.test.ts` that passes a `Date`
constructed from a UTC timestamp that falls on a day boundary — e.g.
`new Date('2024-01-16T00:30:00Z')` — and asserts the returned Coptic date matches the
UTC date (Tobi 6, 1740), not the local date that a negative-offset timezone would see.
The existing `jsDateToCopticDate` test uses `new Date(2024, 0, 15)` (local constructor)
and should be updated to use a UTC-anchored date so it is timezone-independent.

---

## Constraints

- No changes to any exported API surface.
- No changes outside the two source files and the one test file.
- Both fixes ship in a single commit.

---

## Out of scope

- Removing or deprecating `jsDateToCopticDate` (it is internal but still in use).
- Any other timezone handling changes.
