import "./index.css";
import { useDataLoader } from "@/hooks/useDataLoader";
import { useChartExpansion } from "@/hooks/useChartExpansion";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ErrorPage } from "./components/ErrorPage";
import { GrillSeparator } from "./components/GrillSeparator";
import { IndexedComparisonChart } from "./components/charts/IndexedComparisonChart";
import { SPXChart } from "./components/charts/SPXChart";
import { PEChart } from "./components/charts/PEChart";
import { GClassSalesChart } from "./components/charts/GClassSalesChart";
import { HouseholdNetWorthChart } from "./components/charts/HouseholdNetWorthChart";
import { PricingChart } from "./components/charts/PricingChart";
import { toIndexedChartData } from "@/lib/dataTransformers";
import { ThemeProvider } from "@/components/theme-provider";
import { YouTubeVideo } from "./components/YouTubeVideo";
import { YouTubeVideo as YouTubeVideoConfig } from "@/constants/strings";

export default function App() {
    const {
        rows,
        indexedRows,
        spxCumData,
        spxCumInvestment,
        error,
        isLoading,
    } = useDataLoader();
    const { expandedCharts, toggleChart } = useChartExpansion();

    if (error) {
        return <ErrorPage error={error} />;
    }

    if (
        isLoading ||
        !rows ||
        !indexedRows ||
        !spxCumData ||
        !spxCumInvestment
    ) {
        return (
            <div className="p-6 bg-background text-foreground">Loading…</div>
        );
    }

    const dataIndexed = toIndexedChartData(indexedRows);

    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <div className="min-h-screen bg-background text-foreground">
                <Header />

                <main className="mx-auto max-w-7xl px-3 sm:px-4 py-4">
                    <div className="grid gap-6">
                        <GrillSeparator>Indexed Comparison</GrillSeparator>

                        <IndexedComparisonChart data={dataIndexed} />

                        <div className="space-y-4">
                            <GrillSeparator>
                                Individual Series Details
                            </GrillSeparator>

                            <SPXChart
                                rows={rows}
                                spxCumData={spxCumData}
                                spxCumInvestment={spxCumInvestment}
                                expandedCharts={expandedCharts}
                                onToggle={() => toggleChart("spx")}
                            />

                            <PEChart
                                rows={rows}
                                expandedCharts={expandedCharts}
                                onToggle={() => toggleChart("pe")}
                            />

                            <GClassSalesChart
                                rows={rows}
                                expandedCharts={expandedCharts}
                                onToggle={() => toggleChart("gclass")}
                            />

                            <HouseholdNetWorthChart
                                rows={rows}
                                expandedCharts={expandedCharts}
                                onToggle={() => toggleChart("hhNetWorth")}
                            />

                            <PricingChart
                                rows={rows}
                                expandedCharts={expandedCharts}
                                onToggle={() => toggleChart("prices")}
                            />
                        </div>

                        <GrillSeparator>Related Content</GrillSeparator>
                        <div className="space-y-3">
                            <div className="px-3 sm:px-4 py-3 bg-card border border-border rounded">
                                <h4 className="text-base md:text-lg font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent max-w-prose">
                                    {YouTubeVideoConfig.CAPTION}
                                </h4>
                            </div>
                            <YouTubeVideo
                                videoId={YouTubeVideoConfig.ID}
                                title={YouTubeVideoConfig.TITLE}
                            />
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </ThemeProvider>
    );
}
