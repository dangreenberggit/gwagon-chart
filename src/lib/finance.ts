// src/lib/finance.ts
// Build a cumulative total return index from annual total return percentages.
//
// Inputs:
// - series: array of { year, trPct } where trPct is S&P 500 calendar-year total return (%)
// - base: starting index level (default 100)
// - baseYearIncluded:
//   - true  -> apply the first year's return to the base (so first value > base if tr > 0)
//   - false -> first year equals base; compounding starts from the next year
//
// Output:
// - array of { year, index } with index rounded to 2 decimals

export function buildTotalReturnIndex(
    series: Array<{ year: number; trPct: number }>,
    base = 100,
    baseYearIncluded = true
): Array<{ year: number; index: number }> {
    const out: Array<{ year: number; index: number }> = [];
    let level = base;

    for (let i = 0; i < series.length; i++) {
        const item = series[i];
        if (!item) continue;
        
        const r = item.trPct / 100;
        if (i === 0 && !baseYearIncluded) {
            out.push({ year: item.year, index: Number(level.toFixed(2)) });
            continue;
        }
        level = level * (1 + r);
        out.push({ year: item.year, index: Number(level.toFixed(2)) });
    }

    return out;
}
