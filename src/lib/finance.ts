/**
 * Builds a cumulative total return index from annual total return percentages.
 *
 * @param series - Array of year and total return percentage pairs. trPct represents
 *                 S&P 500 calendar-year total return as a percentage.
 * @param base - Starting index level. Defaults to 100.
 * @param baseYearIncluded - When true, applies the first year's return to the base
 *                          (first value will exceed base if return > 0). When false,
 *                          the first year equals the base and compounding starts from
 *                          the next year.
 * @returns Array of year and index pairs with full precision. Rounding is handled
 *          at the display layer.
 */
export function buildTotalReturnIndex(
    series: Array<{ year: number; trPct: number }>,
    base = 100,
    baseYearIncluded = true
): Array<{ year: number; index: number }> {
    if (!series || series.length === 0) {
        console.warn("buildTotalReturnIndex: empty or null series provided");
        return [];
    }

    const out: Array<{ year: number; index: number }> = [];
    let level = base;

    for (let i = 0; i < series.length; i++) {
        const item = series[i];
        if (!item) continue;

        if (!Number.isFinite(item.trPct)) continue;

        const r = item.trPct / 100;
        if (i === 0 && !baseYearIncluded) {
            out.push({ year: item.year, index: level });
            continue;
        }
        level = level * (1 + r);
        out.push({ year: item.year, index: level });
    }

    return out;
}
