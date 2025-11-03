import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LineChart } from "@tremor/react";
import { CustomTooltip } from "../CustomTooltip";
import { formatTrillions } from "@/lib/formatters";
import { toHouseholdNetWorthData } from "@/lib/dataTransformers";
import {
    Titles,
    Subtitles,
    Categories,
    AxisLabels,
    FooterAnchors,
} from "@/constants/strings";
import type { Row } from "@/lib/types";
import type { ExpandedCharts } from "@/lib/types";

interface HouseholdNetWorthChartProps {
    rows: Row[];
    expandedCharts: ExpandedCharts;
    onToggle: () => void;
}

export function HouseholdNetWorthChart({
    rows,
    expandedCharts,
    onToggle,
}: HouseholdNetWorthChartProps) {
    const hhNetWorthData = toHouseholdNetWorthData(rows);

    return (
        <Card className="border-l-4 border-l-chart-wealth hover:shadow-lg transition-shadow">
            <CardHeader
                className="cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={onToggle}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onToggle();
                    }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={expandedCharts.hhNetWorth}
            >
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        {Titles.HHNW_CARD}
                        <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                            USD T
                        </span>
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
                        {Subtitles.HHNW_CARD}
                    </p>
                </div>
            )}
            {expandedCharts.hhNetWorth && (
                <CardContent>
                    <div className="space-y-4">
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
                            categories={[...Categories.HHNW]}
                            colors={["violet"]}
                            yAxisWidth={64}
                            showLegend={false}
                            showTooltip={true}
                            customTooltip={CustomTooltip}
                            valueFormatter={formatTrillions}
                            connectNulls
                            curveType="monotone"
                            xAxisLabel={AxisLabels.YEAR}
                            yAxisLabel={AxisLabels.USD_TRILLIONS}
                        />
                    </ErrorBoundary>
                    <div className="pt-4 border-t">
                        <a
                            href={`#${FooterAnchors.HHNW}`}
                            className="text-sm text-primary hover:underline"
                            aria-label="View sources and definitions for Household net worth"
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

