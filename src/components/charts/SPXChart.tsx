import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LineChart } from "@tremor/react";
import { CustomTooltip } from "../CustomTooltip";
import { formatPercentage, formatIndexValue } from "@/lib/formatters";
import type { Row } from "@/lib/types";
import type { ExpandedCharts } from "@/lib/types";

interface SPXChartProps {
    rows: Row[];
    spxCumData: Array<{ year: number; index: number }>;
    spxCumInvestment: Array<{ year: number; index: number }>;
    expandedCharts: ExpandedCharts;
    onToggle: () => void;
}

export function SPXChart({
    rows,
    spxCumData,
    spxCumInvestment,
    expandedCharts,
    onToggle,
}: SPXChartProps) {
    const spxReturnData = rows.map((r) => ({
        Year: r.year.toString(),
        "S&P 500 Annual Total Return (%)": r.spxTR,
    }));

    // Combine both cumulative series for the chart
    const spxData = spxCumData.map((d) => {
        const investmentData = spxCumInvestment.find(
            (inv) => inv.year === d.year
        );
        return {
            Year: d.year.toString(),
            "S&P 500 Total Return Index (2012 = 100, compounding from 2013)":
                d.index,
            "S&P 500 Total Return Index (base 100, compounding from 2012)":
                investmentData?.index ?? null,
        };
    });

    return (
        <Card className="border-l-4 border-l-chart-spx hover:shadow-lg transition-shadow">
            <CardHeader
                className="cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={onToggle}
            >
                <CardTitle className="flex items-center justify-between">
                    <span>S&P 500 Total Return</span>
                    <span className="subtle font-normal">
                        {expandedCharts.spx ? "▼" : "▶"} Click to{" "}
                        {expandedCharts.spx ? "collapse" : "expand"}
                    </span>
                </CardTitle>
            </CardHeader>
            {expandedCharts.spx && (
                <CardContent>
                    <div className="space-y-6">
                        {/* Annual Return Chart */}
                        <div>
                            <h3 className="font-medium mb-3">
                                S&P 500 Annual Total Return (%)
                            </h3>
                            <p className="text-xs text-muted-foreground mb-2">
                                Calendar-year total return (price change +
                                dividends).
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
                                    customTooltip={CustomTooltip}
                                    valueFormatter={formatPercentage}
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
                                S&P 500 Cumulative Total Return Index (2012 =
                                100)
                            </h3>
                            <p className="text-xs text-muted-foreground mb-2">
                                Two cumulative total return indices. Blue:
                                Indexed so 2012 = 100, compounding from 2013.
                                Green: Base 100 at start of 2012, compounding
                                from 2012.
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
                                    className="h-96 w-full"
                                    data={spxData}
                                    index="Year"
                                    categories={[
                                        "S&P 500 Total Return Index (2012 = 100, compounding from 2013)",
                                        "S&P 500 Total Return Index (base 100, compounding from 2012)",
                                    ]}
                                    colors={["blue", "emerald"]}
                                    yAxisWidth={56}
                                    showLegend={true}
                                    showTooltip={true}
                                    customTooltip={CustomTooltip}
                                    valueFormatter={formatIndexValue}
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
    );
}
