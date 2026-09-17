# GoalBridge — Completed Test Evidence Matrix

This document provides complete, auditable verification evidence for the **GoalBridge** educational goal-planning application. All tests were executed and validated against the live browser DOM using **Headless Microsoft Edge** test harnesses (`scratch/run_scenario_tests.ps1` and `scratch/run_report_tests.ps1`).

**Overall Test Results**: **141 / 141 Assertions Passed (100% Pass Rate)**  
- Scenario Management Suite: 76 / 76 Passed  
- Print & Download Report Suite: 65 / 65 Passed  

---

## Completed Test Evidence Table

| Test ID | Category | Objective / Scenario | Input Parameters | Expected Result | Actual Result | Status | Verification Evidence / Notes |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **TC-01** | **Core TVM Math** | Higher Education Demonstration Case | Cost: ₹12,00,000<br>Years: 8<br>Inflation: 6%<br>Return: 10%<br>Savings: ₹1,50,000<br>Step-Up: 0% | Future Cost: ₹19,12,618<br>Savings FV: ₹3,32,726<br>Funding Gap: ₹15,79,891<br>Monthly: ₹10,808<br>Total Contrib: ₹10,37,546<br>Growth: ₹5,42,345 | Future Cost: ₹19,12,618<br>Savings FV: ₹3,32,726<br>Funding Gap: ₹15,79,891<br>Monthly: ₹10,808<br>Total Contrib: ₹10,37,546<br>Growth: ₹5,42,345 | **PASS** | Exact match with standard TVM mathematical model (`calculateScenario`). Verified in DOM outputs. |
| **TC-02** | **Edge Case** | Zero Assumed Return ($r = 0\%$) | Cost: ₹1,20,000<br>Years: 1 (12 mos)<br>Inflation: 0%<br>Return: 0%<br>Savings: ₹0 | Linear division without division-by-zero error.<br>Monthly: ₹10,000 / mo.<br>Growth: ₹0. | Monthly: ₹10,000 / mo.<br>Projected Growth: ₹0.<br>No `NaN` or `Infinity`. | **PASS** | `Funding Gap / Months` fallback executed cleanly. Verified in DOM and download report. |
| **TC-03** | **Edge Case** | Zero Net Gap ($\text{Savings} \ge \text{Goal Cost}$) | Cost: ₹1,00,000<br>Years: 5<br>Inflation: 6%<br>Return: 10%<br>Savings: ₹2,00,000 | Projected savings cover future cost.<br>Funding Gap: ₹0.<br>Monthly: ₹0 / month.<br>Reassuring educational note. | Funding Gap: ₹0.<br>Monthly: ₹0 / month.<br>Prominent subtext: *"Goal covered by projected savings"*. | **PASS** | Zero-gap threshold handled with educational reassurance. Screen reader status updated. |
| **TC-04** | **Step-Up Math** | Step-Up Contribution Active ($g = 10\%$) | Cost: ₹12,00,000<br>Years: 8<br>Inflation: 6%<br>Return: 10%<br>Savings: ₹1,50,000<br>Step-Up: 10% | Starting Monthly: ₹7,945 / mo.<br>Final Year Monthly: ₹15,482 / mo.<br>Annual 10% compounding blocks. | Starting Monthly: ₹7,945 / mo.<br>Final Year Monthly: ₹15,482 / mo.<br>Prominent card displays Step-Up badge. | **PASS** | 12-month block TVM growing annuity formula verified. Final year calculation exact. |
| **TC-05** | **Scenario CRUD** | Save Valid Scenario | Goal: "My Baseline Plan"<br>Cost: ₹10,00,000<br>Years: 5<br>Inf: 6%, Ret: 10%, Sav: ₹1L | Scenario object created, added to `savedScenarios`, persisted in `sessionStorage`. | Scenario stored with unique ID and name "My Baseline Plan". `sessionStorage` updated. | **PASS** | Inspecting `sessionStorage.getItem('goalbridge_saved_scenarios')` verified JSON record. |
| **TC-06** | **Scenario CRUD** | Auto-Generated Scenario Naming | Blank scenario name entered upon saving. | Falls back to auto-incremented naming: "Scenario 1", "Scenario 2", "Scenario 3". | Scenario saved as "Scenario 3". Naming counter incremented. | **PASS** | Auto-naming generator verifies uniqueness against existing names. |
| **TC-07** | **Scenario CRUD** | Duplicate Scenario | Click "Duplicate" on Scenario 1. | Creates clone with new unique ID, preserves all assumptions/outputs, appends "(Copy)". | Clone created with identical inputs and name "My Baseline Plan (Copy)". | **PASS** | Deep JSON clone verified; mutating clone does not affect original. |
| **TC-08** | **Scenario CRUD** | Edit Saved Scenario | Click "Edit" on saved scenario. | Populates inputs into form, displays `#scenarioEditBanner` with `aria-live`, updates in place. | Form loaded; edit banner displayed; updating saved scenario in-place without duplicates. | **PASS** | Verified edit mode preserves scenario ID and refreshes comparison matrix. |
| **TC-09** | **Scenario CRUD** | Delete Saved Scenario | Click "Delete" on saved scenario. | Confirms deletion, removes scenario from state and `sessionStorage`, updates UI count. | Scenario removed; list refreshed; counter updated; `sessionStorage` synchronized. | **PASS** | Confirmed non-obstructive dialog and state cleanup. |
| **TC-10** | **Multi-Scenario** | Side-by-Side Comparison Matrix | 2 or more scenarios saved in session. | Displays `#scenarioComparisonCard`, renders tabular comparison matrix, neutral narrative. | Table rendered with parameter rows and scenario columns; narrative explains differences neutrally. | **PASS** | Tested with 2, 3, and 4 scenarios. Sticky parameter labels and horizontal scroll verified. |
| **TC-11** | **Visual Bars** | Dynamic Visual Progress Bars | Switch to "Compare Scenarios" mode with 2 saved scenarios. | Scaled horizontal progress bars proportional to highest monthly contribution. | Dynamic bars rendered with accessible color variants, compact labels, and ARIA progressbars. | **PASS** | Screen reader summary `#vizAccessibleSummary` dynamically announced. |
| **TC-12** | **Print Report** | Dedicated `#printReport` Population | Calculated plan with 2 saved scenarios and 5% Step-Up. | `#printReport` populated with all 10 sections. `#printNeutralNotice` hidden. `#printCalculatedContent` shown. | All placeholders filled: Goal info, projections, monthly highlight, step-up, scenario table, disclaimer. | **PASS** | Verified in DOM dump (`scratch/report_tests_dump.txt`). |
| **TC-13** | **Print Styles** | CSS Print Isolation (`@media print`) | Browser print simulation. | Interactive web chrome (`.site-header`, `main`, buttons, inputs) hidden. Only `#printReport` printed. | Web chrome `display: none !important`. `#printReport` `display: block !important`. Clean white background. | **PASS** | Verified via Headless Edge `--print-to-pdf` rendering. Zero UI controls present in PDF. |
| **TC-14** | **Download Report** | Structured Text Summary Generation | Click "Download" (`handleDownloadSummary`). | Produces `goalbridge-summary.txt` via client-side Blob with identical 10-section plain-text report. | File generated cleanly. ASCII dividers, INR formatting (`₹12,00,000`), zero HTML/CSS markup. | **PASS** | Captured and validated downloaded file text in test runner. |
| **TC-15** | **Reset Safety** | Complete Session Reset & Export Safety | Click "Reset" button after saving scenarios. | Wipes all inputs to blank/₹0, clears `sessionStorage`, empties scenarios, resets print/download to neutral. | Inputs cleared; outputs ₹0; `#printNeutralNotice` shown; download contains "No Goal Calculation Completed". | **PASS** | Prevents printing or downloading stale figures after reset. Tested across both Print and Download. |
| **TC-16** | **Large Numbers** | High-Value Indian Rupee Formatting | Cost: ₹1,00,00,000 (1 Crore)<br>Years: 25<br>Savings: ₹5,00,000 | Proper Indian grouping (`₹1,00,00,000`), no scientific notation or Western grouping. | Output formatted as `₹1,00,00,000` across cards, print report, and text file. | **PASS** | `Intl.NumberFormat('en-IN')` validated for values exceeding 1 Crore. |
| **TC-17** | **Compliance** | Non-Advisory Keyword Scan | Scan all UI elements, print report HTML, and downloaded text. | Zero occurrences of prohibited terms: "recommended", "SIP", "guaranteed return", "best", "worst", "optimal". | 0 occurrences found across all templates, outputs, and generated text files. | **PASS** | Automated regex scan in `run_report_tests.ps1` confirmed 100% compliance. |
| **TC-18** | **Accessibility** | WCAG 2.1 AA Keyboard & Screen Readers | Tab navigation through all controls, contrast check, live region announcements. | Contrast ratio $\ge 4.5:1$, visible focus rings, touch targets $\ge 44\text{px}$, ARIA attributes valid. | Contrast ratios up to $15.6:1$, all interactive buttons $\ge 44\text{px}$, `#statusMessage` polite live updates. | **PASS** | Validated using Edge DevTools DOM inspection and automated accessibility audit rules. |

---

## Automated Test Harness Execution Summary

```text
========================================
TEST EXECUTION COMPLETE
Total Tests: 65 | PASS: 65 | FAIL: 0
========================================

[PASS] Test 1.1: Dedicated #printReport element exists in DOM
[PASS] Test 1.2: Initial state shows #printNeutralNotice
[PASS] Test 1.3: Initial state hides #printCalculatedContent
[PASS] Test 2.1: Initial download produces goalbridge-summary.txt
[PASS] Test 2.2: Initial download contains neutral notice
[PASS] Test 2.3: Initial download contains no stale values
[PASS] Test 3.1: Neutral notice is hidden after calculation
[PASS] Test 3.2: Calculated content is displayed in #printReport
[PASS] Test 3.3: Print Goal Name populated - Got: Higher Education Fund
[PASS] Test 3.4: Print Cost Today formatted in INR - Got: ₹12,00,000
[PASS] Test 3.5: Print Target Years populated - Got: 8 Years (96 Months)
[PASS] Test 3.6: Print Inflation populated - Got: 6% / year
[PASS] Test 3.7: Print Return populated - Got: 10% / year
[PASS] Test 3.8: Print Current Savings formatted in INR - Got: ₹1,50,000
[PASS] Test 3.9: Print Future Goal Cost matches engine - Got: ₹19,12,618
[PASS] Test 3.10: Print Future Savings matches engine - Got: ₹3,32,726
[PASS] Test 3.11: Print Funding Gap matches engine - Got: ₹15,79,891
[PASS] Test 3.12: Print Monthly Contribution matches engine - Got: ₹10,808 / month
[PASS] Test 4.1: Step-up section hidden when rate is 0%
[PASS] Test 4.2: Step-up assumption bullet hidden when rate is 0%
[PASS] Test 4.3: Downloaded text omits STEP-UP section when 0%
[PASS] Test 4.4: Downloaded text contains goal info and projections
[PASS] Test 5.1: Step-up section displayed when rate is 10%
[PASS] Test 5.2: Step-up assumption bullet displayed
[PASS] Test 5.3: Print Step-up Rate populated - Got: 10% / year
[PASS] Test 5.4: Print Starting Step-up contribution populated - Got: ₹7,945 / month
[PASS] Test 5.5: Print Final Year contribution populated - Got: ₹15,482 / month
[PASS] Test 5.6: Downloaded text includes STEP-UP ASSUMPTION section
[PASS] Test 5.7: Downloaded text includes Annual Contribution Increase: 10%
[PASS] Test 5.8: Downloaded text includes Starting Monthly Contribution
[PASS] Test 5.9: Downloaded text includes Estimated Contribution in Final Year
[PASS] Test 6.1: 1 saved scenario displays single scenario section
[PASS] Test 6.2: 1 saved scenario title is "SAVED SCENARIO DETAILS"
[PASS] Test 6.3: 1 saved scenario table contains Base Scenario
[PASS] Test 6.4: 2 saved scenarios displays comparison section
[PASS] Test 6.5: 2 saved scenarios title is "SCENARIO COMPARISON"
[PASS] Test 6.6: Comparison table contains both scenarios
[PASS] Test 6.7: Downloaded text contains SCENARIO COMPARISON block
[PASS] Test 6.8: Downloaded text lists Base Scenario and Optimistic Return
[PASS] Test 7.1: Reset updates #printNeutralNotice to display block
[PASS] Test 7.2: Reset hides #printCalculatedContent
[PASS] Test 7.3: Saved scenarios array cleared by reset
[PASS] Test 7.4: Download after Reset contains neutral notice
[PASS] Test 7.5: Download after Reset has no old scenario data
[PASS] Test 8.1: Large INR formatted with Crores (₹1,00,00,000) - Got: ₹1,00,00,000
[PASS] Test 8.2: Print report populated for 1 Crore goal
[PASS] Test 8.3: Download text formats 1 Crore correctly
[PASS] Test 9.1: Zero-gap displays 0 funding gap - Expected: ₹0, Got: ₹0
[PASS] Test 9.2: Zero-gap displays 0 / month monthly contribution
[PASS] Test 10.1: Zero return calculates monthly linearly (₹10,000/mo) - Got: ₹10,000 / month
[PASS] Test 11.1 - 11.14: Prohibited compliance words NOT in print or download
[PASS] Test 12.1: No interactive form controls inside #printReport
```
