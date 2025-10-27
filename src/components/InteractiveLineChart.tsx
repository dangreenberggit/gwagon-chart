import React, { useState, useCallback } from "react";
import { LineChart as TremorLineChart } from "@tremor/react";
import {
    type AvailableChartColorsKeys,
    getColorClassName,
    constructCategoryColors,
} from "../lib/chartUtils";
import { cn } from "../lib/utils";

interface InteractiveLineChartProps {
    data: Record<string, any>[];
    index: string;
    categories: string[];
    colors?: AvailableChartColorsKeys[];
    className?: string;
    yAxisWidth?: number;
    showLegend?: boolean;
    showTooltip?: boolean;
    customTooltip?: React.ComponentType<any>;
    valueFormatter?: (value: number) => string;
    connectNulls?: boolean;
    curveType?: "linear" | "natural" | "monotone" | "step";
    xAxisLabel?: string;
    yAxisLabel?: string;
    onValueChange?: (value: any) => void;
}

export const InteractiveLineChart: React.FC<InteractiveLineChartProps> = ({
    data,
    index,
    categories,
    colors = [
        "blue",
        "emerald",
        "violet",
        "amber",
        "gray",
        "cyan",
        "pink",
        "lime",
        "fuchsia",
    ],
    className,
    yAxisWidth = 56,
    showLegend = true,
    showTooltip = true,
    customTooltip,
    valueFormatter,
    connectNulls = false,
    curveType = "monotone",
    xAxisLabel,
    yAxisLabel,
    onValueChange,
    ...props
}) => {
    // State to track which categories are visible
    const [visibleCategories, setVisibleCategories] = useState<Set<string>>(
        new Set(categories)
    );

    // Toggle category visibility
    const toggleCategory = useCallback((category: string) => {
        setVisibleCategories((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    }, []);

    // Filter data to only include visible categories
    const filteredData = data.map((item) => {
        const filteredItem = { ...item };
        categories.forEach((category) => {
            if (!visibleCategories.has(category)) {
                delete filteredItem[category];
            }
        });
        return filteredItem;
    });

    // Get visible categories for the chart
    const visibleCategoriesArray = categories.filter((cat) =>
        visibleCategories.has(cat)
    );

    // Create category colors map
    const categoryColors = constructCategoryColors(categories, colors);

    // Filter colors to match visible categories, maintaining original color mapping
    const visibleColors = categories
        .filter((cat) => visibleCategories.has(cat))
        .map((cat) => categoryColors.get(cat) || "blue");

    return (
        <div className="w-full">
            {/* Custom Legend with Toggle Buttons */}
            {showLegend && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    {categories.map((category) => {
                        const isVisible = visibleCategories.has(category);
                        const color = categoryColors.get(category) || "blue";

                        return (
                            <button
                                key={category}
                                onClick={() => toggleCategory(category)}
                                className={cn(
                                    "inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-all duration-200",
                                    "border hover:shadow-md",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                    isVisible
                                        ? "bg-card text-card-foreground border-border shadow-sm"
                                        : "bg-secondary text-muted-foreground border-border hover:bg-secondary/80"
                                )}
                            >
                                {/* Color indicator */}
                                <div
                                    className={cn(
                                        "h-3 w-3 rounded-full ring-2 ring-offset-1",
                                        getColorClassName(color, "bg"),
                                        isVisible
                                            ? "ring-white"
                                            : "ring-transparent opacity-40"
                                    )}
                                />

                                {/* Category name */}
                                <span>{category}</span>

                                {/* Toggle indicator */}
                                <span className="text-xs w-3 flex items-center justify-center">
                                    {isVisible ? "●" : "○"}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Tremor LineChart */}
            <TremorLineChart
                className={className}
                data={filteredData}
                index={index}
                categories={visibleCategoriesArray}
                colors={visibleColors}
                yAxisWidth={yAxisWidth}
                showLegend={false} // We're using our custom legend
                showTooltip={showTooltip}
                customTooltip={customTooltip}
                valueFormatter={valueFormatter}
                connectNulls={connectNulls}
                curveType={curveType}
                xAxisLabel={xAxisLabel}
                yAxisLabel={yAxisLabel}
                onValueChange={onValueChange}
                {...props}
            />
        </div>
    );
};
