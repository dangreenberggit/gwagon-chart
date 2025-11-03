import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { InteractiveLineChart } from "../InteractiveLineChart";
import { CustomTooltip } from "../CustomTooltip";
import { formatIndexValue } from "@/lib/formatters";
import { Titles, Subtitles, Categories } from "@/constants/strings";

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
                <CardTitle>{Titles.INDEXED_CARD}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                    {Subtitles.INDEXED_CARD}
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
                        categories={[...Categories.INDEXED]}
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

