import fs from 'fs';

const MONTH_MAP = {
    "tout": 1, "baba": 2, "hator": 3, "kiahk": 4, "toba": 5, "amshir": 6,
    "baramhat": 7, "baramouda": 8, "bashans": 9, "baouna": 10, "paona": 10, "apeeb": 11, "mesra": 12, "nasie": 13,
    "thout": 1, "paopi": 2, "hathor": 3, "koiak": 4, "tobi": 5, "meshir": 6,
    "paremhat": 7, "parmouti": 8, "pashons": 9, "paoni": 10, "epip": 11, "epep": 11, "abeeb": 11, "mesori": 12, "piikougi enavot": 13,
    "nasii": 13, "nasi": 13
};

async function build() {
    console.log("Fetching Synaxarium data...");
    const res = await fetch("https://raw.githubusercontent.com/abanobmikaeel/coptic.io/main/packages/data/src/en/synaxarium/canonical.json");
    const data = await res.json();

    const output = {};
    for (const [key, events] of Object.entries(data)) {
        const parts = key.toLowerCase().split(' ');
        const day = parseInt(parts[0], 10);
        const monthStr = parts.slice(1).join(' ');

        const monthNum = MONTH_MAP[monthStr];
        if (!monthNum) {
            console.error(`Unknown month explicitly parsed: ${monthStr} in key ${key}`);
            continue;
        }

        output[`${monthNum}-${day}`] = events.map(e => e.name);
    }

    const tsCode = `/**
 * A memory-efficient daily registry of commemorated Saints (Synaxarium).
 * Auto-generated via canonical Coptic Orthodox Church data mapping 365 Days natively.
 */
export const SYNAXARIUM_NAMES: Record<string, string[]> = ${JSON.stringify(output, null, 4)};

/**
 * Resolves the names of the Saints commemorated on a specific Coptic Month and Day.
 * Returns an empty array if no entry exists in the localized dictionary.
 */
export function getSynaxariumNames(month: number, day: number): string[] {
    const key = \`\${month}-\${day}\`;
    return SYNAXARIUM_NAMES[key] || [];
}
`;
    fs.writeFileSync('./src/synaxarium.ts', tsCode);
    console.log("Synaxarium successfully fetched and mapped cleanly!");
}

build().catch(err => {
    console.error(err);
    process.exit(1);
});
