export type SeriesRow = {
    year: number;
    sp500_total_return_pct: number;
    global_pe_aum_usd_trn: number;
    us_gclass_sales_units: number;
    g550_base_msrp_usd: number;
    gclass_est_atp_usd_proxy: number;
    g550_msrp_index_2012: number;
    gclass_est_atp_index_2012: number;
    hh_net_worth_usd_bn_q4: number;
};

/**
 * Parses CSV text into an array of objects.
 * 
 * Note: This is a simple parser that does not handle quoted commas. Consider
 * using papaparse if fields become more complex.
 * 
 * @param text - Raw CSV text content.
 * @returns Array of objects with keys from the header row.
 */
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

export function toSeriesRows(rows: Record<string, string>[]): SeriesRow[] {
    return rows.map((r) => ({
        year: Number(r.year),
        sp500_total_return_pct: Number(r.sp500_total_return_pct),
        global_pe_aum_usd_trn: Number(r.global_pe_aum_usd_trn),
        us_gclass_sales_units: Number(r.us_gclass_sales_units),
        g550_base_msrp_usd: Number(r.g550_base_msrp_usd),
        gclass_est_atp_usd_proxy: Number(r.gclass_est_atp_usd_proxy),
        g550_msrp_index_2012: Number(r.g550_msrp_index_2012),
        gclass_est_atp_index_2012: Number(r.gclass_est_atp_index_2012),
        hh_net_worth_usd_bn_q4: Number(r.hh_net_worth_usd_bn_q4),
    }));
}
