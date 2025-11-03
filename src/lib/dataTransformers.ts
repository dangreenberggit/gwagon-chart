import type { Row, IndexedRow } from "./types";

export function toChartData(rows: Row[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "S&P 500 total return (%)": r.spxTR,
        "Global PE AUM (USD T)": r.peAumT,
        "US G‑Class sales (units)": r.gSales,
    }));
}

export function toSPXCumData(spxCum: Array<{ year: number; index: number }>) {
    return spxCum.map((d) => ({
        Year: d.year.toString(),
        "S&P 500 Cumulative Total Return Index (2012 = 100)": d.index,
    }));
}

export function toSPXReturnData(rows: Row[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "S&P 500 Annual Total Return (%)": r.spxTR,
    }));
}

export function toPEData(rows: Row[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "Global PE AUM (USD T)": r.peAumT,
    }));
}

export function toGClassData(rows: Row[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "US G‑Class sales (units)": r.gSales,
    }));
}

export function toHouseholdNetWorthData(rows: Row[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "Household Net Worth (USD T)": r.hhNetWorthBn / 1000, // Convert billions to trillions
    }));
}

export function toIndexedChartData(rows: IndexedRow[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "S&P 500 total return index (2012 = 100)": r.spxCumIdx,
        "Global PE AUM (index, 2012 = 100)": r.peAumIdx,
        "US G‑Class sales (index, 2012 = 100)": r.gSalesIdx,
        "Household net worth (index, 2012 = 100)": r.hhNetWorthIdx,
    }));
}

export function toPriceData(rows: Row[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "G‑Class estimated price (proxy, USD)": r.gClassAtp,
    }));
}

export function toPriceIndexData(rows: IndexedRow[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "G 550 MSRP (index, 2012 = 100)": r.g550MsrpIdx,
        "G‑Class Est. ATP (index, 2012 = 100)": r.gClassAtpIdx,
    }));
}

export function toPriceIndexWithContextData(rows: IndexedRow[]) {
    return rows.map((r) => ({
        Year: r.year.toString(),
        "G‑Class Est. ATP (index, 2012 = 100)": r.gClassAtpIdx,
        "Global PE AUM (index, 2012 = 100)": r.peAumIdx,
        "Household net worth (index, 2012 = 100)": r.hhNetWorthIdx,
    }));
}
