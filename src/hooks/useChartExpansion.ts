import { useState } from "react";
import type { ExpandedCharts } from "@/lib/types";

export function useChartExpansion() {
    const [expandedCharts, setExpandedCharts] = useState<ExpandedCharts>({
        spx: false,
        pe: false,
        gclass: false,
        prices: false,
        hhNetWorth: false,
    });

    const toggleChart = (chart: keyof ExpandedCharts) => {
        setExpandedCharts((prev) => ({
            ...prev,
            [chart]: !prev[chart],
        }));
    };

    return { expandedCharts, toggleChart };
}
