// Test the finance helper functions
import { describe, it, expect } from "bun:test";
import { buildTotalReturnIndex } from "./lib/finance";

describe("buildTotalReturnIndex", () => {
    it("builds cumulative index with base year included", () => {
        const series = [
            { year: 2012, trPct: 16.0 },
            { year: 2013, trPct: 32.4 },
            { year: 2014, trPct: 13.7 },
        ];
        const result = buildTotalReturnIndex(series, 100, true);

        expect(result).toHaveLength(3);
        expect(result[0]).toEqual({ year: 2012, index: 116.0 }); // 100 * (1 + 0.16)
        expect(result[1]).toEqual({ year: 2013, index: 153.58 }); // 116 * (1 + 0.324)
        expect(result[2]).toEqual({ year: 2014, index: 174.63 }); // 153.58 * (1 + 0.137)
    });

    it("builds cumulative index with base year excluded", () => {
        const series = [
            { year: 2012, trPct: 16.0 },
            { year: 2013, trPct: 32.4 },
        ];
        const result = buildTotalReturnIndex(series, 100, false);

        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({ year: 2012, index: 100.0 }); // Base year, no return applied
        expect(result[1]).toEqual({ year: 2013, index: 132.4 }); // 100 * (1 + 0.324)
    });

    it("handles negative returns", () => {
        const series = [
            { year: 2018, trPct: -4.4 },
            { year: 2019, trPct: 31.5 },
        ];
        const result = buildTotalReturnIndex(series, 100, true);

        expect(result[0]).toEqual({ year: 2018, index: 95.6 }); // 100 * (1 - 0.044)
        expect(result[1]).toEqual({ year: 2019, index: 125.71 }); // 95.6 * (1 + 0.315)
    });
});
