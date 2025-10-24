// TEST: Phase 2 - CSV parsing and indexing
import { describe, it, expect } from "bun:test";
import { parseCSV, toSeriesRows, indexSeries } from "./lib/csv";

describe("parseCSV", () => {
    it("parses simple CSV", () => {
        const csv = "a,b\n1,2\n3,4";
        expect(parseCSV(csv)).toEqual([
            { a: "1", b: "2" },
            { a: "3", b: "4" },
        ]);
    });
    it("ignores trailing empty lines", () => {
        const csv = "a,b\n1,2\n\n";
        expect(parseCSV(csv).length).toBe(1);
    });
});

describe("toSeriesRows", () => {
    it("converts strings to numbers", () => {
        const raw = [
            {
                year: "2012",
                sp500_total_return_pct: "16.0",
                global_pe_aum_usd_trn: "2.0",
                us_gclass_sales_units: "1408",
            },
        ];
        const r = toSeriesRows(raw)[0];
        if (!r) throw new Error("Expected row");
        expect(r.year).toBe(2012);
        expect(r.sp500_total_return_pct).toBe(16.0);
    });
});

describe("indexSeries", () => {
    it("indexes to base=100", () => {
        expect(indexSeries([2, 4, 6], 0)).toEqual([100, 200, 300]);
    });
    it("handles zero base", () => {
        expect(indexSeries([0, 10], 0)).toEqual([0, 0]);
    });
});

// TEST: Phase 5 - edge cases
describe("edge cases", () => {
    it("handles missing columns gracefully", () => {
        const result = parseCSV("year,wealth\n2012,31.6\n2013");
        const row = result[1];
        expect(row?.wealth).toBe("");
    });
    it("invalid nums -> NaN in toSeriesRows", () => {
        const rows = toSeriesRows([
            {
                year: "x",
                sp500_total_return_pct: "y",
                global_pe_aum_usd_trn: "1",
                us_gclass_sales_units: "2",
            },
        ]);
        const row = rows[0];
        expect(row && Number.isNaN(row.year)).toBe(true);
    });
});
