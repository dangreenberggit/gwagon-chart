import { test, expect, describe } from "bun:test";
import { indexSeries } from "./utils";

describe("indexSeries", () => {
    test("indexes a series to base 100 using first element", () => {
        const values = [50, 100, 150, 200];
        const result = indexSeries(values, 0);
        expect(result).toEqual([100, 200, 300, 400]);
    });

    test("indexes a series to base 100 using a different base index", () => {
        const values = [50, 100, 150, 200];
        const result = indexSeries(values, 1); // Use 100 as base
        expect(result).toEqual([50, 100, 150, 200]);
    });

    test("handles decimal values correctly", () => {
        const values = [2.5, 5.0, 7.5, 10.0];
        const result = indexSeries(values, 0);
        expect(result).toEqual([100, 200, 300, 400]);
    });

    test("returns zeros when base value is 0", () => {
        const values = [0, 100, 200];
        const result = indexSeries(values, 0);
        expect(result).toEqual([0, 0, 0]);
    });

    test("returns zeros when base value is undefined", () => {
        const values: number[] = [];
        const result = indexSeries(values, 0);
        expect(result).toEqual([]);
    });

    test("returns zeros when base value is not finite", () => {
        const values = [Infinity, 100, 200];
        const result = indexSeries(values, 0);
        expect(result).toEqual([0, 0, 0]);
    });

    test("handles negative values", () => {
        const values = [100, 50, 25];
        const result = indexSeries(values, 0);
        expect(result).toEqual([100, 50, 25]);
    });

    test("handles real-world example: PE AUM growth", () => {
        // Example: PE AUM in trillions
        const values = [1.5, 2.0, 2.5, 3.0];
        const result = indexSeries(values, 0);
        expect(result[0]).toBeCloseTo(100, 2);
        expect(result[1]).toBeCloseTo(133.33, 2);
        expect(result[2]).toBeCloseTo(166.67, 2);
        expect(result[3]).toBeCloseTo(200, 2);
    });

    test("handles single element array", () => {
        const values = [42];
        const result = indexSeries(values, 0);
        expect(result).toEqual([100]);
    });

    test("returns null for non-finite elements in the series", () => {
        const values = [100, NaN, 200, Infinity, -Infinity, 300];
        const result = indexSeries(values, 0);
        expect(result[0]).toBe(100);
        expect(result[1]).toBe(null);
        expect(result[2]).toBe(200);
        expect(result[3]).toBe(null);
        expect(result[4]).toBe(null);
        expect(result[5]).toBe(300);
    });

    test("handles NaN in middle of real-world series", () => {
        const values = [1.5, 2.0, NaN, 3.0];
        const result = indexSeries(values, 0);
        expect(result[0]).toBeCloseTo(100, 2);
        expect(result[1]).toBeCloseTo(133.33, 2);
        expect(result[2]).toBe(null);
        expect(result[3]).toBeCloseTo(200, 2);
    });

    test("handles Infinity in series", () => {
        const values = [100, Infinity, 150];
        const result = indexSeries(values, 0);
        expect(result[0]).toBe(100);
        expect(result[1]).toBe(null);
        expect(result[2]).toBe(150);
    });
});
