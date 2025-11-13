import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LineChart } from "@tremor/react";
import { CustomTooltip } from "../CustomTooltip";
import { formatUnits } from "@/lib/formatters";
import { toGClassData } from "@/lib/dataTransformers";
import {
    Titles,
    Subtitles,
    Categories,
    AxisLabels,
    FooterAnchors,
} from "@/constants/strings";
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
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onToggle();
                    }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={expandedCharts.gclass}
            >
                <CardTitle className="flex items-center justify-between gap-2 pr-2">
                    <span className="flex items-center gap-2">
                        {expandedCharts.gclass ? "▼" : "▶"}{" "}
                        {Titles.GCLASS_CARD}
                    </span>
                    <span className="text-xs font-normal px-2.5 py-1 sm:px-2 sm:py-0.5 rounded-full bg-secondary text-muted-foreground whitespace-nowrap flex-shrink-0">
                        Units
                    </span>
                </CardTitle>
            </CardHeader>
            {expandedCharts.gclass && (
                <div className="px-3 sm:px-6 pb-4">
                    <p className="text-sm text-muted-foreground mt-1">
                        {Subtitles.GCLASS_CARD}
                    </p>
                </div>
            )}
            {expandedCharts.gclass && (
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
                                data={gClassData}
                                index="Year"
                                categories={[...Categories.GCLASS]}
                                colors={["emerald"]}
                                yAxisWidth={52}
                                showLegend={false}
                                showTooltip={true}
                                customTooltip={CustomTooltip}
                                valueFormatter={formatUnits}
                                connectNulls
                                curveType="monotone"
                                xAxisLabel={AxisLabels.YEAR}
                                yAxisLabel={AxisLabels.UNITS}
                            />
                        </ErrorBoundary>
                        <div className="pt-4 border-t">
                            <a
                                href={`#${FooterAnchors.GCLASS}`}
                                className="text-sm text-primary hover:underline"
                                aria-label="View sources and definitions for G-Class U.S. sales"
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
