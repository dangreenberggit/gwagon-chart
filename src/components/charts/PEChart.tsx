import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LineChart } from "@tremor/react";
import { CustomTooltip } from "../CustomTooltip";
import { formatTrillions } from "@/lib/formatters";
import { toPEData } from "@/lib/dataTransformers";
import {
    Titles,
    Subtitles,
    Categories,
    AxisLabels,
    FooterAnchors,
} from "@/constants/strings";
import type { Row } from "@/lib/types";
import type { ExpandedCharts } from "@/lib/types";

interface PEChartProps {
    rows: Row[];
    expandedCharts: ExpandedCharts;
    onToggle: () => void;
}

export function PEChart({ rows, expandedCharts, onToggle }: PEChartProps) {
    const peData = toPEData(rows);

    return (
        <Card className="border-l-4 border-l-chart-pe hover:shadow-lg transition-shadow">
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
                aria-expanded={expandedCharts.pe}
            >
                <CardTitle className="flex items-center justify-between gap-2 pr-2">
                    <span className="flex items-center gap-2">
                        {expandedCharts.pe ? "▼" : "▶"} {Titles.PE_CARD}
                    </span>
                    <span className="text-xs font-normal px-2.5 py-1 sm:px-2 sm:py-0.5 rounded-full bg-secondary text-muted-foreground whitespace-nowrap flex-shrink-0">
                        USD T
                    </span>
                </CardTitle>
            </CardHeader>
            {expandedCharts.pe && (
                <div className="px-3 sm:px-6 pb-4">
                    <p className="text-sm text-muted-foreground mt-1">
                        {Subtitles.PE_CARD}
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
                            categories={[...Categories.PE]}
                            colors={["amber"]}
                            yAxisWidth={48}
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
                            href={`#${FooterAnchors.PE}`}
                            className="text-sm text-primary hover:underline"
                            aria-label="View sources and definitions for Global private equity assets under management"
                        >
                            Sources and definitions
                        </a>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
