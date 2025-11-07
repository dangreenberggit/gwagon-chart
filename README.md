# The G‑Class Economy

A data visualization dashboard comparing S&P 500 total returns, US G‑Class sales, household net worth, and related economic indicators from 2012–2024.

## Charts

### Indexed Comparison Chart

Main visualization showing three series indexed to 2012 = 100:
- **S&P 500 total return index**: Cumulative total return with geometric compounding
- **US G‑Class sales (index)**: Annual US deliveries, arithmetic indexing
- **Household net worth (index)**: Q4 year-end levels, arithmetic indexing

### Individual Series Details

#### S&P 500 Total Return
- **Annual Total Return (%)**: Calendar-year total returns with dividends
- **Cumulative Total Return Index**: Two variants showing geometric compounding
  - Blue: 2012 = 100, compounding from 2013
  - Green: Base 100 at start of 2012, compounding from 2012

#### Global Private Equity Assets Under Management
- Year-end levels in nominal USD trillions
- Includes closed-end funds (buyout, growth, venture) and uninvested capital

#### Mercedes‑Benz G‑Class U.S. Sales
- Annual calendar-year US deliveries in units

#### U.S. Household and Nonprofit Net Worth
- Q4 year-end levels in nominal USD trillions
- Assets minus liabilities

#### G‑Class Estimated Price
- Estimated average transaction price (ATP) proxy
- Calculated as 1.46 × G 550 base MSRP
- Calibrated to Kelley Blue Book / Cox Automotive March 2024 estimate (~$208,663)
- Not observed transaction data

## Data Sources

### S&P 500 Total Return
- [SlickCharts S&P 500 Returns](https://www.slickcharts.com/sp500/returns)
- [Return Details](https://www.slickcharts.com/sp500/returns/details)

### Global Private Equity Assets Under Management
- [McKinsey Global Private Markets Report (GPMR)](https://www.mckinsey.com/industries/private-capital/our-insights/global-private-markets-report)

### G‑Class U.S. Sales
- [MBUSA press releases](https://media.mbusa.com/releases/release-4efd8afecd0ad84220062379551956e8-mercedes-benz-usa-reports-9-year-over-year-growth-for-passenger-car-sales)
- [CarFigures historical sales](https://carfigures.com/us-market-brand/mercedes-benz/g-class)

### Household Net Worth
- [FRED, TNWBSHNO](https://fred.stlouisfed.org/series/TNWBSHNO)

### G‑Class Pricing
- MBUSA media resources (model-year documentation)
- US News model pages (2018 and 2020 G 550 specs)
- Press coverage (MY2023 base price reference)
- [Kelley Blue Book / Cox Automotive March 2024 estimate](https://mediaroom.kbb.com/2024-04-15-New-Vehicle-Average-Transaction-Prices-Drop-to-Lowest-Level-in-nearly-Two-Years,-According-to-Latest-Kelley-Blue-Book-Estimates)

## Methodology

### Indexing
All indexed series use 2012 = 100 as the base year.

- **S&P 500 cumulative index**: Uses geometric compounding. Each year's index = previous year's index × (1 + return/100), representing cumulative compounded returns.
- **Other series** (private equity AUM, G‑Class sales, household net worth, prices): Use arithmetic indexing. Index = 100 × value ÷ 2012 value.

### Estimated ATP (Proxy)
G‑Class estimated price uses a fixed multiple of G 550 base MSRP (US). The multiplier (≈1.46×) is calibrated to a publicly cited G‑Class ATP in March 2024 (KBB/Cox; ≈$208,663). The proxy reflects trim/mix and options. This is an estimate, not observed ATP.

## Technical Details

### Stack
- **Runtime**: Bun
- **Build**: Vite
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Tremor React
- **UI Components**: Radix UI, shadcn-style components

### Data
- Source data stored in `public/data/series.csv`
- Data loaded client-side via fetch API
- All calculations performed in-browser

### Features
- Interactive line charts with tooltips
- Expandable/collapsible chart sections
- Dark/light theme support
- Responsive design
- Deep-linking to source sections via hash anchors

### Development
```bash
bun install
bun run dev
```

### Build
```bash
bun run build
```

