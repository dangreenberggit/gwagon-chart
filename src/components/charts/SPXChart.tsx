import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LineChart } from "@tremor/react";
import { CustomTooltip } from "../CustomTooltip";
import { formatPercentage, formatIndexValue } from "@/lib/formatters";
import {
    Titles,
    Subtitles,
    Categories,
    AxisLabels,
    FooterAnchors,
} from "@/constants/strings";
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
        [Categories.SPX_ANNUAL[0]]: r.spxTR,
    }));

    // Combine both cumulative series for the chart
    const invByYear = new Map(spxCumInvestment.map((d) => [d.year, d.index]));
    const spxData = spxCumData.map((d) => ({
        Year: d.year.toString(),
        [Categories.SPX_CUMULATIVE[0]]: d.index,
        [Categories.SPX_CUMULATIVE[1]]: invByYear.get(d.year) ?? null,
    }));

    return (
        <Card className="border-l-4 border-l-chart-spx hover:shadow-lg transition-shadow">
            <CardHeader
                className="cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={onToggle}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onToggle();
                    }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={expandedCharts.spx}
            >
                <CardTitle className="flex items-center justify-between gap-2 pr-2">
                    <span className="flex items-center gap-2">
                        {expandedCharts.spx ? "▼" : "▶"} {Titles.SPX_CARD}
                        <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                            % / Index
                        </span>
                    </span>
                </CardTitle>
            </CardHeader>
            {expandedCharts.spx && (
                <div className="px-6 pb-4">
                    <p className="text-sm text-muted-foreground mt-1">
                        {Subtitles.SPX_CARD}
                    </p>
                </div>
            )}
            {expandedCharts.spx && (
                <CardContent>
                    <div className="space-y-6">
                        {/* Annual Return Chart */}
                        <div>
                            <h3 className="font-medium mb-3">
                                {Titles.SPX_ANNUAL}
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
                                    categories={[...Categories.SPX_ANNUAL]}
                                    colors={["blue"]}
                                    yAxisWidth={56}
                                    showLegend={false}
                                    showTooltip={true}
                                    customTooltip={CustomTooltip}
                                    valueFormatter={formatPercentage}
                                    connectNulls
                                    curveType="monotone"
                                    xAxisLabel={AxisLabels.YEAR}
                                    yAxisLabel={AxisLabels.PERCENT}
                                />
                            </ErrorBoundary>
                        </div>

                        {/* Cumulative Return Chart */}
                        <div>
                            <h3 className="font-medium mb-3">
                                {Titles.SPX_CUMULATIVE}
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
                                    categories={[...Categories.SPX_CUMULATIVE]}
                                    colors={["blue", "emerald"]}
                                    yAxisWidth={56}
                                    showLegend={true}
                                    showTooltip={true}
                                    customTooltip={CustomTooltip}
                                    valueFormatter={formatIndexValue}
                                    connectNulls
                                    curveType="monotone"
                                    xAxisLabel={AxisLabels.YEAR}
                                    yAxisLabel={AxisLabels.INDEX}
                                />
                            </ErrorBoundary>
                        </div>
                        <div className="pt-4 border-t">
                            <a
                                href={`#${FooterAnchors.SPX}`}
                                className="text-sm text-primary hover:underline"
                                aria-label="View sources and definitions for S&P 500 total return"
                            >
                                Sources and definitions
                            </a>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
