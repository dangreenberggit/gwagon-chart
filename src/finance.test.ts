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

    it("comparison mode (baseYearIncluded=false) - full 2012-2024 series", () => {
        const series = [
            { year: 2012, trPct: 16.0 },
            { year: 2013, trPct: 32.4 },
            { year: 2014, trPct: 13.7 },
            { year: 2015, trPct: 1.4 },
            { year: 2016, trPct: 12.0 },
            { year: 2017, trPct: 21.8 },
            { year: 2018, trPct: -4.4 },
            { year: 2019, trPct: 31.5 },
            { year: 2020, trPct: 18.4 },
            { year: 2021, trPct: 28.7 },
            { year: 2022, trPct: -18.1 },
            { year: 2023, trPct: 26.3 },
            { year: 2024, trPct: 25.0 },
        ];
        const result = buildTotalReturnIndex(series, 100, false);

        expect(result).toEqual([
            { year: 2012, index: 100.0 },
            { year: 2013, index: 132.4 },
            { year: 2014, index: 150.54 },
            { year: 2015, index: 152.65 },
            { year: 2016, index: 170.96 },
            { year: 2017, index: 208.23 },
            { year: 2018, index: 199.07 },
            { year: 2019, index: 261.78 },
            { year: 2020, index: 309.95 },
            { year: 2021, index: 398.9 },
            { year: 2022, index: 326.7 },
            { year: 2023, index: 412.62 },
            { year: 2024, index: 515.78 },
        ]);
    });

    it("investment mode (baseYearIncluded=true) - full 2012-2024 series", () => {
        const series = [
            { year: 2012, trPct: 16.0 },
            { year: 2013, trPct: 32.4 },
            { year: 2014, trPct: 13.7 },
            { year: 2015, trPct: 1.4 },
            { year: 2016, trPct: 12.0 },
            { year: 2017, trPct: 21.8 },
            { year: 2018, trPct: -4.4 },
            { year: 2019, trPct: 31.5 },
            { year: 2020, trPct: 18.4 },
            { year: 2021, trPct: 28.7 },
            { year: 2022, trPct: -18.1 },
            { year: 2023, trPct: 26.3 },
            { year: 2024, trPct: 25.0 },
        ];
        const result = buildTotalReturnIndex(series, 100, true);

        expect(result).toEqual([
            { year: 2012, index: 116.0 },
            { year: 2013, index: 153.58 },
            { year: 2014, index: 174.63 },
            { year: 2015, index: 177.07 },
            { year: 2016, index: 198.32 },
            { year: 2017, index: 241.55 },
            { year: 2018, index: 230.92 },
            { year: 2019, index: 303.66 },
            { year: 2020, index: 359.54 },
            { year: 2021, index: 462.73 },
            { year: 2022, index: 378.97 },
            { year: 2023, index: 478.64 },
            { year: 2024, index: 598.3 },
        ]);
    });
});
