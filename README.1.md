# GoalBridge

GoalBridge is an educational goal-based planning tool that helps first-time earners explore how inflation, time, existing savings, and an assumed investment return affect an illustrative monthly contribution.

## Live Demo

**Live Demo:** [GoalBridge](https://your-goalbridge-site.netlify.app)

> Replace the placeholder URL above with the final Netlify or Vercel production URL after deployment.

## Features

- Goal-based financial planning for educational workshops
- Categorized goal library with six goal categories
- Goal-specific default inflation assumptions
- Custom goal creation
- Editable goal cost, timeframe, inflation, return assumption, and current savings
- Inflation-adjusted future goal cost
- Estimated future value of current savings
- Estimated funding gap
- Estimated monthly contribution
- Total projected contributions and illustrative projected growth
- Indian Rupee (INR) formatting using the Indian numbering system
- Friendly input validation
- Zero-return handling
- Responsive mobile and desktop layout
- Visual comparison of the goal, projected savings, and funding gap
- Methodology and educational disclaimer
- No registration or login required
- Client-side scenario calculations

## Inputs, Outputs and Calculation Approach

### Inputs

The calculator uses:

- Goal / goal name
- Goal amount in today's money
- Years remaining to the goal
- Expected annual inflation rate
- Assumed annual investment return
- Current savings already allocated to the goal

Predefined goals automatically populate example costs, time horizons, and goal-specific inflation assumptions. All assumptions remain editable.

### Outputs

The application displays:

- Goal amount today
- Estimated future goal cost
- Estimated future value of current savings
- Estimated funding gap
- Estimated monthly contribution required
- Total projected contributions
- Illustrative projected growth
- Plain-language scenario explanation

### Calculation approach

**Future Goal Value**

```text
Future Goal Value =
Today's Goal Cost × (1 + Inflation Rate)^Years
```

**Monthly Rate**

```text
Monthly Rate = Annual Return / 12
```

**Number of Months**

```text
Number of Months = Years × 12
```

**Future Value of Current Savings**

```text
Future Value of Current Savings =
Current Savings × (1 + Monthly Rate)^Number of Months
```

**Funding Gap**

```text
Funding Gap =
max(0, Future Goal Value - Future Value of Current Savings)
```

**Estimated Monthly Contribution**

When the assumed annual return is greater than zero:

```text
Monthly Contribution =
Funding Gap × Monthly Rate
/
((1 + Monthly Rate)^Number of Months - 1)
```

When the assumed annual return is zero:

```text
Monthly Contribution =
Funding Gap / Number of Months
```

The calculator assumes monthly compounding and contributions made at the end of each month. Annual return is converted to a monthly rate by dividing the annual rate by 12.

## Technology Used

- HTML5
- CSS3
- JavaScript
- Browser-native JavaScript APIs
- `Intl.NumberFormat` for Indian currency formatting
- No backend or database required

## How to Run Locally

### Option 1: Open directly

1. Download or clone this repository.
2. Open `index.html` in a modern web browser.

### Option 2: Run a local web server

Using Python:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

No installation, database, login, or environment variables are required for the basic application.

## Testing Summary

The application was tested against the following areas:

- Goal selection and automatic default population
- Goal-specific inflation assumptions
- Custom goal creation
- Editable calculator assumptions
- Current savings calculation
- Inflation-adjusted future goal values
- Monthly contribution calculation
- Zero-return scenario
- Zero funding-gap scenario
- Input validation for blank, zero, negative, and unrealistic values
- Indian currency formatting
- Calculate and Reset actions
- Responsive mobile and desktop layouts
- Keyboard navigation and visible focus states
- Educational wording and disclaimer
- No investment-product recommendations

### Demonstration Scenario

The original demonstration scenario can be reproduced using:

| Input | Value |
|---|---:|
| Goal | Higher Education Fund |
| Today's cost | ₹12,00,000 |
| Time horizon | 8 years |
| Inflation | 6% |
| Assumed annual return | 10% |
| Current savings | ₹1,50,000 |

Expected approximate results:

| Output | Result |
|---|---:|
| Future goal value | ₹19,12,618 |
| Future value of current savings | ₹3,32,726 |
| Funding gap | ₹15,79,891 |
| Monthly contribution | ₹10,808 |

## Assumptions and Limitations

- Inflation is treated as a constant annual rate over the selected time horizon.
- The assumed investment return is treated as a constant annual rate for illustration.
- Annual return is converted to a monthly rate by dividing it by 12.
- Monthly compounding is used for the projection of current savings and monthly contributions.
- Monthly contributions are assumed to occur at the end of each month.
- Taxes, fees, transaction costs, and other investment expenses are not included.
- Actual inflation and investment returns can vary over time.
- Future goal costs may differ from the estimates produced by the calculator.
- The calculator does not account for changes in contribution amounts unless explicitly supported by the current calculation model.
- Results are estimates for scenario exploration and should not be interpreted as predictions.

## Educational-Use Disclaimer

This calculator is for educational and illustrative purposes only. It is not financial, investment, tax, or legal advice and does not recommend any investment product or strategy.

Future values are estimates based on the assumptions entered. Actual inflation, investment returns, and future costs may differ materially.

The assumed investment return is not guaranteed.

GoalBridge is intended to help workshop participants understand the relationship between goals, inflation, time, existing savings, and assumed returns. It should not be used as a substitute for professional financial advice.

## Author

**Drisha Mehta**

GoalBridge was created as an educational financial-literacy project for helping first-time earners explore goal-based planning scenarios.
