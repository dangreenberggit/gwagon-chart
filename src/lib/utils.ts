import { type ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge.
 * Handles conditional classes and resolves Tailwind conflicts.
 * 
 * @param inputs - Class values to merge (strings, objects, arrays, etc.).
 * @returns Merged class string.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Finds the index of a target year in an array of years.
 * 
 * @param years - Array of year numbers.
 * @param targetYear - The year to find.
 * @returns The index of the target year.
 * @throws Error if the target year is not found in the array.
 */
export function findYearIndex(years: number[], targetYear: number): number {
    const idx = years.indexOf(targetYear);
    if (idx < 0) throw new Error(`Base year ${targetYear} not found`);
    return idx;
}

/**
 * Indexes a series to base = 100 at the specified base index.
 * 
 * @param values - Array of numeric values to index.
 * @param baseIndex - Index of the base element (defaults to 0).
 * @returns Array of indexed values. Returns zeros if base is 0 or invalid.
 *          Non-finite elements (NaN, ±Inf) return null for chart compatibility.
 */
export function indexSeries(
    values: number[],
    baseIndex = 0
): (number | null)[] {
    const base = values[baseIndex];
    if (base === undefined || !isFinite(base) || base === 0)
        return values.map(() => 0);
    return values.map((v) => {
        if (!isFinite(v)) return null;
        return (v / base) * 100;
    });
}

/**
 * Computes an index series where the base element equals 100.
 * 
 * @param levels - Array of level values (e.g., USD amounts), not returns.
 * @param baseIndex - Index of the base element (e.g., the index corresponding to 2012).
 * @param options - Configuration options:
 *   - decimals: Reserved for future use (not used for calculation rounding).
 *   - fallback: Behavior for invalid points - "zeros" or "skip".
 *   - onIssue: Optional logger function for error messages.
 * @returns Array of indexed values with full precision. Rounding is handled at
 *          the display layer.
 */
export function indexLevelsToBase100(
    levels: Array<number | null | undefined>,
    baseIndex: number,
    options?: {
        decimals?: number; // Reserved for future use (not used for calculation rounding)
        fallback?: "zeros" | "skip"; // what to do for invalid points: zeros or undefined
        onIssue?: (msg: string) => void; // logger
    }
): number[] {
    const { fallback = "skip", onIssue } = options ?? {};
    const base = levels[baseIndex];

    const invalidBase =
        base === null ||
        base === undefined ||
        !Number.isFinite(base as number) ||
        (base as number) === 0;

    if (invalidBase) {
        onIssue?.(
            `indexLevelsToBase100: invalid base at index ${baseIndex} (value=${String(
                base
            )})`
        );
        return levels.map(() =>
            fallback === "zeros" ? 0 : (undefined as any)
        );
    }

    const b = base as number;

    return levels.map((v, i) => {
        if (v === null || v === undefined || !Number.isFinite(v as number)) {
            return fallback === "zeros" ? 0 : (undefined as any);
        }
        return ((v as number) / b) * 100;
    });
}
