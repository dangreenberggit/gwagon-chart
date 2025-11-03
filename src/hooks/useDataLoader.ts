import { useEffect, useState } from "react";
import type { Row, IndexedRow } from "@/lib/types";
import { parseCSV, toSeriesRows } from "@/lib/csv";
import { buildTotalReturnIndex } from "@/lib/finance";
import { indexSeries, indexLevelsToBase100 } from "@/lib/utils";

export function useDataLoader() {
    const [rows, setRows] = useState<Row[] | null>(null);
    const [indexedRows, setIndexedRows] = useState<IndexedRow[] | null>(null);
    const [spxCumData, setSpxCumData] = useState<Array<{
        year: number;
        index: number;
    }> | null>(null);
    const [spxCumInvestment, setSpxCumInvestment] = useState<Array<{
        year: number;
        index: number;
    }> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                setIsLoading(true);
                const res = await fetch("/data/series.csv");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const txt = await res.text();
                const parsed = toSeriesRows(parseCSV(txt));
                const base = parsed.map((r) => ({
                    year: r.year,
                    spxTR: r.sp500_total_return_pct,
                    peAumT: r.global_pe_aum_usd_trn,
                    gSales: r.us_gclass_sales_units,
                    g550Msrp: r.g550_base_msrp_usd,
                    gClassAtp: r.gclass_est_atp_usd_proxy,
                    g550MsrpIdx: r.g550_msrp_index_2012,
                    gClassAtpIdx: r.gclass_est_atp_index_2012,
                    hhNetWorthBn: r.hh_net_worth_usd_bn_q4,
                    hhNetWorthIdx: r.hh_net_worth_index_2012,
                }));

                // Build cumulative SPX total return index (2012 base applied)
                const spxTRSeries = base.map((r) => ({
                    year: r.year,
                    trPct: r.spxTR,
                }));
                
                // Comparison mode: 2012 = 100, compounding starts 2013
                const spxCumComparison = buildTotalReturnIndex(spxTRSeries, 100, false);
                
                // Investment mode: $100 at start of 2012, includes 2012's return
                const spxCumInvestment = buildTotalReturnIndex(spxTRSeries, 100, true);
                
                // Use comparison mode for indexed view (2012 = 100)
                const spxCum = spxCumComparison;

                const spxCumByYear = new Map<number, number>(
                    spxCum.map((d) => [d.year, d.index])
                );

                // Indexed view for PE and G-Class (2012 = 100 via indexSeries)
                const peIdx = indexSeries(
                    base.map((r) => r.peAumT),
                    0
                );
                const salesIdx = indexSeries(
                    base.map((r) => r.gSales),
                    0
                );

                // Use indexLevelsToBase100 for price indices (2012 = index 0)
                const g550MsrpIdx = indexLevelsToBase100(
                    base.map((r) => r.g550Msrp),
                    0,
                    { decimals: 1, onIssue: (msg) => console.warn(msg) }
                );
                const gClassAtpIdx = indexLevelsToBase100(
                    base.map((r) => r.gClassAtp),
                    0,
                    { decimals: 1, onIssue: (msg) => console.warn(msg) }
                );

                // Use cumulative SPX index directly (already represents accumulation)
                const indexed = base.map((r, i) => ({
                    year: r.year,
                    spxCumIdx: spxCumByYear.get(r.year) ?? null,
                    peAumIdx: Number((peIdx[i] ?? 0).toFixed(1)),
                    gSalesIdx: Number((salesIdx[i] ?? 0).toFixed(1)),
                    g550MsrpIdx: g550MsrpIdx[i] ?? 0,
                    gClassAtpIdx: gClassAtpIdx[i] ?? 0,
                    hhNetWorthIdx: r.hhNetWorthIdx, // Use pre-indexed value from CSV
                }));
                setRows(base);
                setIndexedRows(indexed);
                setSpxCumData(spxCum);
                setSpxCumInvestment(spxCumInvestment);
            } catch (e) {
                console.error("Error loading data:", e);
                setError(e instanceof Error ? e.message : String(e));
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, []);

    return { rows, indexedRows, spxCumData, spxCumInvestment, error, isLoading };
}
