import "./index.css";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { parseCSV, toSeriesRows, indexSeries } from "@/lib/csv";
import { buildTotalReturnIndex } from "@/lib/finance";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Import Tremor components
import { LineChart } from "@tremor/react";
import { CustomTooltip } from "./components/CustomTooltip";
import { InteractiveLineChart } from "./components/InteractiveLineChart";

type Row = {
    year: number;
    spxTR: number;
    peAumT: number;
    gSales: number;
};

type IndexedRow = {
    year: number;
    spxCumIdx: number | null;
    peAumIdx: number;
    gSalesIdx: number;
};

// Transform to Tremor-friendly data objects for combined chart
function toChartData(rows: Row[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "S&P 500 total return (%)": r.spxTR,
        "Global PE AUM (USD T)": r.peAumT,
        "US G‑Class sales (units)": r.gSales,
    }));
}

// Individual chart data transformers
function toSPXCumData(spxCum: Array<{ year: number; index: number }>) {
    return spxCum.map((d) => ({
        Year: d.year.toString(),
        "S&P 500 total return index (2012 = 100)": d.index,
    }));
}

function toPEData(rows: Row[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "Global PE AUM (USD T)": r.peAumT,
    }));
}

function toGClassData(rows: Row[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "US G‑Class sales (units)": r.gSales,
    }));
}

// Transform indexed data for combined chart
function toIndexedChartData(rows: IndexedRow[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "S&P 500 total return index (2012 = 100)": r.spxCumIdx,
        "Global PE AUM (index, 2012 = 100)": r.peAumIdx,
        "US G‑Class sales (index, 2012 = 100)": r.gSalesIdx,
    }));
}

export default function App() {
    const [rows, setRows] = useState<Row[] | null>(null);
    const [indexedRows, setIndexedRows] = useState<IndexedRow[] | null>(null);
    const [spxCumData, setSpxCumData] = useState<Array<{
        year: number;
        index: number;
    }> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expandedCharts, setExpandedCharts] = useState<{
        spx: boolean;
        pe: boolean;
        gclass: boolean;
    }>({
        spx: false,
        pe: false,
        gclass: false,
    });

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
                    spxTR: r.sp500_total_return_pct,
                    peAumT: r.global_pe_aum_usd_trn,
                    gSales: r.us_gclass_sales_units,
                }));

                // Build cumulative SPX total return index (2012 base applied)
                const spxTRSeries = base.map((r) => ({
                    year: r.year,
                    trPct: r.spxTR,
                }));
                const spxCum = buildTotalReturnIndex(spxTRSeries, 100, true); // true applies 2012 return
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

                // Use cumulative SPX index directly (already represents accumulation)
                const indexed = base.map((r, i) => ({
                    year: r.year,
                    spxCumIdx: spxCumByYear.get(r.year) ?? null, // number
                    peAumIdx: Number((peIdx[i] ?? 0).toFixed(1)),
                    gSalesIdx: Number((salesIdx[i] ?? 0).toFixed(1)),
                }));
                setRows(base);
                setIndexedRows(indexed);
                setSpxCumData(spxCum);
            } catch (e) {
                console.error("Error loading data:", e);
                setError(e instanceof Error ? e.message : String(e));
            }
        }
        load();
    }, []);

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Error Loading Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-destructive">{error}</p>
                        <button
                            className="btn btn-primary mt-4"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!rows || !indexedRows || !spxCumData)
        return (
            <div className="p-6 bg-background text-foreground">Loading…</div>
        );

    const spxData = toSPXCumData(spxCumData);
    const peData = toPEData(rows);
    const gClassData = toGClassData(rows);
    const dataIndexed = toIndexedChartData(indexedRows);

    const toggleChart = (chart: keyof typeof expandedCharts) => {
        setExpandedCharts((prev) => ({
            ...prev,
            [chart]: !prev[chart],
        }));
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-md bg-primary" />
                        <span className="font-semibold">G-Wagon Chart</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 py-10">
                <div className="grid gap-6">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold mb-2">
                            S&P 500 Total Return Index (2012=100), PE AUM, and
                            G‑Class Sales (2012–2024)
                        </h1>
                    </div>

                    {/* Indexed Comparison Chart - Main Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Indexed Comparison (2012 = 100): S&P 500 Total
                                Return Index, Global PE AUM, and US G‑Class
                                Sales
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ErrorBoundary
                                fallback={
                                    <div className="h-64 sm:h-80 md:h-96 w-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                                        <p className="text-muted-foreground">
                                            Chart failed to load
                                        </p>
                                    </div>
                                }
                            >
                                <InteractiveLineChart
                                    className="h-64 sm:h-80 md:h-96"
                                    data={dataIndexed}
                                    index="Year"
                                    categories={[
                                        "S&P 500 total return index (2012 = 100)",
                                        "Global PE AUM (index, 2012 = 100)",
                                        "US G‑Class sales (index, 2012 = 100)",
                                    ]}
                                    colors={["blue", "amber", "emerald"]}
                                    yAxisWidth={56}
                                    showLegend={true}
                                    showTooltip={true}
                                    customTooltip={CustomTooltip}
                                    valueFormatter={(v) =>
                                        typeof v === "number"
                                            ? v.toLocaleString(undefined, {
                                                  maximumFractionDigits: 1,
                                              })
                                            : String(v)
                                    }
                                    connectNulls
                                    curveType="monotone"
                                />
                            </ErrorBoundary>
                        </CardContent>
                    </Card>

                    {/* Individual Charts - Collapsible */}
                    <div className="space-y-4">
                        <h2 className="section-title mb-4">
                            Individual Series Details
                        </h2>

                        {/* S&P 500 Chart */}
                        <Card>
                            <CardHeader
                                className="cursor-pointer hover:bg-accent transition-colors"
                                onClick={() => toggleChart("spx")}
                            >
                                <CardTitle className="flex items-center justify-between">
                                    <span>
                                        S&P 500 Total Return Index (2012 = 100)
                                    </span>
                                    <span className="subtle font-normal">
                                        {expandedCharts.spx ? "▼" : "▶"} Click
                                        to{" "}
                                        {expandedCharts.spx
                                            ? "collapse"
                                            : "expand"}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            {expandedCharts.spx && (
                                <CardContent>
                                    <ErrorBoundary
                                        fallback={
                                            <div className="h-48 w-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                                                <p className="text-muted-foreground">
                                                    Chart failed to load
                                                </p>
                                            </div>
                                        }
                                    >
                                        <LineChart
                                            className="h-48 w-full"
                                            data={spxData}
                                            index="Year"
                                            categories={[
                                                "S&P 500 total return index (2012 = 100)",
                                            ]}
                                            colors={["blue"]}
                                            yAxisWidth={56}
                                            showLegend={false}
                                            showTooltip={true}
                                            customTooltip={CustomTooltip}
                                            valueFormatter={(v) =>
                                                typeof v === "number"
                                                    ? v.toLocaleString(
                                                          undefined,
                                                          {
                                                              maximumFractionDigits: 2,
                                                          }
                                                      )
                                                    : String(v)
                                            }
                                            connectNulls
                                            curveType="monotone"
                                            xAxisLabel="Year"
                                            yAxisLabel="Index (2012 = 100)"
                                        />
                                    </ErrorBoundary>
                                </CardContent>
                            )}
                        </Card>

                        {/* Global PE AUM Chart */}
                        <Card>
                            <CardHeader
                                className="cursor-pointer hover:bg-accent transition-colors"
                                onClick={() => toggleChart("pe")}
                            >
                                <CardTitle className="flex items-center justify-between">
                                    <span>
                                        Global Private Equity Assets Under
                                        Management (USD Trillions)
                                    </span>
                                    <span className="subtle font-normal">
                                        {expandedCharts.pe ? "▼" : "▶"} Click
                                        to{" "}
                                        {expandedCharts.pe
                                            ? "collapse"
                                            : "expand"}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            {expandedCharts.pe && (
                                <CardContent>
                                    <ErrorBoundary
                                        fallback={
                                            <div className="h-48 w-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                                                <p className="text-muted-foreground">
                                                    Chart failed to load
                                                </p>
                                            </div>
                                        }
                                    >
                                        <LineChart
                                            className="h-48 w-full"
                                            data={peData}
                                            index="Year"
                                            categories={[
                                                "Global PE AUM (USD T)",
                                            ]}
                                            colors={["amber"]}
                                            yAxisWidth={48}
                                            showLegend={false}
                                            showTooltip={true}
                                            customTooltip={CustomTooltip}
                                            valueFormatter={(v) =>
                                                typeof v === "number"
                                                    ? `$${v.toFixed(1)}T`
                                                    : String(v)
                                            }
                                            connectNulls
                                            curveType="monotone"
                                            xAxisLabel="Year"
                                            yAxisLabel="USD Trillions"
                                        />
                                    </ErrorBoundary>
                                </CardContent>
                            )}
                        </Card>

                        {/* G-Class Sales Chart */}
                        <Card>
                            <CardHeader
                                className="cursor-pointer hover:bg-accent transition-colors"
                                onClick={() => toggleChart("gclass")}
                            >
                                <CardTitle className="flex items-center justify-between">
                                    <span>
                                        US Mercedes-Benz G-Class Sales (Units)
                                    </span>
                                    <span className="subtle font-normal">
                                        {expandedCharts.gclass ? "▼" : "▶"}{" "}
                                        Click to{" "}
                                        {expandedCharts.gclass
                                            ? "collapse"
                                            : "expand"}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            {expandedCharts.gclass && (
                                <CardContent>
                                    <ErrorBoundary
                                        fallback={
                                            <div className="h-48 w-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                                                <p className="text-muted-foreground">
                                                    Chart failed to load
                                                </p>
                                            </div>
                                        }
                                    >
                                        <LineChart
                                            className="h-48 w-full"
                                            data={gClassData}
                                            index="Year"
                                            categories={[
                                                "US G‑Class sales (units)",
                                            ]}
                                            colors={["emerald"]}
                                            yAxisWidth={52}
                                            showLegend={false}
                                            showTooltip={true}
                                            customTooltip={CustomTooltip}
                                            valueFormatter={(v) =>
                                                typeof v === "number"
                                                    ? v.toLocaleString()
                                                    : String(v)
                                            }
                                            connectNulls
                                            curveType="monotone"
                                            xAxisLabel="Year"
                                            yAxisLabel="Units Sold"
                                        />
                                    </ErrorBoundary>
                                </CardContent>
                            )}
                        </Card>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t mt-10">
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="font-medium text-foreground mb-2">
                                Data Sources:
                            </p>
                            <ul className="space-y-2 subtle">
                                <li>
                                    <strong className="font-medium text-foreground">
                                        S&P 500 total return:
                                    </strong>{" "}
                                    <a
                                        href="https://www.slickcharts.com/sp500/returns"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        SlickCharts S&P 500 Returns
                                    </a>{" "}
                                    (annual, compounded to form index).
                                </li>
                                <li>
                                    <strong className="font-medium text-foreground">
                                        PE AUM:
                                    </strong>{" "}
                                    <a
                                        href="https://www.mckinsey.com/industries/private-capital/our-insights/global-private-markets-report"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        McKinsey Global Private Markets Report
                                    </a>
                                    .
                                </li>
                                <li>
                                    <strong className="font-medium text-foreground">
                                        G‑Class (US sales):
                                    </strong>
                                    <ul className="ml-6 mt-1 space-y-1">
                                        <li>
                                            <a
                                                href="https://media.mbusa.com/releases/release-4efd8afecd0ad84220062379551956e8-mercedes-benz-usa-reports-9-year-over-year-growth-for-passenger-car-sales"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                MBUSA 2024 press release
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://carfigures.com/us-market-brand/mercedes-benz/g-class"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                CarFigures historical sales
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                            <span className="subtle">
                                © 2025 G-Wagon Chart
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
