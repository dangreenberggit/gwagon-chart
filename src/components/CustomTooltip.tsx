import type { CustomTooltipProps } from "@tremor/react";
import { formatValue } from "@/lib/formatters";

/**
 * Maps full data key names to concise labels for tooltip display.
 */
const getConciseLabel = (dataKey: string) => {
    const labelMap: { [key: string]: string } = {
        "S&P 500 total return index (2012 = 100)": "S&P 500",
        "S&P 500 Cumulative Total Return Index (2012 = 100)": "S&P 500",
        "S&P 500 Annual Total Return (%)": "S&P 500",
        "S&P 500 total return (%)": "S&P 500",
        "S&P 500 Total Return Index (2012 = 100, compounding from 2013)":
            "S&P 500 (from 2013)",
        "S&P 500 Total Return Index (base 100, compounding from 2012)":
            "S&P 500 (from 2012)",
        "Total return (compounding from 2013)": "S&P 500 (from 2013)",
        "Total return (compounding from 2012)": "S&P 500 (from 2012)",
        "Global PE AUM (index, 2012 = 100)": "PE AUM",
        "Global PE AUM (USD T)": "PE AUM",
        "US G‑Class sales (index, 2012 = 100)": "G‑Class Sales",
        "US G‑Class sales (units)": "G‑Class Sales",
        "G‑Class Est. ATP (index, 2012 = 100)": "G‑Class ATP",
        "G‑Class Est. ATP (Proxy) (USD)": "G‑Class ATP",
        "G‑Class estimated price (proxy, USD)": "G‑Class Price",
        "G 550 base MSRP (USD)": "G 550 MSRP",
        "Household net worth (index, 2012 = 100)": "HH Net Worth",
        "Household Net Worth (USD T)": "HH Net Worth",
    };
    return labelMap[dataKey] || dataKey;
};

export const CustomTooltip = ({
    active,
    payload,
    label,
}: CustomTooltipProps) => {
    if (!active || !payload || payload.length === 0) return null;

    const getSeriesColor = (dataKey: string) => {
        const colorMap: { [key: string]: string } = {
            "S&P 500 total return index (2012 = 100)": "#3b82f6",
            "S&P 500 Cumulative Total Return Index (2012 = 100)": "#3b82f6",
            "S&P 500 Annual Total Return (%)": "#3b82f6",
            "S&P 500 total return (%)": "#3b82f6",
            "S&P 500 Total Return Index (2012 = 100, compounding from 2013)":
                "#3b82f6",
            "S&P 500 Total Return Index (base 100, compounding from 2012)":
                "#10b981",
            "Total return (compounding from 2013)": "#3b82f6",
            "Total return (compounding from 2012)": "#10b981",
            "Global PE AUM (index, 2012 = 100)": "#f59e0b",
            "Global PE AUM (USD T)": "#f59e0b",
            "US G‑Class sales (index, 2012 = 100)": "#10b981",
            "US G‑Class sales (units)": "#10b981",
            "G‑Class Est. ATP (index, 2012 = 100)": "#ec4899",
            "G‑Class Est. ATP (Proxy) (USD)": "#ec4899",
            "G‑Class estimated price (proxy, USD)": "#ec4899",
            "G 550 base MSRP (USD)": "#a855f7",
            "Household net worth (index, 2012 = 100)": "#8b5cf6",
            "Household Net Worth (USD T)": "#8b5cf6",
        };
        return colorMap[dataKey] || "#6b7280";
    };

    return (
        <div className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg px-3 py-2 text-sm">
            <div className="font-semibold text-gray-900 dark:text-white mb-1">
                {label}
            </div>
            {payload.map((category: any, idx: number) => (
                <div
                    key={idx}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{
                            backgroundColor: getSeriesColor(category.dataKey),
                        }}
                    />
                    <span className="text-xs">
                        {getConciseLabel(category.dataKey)}:{" "}
                        <span className="font-medium">
                            {formatValue(category.dataKey, category.value)}
                        </span>
                    </span>
                </div>
            ))}
        </div>
    );
};
