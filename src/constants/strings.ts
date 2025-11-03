// src/constants/strings.ts

import { mbTheme } from "@/lib/theme";

export const Titles = {
    // SPX (two charts inside one card)
    SPX_CARD: "S&P 500 total return",
    SPX_ANNUAL: "S&P 500 Annual Total Return (%)",
    SPX_CUMULATIVE: "S&P 500 Cumulative Total Return Index (2012 = 100)",

    // Indexed comparison
    INDEXED_CARD:
        "Indexed Comparison (2012 = 100): S&P 500 Total Return, G‑Class Sales, and Household Net Worth",

    // PE AUM
    PE_CARD: "Global private equity assets under management",

    // G‑Class sales
    GCLASS_CARD: "Mercedes‑Benz G‑Class U.S. sales",

    // Household net worth
    HHNW_CARD: "U.S. household and nonprofit net worth",

    // Pricing
    PRICES_CARD: "G‑Class estimated price",
} as const;

export const Subtitles = {
    SPX_CARD: "",
    SPX_CUMULATIVE_DETAIL:
        "Two cumulative total return indices. Blue: 2012 is set to 100; compounding begins with 2013. Green: Base is 100 at the start of 2012; compounding begins with 2012.",

    INDEXED_CARD:
        "S&P 500 shows cumulative total return; G‑Class sales and household net worth are level series. All are indexed to 2012 = 100.",

    PE_CARD: "Global private equity assets under management.",

    GCLASS_CARD: "Annual U.S. deliveries.",

    HHNW_CARD: "Household and nonprofit net worth, year-end level.",

    PRICES_CARD: "Estimated U.S. G‑Class purchase price by year.",
} as const;

export const Categories = {
    // SPX
    SPX_ANNUAL: ["S&P 500 Annual Total Return (%)"],
    SPX_CUMULATIVE: [
        "Total return (compounding from 2013)",
        "Total return (compounding from 2012)",
    ],

    // Indexed comparison
    INDEXED: [
        "S&P 500 total return index (2012 = 100)",
        "US G‑Class sales (index, 2012 = 100)",
        "Household net worth (index, 2012 = 100)",
    ],

    // G‑Class sales
    GCLASS: ["US G‑Class sales (units)"],

    // Household net worth
    HHNW: ["Household Net Worth (USD T)"],

    // Pricing
    PRICES: ["G‑Class estimated price (proxy, USD)"],

    // PE
    PE: ["Global PE AUM (USD T)"],
} as const;

export const AxisLabels = {
    YEAR: "Year",
    PERCENT: "Return (%)",
    INDEX: "Index Value",
    USD_TRILLIONS: "USD Trillions",
    UNITS: "Units Sold",
    USD_PRICE: "Price (USD)",
} as const;

export const Tooltips = {
    // SPX cumulative footnote
    SPX_FOOTNOTE: {
        SOURCE: 'Source: SlickCharts "S&P 500 Returns" (annual totals and details).',
        CONSTRUCTION:
            "Construction: The cumulative series compound annual total returns; one is indexed to 2012 = 100 with compounding from 2013, and one compounds from 2012.",
        VARIANTS: [
            "Blue: 2012 is set to 100; compounding begins with 2013.",
            "Green: Base is 100 at the start of 2012; compounding begins with 2012.",
        ],
        UNITS: "Units: Index level (no units). Annual returns shown as percentages.",
    },

    // G‑Class sales
    GCLASS_FOOTNOTE: {
        SOURCES: [
            "Mercedes‑Benz USA (MBUSA) press releases (for recent years).",
            "CarFigures (historical model sales series).",
        ],
        DEF: "Definition: Calendar‑year U.S. sales/deliveries (units).",
    },

    // Household net worth
    HHNW_FOOTNOTE: {
        SOURCE: "Source: Federal Reserve Economic Data (FRED), series TNWBSHNO.",
        DEF: "Definition: Net worth of households and nonprofit organizations (assets minus liabilities).",
        TIMING: "Timing: Q4 observation used to represent each year.",
    },

    // Pricing
    PRICES_FOOTNOTE: {
        BASE_SOURCES: [
            "MBUSA media resources (for model‑year documentation).",
            "US News model pages (e.g., 2018 and 2020 G 550 specs).",
            "Press coverage for MY2023 base price reference.",
        ],
        ATP_DEF:
            "Estimated transaction price (ATP): Uses a fixed multiple calibrated to a Kelley Blue Book / Cox Automotive estimate for March 2024 (about $208,663). This is not an observed transaction series.",
    },

    // PE (optional: if you add a footnote block)
    PE_FOOTNOTE: {
        SOURCE: "Source: McKinsey Global Private Markets Report (GPMR).",
        DEF: 'Definition: Traditional private equity assets under management include closed‑end funds (buyout, growth, venture) and combine invested assets and uninvested capital ("dry powder").',
        TIMING: "Timing: Year‑end, nominal U.S. dollars.",
    },
} as const;

// Footer anchor IDs for source deep-linking
export const FooterAnchors = {
    SPX: "spx-sources",
    PE: "pe-sources",
    GCLASS: "gclass-sources",
    HHNW: "hhnw-sources",
    PRICING: "pricing-sources",
} as const;

// Mapping from footer anchors to chart series colors
export const FooterAnchorColors = {
    [FooterAnchors.SPX]: mbTheme.colors.series.spx,
    [FooterAnchors.PE]: mbTheme.colors.series.pe,
    [FooterAnchors.GCLASS]: mbTheme.colors.series.sales,
    [FooterAnchors.HHNW]: mbTheme.colors.series.wealth,
    [FooterAnchors.PRICING]: mbTheme.colors.series.atp,
} as const;
