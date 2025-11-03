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
        expect(result[0]!.year).toBe(2012);
        expect(result[0]!.index).toBeCloseTo(116.0, 10); // 100 * (1 + 0.16)
        expect(result[1]!.year).toBe(2013);
        expect(result[1]!.index).toBeCloseTo(153.584, 10); // 116 * (1 + 0.324)
        expect(result[2]!.year).toBe(2014);
        expect(result[2]!.index).toBeCloseTo(174.625008, 10); // 153.584 * (1 + 0.137)
    });

    it("builds cumulative index with base year excluded", () => {
        const series = [
            { year: 2012, trPct: 16.0 },
            { year: 2013, trPct: 32.4 },
        ];
        const result = buildTotalReturnIndex(series, 100, false);

        expect(result).toHaveLength(2);
        expect(result[0]!).toEqual({ year: 2012, index: 100.0 }); // Base year, no return applied
        expect(result[1]!).toEqual({ year: 2013, index: 132.4 }); // 100 * (1 + 0.324)
    });

    it("handles negative returns", () => {
        const series = [
            { year: 2018, trPct: -4.4 },
            { year: 2019, trPct: 31.5 },
        ];
        const result = buildTotalReturnIndex(series, 100, true);

        expect(result[0]!.year).toBe(2018);
        expect(result[0]!.index).toBeCloseTo(95.6, 10); // 100 * (1 - 0.044)
        expect(result[1]!.year).toBe(2019);
        expect(result[1]!.index).toBeCloseTo(125.714, 10); // 95.6 * (1 + 0.315)
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

        expect(result).toHaveLength(13);
        expect(result[0]!.year).toBe(2012);
        expect(result[0]!.index).toBeCloseTo(100.0, 10);
        expect(result[1]!.year).toBe(2013);
        expect(result[1]!.index).toBeCloseTo(132.4, 10);
        expect(result[2]!.year).toBe(2014);
        expect(result[2]!.index).toBeCloseTo(150.5388, 10);
        expect(result[3]!.year).toBe(2015);
        expect(result[3]!.index).toBeCloseTo(152.6463432, 10);
        expect(result[4]!.year).toBe(2016);
        expect(result[4]!.index).toBeCloseTo(170.963904384, 10);
        expect(result[5]!.year).toBe(2017);
        expect(result[5]!.index).toBeCloseTo(208.234035539712, 10);
        expect(result[6]!.year).toBe(2018);
        expect(result[6]!.index).toBeCloseTo(199.0717379759647, 10);
        expect(result[7]!.year).toBe(2019);
        expect(result[7]!.index).toBeCloseTo(261.77933543839356, 10);
        expect(result[8]!.year).toBe(2020);
        expect(result[8]!.index).toBeCloseTo(309.94673315905794, 10);
        expect(result[9]!.year).toBe(2021);
        expect(result[9]!.index).toBeCloseTo(398.90144557570756, 10);
        expect(result[10]!.year).toBe(2022);
        expect(result[10]!.index).toBeCloseTo(326.7002839265045, 10);
        expect(result[11]!.year).toBe(2023);
        expect(result[11]!.index).toBeCloseTo(412.6224585991751, 10);
        expect(result[12]!.year).toBe(2024);
        expect(result[12]!.index).toBeCloseTo(515.7780732489689, 10);
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

        expect(result).toHaveLength(13);
        expect(result[0]!.year).toBe(2012);
        expect(result[0]!.index).toBeCloseTo(116.0, 10);
        expect(result[1]!.year).toBe(2013);
        expect(result[1]!.index).toBeCloseTo(153.584, 10);
        expect(result[2]!.year).toBe(2014);
        expect(result[2]!.index).toBeCloseTo(174.625008, 10);
        expect(result[3]!.year).toBe(2015);
        expect(result[3]!.index).toBeCloseTo(177.069758112, 10);
        expect(result[4]!.year).toBe(2016);
        expect(result[4]!.index).toBeCloseTo(198.31812908544, 10);
        expect(result[5]!.year).toBe(2017);
        expect(result[5]!.index).toBeCloseTo(241.55148122606593, 10);
        expect(result[6]!.year).toBe(2018);
        expect(result[6]!.index).toBeCloseTo(230.92321605211902, 10);
        expect(result[7]!.year).toBe(2019);
        expect(result[7]!.index).toBeCloseTo(303.6640291085365, 10);
        expect(result[8]!.year).toBe(2020);
        expect(result[8]!.index).toBeCloseTo(359.5382104645072, 10);
        expect(result[9]!.year).toBe(2021);
        expect(result[9]!.index).toBeCloseTo(462.7256768678207, 10);
        expect(result[10]!.year).toBe(2022);
        expect(result[10]!.index).toBeCloseTo(378.9723293547451, 10);
        expect(result[11]!.year).toBe(2023);
        expect(result[11]!.index).toBeCloseTo(478.64205197504305, 10);
        expect(result[12]!.year).toBe(2024);
        expect(result[12]!.index).toBeCloseTo(598.3025649688038, 10);
    });
});
