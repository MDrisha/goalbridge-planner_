# GoalBridge

> **An educational goal-planning tool empowering first-time earners to understand how inflation, time, existing savings, and assumed returns shape their monthly contribution path.**

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?logo=javascript&logoColor=black)](script.js)
[![HTML5 / CSS3](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3-E34F26?logo=html5&logoColor=white)](index.html)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-0F766E)](index.html)
[![Audit: 100% Passed](https://img.shields.io/badge/Audit-Passed-0F766E)](AUDIT.md)
[![Tests: 100% Passed](https://img.shields.io/badge/Tests-76%2F76%20Passed-22C55E)](#testing-summary)

---

## Live Demo

🔗 **[Launch GoalBridge Live Application](https://drisha.github.io/goal-bridge/)**  
*(Or open `index.html` directly in any web browser — no build steps, backend, or internet connection required.)*

---

## Features

- **Structured Goal Library (28 Predefined Goals + Custom Goal)**  
  Organized across 6 life categories (*Financial Foundation*, *Education & Career*, *Lifestyle*, *Family*, *Children*, *Experiences*) plus *Something Else*. Each goal card includes sensible starter defaults: icon, example today's cost, horizon, and goal-specific annual inflation rate.
- **✨ "Create My Own Goal" Option**  
  Selectable custom goal with automatically cleared, focused input, baseline custom inflation of 6%, and full freedom to model unique aspirations.
- **Assumption Edit Preservation**  
  Selecting a goal populates starting defaults, but any subsequent user customization of cost, horizon, inflation, return, or savings is strictly preserved until another goal card is explicitly chosen.
- **Robust Time-Value-of-Money Engine**  
  Pure, modular financial formulas implementing inflation compounding for future goal cost, monthly compounding for current savings, net funding gap determination, and end-of-month contribution annuity formulas.
- **Zero-Return & Zero-Gap Safe Handling**  
  - **Zero Return ($r = 0\%$)**: Gracefully falls back to linear funding ($\text{Gap} / n$), reporting strictly ₹0 compounding growth with zero risk of `NaN` or division-by-zero errors.
  - **Zero Gap ($\text{Savings} \ge \text{Goal Cost}$)**: Highlights that existing savings satisfy the projected target, setting monthly contribution to ₹0 with reassuring educational messaging.
- **⚖️ User-Created Scenario Comparison**  
  Empowers users to create, save, edit, duplicate, delete, and compare multiple alternate planning scenarios based on their own custom assumptions:
  - **Save This Scenario**: Saves the current calculated plan into the active session with custom or automatic naming ("Scenario 1", "Scenario 2").
  - **+ Create Alternate Scenario**: Clones active assumptions into the input builder to easily model "what-if" alternatives (e.g. higher inflation, earlier target horizon, or higher current savings) without mutating previous scenarios.
  - **Side-by-Side Comparison Table**: Dynamically renders when 2 or more scenarios exist, contrasting inputs and key projected outcomes side-by-side with responsive horizontal scrolling.
  - **Neutral Comparative Narrative**: Objective, non-judgmental plain-language comparison without automatic ranking, winners, or recommendations.
  - **Visual Comparison Bars**: Scaled horizontal bar chart visualizing required monthly contributions across saved scenarios.
  - **Session-Only Privacy**: Scenarios are stored exclusively in `sessionStorage`, surviving in-session page reloads without sending data to servers.
- **📈 Optional Step-up Contribution (Advanced Planning)**  
  Expandable disclosure allowing users to model contributions that increase annually (e.g. $5\%–10\%$) to match expected salary progression. Uses exact 12-month block TVM summation compounding. When set to $0\%$, results collapse identically to the standard flat monthly contribution.
- **📊 Accessible Dynamic Visualizations**  
  Interactive horizontal comparison bars scaled proportionally to the largest metric:
  - **Base Breakdown**: Proportional scale of Estimated Goal Cost, Projected Savings, and Funding Gap.
  - **Compare Scenarios**: Visual bar comparison of required monthly contributions across all user-saved scenarios.
  - Includes dedicated screen-reader live announcements (`#vizAccessibleSummary`) and ARIA progressbar semantics.
- **🖨️ Clean Financial Planning Report (Print & Download)**  
  - **Print Report (`window.print()`)**: Dedicated `#printReport` container rendered exclusively during `@media print`. Generates a clean, professional 10-section financial planning report (Goal Parameters, Projections at Goal Date, Highlighted Monthly Contribution, Conditional Step-up, User Scenario Comparison Matrix, Methodology, Assumptions, Disclaimer, and Footer) with zero interactive web chrome.
  - **Download Text Report (`goalbridge-summary.txt`)**: Generates an identical structured, client-side plain-text report matching the 10-section hierarchy with Indian currency formatting (`₹12,00,000`).
  - **Reset Safety**: When invoked before a calculation or after clicking Reset, both Print and Download output a clear neutral notice (*"No Goal Calculation Completed"*) rather than stale values.
- **Plain-Language Scenario Explanation**  
  Dynamic narrative translation that explains exactly what the numbers mean in clear, jargon-free Indian Lakh/Crore phrasing.
- **Accessible, Educational Validation**  
  Friendly inline feedback with SVG alert icons, semantic badges (`[Error]`, `[Caution]`), screen-reader attributes (`aria-invalid`, `aria-describedby`), focus management, and contextual warnings for unusually high inflation (>12%), return (>15%), or step-up (>20%) assumptions.
- **100% Client-Side & Private**  
  Zero tracking, zero analytics, zero cookies, zero APIs, zero external CDNs, and zero personal data collection. Runs entirely in the user's browser.
- **Indian Rupee Formatting (`en-IN`)**  
  Faithfully displays amounts using `Intl.NumberFormat('en-IN')` (e.g. `₹12,00,000`, `₹1,50,000`), never Western comma grouping.

---

## Inputs, Outputs and Calculation Approach

### The Inputs

| # | Field | Identifier | Validation Rules | Default / Behavior |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Goal** | `#categoryNav` / `#goalName` | Required text; auto-filled by Goal Library presets | Blank on initial load & reset |
| **2** | **Goal Amount in Today's Money** | `#goalCostToday` | Numeric, $> ₹0$ | Blank on initial load & reset |
| **3** | **Years Remaining** | `#targetYears` | Numeric integer, $1 \le Y \le 100$ | Blank on initial load & reset |
| **4** | **Expected Annual Inflation** | `#inflationRate` | Numeric, $0\% \le i \le 50\%$ (Caution if $> 12\%$) | Blank on initial load & reset |
| **5** | **Expected Annual Investment Return** | `#investmentReturn` | Numeric, $0\% \le r \le 100\%$ (Caution if $> 15\%$) | Blank on initial load & reset |
| **6** | **Current Savings Already Allocated** | `#currentSavings` | Numeric, $\ge ₹0$ | Defaults to ₹0 |
| **+** | **Annual Step-up Contribution (Optional)** | `#stepUpRate` | Numeric, $0\% \le g \le 50\%$ (Caution if $> 20\%$) | Defaults to 0% (in Advanced disclosure) |

---

### Core Outputs

- **Primary Planning Output**: Estimated Monthly Contribution ($\text{₹}M / \text{month}$) (or Starting Monthly Contribution if Step-up is configured).
- **Future Goal Value**: Projected cost at the target horizon reflecting purchasing power loss.
- **Projected Future Value of Current Savings**: Earmarked savings compounded monthly.
- **Estimated Funding Gap**: Net remaining requirement to be accumulated through monthly deposits.
- **Total Contributions**: Cumulative out-of-pocket savings across the entire timeline.
- **Illustrative Projected Growth**: Compounding returns generated from deposits ($\text{Funding Gap} - \text{Total Contributions}$).
- **User Scenario Comparison Matrix**: Side-by-side comparison table contrasting assumptions and outputs across 2 or more custom saved scenarios.

---

### Calculation Methodology & Mathematical Formulas

All equations follow standard actuarial and time-value-of-money standards:

#### 1. Basis Variables
$$\text{Total Months: } n = Y \times 12$$
$$\text{Monthly Compounding Rate: } r_m = \frac{r}{12}$$

#### 2. Future Goal Value (Step 1)
Adjusts today's cost ($P$) for annual inflation ($i$) over $Y$ years:
$$\text{Future Goal Value} = P \times (1 + i)^Y$$
*(If $i = 0\%$, $\text{Future Goal Value} = P$)*

#### 3. Future Value of Current Savings (Step 2)
Projects existing savings ($S$) using monthly compounding at annual return ($r$):
$$\text{Future Value of Savings} = S \times (1 + r_m)^n$$
*(If $r = 0\%$, $\text{Future Value of Savings} = S$; if $S = 0$, value is $0$)*

#### 4. Funding Gap (Step 3)
Calculates the net shortfall between future goal cost and accumulated savings:
$$\text{Funding Gap} = \max(0, \, \text{Future Goal Value} - \text{Future Value of Savings})$$

#### 5. Estimated Monthly Contribution (Step 4 — Standard Flat Annuity)
Assumes equal end-of-month ordinary annuity deposits:
- **When Assumed Annual Return $r > 0\%$:**
  $$PMT = \frac{\text{Funding Gap} \times r_m}{(1 + r_m)^n - 1}$$
- **When Assumed Annual Return $r = 0\%$ (Zero-Return Fallback):**
  $$PMT = \frac{\text{Funding Gap}}{n}$$

#### 6. Optional Annual Step-Up Contribution (Step 5 — Growing Annuity)
When an annual step-up rate $g$ ($g > 0$) is chosen, contributions remain constant for 12 months, then increase by $(1 + g)$ at the start of each subsequent year:
$$\text{Contribution Factor} = \sum_{y=0}^{Y-1} \left[ (1 + g)^y \times \left( \frac{(1 + r_m)^{12} - 1}{r_m} \right) \times (1 + r_m)^{12(Y - y - 1)} \right]$$
$$\text{Starting Monthly Contribution } P_0 = \frac{\text{Funding Gap}}{\text{Contribution Factor}}$$
*(When $g = 0\%$, this collapses identically to the standard monthly contribution formula above.)*

#### 7. Growth & Contribution Breakdown
$$\text{Total Contributions} = \sum \text{All Monthly Installments}$$
$$\text{Illustrative Projected Growth} = \max(0, \, \text{Funding Gap} - \text{Total Contributions})$$

---

### Demonstration Case Reference

For validation and QA, GoalBridge provides the reference scenario:

- **Inputs**: Higher Education Fund, Cost Today = ₹12,00,000, Horizon = 8 Years, Inflation = 6%, Assumed Return = 10%, Current Savings = ₹1,50,000, Step-up = 0%
- **Computed Reference Results**:
  - **Future Goal Value**: $\mathbf{₹19,12,618}$
  - **Future Value of Savings**: $\mathbf{₹3,32,726}$
  - **Estimated Funding Gap**: $\mathbf{₹15,79,891}$
  - **Estimated Monthly Contribution**: $\mathbf{₹10,808 \text{ / month}}$
  - **Total Contributions**: $\mathbf{₹10,37,546}$
  - **Projected Growth from Compounding**: $\mathbf{₹5,42,345}$

---

## Technology Used

- **HTML5**: Semantic, accessible markup (`<header>`, `<main>`, `<section>`, `<article>`, `<details>`, `<summary>`, `role="tablist"`, `role="tab"`, `aria-live="polite"`).
- **CSS3**: Modern responsive layout leveraging CSS Custom Properties (design tokens), CSS Grid, Flexbox, high-contrast states, `:focus-visible`, print stylesheet (`@media print`), and media queries. Zero external CSS frameworks or icon fonts.
- **Vanilla JavaScript (ES6+)**:
  - Pure calculation functions without framework overhead.
  - Zero third-party dependencies or external CDNs.
  - Native `Intl.NumberFormat('en-IN')` for localization.
  - Universal export bindings (`globalThis`, `window`, `module.exports`) enabling headless automation, unit testing, and Node.js execution.

---

## How to Run Locally

Because GoalBridge has **zero dependencies and no build step**, running it locally is instant.

### Option 1: Direct File Opening
1. Clone or download the repository:
   ```bash
   git clone https://github.com/drisha/goal-bridge.git
   ```
2. Open [`index.html`](index.html) directly in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari).

### Option 2: Using a Lightweight Local HTTP Server

- **Using Python 3:**
  ```bash
  cd "Goal Bridge"
  python -m http.server 8000
  ```
  Open `http://localhost:8000` in your browser.

- **Using Node.js (`npx`):**
  ```bash
  cd "Goal Bridge"
  npx serve .
  ```

---

## Testing Summary

GoalBridge includes automated end-to-end regression tests executed against the real browser DOM in headless Microsoft Edge.

### Automated Test Suite Results: **76 / 76 PASSED (100%)**

- **Test 1 — Save Valid Scenario**: Confirmed scenario object creation, storage in `savedScenarios` array, and persistence to `sessionStorage` (`goalbridge_saved_scenarios`).
- **Test 2 — Save Multiple Scenarios**: Confirmed sequential addition of multiple custom scenarios without data collision.
- **Test 3 — Scenario Numbering**: Confirmed automatic naming fallback ("Scenario 1", "Scenario 2", "Scenario 3") when custom name is omitted.
- **Test 4 — Custom Scenario Names**: Confirmed user-entered names (e.g. "Eurotrip 2028", "Higher Inflation") are preserved faithfully.
- **Test 5 — Duplicate Scenario**: Confirmed cloning creates a unique ID, appends `(Copy)` suffix, and preserves all inputs and outputs.
- **Test 6 — Edit Scenario**: Confirmed edit mode activates status banner, updates inputs/outputs in place, updates name, and cancels/hides banner on save without creating duplicates.
- **Test 7 — Delete Scenario**: Confirmed scenario deletion removes item from state, updates `sessionStorage`, and refreshes comparison matrix.
- **Test 8 — Compare 2 Scenarios**: Confirmed side-by-side comparison table renders with sticky parameter rows and column headers when $\ge 2$ scenarios exist.
- **Test 9 — Compare Multiple Scenarios (3+)**: Confirmed dynamic table expansion for 3+ scenarios and generation of neutral comparative plain-language narrative.
- **Test 10 — Assumption Preservation**: Confirmed saved scenarios permanently retain their exact inputs (goal name, cost today, years, inflation, return, current savings, step-up) at save time.
- **Test 11 — Alternate Scenario Independence**: Confirmed "+ Create alternate scenario" copies current assumptions into calculator without mutating the original source scenario.
- **Test 12 — Edit Isolation**: Confirmed modifying one scenario leaves all other saved scenarios completely untouched.
- **Test 13 — Session Persistence Across Reload**: Confirmed `loadSavedScenariosFromSession()` restores saved scenarios from `sessionStorage` on page reload.
- **Test 14 — Complete Session Reset**: Confirmed Reset clears all in-memory scenarios, resets counter, and displays empty state.
- **Test 15 — Session Storage Reset**: Confirmed Reset removes `goalbridge_saved_scenarios` from `sessionStorage`.
- **Test 16 — Neutral Calculator State**: Confirmed Reset clears all 6 inputs to blank/₹0, collapses step-up, sets outputs to ₹0, and never restores demo values.
- **Test 17 — Zero Scenarios State**: Confirmed comparison card and table are hidden when 0 scenarios exist.
- **Test 18 — Single Scenario State**: Confirmed 1 saved scenario displays in list without falsely rendering comparison table.
- **Test 19 — Multi-Scenario Trigger**: Confirmed comparison table and narrative automatically display as soon as 2 or more scenarios are saved.
- **Test 20 — Indian Rupee Formatting (`en-IN`)**: Confirmed `formatCurrency()` formats with Indian grouping (`₹12,00,000`) across cards and tables.
- **Test 21 — Zero-Return Calculation**: Confirmed scenarios with $r=0\%$ calculate linear contribution ($\text{Gap} / n$) and ₹0 growth.
- **Test 22 — Step-up Scenario Preservation**: Confirmed scenarios with step-up $>0\%$ preserve their step-up rate and starting contribution.
- **Test 23 — Core Calculator Regression**: Validated demonstration reference case (Higher Education Fund ₹12L / 8 yrs / 6% inf / 10% ret / ₹1.5L savings: ₹19,12,618 future cost, ₹3,32,726 savings FV, ₹15,79,891 gap, ₹10,808/mo contribution).
- **Test 24 — Accessibility & Screen Readers**: Confirmed ARIA roles, `aria-live="polite"` status banner, accessible action buttons, and touch targets.

---

## Assumptions and Limitations

1. **End-of-Month Contribution Timing**: All formulas assume contributions occur at the end of each calendar month.
2. **Constant Rates**: Assumed inflation and investment returns remain constant across the entire planning duration, whereas actual markets fluctuate.
3. **Compounding Frequency**: Monthly compounding is assumed for both savings growth and contribution accumulation.
4. **Exclusions**: Calculations exclude taxes, capital gains implications, transaction costs, management fees, advisory charges, and fund expense ratios.
5. **Static Cash Flows**: Assumes regular, uninterrupted monthly contributions; pauses, windfalls, or emergency withdrawals are not modeled.

---

## Educational-Use Disclaimer

> **IMPORTANT NOTICE**  
> 1. This calculator is strictly for educational and illustrative purposes only. It does not constitute financial, investment, tax, or legal advice and does not recommend any specific investment product, security, or strategy.  
> 2. Future values are mathematical projections based solely on the assumptions entered. Actual inflation rates, market returns, and future living costs may differ materially from illustrative scenarios.  
> 3. Investment returns are not guaranteed. Higher return assumptions carry higher investment risk, including potential loss of principal.  
> 4. Taxes, transaction fees, brokerage commissions, and investment expense ratios are not factored into these figures; these costs will reduce net returns.  
> 5. Historical price trends and inflation figures are not a guarantee of future economic performance.  
> 6. Always consult a qualified SEBI-registered investment adviser or certified financial planner before making financial decisions.

---

## Author

Created with care by **Drisha**  
Dedicated to empowering early-career professionals and first-time earners with financial clarity and independent scenario planning.
