import { Logo } from "./Logo";

export function Footer() {
    return (
        <footer className="border-t border-border bg-gradient-to-b from-card to-secondary/30 mt-10">
            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="font-medium text-foreground mb-2">
                            Data Sources:
                        </p>
                        <ul className="space-y-2 subtle">
                            <li
                                id="spx-sources"
                                className="flex items-start gap-2"
                            >
                                <div
                                    className="mt-1 h-3 w-3 flex-shrink-0 rounded-full shadow-sm"
                                    style={{ backgroundColor: "#2453FF" }}
                                />
                                <div>
                                    <strong className="font-medium text-foreground">
                                        S&P 500 total return:
                                    </strong>{" "}
                                    S&P 500 total return (with dividends),
                                    calendar‑year. Cumulative index uses
                                    geometric compounding and is rebased to 2012
                                    = 100.{" "}
                                    <a
                                        href="https://www.slickcharts.com/sp500/returns"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        SlickCharts S&P 500 Returns
                                    </a>{" "}
                                    |{" "}
                                    <a
                                        href="https://www.slickcharts.com/sp500/returns/details"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        Return Details
                                    </a>
                                </div>
                            </li>
                            <li
                                id="pe-sources"
                                className="flex items-start gap-2"
                            >
                                <div
                                    className="mt-1 h-3 w-3 flex-shrink-0 rounded-full shadow-sm"
                                    style={{ backgroundColor: "#D39B00" }}
                                />
                                <div>
                                    <strong className="font-medium text-foreground">
                                        Global PE Assets Under Management:
                                    </strong>{" "}
                                    <a
                                        href="https://www.mckinsey.com/industries/private-capital/our-insights/global-private-markets-report"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        McKinsey Global Private Markets Report
                                        (GPMR)
                                    </a>
                                    . Global private equity assets under
                                    management, nominal USD, year‑end levels.
                                </div>
                            </li>
                            <li
                                id="gclass-sources"
                                className="flex items-start gap-2"
                            >
                                <div
                                    className="mt-1 h-3 w-3 flex-shrink-0 rounded-full shadow-sm"
                                    style={{ backgroundColor: "#1FA97A" }}
                                />
                                <div>
                                    <strong className="font-medium text-foreground">
                                        G‑Class U.S. sales:
                                    </strong>{" "}
                                    G‑Class U.S. sales (units), calendar year.
                                    Sources:{" "}
                                    <a
                                        href="https://media.mbusa.com/releases/release-4efd8afecd0ad84220062379551956e8-mercedes-benz-usa-reports-9-year-over-year-growth-for-passenger-car-sales"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        MBUSA press releases
                                    </a>
                                    ;{" "}
                                    <a
                                        href="https://carfigures.com/us-market-brand/mercedes-benz/g-class"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        CarFigures historical sales
                                    </a>
                                    .
                                </div>
                            </li>
                            <li
                                id="hhnw-sources"
                                className="flex items-start gap-2"
                            >
                                <div
                                    className="mt-1 h-3 w-3 flex-shrink-0 rounded-full shadow-sm"
                                    style={{ backgroundColor: "#6F5BD5" }}
                                />
                                <div>
                                    <strong className="font-medium text-foreground">
                                        Household net worth:
                                    </strong>{" "}
                                    Household and nonprofit net worth (level),
                                    Q4 of each year. Source:{" "}
                                    <a
                                        href="https://fred.stlouisfed.org/series/TNWBSHNO"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        FRED, TNWBSHNO
                                    </a>
                                    . Nominal U.S. dollars.
                                </div>
                            </li>
                            <li
                                id="pricing-sources"
                                className="flex items-start gap-2"
                            >
                                <div
                                    className="mt-1 h-3 w-3 flex-shrink-0 rounded-full shadow-sm"
                                    style={{ backgroundColor: "#E05E8C" }}
                                />
                                <div>
                                    <strong className="font-medium text-foreground">
                                        G‑Class pricing:
                                    </strong>{" "}
                                    Estimated price is a proxy = 1.46 × base
                                    MSRP. Calibrated to{" "}
                                    <a
                                        href="https://mediaroom.kbb.com/2024-04-15-New-Vehicle-Average-Transaction-Prices-Drop-to-Lowest-Level-in-nearly-Two-Years,-According-to-Latest-Kelley-Blue-Book-Estimates"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        Kelley Blue Book / Cox Automotive March
                                        2024 estimate (~$208,663)
                                    </a>
                                    . Not observed transaction data.
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="border-t pt-4">
                        <p className="font-medium text-foreground mb-2">
                            Methodology Note:
                        </p>
                        <p className="text-sm subtle">
                            <strong>Indexing:</strong> All indexed series use
                            2012 = 100. The S&P 500 cumulative index uses
                            <strong> geometric compounding</strong>: each year's
                            index = previous year's index × (1 + return/100),
                            representing cumulative compounded returns. Other
                            series (private equity assets under management,
                            G‑Class sales, household net worth, prices) use{" "}
                            <strong>arithmetic indexing</strong>: index = 100 ×
                            value ÷ 2012 value.
                        </p>
                        <p className="text-sm subtle mt-2">
                            <strong>Estimated ATP (Proxy):</strong> A fixed
                            multiple of G 550 base MSRP (US). Multiplier
                            (≈1.46×) calibrated to a publicly cited G‑Class ATP
                            in March 2024 (KBB/Cox; ≈$208,663). Proxy reflects
                            trim/mix and options. This is an estimate, not
                            observed ATP.
                        </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="subtle flex items-center gap-2">
                            <Logo size="md" loading="lazy" />© 2025 The G‑Class
                            Economy
                        </span>
                        <div className="flex items-center gap-3">
                            <div className="h-1.5 w-1.5 rounded-full bg-g-agave" />
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <div className="h-1.5 w-1.5 rounded-full bg-chart-spx" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
