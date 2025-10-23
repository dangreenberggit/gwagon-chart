export type SeriesRow = {
    year: number;
    us_wealth_top1_share_dfa_pct: number;
    global_pe_aum_usd_trn: number;
    us_gclass_sales_units: number;
};

// Simple CSV parser (no quoted commas).
// TEST: Keep minimal to avoid dependency bloat; consider papaparse if fields become complex.
export function parseCSV(text: string): Record<string, string>[] {
    const lines = text.trim().split(/\r?\n/);
    const firstLine = lines[0];
    if (!firstLine) return [];
    const headers = firstLine.split(",").map((h) => h.trim());
    return lines
        .slice(1)
        .filter(Boolean)
        .map((line) => {
            const cols = line.split(",").map((c) => c.trim());
            const obj: Record<string, string> = {};
            headers.forEach((h, i) => (obj[h] = cols[i] ?? ""));
            return obj;
        });
}

// Convert raw CSV objects to typed rows with numeric fields.
export function toSeriesRows(rows: Record<string, string>[]): SeriesRow[] {
    return rows.map((r) => ({
        year: Number(r.year),
        us_wealth_top1_share_dfa_pct: Number(r.us_wealth_top1_share_dfa_pct),
        global_pe_aum_usd_trn: Number(r.global_pe_aum_usd_trn),
        us_gclass_sales_units: Number(r.us_gclass_sales_units),
    }));
}

// Index series to base = 100 (e.g., first year).
// TEST: Protect against divide-by-zero; return zeros if base is 0 or invalid.
export function indexSeries(values: number[], baseIndex = 0): number[] {
    const base = values[baseIndex];
    if (base === undefined || !isFinite(base) || base === 0)
        return values.map(() => 0);
    return values.map((v) => (v / base) * 100);
}
