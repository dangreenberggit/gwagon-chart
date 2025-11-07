/**
 * Locale detection and number formatting utilities using native Intl API.
 * Automatically detects browser locale with fallback to 'en-US'.
 */

/**
 * Auto-detects locale from browser with fallback to 'en-US'.
 * 
 * @returns Locale string (e.g., 'en-US', 'fr-FR').
 */
export function getLocale(): string {
    if (typeof navigator !== "undefined" && navigator.language) {
        return navigator.language;
    }
    return "en-US";
}

/**
 * Formats a number with locale-aware formatting.
 * 
 * @param value - The value to format. Non-number values are converted to strings.
 * @param locale - Optional locale string. Defaults to browser locale.
 * @param options - Optional Intl.NumberFormatOptions for custom formatting.
 * @returns Formatted number string, or String(value) if value is not a number.
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
 * Formats a currency value with locale-aware formatting.
 * 
 * @param value - The value to format. Non-number values are converted to strings.
 * @param locale - Optional locale string. Defaults to browser locale.
 * @param currency - Currency code (defaults to 'USD').
 * @returns Formatted currency string, or String(value) if value is not a number.
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
 * Formats a percentage value with locale-aware number formatting.
 * Keeps the "%" suffix but formats the number part according to locale.
 * 
 * @param value - The value to format. Non-number values are converted to strings.
 * @param locale - Optional locale string. Defaults to browser locale.
 * @param decimals - Number of decimal places (defaults to 1).
 * @returns Formatted percentage string with "%" suffix, or String(value) if value is not a number.
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
 * Formats a value based on the dataKey type and context.
 * Automatically detects the appropriate format (percentage, currency, units, index, etc.)
 * and applies locale-aware formatting.
 * 
 * @param dataKey - The data key string that determines the formatting strategy.
 * @param value - The numeric value to format, or null/undefined.
 * @param locale - Optional locale string. Defaults to browser locale.
 * @returns Formatted string value, or "N/A" if value is null/undefined.
 */
export function formatValue(
    dataKey: string,
    value: number | null | undefined,
    locale?: string
): string {
    if (value === null || value === undefined) return "N/A";

    const loc = locale || getLocale();

    if (dataKey.includes("(%)") || dataKey.includes("Return (%)")) {
        return formatPercentage(value, loc, 1);
    }

    if (dataKey.includes("(USD T)")) {
        const formatted = formatNumber(value, loc, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        });
        return `$${formatted} T`;
    }

    if (dataKey.includes("(units)")) {
        return formatNumber(value, loc, {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
        });
    }

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

    return formatNumber(value, loc, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
    });
}

/**
 * Creates a value formatter function for use in chart valueFormatter props.
 * Automatically uses detected locale.
 * 
 * @param options - Configuration options:
 *   - format: Format type ('number', 'currency', or 'percentage').
 *   - decimals: Number of decimal places.
 *   - currency: Currency code (for currency format).
 * @returns A function that formats numbers according to the specified options.
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
 * Formats indexed values with up to 1 decimal place and no trailing zeros.
 * 
 * @param value - The value to format. Non-number values are converted to strings.
 * @param locale - Optional locale string. Defaults to browser locale.
 * @returns Formatted index value string, or String(value) if value is not a number.
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
 * Formats trillion currency values (e.g., $X.XX T).
 * 
 * @param value - The value to format. Non-number values are converted to strings.
 * @param locale - Optional locale string. Defaults to browser locale.
 * @returns Formatted trillion string with "$" prefix and "T" suffix, or String(value) if value is not a number.
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
 * Formats unit counts (e.g., sales units) with no decimals.
 * 
 * @param value - The value to format. Non-number values are converted to strings.
 * @param locale - Optional locale string. Defaults to browser locale.
 * @returns Formatted unit count string with no decimals, or String(value) if value is not a number.
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
