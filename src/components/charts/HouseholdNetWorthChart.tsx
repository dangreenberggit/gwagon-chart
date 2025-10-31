import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LineChart } from "@tremor/react";
import { CustomTooltip } from "../CustomTooltip";
import { formatTrillions } from "@/lib/formatters";
import { toHouseholdNetWorthData } from "@/lib/dataTransformers";
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
                        US households and nonprofits; Q4
                        year‑end levels (USD trillions). Subject
                        to revision.
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
                            categories={["Household Net Worth (USD T)"]}
                            colors={["violet"]}
                            yAxisWidth={64}
                            showLegend={false}
                            showTooltip={true}
                            customTooltip={CustomTooltip}
                            valueFormatter={formatTrillions}
                            connectNulls
                            curveType="monotone"
                            xAxisLabel="Year"
                            yAxisLabel="USD Trillions"
                        />
                    </ErrorBoundary>
                </CardContent>
            )}
        </Card>
    );
}

