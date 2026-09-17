# GoalBridge

> **An interactive, educational goal-planning platform empowering Indian retail savers to understand how inflation, time horizons, existing savings, and annual contribution step-ups shape their path toward financial milestones.**

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?logo=javascript&logoColor=black)](script.js)
[![HTML5 / CSS3](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3-E34F26?logo=html5&logoColor=white)](index.html)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-0F766E)](index.html)
[![Tests: 100% Passed](https://img.shields.io/badge/Tests-141%2F141%20Passed-22C55E)](TEST_EVIDENCE.md)
[![Audit: 100% Passed](https://img.shields.io/badge/Audit-Passed-0F766E)](AUDIT.md)
[![Compliance: SEBI Aligned](https://img.shields.io/badge/Compliance-SEBI%20Non--Advisory-0284C7)](PROJECT_REPORT.md)
[![Report: 4--Page PDF](https://img.shields.io/badge/Project%20Report-4--Page%20PDF-DC2626)](GoalBridge_Project_Report.pdf)

---

## Quick Links

- 🚀 **[Launch Live Application](https://6aaa7304d65cdd0008e9339b--goalbridge-planner.netlify.app/)** *(or open `index.html` directly in any browser)*
- 📄 **[Formal Project Report (4-Page PDF)](GoalBridge_Project_Report.pdf)**
- 📖 **[Master Project Report (Markdown)](PROJECT_REPORT.md)**
- 🧪 **[Completed Test Evidence Matrix](TEST_EVIDENCE.md)**
- 🤖 **[AI Collaboration & Use Log](AI_USE_LOG.md)**
- 🛡️ **[Accessibility & Technical Audit](AUDIT.md)**

---

## Project Overview

**GoalBridge** is a high-performance, client-side financial literacy utility engineered to eliminate the cognitive blindspots associated with long-term savings in India. Most savers instinctively plan using today's prices, unaware of the compounding erosion caused by inflation. Furthermore, commercial online calculators are frequently hosted by brokerage firms or fund houses that double as product sales funnels.

GoalBridge operates with strict **educational neutrality**:
1. **No Product Recommendations**: Does not recommend mutual fund schemes, insurance policies, or financial instruments.
2. **Zero Commercial Bias**: Strictly educational calculations with zero sponsored links, commissions, or sales funnels.
3. **100% Client-Side Privacy**: Zero cookies, zero analytics, zero external CDNs, and zero backend tracking. All scenario models reside exclusively in the user's browser session.
4. **Native Web Standards**: Zero external frameworks or libraries—pure semantic HTML5, responsive CSS3, and modern ES6+ JavaScript. Loads in under 0.5 seconds.

---

## Key Features

### 1. Structured Goal Library (28 Benchmarks + Custom Goal)
- Categorized across 6 life stages: **Financial Foundation**, **Education & Career**, **Lifestyle**, **Family**, **Children**, and **Experiences**, plus **Something Else**.
- Each preset auto-populates realistic starter figures: goal icon, example today's cost, target horizon, and category-specific inflation rates (e.g., 6% for general lifestyle, 8% for higher education, 10% for healthcare).
- **"Create My Own Goal"**: A clean custom option that clears inputs, focuses the goal name field, sets a baseline 6% inflation default, and gives complete modeling freedom.
- **Assumption Edit Preservation**: Selecting a preset populates baseline figures, but any manual edits made by the user to cost, horizon, inflation, return, or savings are strictly preserved.

### 2. Time-Value-of-Money (TVM) Calculation Engine
- **Compounding Inflation**: Projects the true future cost of a goal based on annual inflation: $FV = PV(1 + i)^n$.
- **Compounding Existing Savings**: Projects monthly compounded growth of currently allocated savings: $FV = PV(1 + r_m)^{12n}$.
- **Net Funding Gap**: Accurately computes the real capital deficit: $\max(0, FV_{\text{goal}} - FV_{\text{savings}})$.
- **Required Monthly Contribution**: Computes the exact end-of-month ordinary annuity payment required to bridge the deficit.
- **Zero-Return Handling ($r = 0\%$)**: Gracefully executes a linear fallback ($\text{Funding Gap} / \text{Months}$) with zero growth, preventing `NaN` or division-by-zero crashes.
- **Zero-Gap Handling ($\text{Savings} \ge \text{Goal Cost}$)**: Detects when existing savings satisfy future costs, sets monthly contribution to ₹0, and displays reassuring educational messaging.

### 3. Optional Step-Up Contribution (Growing Annuity)
- Expandable disclosure allowing users to model contributions that increase annually by a fixed percentage (e.g., $5\%–10\%$) to align with career salary progression.
- Built on a **discrete 12-month compounding block model** (contributions remain constant within each year and step up at the start of each subsequent year).
- Clearly highlights both the **Starting Monthly Contribution** and the **Final Year Monthly Contribution**.
- When set to $0\%$, results collapse identically to the standard flat monthly contribution.

### 4. User-Created Scenarios & Side-by-Side Comparison
Empowers users to create, save, edit, duplicate, delete, and compare multiple alternate planning scenarios based on their own custom assumptions:
- **Save Scenario**: Stores the current calculation into the active session with custom naming or auto-incrementing fallbacks ("Scenario 1", "Scenario 2").
- **+ Create Alternate Scenario**: Clones active assumptions into the input builder to easily model "what-if" variations (e.g., higher inflation, earlier horizon, or conservative return) without mutating earlier scenarios.
- **In-Place Scenario Editing**: Clicking "Edit" populates inputs into the form, engages a prominent `#scenarioEditBanner`, and updates the scenario in place without creating duplicates.
- **Deep-Clone Duplication**: One-click "Duplicate" clones all assumptions and outputs, assigns a fresh unique ID, and appends `(Copy)`.
- **Side-by-Side Comparison Matrix**: Automatically renders when 2 or more scenarios are saved, displaying a tabular comparison of inputs, outcomes, and difference analyses with responsive horizontal scrolling.
- **Proportional Visual Bars**: Scaled horizontal progress bars visualizing required monthly contributions across saved scenarios, equipped with ARIA progressbar semantics.
- **Neutral Comparative Narrative**: Generates plain-language comparative summaries explaining differences neutrally, without assigning "winners" or prescriptive advice.
- **Session Privacy**: All scenarios persist in `sessionStorage` (`goalbridge_saved_scenarios`), surviving page reloads while keeping data strictly on the client device.

### 5. Dedicated Clean Report (Print & Download)
- **Isolated Print Output (`window.print()`)**: Built with a dedicated `#printReport` container. Under `@media print`, all interactive screen chrome (navigation, headers, form controls, buttons, sliders) is hidden (`display: none !important`), rendering only a clean, professional, publication-grade 10-section financial planning report.
- **Structured Plain-Text Download (`goalbridge-summary.txt`)**: Client-side Blob export generating an identical 10-section structured plain-text report with ASCII card borders and Indian currency formatting.
- **Reset Safety**: Before calculation or after clicking Reset, both Print and Download output a clear neutral notice (*"No Goal Calculation Completed"*) rather than stale values.

### 6. Atomic Reset & Clean Initial Experience
- **Initial Clean State**: The calculator opens with empty, neutral inputs—no pre-filled clutter.
- **Atomic Reset**: One click wipes all form inputs to blank/₹0, resets output cards, clears in-memory scenarios, purges `sessionStorage`, and resets print/download queues to neutral.
- **Screen Reader Feedback**: Dynamic status updates announced via `aria-live="polite"` live regions.

### 7. Accessibility & Indian Localization
- **WCAG 2.1 AA Compliant**: High contrast ratios ($\ge 4.5:1$, up to $15.6:1$), clear `:focus-visible` outlines, touch targets $\ge 44\text{px}$, and semantic HTML landmarks.
- **Indian Rupee Notation**: Custom formatting via native `Intl.NumberFormat('en-IN')` displaying amounts in Lakhs and Crores (`₹12,00,000`).

---

## Inputs, Outputs and Calculation Methodology

### The Inputs

| # | Field | Identifier | Type / Constraints | Default / Initial State |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Goal Name** | `#goalName` | Text string | Blank (auto-filled by preset) |
| **2** | **Cost in Today's Money** | `#goalCostToday` | Numeric, $> ₹0$ | Blank on load / reset |
| **3** | **Time Horizon** | `#targetYears` | Integer, $1 \le Y \le 100$ | Blank on load / reset |
| **4** | **Expected Annual Inflation** | `#inflationRate` | Percentage, $0\% \le i \le 50\%$ (Caution $>12\%$) | Blank on load / reset |
| **5** | **Assumed Investment Return** | `#investmentReturn` | Percentage, $0\% \le r \le 100\%$ (Caution $>15\%$) | Blank on load / reset |
| **6** | **Current Savings Allocated** | `#currentSavings` | Numeric, $\ge ₹0$ | Defaults to ₹0 |
| **+** | **Annual Step-Up (Optional)** | `#stepUpRate` | Percentage, $0\% \le g \le 50\%$ (Caution $>20\%$) | Defaults to 0% (Advanced section) |

---

### Core Outputs

- **Required Monthly Contribution**: Baseline monthly commitment required to achieve the goal deficit.
- **Future Goal Cost**: Projected cost after compounding for inflation.
- **Projected Value of Current Savings**: Earmarked savings compounded over the horizon.
- **Estimated Funding Gap**: Net remaining deficit that monthly savings must bridge.
- **Total Contributions**: Cumulative out-of-pocket deposits across the entire tenure.
- **Illustrative Projected Growth**: Compounding returns earned on monthly installments.
- **Step-Up Schedule (When Active)**: Explicit breakdown of Year 1 starting deposit vs. Final Year deposit.
- **Scenario Comparison Matrix**: Tabular side-by-side evaluation across 2+ custom saved scenarios.

---

### Mathematical Model

All calculations implement standard Time Value of Money (TVM) principles:

#### 1. Baseline Variables
$$\text{Total Months: } N = 12 \times Y \qquad \text{Monthly Compounding Rate: } r_m = \frac{r}{12}$$

#### 2. Inflation-Adjusted Future Goal Cost
Adjusts today's cost ($P$) for annual inflation ($i$) over $Y$ years:
$$FV_{\text{goal}} = P \times (1 + i)^Y$$

#### 3. Future Value of Existing Savings
Projects existing savings ($S$) compounded monthly at nominal annual return ($r$):
$$FV_{\text{savings}} = S \times (1 + r_m)^N \qquad \text{(If } r = 0\%, \, FV_{\text{savings}} = S\text{)}$$

#### 4. Net Funding Gap
Calculates the real shortfall to be funded through monthly deposits:
$$\text{Funding Gap} = \max\left(0, \, FV_{\text{goal}} - FV_{\text{savings}}\right)$$

#### 5. Required Monthly Contribution (Ordinary Annuity)
Assumes equal end-of-month deposits:
- **When Assumed Return $r > 0\%$:**
  $$PMT = \frac{\text{Funding Gap} \times r_m}{(1 + r_m)^N - 1}$$
- **When Assumed Return $r = 0\%$ (Zero-Return Fallback):**
  $$PMT = \frac{\text{Funding Gap}}{N}$$

#### 6. Annual Step-Up Contribution (12-Month Compounding Blocks)
When an annual step-up rate $g$ ($g > 0$) is selected, monthly deposits remain constant within each 12-month period and increase by $(1 + g)$ at the beginning of each subsequent year:
$$A_{12} = \frac{(1 + r_m)^{12} - 1}{r_m}$$
$$W = \sum_{k=1}^{Y} (1 + g)^{k-1} \times (1 + r_m)^{12(Y - k)}$$
$$\text{Starting Monthly Contribution } PMT_1 = \frac{\text{Funding Gap}}{A_{12} \times W}$$
$$\text{Final Year Monthly Contribution } PMT_Y = PMT_1 \times (1 + g)^{Y - 1}$$
*(When $g = 0\%$, this formula collapses identically to the standard flat monthly contribution.)*

#### 7. Cumulative Contributions & Compounding Growth
$$\text{Total Contributions} = \sum \text{All Monthly Installments}$$
$$\text{Illustrative Projected Growth} = \max(0, \, \text{Funding Gap} - \text{Total Contributions})$$

---

### Demonstration Reference Case

For auditing and regression verification, GoalBridge specifies the benchmark demonstration case:

- **Inputs**: Higher Education Fund, Cost Today = ₹12,00,000, Horizon = 8 Years, Inflation = 6%, Assumed Return = 10%, Current Savings = ₹1,50,000, Step-up = 0%
- **Computed Outputs**:
  - **Future Goal Cost**: $\mathbf{₹19,12,618}$
  - **Projected Value of Savings**: $\mathbf{₹3,32,726}$
  - **Estimated Funding Gap**: $\mathbf{₹15,79,891}$
  - **Required Monthly Contribution**: $\mathbf{₹10,808 \text{ / month}}$
  - **Total Contributions**: $\mathbf{₹10,37,546}$
  - **Projected Compounding Growth**: $\mathbf{₹5,42,345}$

---

## Repository Structure

```
d:\Drisha\Goal Bridge\
├── index.html                    # Semantic HTML5 single-page application structure
├── styles.css                    # CSS3 design tokens, responsive layout, @media print
├── script.js                     # Pure TVM engine, Scenario CRUD, DOM handlers
├── GoalBridge_Project_Report.pdf # Publication-ready 4-page compiled project report
├── PROJECT_REPORT.md             # Master project report (9 comprehensive sections)
├── TEST_EVIDENCE.md              # Completed 18-case test evidence matrix (141 tests)
├── AI_USE_LOG.md                 # Chronological AI prompt, decision & correction log
├── AUDIT.md                      # Accessibility, performance & functional audit logs
└── README.md                     # Project documentation, formulas, and usage guide
```

---

## Formal Project Documentation & Deliverables

| Document | Format | Description |
| :--- | :---: | :--- |
| **[GoalBridge Project Report](GoalBridge_Project_Report.pdf)** | **PDF** | **4-Page formal executive report** covering project planning, problem definition, responsive UI screenshots (Desktop, Tablet, Mobile, Print), mathematical derivations, AI collaboration log, 18-case test table, and reflection. |
| **[Master Project Report](PROJECT_REPORT.md)** | **MD** | Full 9-section master documentation covering executive summary, user personas, system design, TVM formulas, development history, testing, deployment, and future roadmap. |
| **[Test Evidence Matrix](TEST_EVIDENCE.md)** | **MD** | Detailed 18-row test verification matrix with inputs, expected vs. actual outcomes, and automated runner output (**141 / 141 Assertions Passed — 100% Pass Rate**). |
| **[AI Use Log](AI_USE_LOG.md)** | **MD** | Comprehensive record of AI pair-programming interactions, technical design decisions, discrete compounding self-corrections, and automated verification loops across all 6 project milestones. |
| **[System & Accessibility Audit](AUDIT.md)** | **MD** | Comprehensive technical audit covering WCAG 2.1 AA accessibility, keyboard navigation, Lighthouse scores, and functional edge-case validations. |

---

## How to Run Locally

GoalBridge requires **no build step, no Node.js compilation, and no external dependencies**.

### Option 1: Direct File Launch
1. Clone or download this repository:
   ```bash
   git clone https://github.com/drisha/goal-bridge.git
   ```
2. Double-click [`index.html`](index.html) or open it directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari.

### Option 2: Lightweight Local HTTP Server
- **Python 3:**
  ```bash
  cd "Goal Bridge"
  python -m http.server 8000
  ```
  Open `http://localhost:8000` in your web browser.

- **Node.js (`npx`):**
  ```bash
  cd "Goal Bridge"
  npx serve .
  ```

---

## Testing & Verification Summary

GoalBridge is verified through automated headless browser test harnesses executed against the live browser DOM using Microsoft Edge:

### Overall Test Suite Results: **141 / 141 Assertions Passed (100%)**

- **Scenario Management Test Suite**: **76 / 76 Passed**
  - Scenario creation, auto-naming, deep-cloning, in-place editing, deletion, multi-scenario tabular comparison, proportional visual bars, session persistence, and reset safety.
- **Print & Download Report Test Suite**: **65 / 65 Passed**
  - Dedicated `#printReport` isolation, `@media print` style enforcement, plain-text export generation, step-up inclusion, large INR formatting ($\ge$ ₹1 Crore), and regulatory compliance scans.

### Core Test Matrix Overview (18 Audited Cases)

| Test ID | Category | Target Objective | Status |
| :---: | :--- | :--- | :---: |
| **TC-01** | Core TVM Math | Demonstration Benchmark (₹12L, 8y, 6% inf, 10% ret): ₹10,808/mo | **PASS** |
| **TC-02** | Edge Case | Zero Assumed Return ($r=0\%$): Linear allocation ₹10,000/mo, zero growth | **PASS** |
| **TC-03** | Edge Case | Zero Net Gap ($\text{Savings} \ge \text{Cost}$): ₹0/mo with educational reassurance | **PASS** |
| **TC-04** | Step-Up Math | 10% Step-Up: Starting ₹7,945/mo, Final Year ₹15,482/mo | **PASS** |
| **TC-05** | Scenario CRUD | Save Valid Scenario into state and `sessionStorage` | **PASS** |
| **TC-06** | Scenario CRUD | Auto-Incremented Scenario Naming ("Scenario 1", "Scenario 2") | **PASS** |
| **TC-07** | Scenario CRUD | Deep-Clone Duplication workflow with `(Copy)` naming | **PASS** |
| **TC-08** | Scenario CRUD | In-Place Scenario Editing with `#scenarioEditBanner` | **PASS** |
| **TC-09** | Scenario CRUD | Scenario Deletion and `sessionStorage` synchronization | **PASS** |
| **TC-10** | Comparison | Side-by-Side Comparison Matrix with neutral narrative | **PASS** |
| **TC-11** | Visual Bars | Proportional Progress Bars with ARIA progressbar attributes | **PASS** |
| **TC-12** | Print Report | Dedicated `#printReport` populated with all 10 report sections | **PASS** |
| **TC-13** | Print Isolation | CSS Print Isolation: web chrome hidden, only report printed | **PASS** |
| **TC-14** | Download Report | Structured plain-text summary export (`goalbridge-summary.txt`) | **PASS** |
| **TC-15** | Reset Safety | Complete teardown: inputs, outputs, storage, and print caches | **PASS** |
| **TC-16** | Large Numbers | Indian Rupee formatting for values $\ge$ ₹1 Crore (`₹1,00,00,000`) | **PASS** |
| **TC-17** | Compliance | Non-Advisory Keyword Scan: 0 occurrences of prohibited terms | **PASS** |
| **TC-18** | Accessibility | WCAG 2.1 AA keyboard navigation, contrast $\ge 4.5:1$, touch $\ge 44\text{px}$ | **PASS** |

*For full line-by-line verification logs, consult [`TEST_EVIDENCE.md`](TEST_EVIDENCE.md).*

---

## Assumptions and Limitations

1. **End-of-Month Contribution Timing**: All formulas assume contributions occur at the end of each calendar month.
2. **Constant Rates**: Assumed inflation and investment returns remain constant across the entire planning horizon; actual market returns fluctuate.
3. **Compounding Frequency**: Monthly compounding is applied for both savings growth and monthly contribution accumulation.
4. **Exclusions**: Calculations exclude taxes, capital gains implications, transaction costs, management fees, advisory charges, and fund expense ratios.
5. **Static Cash Flows**: Assumes regular, uninterrupted monthly contributions; pauses, windfalls, or emergency withdrawals are not modeled.

---

## Regulatory Notice & Non-Advisory Disclaimer

> **IMPORTANT NOTICE**  
> 1. **Educational Purpose Only**: GoalBridge is strictly an educational and illustrative planning utility. It does not constitute financial, investment, tax, or legal advice under the Securities and Exchange Board of India (Investment Advisers) Regulations, 2013, or any other applicable regulations.  
> 2. **No Product Endorsement**: GoalBridge does not recommend, sponsor, endorse, or promote any specific financial instrument, security, mutual fund scheme, insurance policy, or portfolio manager.  
> 3. **Mathematical Projections**: All future values and contribution amounts are hypothetical projections based solely on the assumptions entered by the user. Actual inflation, market performance, and cost of living changes may differ materially from illustrative figures.  
> 4. **No Guaranteed Returns**: Investment returns are not guaranteed. Projections involving higher return assumptions entail higher market volatility and risk of capital loss.  
> 5. **Taxes and Fees Excluded**: Projections do not account for taxation, expense ratios, exit loads, or transaction costs, which reduce real-world investment outcomes.  
> 6. **Professional Consultation**: Users must consult a qualified SEBI-registered investment adviser (RIA) or certified financial planner before executing any financial commitments or investment decisions.

---

## Author & Credits

Created with care by **Drisha**  
Dedicated to empowering first-time earners and young families with financial clarity, mathematical rigor, and independent scenario planning.
