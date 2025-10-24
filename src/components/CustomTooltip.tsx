import type { CustomTooltipProps } from "@tremor/react";

// Helper function to create concise labels
const getConciseLabel = (dataKey: string) => {
    const labelMap: { [key: string]: string } = {
        "S&P 500 total return index (2012 = 100)": "S&P 500",
        "Global PE AUM (index, 2012 = 100)": "PE AUM",
        "US G‑Class sales (index, 2012 = 100)": "G‑Class Sales",
        "S&P 500 total return (%)": "S&P 500",
        "Global PE AUM (USD T)": "PE AUM",
        "US G‑Class sales (units)": "G‑Class Sales",
    };
    return labelMap[dataKey] || dataKey;
};

export const CustomTooltip = ({
    active,
    payload,
    label,
}: CustomTooltipProps) => {
    if (!active || !payload || payload.length === 0) return null;

    // Define colors for each data series
    const getSeriesColor = (dataKey: string) => {
        const colorMap: { [key: string]: string } = {
            "S&P 500 total return index (2012 = 100)": "#3b82f6", // blue
            "Global PE AUM (index, 2012 = 100)": "#f59e0b", // amber
            "US G‑Class sales (index, 2012 = 100)": "#10b981", // emerald
            "S&P 500 total return (%)": "#3b82f6", // blue
            "Global PE AUM (USD T)": "#f59e0b", // amber
            "US G‑Class sales (units)": "#10b981", // emerald
        };
        return colorMap[dataKey] || category.color || "#6b7280";
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
                        <span className="font-medium">{category.value}</span>
                    </span>
                </div>
            ))}
        </div>
    );
};
