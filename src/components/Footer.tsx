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
                            <li className="flex items-start gap-2">
                                <div
                                    className="mt-1 h-3 w-3 flex-shrink-0 rounded-full shadow-sm"
                                    style={{ backgroundColor: "#2453FF" }}
                                />
                                <div>
                                    <strong className="font-medium text-foreground">
                                        S&P 500 total return:
                                    </strong>{" "}
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
                                    . Calendar-year total return percentages
                                    (with dividends), compounded to a cumulative
                                    index rebased to 2012 = 100.
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
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
                            <li className="flex items-start gap-2">
                                <div
                                    className="mt-1 h-3 w-3 flex-shrink-0 rounded-full shadow-sm"
                                    style={{ backgroundColor: "#1FA97A" }}
                                />
                                <div>
                                    <strong className="font-medium text-foreground">
                                        G‑Class US sales:
                                    </strong>{" "}
                                    US calendar-year sales/deliveries (units).
                                    <ul className="ml-6 mt-1 space-y-1">
                                        <li>
                                            <a
                                                href="https://media.mbusa.com/releases/release-4efd8afecd0ad84220062379551956e8-mercedes-benz-usa-reports-9-year-over-year-growth-for-passenger-car-sales"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                MBUSA 2024 press release
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://carfigures.com/us-market-brand/mercedes-benz/g-class"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                CarFigures historical sales
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <div
                                    className="mt-1 h-3 w-3 flex-shrink-0 rounded-full shadow-sm"
                                    style={{ backgroundColor: "#E05E8C" }}
                                />
                                <div>
                                    <strong className="font-medium text-foreground">
                                        G‑Class ATP calibration:
                                    </strong>{" "}
                                    <a
                                        href="https://mediaroom.kbb.com/2024-04-15-New-Vehicle-Average-Transaction-Prices-Drop-to-Lowest-Level-in-nearly-Two-Years,-According-to-Latest-Kelley-Blue-Book-Estimates"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        Kelley Blue Book / Cox Automotive,
                                        Average Transaction Prices (March 2024)
                                    </a>{" "}
                                    (press release). G‑Class ATP ≈ $208,663.{" "}
                                    <a
                                        href="https://www.coxautoinc.com/wp-content/uploads/2024/04/March-2024-Kelley-Blue-Book-Average-Transaction-Price-tables.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        Data tables (PDF)
                                    </a>
                                    . Used for proxy calibration.
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <div
                                    className="mt-1 h-3 w-3 flex-shrink-0 rounded-full shadow-sm"
                                    style={{ backgroundColor: "#6F5BD5" }}
                                />
                                <div>
                                    <strong className="font-medium text-foreground">
                                        Household net worth:
                                    </strong>{" "}
                                    <a
                                        href="https://fred.stlouisfed.org/series/TNWBSHNO"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        Federal Reserve Economic Data (FRED),
                                        TNWBSHNO
                                    </a>
                                    — Households and nonprofit organizations;
                                    net worth (level). Q4 observation used for
                                    each year.
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <div
                                    className="mt-1 h-3 w-3 flex-shrink-0 rounded-full shadow-sm"
                                    style={{ backgroundColor: "#E05E8C" }}
                                />
                                <div>
                                    <strong className="font-medium text-foreground">
                                        G 550 MSRP (basis for proxy):
                                    </strong>{" "}
                                    G 550 base MSRP (US). Base trim; excludes
                                    destination/options. Selected model‑year
                                    references:
                                    <ul className="ml-6 mt-1 space-y-1">
                                        <li>
                                            <a
                                                href="https://media.mbusa.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                MBUSA media resources
                                            </a>{" "}
                                            (2018 G‑Class Quick Reference Guide,
                                            G 550 MSRP $123,600)
                                        </li>
                                        <li>
                                            US News model pages:
                                            <ul className="ml-4 mt-1 space-y-1">
                                                <li>
                                                    <a
                                                        href="https://cars.usnews.com/cars-trucks/mercedes-benz/g-class/2018/specs"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline"
                                                    >
                                                        2018 G 550
                                                    </a>{" "}
                                                    base MSRP $123,600
                                                </li>
                                                <li>
                                                    <a
                                                        href="https://cars.usnews.com/cars-trucks/mercedes-benz/g-class/2020/specs"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline"
                                                    >
                                                        2020 G 550
                                                    </a>{" "}
                                                    base MSRP $130,900
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            MY2023 G 550 base MSRP ≈ $139,900
                                            (automotive press, 2022 launch
                                            coverage)
                                        </li>
                                    </ul>
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
                            series (PE Assets Under Management, G‑Class sales,
                            household net worth, prices) use{" "}
                            <strong>arithmetic indexing</strong>: index = 100 ×
                            current value / 2012 value, representing relative
                            change from base. When comparing on the same chart,
                            both start at 100 but growth patterns differ
                            (multiplicative vs relative).
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
