/**
 * Locale detection and number formatting utilities using native Intl API.
 * Automatically detects browser locale with fallback to 'en-US'.
 */

/**
 * Auto-detect locale from browser with fallback to 'en-US'.
 */
export function getLocale(): string {
    if (typeof navigator !== "undefined" && navigator.language) {
        return navigator.language;
    }
    return "en-US";
}

/**
 * Format a number with locale-aware formatting.
 * Handles non-number values by returning String(value).
 */
export function formatNumber(
    value: number | string | null | undefined,
    locale?: string,
    options?: Intl.NumberFormatOptions
): string {
    if (typeof value !== "number") return String(value);
    const loc = locale || getLocale();
    return new Intl.NumberFormat(loc, options).format(value);
}

/**
 * Format currency value with locale-aware formatting.
 * Defaults to USD currency.
 * Handles non-number values by returning String(value).
 */
export function formatCurrency(
    value: number | string | null | undefined,
    locale?: string,
    currency: string = "USD"
): string {
    if (typeof value !== "number") return String(value);
    const loc = locale || getLocale();
    return new Intl.NumberFormat(loc, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    }).format(value);
}

/**
 * Format percentage value with locale-aware number formatting.
 * Keeps the "%" suffix but formats the number part according to locale.
 * Handles non-number values by returning String(value).
 */
export function formatPercentage(
    value: number | string | null | undefined,
    locale?: string,
    decimals: number = 1
): string {
    if (typeof value !== "number") return String(value);
    const loc = locale || getLocale();
    const formatted = formatNumber(value, loc, {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
    });
    return `${formatted}%`;
}

/**
 * Format value based on dataKey type and context.
 */
export function formatValue(
    dataKey: string,
    value: number | null | undefined,
    locale?: string
): string {
    if (value === null || value === undefined) return "N/A";

    const loc = locale || getLocale();

    // Percentages - format as X.X% (locale-aware number part)
    if (dataKey.includes("(%)") || dataKey.includes("Return (%)")) {
        return formatPercentage(value, loc, 1);
    }

    // Dollar values in trillions - format as $X.XX T
    if (dataKey.includes("(USD T)")) {
        const formatted = formatNumber(value, loc, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        });
        return `$${formatted} T`;
    }

    // Unit counts (sales) - format as X,XXX (no decimals, locale-aware)
    if (dataKey.includes("(units)")) {
        return formatNumber(value, loc, {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
        });
    }

    // Dollar values (MSRP, ATP) - format as $XXX,XXX (no cents, locale-aware)
    if (
        dataKey.includes("MSRP (USD)") ||
        dataKey.includes("ATP (Proxy) (USD)")
    ) {
        const formatted = formatNumber(value, loc, {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
        });
        return `$${formatted}`;
    }

    // Index values - format as XXX or XXX.X (up to one decimal, no trailing zeros)
    if (
        dataKey.includes("index") ||
        dataKey.includes("Index") ||
        dataKey.includes("= 100")
    ) {
        return formatNumber(value, loc, {
            maximumFractionDigits: 1,
            minimumFractionDigits: 0,
        });
    }

    // Default formatting (locale-aware)
    return formatNumber(value, loc, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
    });
}

/**
 * Create a value formatter function for use in chart valueFormatter props.
 * Automatically uses detected locale.
 */
export function createValueFormatter(options?: {
    format?: "number" | "currency" | "percentage";
    decimals?: number;
    currency?: string;
}): (value: number) => string {
    const locale = getLocale();
    const format = options?.format || "number";
    const decimals = options?.decimals;

    return (value: number) => {
        if (typeof value !== "number") return String(value);

        switch (format) {
            case "currency":
                return formatCurrency(value, locale, options?.currency);
            case "percentage":
                return formatPercentage(value, locale, decimals);
            default:
                return formatNumber(value, locale, {
                    maximumFractionDigits: decimals ?? 2,
                    minimumFractionDigits: decimals ?? 0,
                });
        }
    };
}

/**
 * Format indexed values (up to 1 decimal place, no trailing zeros).
 * Handles non-number values by returning String(value).
 */
export function formatIndexValue(
    value: number | string | null | undefined,
    locale?: string
): string {
    if (typeof value !== "number") return String(value);
    return formatNumber(value, locale || getLocale(), {
        maximumFractionDigits: 1,
        minimumFractionDigits: 0,
    });
}

/**
 * Format trillion currency values (e.g., $X.XX T).
 * Handles non-number values by returning String(value).
 */
export function formatTrillions(
    value: number | string | null | undefined,
    locale?: string
): string {
    if (typeof value !== "number") return String(value);
    const formatted = formatNumber(value, locale || getLocale(), {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    });
    return `$${formatted} T`;
}

/**
 * Format unit counts (e.g., sales units) with no decimals.
 * Handles non-number values by returning String(value).
 */
export function formatUnits(
    value: number | string | null | undefined,
    locale?: string
): string {
    if (typeof value !== "number") return String(value);
    return formatNumber(value, locale || getLocale(), {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });
}
