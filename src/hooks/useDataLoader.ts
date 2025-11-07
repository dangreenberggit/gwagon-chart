import { useEffect, useState } from "react";
import type { Row, IndexedRow } from "@/lib/types";
import { parseCSV, toSeriesRows } from "@/lib/csv";
import { buildTotalReturnIndex } from "@/lib/finance";
import { indexSeries } from "@/lib/utils";

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
                }));

                const spxTRSeries = base.map((r) => ({
                    year: r.year,
                    trPct: r.spxTR,
                }));
                
                const spxCumComparison = buildTotalReturnIndex(spxTRSeries, 100, false);
                const spxCumInvestment = buildTotalReturnIndex(spxTRSeries, 100, true);
                const spxCum = spxCumComparison;

                const spxCumByYear = new Map<number, number>(
                    spxCum.map((d) => [d.year, d.index])
                );

                const peIdx = indexSeries(
                    base.map((r) => r.peAumT),
                    0
                );
                const salesIdx = indexSeries(
                    base.map((r) => r.gSales),
                    0
                );
                const hhNetWorthIdx = indexSeries(
                    base.map((r) => r.hhNetWorthBn),
                    0
                );

                // Validate that we have valid indexed values (no nulls from invalid data)
                const validateIndexedValue = (value: number | null | undefined, name: string, year: number): number => {
                    if (value === null || value === undefined) {
                        throw new Error(`Invalid data: ${name} is null/undefined for year ${year}. This indicates corrupted or missing data.`);
                    }
                    if (!Number.isFinite(value)) {
                        throw new Error(`Invalid data: ${name} is not finite (${value}) for year ${year}.`);
                    }
                    return value;
                };

                const indexed = base.map((r, i) => {
                    const spxCumValue = spxCumByYear.get(r.year);
                    if (spxCumValue === undefined) {
                        throw new Error(`Missing S&P 500 cumulative data for year ${r.year}`);
                    }

                    return {
                        year: r.year,
                        spxCumIdx: validateIndexedValue(spxCumValue, "spxCumIdx", r.year),
                        peAumIdx: validateIndexedValue(peIdx[i], "peAumIdx", r.year),
                        gSalesIdx: validateIndexedValue(salesIdx[i], "gSalesIdx", r.year),
                        g550MsrpIdx: r.g550MsrpIdx,
                        gClassAtpIdx: r.gClassAtpIdx,
                        hhNetWorthIdx: validateIndexedValue(hhNetWorthIdx[i], "hhNetWorthIdx", r.year),
                    };
                });
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
