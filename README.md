# GoalBridge

> **An educational goal-planning tool empowering first-time earners to understand how inflation, time, existing savings, and assumed returns shape their monthly contribution path.**

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?logo=javascript&logoColor=black)](script.js)
[![HTML5 / CSS3](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3-E34F26?logo=html5&logoColor=white)](index.html)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-0F766E)](index.html)
[![Tests: 100% Passed](https://img.shields.io/badge/Tests-63%2F63%20Passed-22C55E)](#testing-summary)

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
- **Dynamic Horizontal Comparison Visualization**  
  Interactive CSS-proportional comparison bars dynamically scaling to the maximum scenario metric:
  1. Estimated Goal Cost at Target Date
  2. Projected Future Value of Current Savings
  3. Estimated Funding Gap
- **Plain-Language Scenario Explanation**  
  Dynamic narrative translation that explains exactly what the numbers mean in clear, jargon-free Indian Lakh/Crore phrasing.
- **Accessible, Educational Validation**  
  Friendly inline feedback with SVG alert icons, semantic badges (`[Error]`, `[Caution]`), screen-reader attributes (`aria-invalid`, `aria-describedby`), focus management, and contextual warnings for unusually high inflation (>12%) or return (>15%) assumptions.
- **100% Client-Side & Private**  
  Zero tracking, zero analytics, zero cookies, zero APIs, zero external CDNs, and zero personal data collection. Runs entirely in the user's browser.
- **Indian Rupee Formatting (`en-IN`)**  
  Faithfully displays amounts using `Intl.NumberFormat('en-IN')` (e.g. `₹12,00,000`, `₹1,50,000`), never Western comma grouping.

---

## Inputs, Outputs and Calculation Approach

### The 6 Core Inputs

| # | Field | Identifier | Validation Rules | Default (Demonstration Case) |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Goal** | `#categoryNav` / `#goalName` | Required text; auto-filled by Goal Library presets | *Higher Education Fund* |
| **2** | **Goal Amount in Today's Money** | `#goalCostToday` | Numeric, $> ₹0$ | *₹12,00,000* |
| **3** | **Years Remaining** | `#targetYears` | Numeric integer, $1 \le Y \le 100$ | *8 Years* |
| **4** | **Expected Annual Inflation** | `#inflationRate` | Numeric, $0\% \le i \le 50\%$ (Caution if $> 12\%$) | *6%* |
| **5** | **Expected Annual Investment Return** | `#investmentReturn` | Numeric, $0\% \le r \le 100\%$ (Caution if $> 15\%$) | *10%* |
| **6** | **Current Savings Already Allocated** | `#currentSavings` | Numeric, $\ge ₹0$ | *₹1,50,000* |

---

### Core Outputs

- **Primary Planning Output**: Estimated Monthly Contribution ($\text{₹}M / \text{month}$)
- **Future Goal Value**: Projected cost at the target horizon reflecting purchasing power loss.
- **Projected Future Value of Current Savings**: Earmarked savings compounded monthly.
- **Estimated Funding Gap**: Net remaining requirement to be accumulated through monthly deposits.
- **Total Contributions**: Cumulative out-of-pocket savings across the entire timeline ($PMT \times n$).
- **Illustrative Projected Growth**: Compounding returns generated from deposits ($\text{Funding Gap} - \text{Total Contributions}$).

---

### Calculation Methodology & Mathematical Formulas

All equations follow standard actuarial and time-value-of-money standards:

#### 1. Basis Variables
$$\text{Total Months: } n = Y \times 12$$
$$\text{Monthly Rate: } r_m = \frac{r}{12}$$

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

#### 5. Estimated Monthly Contribution (Step 4)
Assumes equal end-of-month ordinary annuity deposits:
- **When Assumed Annual Return $r > 0\%$:**
  $$PMT = \frac{\text{Funding Gap} \times r_m}{(1 + r_m)^n - 1}$$
- **When Assumed Annual Return $r = 0\%$ (Zero-Return Fallback):**
  $$PMT = \frac{\text{Funding Gap}}{n}$$

#### 6. Growth & Contribution Breakdown
$$\text{Total Contributions} = PMT \times n$$
$$\text{Illustrative Projected Growth} = \max(0, \, \text{Funding Gap} - \text{Total Contributions})$$

---

### Demonstration Case Reference

On page load and upon clicking **Reset**, GoalBridge pre-fills and calculates the reference case:

- **Inputs**: Higher Education Fund, Cost Today = ₹12,00,000, Horizon = 8 Years, Inflation = 6%, Assumed Return = 10%, Current Savings = ₹1,50,000
- **Computed Results**:
  - **Future Goal Value**: $\mathbf{₹19,12,618}$
  - **Future Value of Savings**: $\mathbf{₹3,32,726}$
  - **Estimated Funding Gap**: $\mathbf{₹15,79,891}$
  - **Estimated Monthly Contribution**: $\mathbf{₹10,808 \text{ / month}}$
  - **Total Contributions**: $\mathbf{₹10,37,546}$
  - **Projected Growth from Compounding**: $\mathbf{₹5,42,345}$

---

## Technology Used

- **HTML5**: Semantic, accessible markup (`<header>`, `<main>`, `<section>`, `<article>`, `<details>`, `<summary>`, `role="tablist"`, `role="tab"`, `aria-live="polite"`).
- **CSS3**: Modern responsive layout leveraging CSS Custom Properties (design tokens), CSS Grid, Flexbox, high-contrast states, `:focus-visible`, and media queries. Zero external CSS frameworks or icon fonts.
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

- **Using VS Code:**  
  Install the **Live Server** extension, right-click [`index.html`](index.html), and select *"Open with Live Server"*.

---

## Testing Summary

GoalBridge includes automated end-to-end regression tests executed against the real browser DOM in headless Microsoft Edge.

### Automated Test Suite Results: **63 / 63 PASSED (100%)**

- **Goal Library Structure**: Verified 7 category groups (6 categories + Something Else) and all 29 goals (28 predefined + 1 custom).
- **Category Switching**: Seamless switching across all tabs with accurate goal card updates.
- **Predefined Preset Population**: Verified automatic population of default cost, timeline, goal-specific inflation, return = 10%, and savings = ₹0.
- **Assumption Edit Preservation**: Confirmed that modifying assumptions does not get overridden when calculating or updating other fields.
- **Demonstration Case Accuracy**: Exact formula match against reference outputs (₹19,12,618 / ₹3,32,726 / ₹15,79,891 / ₹10,808).
- **Boundary & Fallback Cases**:
  - Zero Return ($r=0\%$): Linear division, ₹0 growth, zero division errors.
  - Zero Gap ($\text{Savings} \ge \text{Goal Cost}$): Funding Gap = ₹0, Monthly Contribution = ₹0, neutral educational summary rendered.
  - Zero Inflation ($i=0\%$): Future cost strictly equals today's cost.
  - Zero Savings ($S=₹0$): Savings value = ₹0, gap = 100% of goal.
- **Input Validation**: Blank names, zero/negative costs, out-of-range horizons ($>100\text{y}$), extreme inflation ($>50\%$), return ($>100\%$), and negative savings are rejected with inline feedback.
- **Obsolete Code Audit**: 0 occurrences of "Initial Investment" or "Step-up" across all HTML, CSS, and JS files.
- **Responsive Overflow Verification**: Inspected at 360px, 390px, 768px, and 1440px viewports with zero horizontal scrolling or clipping.

---

## Assumptions and Limitations

1. **End-of-Month Contribution Timing**: All formulas assume contributions occur at the end of each calendar month.
2. **Constant Rates**: Assumed inflation and investment returns remain constant across the entire planning duration, whereas actual markets fluctuate.
3. **Compounding Frequency**: Monthly compounding is assumed for both savings growth and contribution accumulation.
4. **Exclusions**: Calculations exclude taxes, capital gains implications, transaction costs, management fees, advisory charges, and fund expense ratios.
5. **Static Cash Flows**: Assumes regular, uninterrupted monthly contributions; does not model salary step-ups, pauses, windfalls, or emergency withdrawals.

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
