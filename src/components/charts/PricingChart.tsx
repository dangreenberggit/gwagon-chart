import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LineChart } from "@tremor/react";
import { CustomTooltip } from "../CustomTooltip";
import { formatCurrency } from "@/lib/formatters";
import { toPriceData } from "@/lib/dataTransformers";
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
            >
                <CardTitle className="flex items-center justify-between">
                    <span>
                        G‑Class Estimated Transaction Price
                        (Proxy) (USD)
                    </span>
                    <span className="subtle font-normal">
                        {expandedCharts.prices ? "▼" : "▶"}{" "}
                        Click to{" "}
                        {expandedCharts.prices ? "collapse" : "expand"}
                    </span>
                </CardTitle>
            </CardHeader>
            {expandedCharts.prices && (
                <div className="px-6 pb-4">
                    <p className="text-sm text-muted-foreground mt-1">
                        Estimated ATP proxy (1.46× MSRP).
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
                                Proxy estimate (1.46× MSRP), calibrated to Mar
                                2024 KBB/Cox ATP ≈ $208,663. Not observed data.
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
                                    yAxisWidth={56}
                                    showLegend={false}
                                    showTooltip={true}
                                    customTooltip={CustomTooltip}
                                    valueFormatter={formatCurrency}
                                    connectNulls
                                    curveType="monotone"
                                    xAxisLabel="Year"
                                    yAxisLabel="Price (USD)"
                                    minValue={160000}
                                    maxValue={215000}
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
                                        Estimated Transaction
                                        Price (Proxy):
                                    </strong>{" "}
                                    computed as a fixed multiple
                                    of G 550 base MSRP.
                                    Multiplier calibrated to a
                                    publicly cited G‑Class ATP
                                    in March 2024 (KBB/Cox).
                                    Reflects trim/mix (e.g., AMG
                                    G 63) and options; this is a
                                    proxy, not observed ATP.
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}

