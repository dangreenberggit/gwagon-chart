import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { InteractiveLineChart } from "../InteractiveLineChart";
import { CustomTooltip } from "../CustomTooltip";
import { formatIndexValue } from "@/lib/formatters";

interface IndexedComparisonChartProps {
    data: Array<{
        Year: string;
        "S&P 500 total return index (2012 = 100)": number | null;
        "US G‑Class sales (index, 2012 = 100)": number;
        "Household net worth (index, 2012 = 100)": number;
    }>;
}

export function IndexedComparisonChart({ data }: IndexedComparisonChartProps) {
    return (
        <Card className="border-l-4 border-l-primary shadow-md">
            <CardHeader>
                <CardTitle>
                    Indexed Comparison (2012 = 100): S&P 500 Total
                    Return, G‑Class Sales, and Household Net Worth
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                    Annual, calendar-year data. S&P 500 is total return with
                    dividends (compounded, rebased so 2012 = 100); sales and
                    household net worth are level series indexed to 2012.
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
                        data={data}
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
                        valueFormatter={formatIndexValue}
                        connectNulls
                        curveType="monotone"
                    />
                </ErrorBoundary>
            </CardContent>
        </Card>
    );
}

