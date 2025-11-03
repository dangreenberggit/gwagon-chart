export type Row = {
    year: number;
    spxTR: number;
    peAumT: number;
    gSales: number;
    g550Msrp: number;
    gClassAtp: number;
    g550MsrpIdx: number;
    gClassAtpIdx: number;
    hhNetWorthBn: number;
    hhNetWorthIdx: number;
};

export type IndexedRow = {
    year: number;
    spxCumIdx: number | null;
    peAumIdx: number | null;
    gSalesIdx: number | null;
    g550MsrpIdx: number;
    gClassAtpIdx: number;
    hhNetWorthIdx: number;
};

export type ExpandedCharts = {
    spx: boolean;
    pe: boolean;
    gclass: boolean;
    prices: boolean;
    hhNetWorth: boolean;
};
