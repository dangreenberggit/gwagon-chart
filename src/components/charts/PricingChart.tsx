import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LineChart } from "@tremor/react";
import { CustomTooltip } from "../CustomTooltip";
import { formatCurrency } from "@/lib/formatters";
import { toPriceData } from "@/lib/dataTransformers";
import {
    Titles,
    Subtitles,
    Categories,
    AxisLabels,
    FooterAnchors,
} from "@/constants/strings";
import type { Row } from "@/lib/types";
import type { ExpandedCharts } from "@/lib/types";

interface PricingChartProps {
    rows: Row[];
    expandedCharts: ExpandedCharts;
    onToggle: () => void;
}

export function PricingChart({
    rows,
    expandedCharts,
    onToggle,
}: PricingChartProps) {
    const priceData = toPriceData(rows);

    return (
        <Card className="border-l-4 border-l-chart-atp hover:shadow-lg transition-shadow">
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
                aria-expanded={expandedCharts.prices}
            >
                <CardTitle className="flex items-center justify-between gap-2 pr-2">
                    <span className="flex items-center gap-2">
                        {expandedCharts.prices ? "▼" : "▶"} {Titles.PRICES_CARD}
                        <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                            USD
                        </span>
                    </span>
                </CardTitle>
            </CardHeader>
            {expandedCharts.prices && (
                <div className="px-3 sm:px-6 pb-4">
                    <p className="text-sm text-muted-foreground mt-1">
                        {Subtitles.PRICES_CARD}
                    </p>
                </div>
            )}
            {expandedCharts.prices && (
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
                            className="h-56 w-full"
                            data={priceData}
                            index="Year"
                            categories={[...Categories.PRICES]}
                            colors={["pink"]}
                            yAxisWidth={56}
                            showLegend={false}
                            showTooltip={true}
                            customTooltip={CustomTooltip}
                            valueFormatter={formatCurrency}
                            connectNulls
                            curveType="monotone"
                            xAxisLabel={AxisLabels.YEAR}
                            yAxisLabel={AxisLabels.USD_PRICE}
                        />
                    </ErrorBoundary>
                    <div className="pt-4 border-t">
                        <a
                            href={`#${FooterAnchors.PRICING}`}
                            className="text-sm text-primary hover:underline"
                            aria-label="View sources and definitions for G‑Class pricing"
                        >
                            Sources and definitions
                        </a>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
