import "./index.css";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { parseCSV, toSeriesRows, indexSeries } from "@/lib/csv";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Import Tremor components
import { LineChart } from "@tremor/react";

type Row = { year: number; wealthPct: number; peAumT: number; gSales: number };

// Transform to Tremor-friendly data objects
function toChartData(rows: Row[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "Top 1% wealth (%, DFA)": r.wealthPct,
        "Global PE AUM (USD T)": r.peAumT,
        "US G‑Class sales (units)": r.gSales,
    }));
}

export default function App() {
    const [rows, setRows] = useState<Row[] | null>(null);
    const [indexedRows, setIndexedRows] = useState<Row[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/data/series.csv", {
                    cache: "no-cache",
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const txt = await res.text();
                const parsed = toSeriesRows(parseCSV(txt));
                const base = parsed.map((r) => ({
                    year: r.year,
                    wealthPct: r.us_wealth_top1_share_dfa_pct,
                    peAumT: r.global_pe_aum_usd_trn,
                    gSales: r.us_gclass_sales_units,
                }));
                const wealthIdx = indexSeries(
                    base.map((r) => r.wealthPct),
                    0
                );
                const peIdx = indexSeries(
                    base.map((r) => r.peAumT),
                    0
                );
                const salesIdx = indexSeries(
                    base.map((r) => r.gSales),
                    0
                );
                const indexed = base.map((r, i) => ({
                    year: r.year,
                    wealthPct: Number((wealthIdx[i] ?? 0).toFixed(1)),
                    peAumT: Number((peIdx[i] ?? 0).toFixed(1)),
                    gSales: Number((salesIdx[i] ?? 0).toFixed(1)),
                }));
                setRows(base);
                setIndexedRows(indexed);
            } catch (e) {
                console.error("Error loading data:", e);
                setError(e instanceof Error ? e.message : String(e));
            }
        }
        load();
    }, []);

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Error Loading Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-600">{error}</p>
                        <button
                            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!rows || !indexedRows) return <div className="p-6">Loading…</div>;

    const data = toChartData(rows);
    const dataIndexed = toChartData(indexedRows);

    return (
        <main className="p-6">
            <div className="mx-auto max-w-6xl grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Inequality, PE AUM, and G‑Class Sales (2012–2024)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ErrorBoundary
                            fallback={
                                <div className="h-64 sm:h-80 md:h-96 w-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                    <p className="text-gray-500">
                                        Chart failed to load
                                    </p>
                                </div>
                            }
                        >
                            <LineChart
                                className="h-64 sm:h-80 md:h-96 w-full"
                                data={data}
                                index="Year"
                                categories={[
                                    "Top 1% wealth (%, DFA)",
                                    "Global PE AUM (USD T)",
                                    "US G‑Class sales (units)",
                                ]}
                                colors={["emerald", "orange", "blue"]}
                                yAxisWidth={60}
                                showLegend={true}
                                showTooltip={true}
                                valueFormatter={(v) =>
                                    typeof v === "number"
                                        ? v.toLocaleString()
                                        : String(v)
                                }
                                connectNulls
                            />
                        </ErrorBoundary>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Indexed (2012 = 100)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ErrorBoundary
                            fallback={
                                <div className="h-64 sm:h-80 md:h-96 w-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                    <p className="text-gray-500">
                                        Chart failed to load
                                    </p>
                                </div>
                            }
                        >
                            <LineChart
                                className="h-64 sm:h-80 md:h-96"
                                data={dataIndexed}
                                index="Year"
                                categories={[
                                    "Top 1% wealth (%, DFA)",
                                    "Global PE AUM (USD T)",
                                    "US G‑Class sales (units)",
                                ]}
                                colors={["emerald", "orange", "blue"]}
                                yAxisWidth={56}
                                showLegend={true}
                                showTooltip={true}
                                valueFormatter={(v) =>
                                    typeof v === "number"
                                        ? v.toLocaleString(undefined, {
                                              maximumFractionDigits: 1,
                                          })
                                        : String(v)
                                }
                                connectNulls
                            />
                        </ErrorBoundary>
                    </CardContent>
                </Card>

                <footer className="mt-4 border-t pt-4 text-sm text-gray-600">
                    <p className="font-medium">Data Sources:</p>
                    <ul className="mt-2 space-y-1">
                        <li>
                            <strong>Wealth:</strong> Fed DFA (WFRBST01134),
                            annual avg of quarterlies
                        </li>
                        <li>
                            <strong>PE AUM:</strong> McKinsey Global Private
                            Markets Reports
                        </li>
                        <li>
                            <strong>G‑Class:</strong> MBUSA press + CarFigures
                        </li>
                    </ul>
                </footer>
            </div>
        </main>
    );
}
