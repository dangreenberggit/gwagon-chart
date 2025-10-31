import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LineChart } from "@tremor/react";
import { CustomTooltip } from "../CustomTooltip";
import { formatUnits } from "@/lib/formatters";
import { toGClassData } from "@/lib/dataTransformers";
import type { Row } from "@/lib/types";
import type { ExpandedCharts } from "@/lib/types";

interface GClassSalesChartProps {
    rows: Row[];
    expandedCharts: ExpandedCharts;
    onToggle: () => void;
}

export function GClassSalesChart({
    rows,
    expandedCharts,
    onToggle,
}: GClassSalesChartProps) {
    const gClassData = toGClassData(rows);

    return (
        <Card className="border-l-4 border-l-chart-sales hover:shadow-lg transition-shadow">
            <CardHeader
                className="cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={onToggle}
            >
                <CardTitle className="flex items-center justify-between">
                    <span>
                        US Mercedes-Benz G-Class Sales (Units)
                    </span>
                    <span className="subtle font-normal">
                        {expandedCharts.gclass ? "▼" : "▶"}{" "}
                        Click to{" "}
                        {expandedCharts.gclass ? "collapse" : "expand"}
                    </span>
                </CardTitle>
            </CardHeader>
            {expandedCharts.gclass && (
                <div className="px-6 pb-4">
                    <p className="text-sm text-muted-foreground mt-1">
                        US calendar-year sales/deliveries
                        (units).
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
                            categories={["US G‑Class sales (units)"]}
                            colors={["emerald"]}
                            yAxisWidth={52}
                            showLegend={false}
                            showTooltip={true}
                            customTooltip={CustomTooltip}
                            valueFormatter={formatUnits}
                            connectNulls
                            curveType="monotone"
                            xAxisLabel="Year"
                            yAxisLabel="Units Sold"
                        />
                    </ErrorBoundary>
                </CardContent>
            )}
        </Card>
    );
}

