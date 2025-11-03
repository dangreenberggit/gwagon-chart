import { type ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function findYearIndex(years: number[], targetYear: number): number {
    const idx = years.indexOf(targetYear);
    if (idx < 0) throw new Error(`Base year ${targetYear} not found`);
    return idx;
}

// Index series to base = 100 (e.g., first year).
// Protects against divide-by-zero; returns zeros if base is 0 or invalid.
// Non-finite elements (NaN, ±Inf) return null for that position (chart-friendly).
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

// Compute an index series where the base element equals 100.
// levels[i] are level values (e.g., USD), not returns.
// baseIndex points to the base element (e.g., the index of 2012).
// Returns full precision values (rounding handled at display layer).
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
