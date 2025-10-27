import "./index.css";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { parseCSV, toSeriesRows } from "@/lib/csv";
import { buildTotalReturnIndex } from "@/lib/finance";
import { indexSeries, indexLevelsToBase100 } from "@/lib/utils";
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
    g550Msrp: number;
    gClassAtp: number;
    g550MsrpIdx: number;
    gClassAtpIdx: number;
    hhNetWorthBn: number;
    hhNetWorthIdx: number;
};

type IndexedRow = {
    year: number;
    spxCumIdx: number | null;
    peAumIdx: number;
    gSalesIdx: number;
    g550MsrpIdx: number;
    gClassAtpIdx: number;
    hhNetWorthIdx: number;
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
        "S&P 500 Cumulative Total Return Index (2012 = 100)": d.index,
    }));
}

function toSPXReturnData(rows: Row[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "S&P 500 Annual Total Return (%)": r.spxTR,
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

function toHouseholdNetWorthData(rows: Row[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "Household Net Worth (USD T)": r.hhNetWorthBn,
    }));
}

// Transform indexed data for combined chart
function toIndexedChartData(rows: IndexedRow[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "S&P 500 total return index (2012 = 100)": r.spxCumIdx,
        "Global PE AUM (index, 2012 = 100)": r.peAumIdx,
        "US G‑Class sales (index, 2012 = 100)": r.gSalesIdx,
        "Household net worth (index, 2012 = 100)": r.hhNetWorthIdx,
    }));
}

// Price data transformers
function toPriceData(rows: Row[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "G 550 base MSRP (USD)": r.g550Msrp,
        "G‑Class Est. ATP (Proxy) (USD)": r.gClassAtp,
    }));
}

function toPriceIndexData(rows: IndexedRow[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "G 550 MSRP (index, 2012 = 100)": r.g550MsrpIdx,
        "G‑Class Est. ATP (index, 2012 = 100)": r.gClassAtpIdx,
    }));
}

// Price index with PE AUM and Household Net Worth for comparison
function toPriceIndexWithContextData(rows: IndexedRow[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "G‑Class Est. ATP (index, 2012 = 100)": r.gClassAtpIdx,
        "Global PE AUM (index, 2012 = 100)": r.peAumIdx,
        "Household net worth (index, 2012 = 100)": r.hhNetWorthIdx,
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
        prices: boolean;
        hhNetWorth: boolean;
    }>({
        spx: false,
        pe: false,
        gclass: false,
        prices: false,
        hhNetWorth: false,
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
                let spxCum = buildTotalReturnIndex(spxTRSeries, 100, true); // includes 2012 perf

                // Rebase so 2012 equals exactly 100 (Option A)
                const base2012 = spxCum.find((d) => d.year === 2012)?.index;
                if (base2012 && base2012 !== 100) {
                    spxCum = spxCum.map((d) => ({
                        year: d.year,
                        index: (d.index / base2012) * 100,
                    }));
                }

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
                    spxCumIdx: spxCumByYear.get(r.year) ?? null, // number
                    peAumIdx: Number((peIdx[i] ?? 0).toFixed(1)),
                    gSalesIdx: Number((salesIdx[i] ?? 0).toFixed(1)),
                    g550MsrpIdx: g550MsrpIdx[i] ?? 0,
                    gClassAtpIdx: gClassAtpIdx[i] ?? 0,
                    hhNetWorthIdx: r.hhNetWorthIdx, // Use pre-indexed value from CSV
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
    const spxReturnData = toSPXReturnData(rows);
    const peData = toPEData(rows);
    const gClassData = toGClassData(rows);
    const hhNetWorthData = toHouseholdNetWorthData(rows);
    const priceData = toPriceData(rows);
    const priceIndexData = toPriceIndexData(indexedRows);
    const priceIndexWithContextData = toPriceIndexWithContextData(indexedRows);
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
                            S&P 500 Total Return and G‑Class Sales (2012–2024)
                        </h1>
                    </div>

                    {/* Indexed Comparison Chart - Main Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Indexed Comparison (2012 = 100): S&P 500 Total
                                Return, G‑Class Sales, and Household Net Worth
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Annual, calendar-year data. S&P 500 is total
                                return (with dividends), compounded; sales and
                                household net worth indexed by ratio to 2012.
                            </p>
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
                                        "US G‑Class sales (index, 2012 = 100)",
                                        "Household net worth (index, 2012 = 100)",
                                    ]}
                                    colors={["blue", "emerald", "violet"]}
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
                                    <span>S&P 500 Total Return</span>
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
                                    <div className="space-y-6">
                                        {/* Annual Return Chart */}
                                        <div>
                                            <h3 className="font-medium mb-3">
                                                Annual Total Return (%)
                                            </h3>
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
                                                    data={spxReturnData}
                                                    index="Year"
                                                    categories={[
                                                        "S&P 500 Annual Total Return (%)",
                                                    ]}
                                                    colors={["blue"]}
                                                    yAxisWidth={56}
                                                    showLegend={false}
                                                    showTooltip={true}
                                                    customTooltip={
                                                        CustomTooltip
                                                    }
                                                    valueFormatter={(v) =>
                                                        typeof v === "number"
                                                            ? `${v.toFixed(1)}%`
                                                            : String(v)
                                                    }
                                                    connectNulls
                                                    curveType="monotone"
                                                    xAxisLabel="Year"
                                                    yAxisLabel="Return (%)"
                                                />
                                            </ErrorBoundary>
                                        </div>

                                        {/* Cumulative Return Chart */}
                                        <div>
                                            <h3 className="font-medium mb-3">
                                                Cumulative Total Return Index
                                                (2012 = 100)
                                            </h3>
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
                                                    className="h-96 w-full"
                                                    data={spxData}
                                                    index="Year"
                                                    categories={[
                                                        "S&P 500 Cumulative Total Return Index (2012 = 100)",
                                                    ]}
                                                    colors={["blue"]}
                                                    yAxisWidth={56}
                                                    showLegend={false}
                                                    showTooltip={true}
                                                    customTooltip={
                                                        CustomTooltip
                                                    }
                                                    valueFormatter={(v) =>
                                                        typeof v === "number"
                                                            ? v.toLocaleString(
                                                                  undefined,
                                                                  {
                                                                      maximumFractionDigits: 1,
                                                                  }
                                                              )
                                                            : String(v)
                                                    }
                                                    connectNulls
                                                    curveType="monotone"
                                                    xAxisLabel="Year"
                                                    yAxisLabel="Index Value"
                                                />
                                            </ErrorBoundary>
                                        </div>
                                    </div>
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
                                        Global Private Equity AUM (USD
                                        Trillions)
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
                                <div className="px-6 pb-4">
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Year-end levels; nominal USD;
                                        definitions per McKinsey GPMR.
                                    </p>
                                </div>
                            )}
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
                                <div className="px-6 pb-4">
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Calendar-year sales/deliveries as
                                        reported by sources.
                                    </p>
                                </div>
                            )}
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

                        {/* Household Net Worth Chart */}
                        <Card>
                            <CardHeader
                                className="cursor-pointer hover:bg-accent transition-colors"
                                onClick={() => toggleChart("hhNetWorth")}
                            >
                                <CardTitle className="flex items-center justify-between">
                                    <span>
                                        US Household Net Worth (USD Trillions,
                                        Q4)
                                    </span>
                                    <span className="subtle font-normal">
                                        {expandedCharts.hhNetWorth ? "▼" : "▶"}{" "}
                                        Click to{" "}
                                        {expandedCharts.hhNetWorth
                                            ? "collapse"
                                            : "expand"}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            {expandedCharts.hhNetWorth && (
                                <div className="px-6 pb-4">
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Year-end (Q4) levels from Federal
                                        Reserve Financial Accounts (Z.1).
                                        Subject to revision.
                                    </p>
                                </div>
                            )}
                            {expandedCharts.hhNetWorth && (
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
                                            data={hhNetWorthData}
                                            index="Year"
                                            categories={[
                                                "Household Net Worth (USD T)",
                                            ]}
                                            colors={["violet"]}
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

                        {/* G-Class Pricing Chart */}
                        <Card>
                            <CardHeader
                                className="cursor-pointer hover:bg-accent transition-colors"
                                onClick={() => toggleChart("prices")}
                            >
                                <CardTitle className="flex items-center justify-between">
                                    <span>
                                        G‑Class Estimated Transaction Price
                                        (Proxy) and G 550 MSRP (USD)
                                    </span>
                                    <span className="subtle font-normal">
                                        {expandedCharts.prices ? "▼" : "▶"}{" "}
                                        Click to{" "}
                                        {expandedCharts.prices
                                            ? "collapse"
                                            : "expand"}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            {expandedCharts.prices && (
                                <div className="px-6 pb-4">
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Annual; MSRP = base G 550 (excludes
                                        destination/options). Estimated ATP is a
                                        proxy calibrated to KBB/Cox March 2024.
                                    </p>
                                </div>
                            )}
                            {expandedCharts.prices && (
                                <CardContent>
                                    <div className="space-y-6">
                                        {/* Price Levels */}
                                        <div>
                                            <h3 className="font-medium mb-3">
                                                G‑Class Estimated Transaction
                                                Price (Proxy) (USD)
                                            </h3>
                                            <p className="text-xs text-muted-foreground mb-2">
                                                Proxy multiplier ≈ 1.46×
                                                (calibrated to Mar 2024 KBB/Cox
                                                ATP ≈ $208,663).
                                            </p>
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
                                                    className="h-64 w-full"
                                                    data={priceData}
                                                    index="Year"
                                                    categories={[
                                                        "G‑Class Est. ATP (Proxy) (USD)",
                                                    ]}
                                                    colors={["pink"]}
                                                    yAxisWidth={68}
                                                    showLegend={false}
                                                    showTooltip={true}
                                                    customTooltip={
                                                        CustomTooltip
                                                    }
                                                    valueFormatter={(v) =>
                                                        typeof v === "number"
                                                            ? `$${v.toLocaleString()}`
                                                            : String(v)
                                                    }
                                                    connectNulls
                                                    curveType="monotone"
                                                    xAxisLabel="Year"
                                                    yAxisLabel="Price (USD)"
                                                />
                                            </ErrorBoundary>
                                        </div>

                                        {/* Definitions */}
                                        <div className="border-t pt-4">
                                            <p className="text-sm font-medium mb-2">
                                                Definitions:
                                            </p>
                                            <ul className="space-y-2 text-sm subtle">
                                                <li>
                                                    <strong className="font-medium text-foreground">
                                                        G‑Class Estimated
                                                        Transaction Price
                                                        (Proxy):
                                                    </strong>{" "}
                                                    Estimated new-vehicle
                                                    transaction price for the
                                                    G‑Class computed as a
                                                    multiple of G 550 base MSRP.
                                                    Multiplier calibrated to a
                                                    public Kelley Blue Book/Cox
                                                    Automotive report citing
                                                    G‑Class ATP in March 2024
                                                    (~$208,663). Reflects
                                                    trim/mix (e.g., AMG G 63),
                                                    options, and market
                                                    conditions. This is a proxy,
                                                    not observed ATP.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
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
                                    </a>
                                    . S&P 500 calendar-year total return
                                    percentages (with dividends), compounded to
                                    form the cumulative total return index. 2012
                                    is set to 100; compounding begins in 2013.
                                </li>
                                <li>
                                    <strong className="font-medium text-foreground">
                                        Global PE AUM:
                                    </strong>{" "}
                                    <a
                                        href="https://www.mckinsey.com/industries/private-capital/our-insights/global-private-markets-report"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        McKinsey Global Private Markets Report
                                        (GPMR)
                                    </a>
                                    . Nominal USD, year-end levels. Historical
                                    values may be revised in later editions.
                                </li>
                                <li>
                                    <strong className="font-medium text-foreground">
                                        G‑Class US sales:
                                    </strong>{" "}
                                    US market; sales/deliveries as reported by
                                    MBUSA and CarFigures.
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
                                <li>
                                    <strong className="font-medium text-foreground">
                                        G‑Class ATP calibration:
                                    </strong>{" "}
                                    <a
                                        href="https://www.kbb.com/press-releases/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        Kelley Blue Book / Cox Automotive
                                    </a>
                                    , New‑Vehicle Average Transaction Price
                                    Report, March 2024: G‑Class ATP ≈ $208,663.
                                </li>
                                <li>
                                    <strong className="font-medium text-foreground">
                                        Household net worth:
                                    </strong>{" "}
                                    <a
                                        href="https://fred.stlouisfed.org/series/TNWBSHNO"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        Federal Reserve Economic Data (FRED),
                                        TNWBSHNO
                                    </a>
                                    — Households and nonprofit organizations;
                                    net worth, level. Q4 observations by year;
                                    subject to revision.
                                </li>
                                <li>
                                    <strong className="font-medium text-foreground">
                                        G 550 MSRP (basis for ATP proxy):
                                    </strong>
                                    <ul className="ml-6 mt-1 space-y-1">
                                        <li>
                                            <a
                                                href="https://media.mbusa.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                MBUSA media resources
                                            </a>{" "}
                                            (2018 G‑Class Quick Reference Guide,
                                            G 550 MSRP $123,600)
                                        </li>
                                        <li>
                                            US News model pages:
                                            <ul className="ml-4 mt-1 space-y-1">
                                                <li>
                                                    <a
                                                        href="https://cars.usnews.com/cars-trucks/mercedes-benz/g-class/2018/specs"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline"
                                                    >
                                                        2018 G 550
                                                    </a>{" "}
                                                    base MSRP $123,600
                                                </li>
                                                <li>
                                                    <a
                                                        href="https://cars.usnews.com/cars-trucks/mercedes-benz/g-class/2020/specs"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline"
                                                    >
                                                        2020 G 550
                                                    </a>{" "}
                                                    base MSRP $130,900
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            MY2023 G 550 base MSRP ≈ $139,900
                                            (automotive press, 2022 launch
                                            coverage)
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div className="border-t pt-4">
                            <p className="font-medium text-foreground mb-2">
                                Methodology Note:
                            </p>
                            <p className="text-sm subtle">
                                <strong>Indexing:</strong> All indexed series
                                use 2012 = 100. For the S&P 500 total return,
                                the cumulative index is rebased so 2012 equals
                                100 and compounding begins in 2013. For level
                                series (PE AUM, G‑Class sales, household net
                                worth, prices), index = 100 × value_t /
                                value_2012.
                            </p>
                            <p className="text-sm subtle mt-2">
                                <strong>G‑Class Estimated ATP (Proxy):</strong>{" "}
                                Computed as a fixed multiple of G 550 base MSRP
                                (US market, base trim, excluding
                                destination/options). The multiplier (≈1.46×) is
                                calibrated to a publicly cited ATP value for
                                March 2024 from Kelley Blue Book/Cox Automotive
                                (≈$208,663). This proxy reflects trim/mix (e.g.,
                                AMG G 63), options, and market conditions, and
                                is presented as an estimate only.
                            </p>
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
