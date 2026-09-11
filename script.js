/**
 * GoalBridge — Educational Scenario Planner
 * script.js — Complete Calculation Engine, Input Validation & Dynamic UI Controller
 *
 * Variables:
 * P = goal amount today
 * i = annual inflation rate (decimal)
 * r = annual assumed investment return (decimal)
 * Y = years remaining
 * S = current savings
 * n = Y * 12
 * monthlyRate = r / 12
 */

// Default demonstration values
const DEFAULTS = Object.freeze({
  goalName: 'Higher Education Fund',
  goalCostToday: 1200000,
  targetYears: 8,
  inflationRate: 6,
  investmentReturn: 10,
  currentSavings: 150000
});

// Caution thresholds for unusually high assumptions
const CAUTION_THRESHOLDS = Object.freeze({
  inflationRate: 12, // Above 12% triggers inflation caution
  investmentReturn: 15 // Above 15% triggers return caution
});

// Structured Goal Library: 6 Categories + Something Else (28 predefined + 1 custom)
const GOAL_LIBRARY = Object.freeze([
  {
    category: 'Financial Foundation',
    id: 'financial-foundation',
    goals: [
      { id: 'emergency-fund', name: 'Emergency Fund', icon: '🚨', years: 2, inflation: 6, cost: 300000 },
      { id: 'medical-health-fund', name: 'Medical / Health Fund', icon: '🏥', years: 3, inflation: 7, cost: 200000 },
      { id: 'family-protection', name: 'Family Protection', icon: '🛡️', years: 5, inflation: 6, cost: 1000000 },
      { id: 'retirement-corpus', name: 'Retirement Corpus', icon: '🌱', years: 30, inflation: 6, cost: 10000000 },
      { id: 'financial-independence', name: 'Financial Independence', icon: '🏆', years: 20, inflation: 6, cost: 10000000 }
    ]
  },
  {
    category: 'Education & Career',
    id: 'education-career',
    goals: [
      { id: 'higher-education', name: 'Higher Education', icon: '🎓', years: 5, inflation: 8, cost: 800000 },
      { id: 'masters-degree', name: "Master's Degree", icon: '🎓', years: 4, inflation: 8, cost: 1000000 },
      { id: 'professional-course', name: 'Professional Course', icon: '📚', years: 2, inflation: 7, cost: 200000 },
      { id: 'professional-certification', name: 'Professional Certification', icon: '🧑‍💻', years: 1, inflation: 6, cost: 75000 },
      { id: 'career-skill-fund', name: 'Career / Skill Fund', icon: '🚀', years: 3, inflation: 6, cost: 150000 },
      { id: 'start-a-business', name: 'Start a Business', icon: '💼', years: 5, inflation: 7, cost: 1000000 }
    ]
  },
  {
    category: 'Lifestyle',
    id: 'lifestyle',
    goals: [
      { id: 'laptop-work-equipment', name: 'Laptop / Work Equipment', icon: '💻', years: 2, inflation: 5, cost: 80000 },
      { id: 'smartphone', name: 'Smartphone', icon: '📱', years: 2, inflation: 5, cost: 50000 },
      { id: 'two-wheeler', name: 'Two-Wheeler', icon: '🛵', years: 3, inflation: 5, cost: 150000 },
      { id: 'car', name: 'Car', icon: '🚗', years: 5, inflation: 5, cost: 1000000 },
      { id: 'home-down-payment', name: 'Home Down Payment', icon: '🏠', years: 7, inflation: 6, cost: 2000000 },
      { id: 'buy-a-home', name: 'Buy a Home', icon: '🏡', years: 10, inflation: 6, cost: 7500000 }
    ]
  },
  {
    category: 'Family',
    id: 'family',
    goals: [
      { id: 'marriage', name: 'Marriage', icon: '💍', years: 5, inflation: 6, cost: 1000000 },
      { id: 'wedding-fund', name: 'Wedding Fund', icon: '💐', years: 5, inflation: 6, cost: 1000000 },
      { id: 'support-parents', name: 'Support Parents', icon: '❤️', years: 5, inflation: 6, cost: 500000 },
      { id: 'parents-care-fund', name: "Parents' Care Fund", icon: '👨‍👩‍👧', years: 10, inflation: 7, cost: 1000000 }
    ]
  },
  {
    category: 'Children',
    id: 'children',
    goals: [
      { id: 'child-education', name: "Child's Education", icon: '🎒', years: 15, inflation: 8, cost: 2000000 },
      { id: 'child-higher-education', name: "Child's Higher Education", icon: '🎓', years: 18, inflation: 8, cost: 3000000 },
      { id: 'child-marriage', name: "Child's Marriage", icon: '💍', years: 25, inflation: 6, cost: 2500000 }
    ]
  },
  {
    category: 'Experiences',
    id: 'experiences',
    goals: [
      { id: 'international-trip', name: 'International Trip', icon: '✈️', years: 3, inflation: 5, cost: 250000 },
      { id: 'dream-vacation', name: 'Dream Vacation', icon: '🌴', years: 2, inflation: 5, cost: 100000 },
      { id: 'hobby-passion-project', name: 'Hobby / Passion Project', icon: '🎨', years: 2, inflation: 5, cost: 50000 },
      { id: 'special-experience', name: 'Special Experience', icon: '⭐', years: 3, inflation: 5, cost: 100000 }
    ]
  },
  {
    category: 'Something Else',
    id: 'something-else',
    goals: [
      { id: 'custom-goal', name: 'Create my own goal', icon: '✨', isCustom: true, years: 5, inflation: 6, cost: 500000 }
    ]
  }
]);

/* ==========================================================================
   0. Goal Library State & Controller
   ========================================================================== */

let currentActiveCategory = 'education-career';
let currentSelectedGoalId = 'higher-education';

/**
 * Finds a goal and its category in GOAL_LIBRARY by goal ID
 * @param {string} goalId
 * @returns {{ goal: Object, category: Object } | null}
 */
function findGoalById(goalId) {
  for (const cat of GOAL_LIBRARY) {
    const goal = cat.goals.find(g => g.id === goalId);
    if (goal) return { goal, category: cat };
  }
  return null;
}

/**
 * Renders the Goal Library category tabs and goal cards.
 * @param {string} activeCatId - Active category identifier
 * @param {string} selectedGoalId - Currently selected goal identifier
 */
function renderGoalLibrary(activeCatId = currentActiveCategory, selectedGoalId = currentSelectedGoalId) {
  if (typeof document === 'undefined') return;
  const categoryNav = document.getElementById('categoryNav');
  const goalCardsWrapper = document.getElementById('goalCardsWrapper');
  if (!categoryNav || !goalCardsWrapper) return;

  // 1. Render Category Tabs
  categoryNav.innerHTML = '';
  GOAL_LIBRARY.forEach(cat => {
    const tabBtn = document.createElement('button');
    tabBtn.type = 'button';
    tabBtn.className = `category-tab-btn ${cat.id === activeCatId ? 'is-active' : ''}`;
    tabBtn.setAttribute('role', 'tab');
    tabBtn.setAttribute('aria-selected', cat.id === activeCatId ? 'true' : 'false');
    tabBtn.setAttribute('id', `cat-tab-${cat.id}`);
    tabBtn.setAttribute('aria-controls', 'goalCardsWrapper');
    tabBtn.textContent = cat.category;

    tabBtn.addEventListener('click', () => {
      currentActiveCategory = cat.id;
      renderGoalLibrary(currentActiveCategory, currentSelectedGoalId);
    });

    categoryNav.appendChild(tabBtn);
  });

  // 2. Render Goal Cards for active category
  goalCardsWrapper.innerHTML = '';
  const activeCategory = GOAL_LIBRARY.find(c => c.id === activeCatId) || GOAL_LIBRARY[0];
  goalCardsWrapper.setAttribute('aria-labelledby', `cat-tab-${activeCategory.id}`);

  activeCategory.goals.forEach(goal => {
    const cardBtn = document.createElement('button');
    cardBtn.type = 'button';
    const isSelected = goal.id === selectedGoalId;
    cardBtn.className = `goal-card-btn ${isSelected ? 'is-selected' : ''}`;
    cardBtn.setAttribute('data-goal-id', goal.id);
    cardBtn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');

    if (goal.isCustom) {
      cardBtn.innerHTML = `
        <div class="goal-card-title-row">
          <span class="goal-card-icon" aria-hidden="true">${goal.icon}</span>
          <span class="goal-card-name">${goal.name}</span>
        </div>
        <div class="goal-card-meta">
          <span class="meta-pill meta-pill-cost">Custom</span>
          <span class="meta-pill">${goal.inflation}% default inf</span>
        </div>
      `;
    } else {
      cardBtn.innerHTML = `
        <div class="goal-card-title-row">
          <span class="goal-card-icon" aria-hidden="true">${goal.icon}</span>
          <span class="goal-card-name">${goal.name}</span>
        </div>
        <div class="goal-card-meta">
          <span class="meta-pill meta-pill-cost">${formatCurrency(goal.cost)}</span>
          <span class="meta-pill">${goal.years} yr${goal.years > 1 ? 's' : ''}</span>
          <span class="meta-pill">${goal.inflation}% inf</span>
        </div>
      `;
    }

    cardBtn.addEventListener('click', () => {
      selectGoal(goal.id, true);
    });

    goalCardsWrapper.appendChild(cardBtn);
  });
}

/**
 * Handles goal selection. When selected by user click:
 * Automatically populates default assumptions, clears prior errors,
 * updates badge and triggers recalculation.
 * Subsequent manual edits to assumptions are preserved.
 * @param {string} goalId
 * @param {boolean} isUserClick
 */
function selectGoal(goalId, isUserClick = false) {
  const found = findGoalById(goalId);
  if (!found) return;

  const { goal, category } = found;
  currentSelectedGoalId = goal.id;
  currentActiveCategory = category.id;

  if (typeof document !== 'undefined' && isUserClick) {
    const goalNameInput = document.getElementById('goalName');
    const goalCostInput = document.getElementById('goalCostToday');
    const targetYearsInput = document.getElementById('targetYears');
    const inflationRateInput = document.getElementById('inflationRate');
    const investmentReturnInput = document.getElementById('investmentReturn');
    const currentSavingsInput = document.getElementById('currentSavings');

    if (goal.isCustom) {
      if (goalNameInput) {
        goalNameInput.value = '';
        goalNameInput.placeholder = 'e.g., Sabbatical / World Tour';
        goalNameInput.focus();
      }
      if (goalCostInput) goalCostInput.value = goal.cost || 500000;
      if (targetYearsInput) targetYearsInput.value = goal.years || 5;
      if (inflationRateInput) inflationRateInput.value = 6; // Default custom inflation = 6%
      if (investmentReturnInput) investmentReturnInput.value = 10;
      if (currentSavingsInput) currentSavingsInput.value = 0;
    } else {
      if (goalNameInput) goalNameInput.value = goal.name;
      if (goalCostInput) goalCostInput.value = goal.cost;
      if (targetYearsInput) targetYearsInput.value = goal.years;
      if (inflationRateInput) inflationRateInput.value = goal.inflation;
      if (investmentReturnInput) investmentReturnInput.value = 10;
      if (currentSavingsInput) currentSavingsInput.value = 0;
    }

    // Clear all inline error and caution indicators
    ['goalName', 'goalCostToday', 'targetYears', 'inflationRate', 'investmentReturn', 'currentSavings'].forEach(id => {
      clearFieldError(id);
      clearFieldCaution(id);
    });

    // Update live badge in header
    const displayGoalBadge = document.getElementById('displayGoalBadge');
    if (displayGoalBadge) {
      const name = goalNameInput ? goalNameInput.value.trim() || 'Custom Goal' : 'Custom Goal';
      const years = targetYearsInput ? targetYearsInput.value || 0 : 0;
      displayGoalBadge.textContent = `${name} (${years} Yrs)`;
    }

    // Automatically recalculate scenario if inputs are valid
    const validation = validateInputs();
    if (validation.isValid) {
      const results = calculateScenario(validation.values);
      renderResults(results, validation.values);
    }
  }

  // Update library UI highlights
  renderGoalLibrary(currentActiveCategory, currentSelectedGoalId);
}

/* ==========================================================================
   1. Core Financial Calculation Functions (Pure & Reusable)
   ========================================================================== */

/**
 * 1. Calculate Future Goal Value
 * Formula: P * (1 + i)^Y
 * If inflation = 0%: Future Goal Value = Goal Amount Today
 * @param {number} costToday - Goal amount today (P)
 * @param {number} inflationRate - Annual inflation rate in percent (e.g. 6 for 6%)
 * @param {number} years - Years remaining (Y)
 * @returns {number} Estimated future cost of the goal
 */
function calculateFutureGoalValue(costToday, inflationRate, years) {
  if (costToday <= 0 || years <= 0) return 0;
  const i = Math.max(0, inflationRate) / 100;
  return costToday * Math.pow(1 + i, years);
}

/**
 * 2. Calculate Future Value of Current Savings
 * Uses monthly compounding: S * (1 + monthlyRate)^n
 * If return = 0%: Future Value = Current Savings
 * If savings = 0: Future Value = 0
 * @param {number} currentSavings - Existing savings earmarked for the goal (S)
 * @param {number} annualReturn - Assumed annual return in percent (e.g. 10 for 10%)
 * @param {number} years - Years remaining (Y)
 * @returns {number} Projected future value of current savings
 */
function calculateFutureSavingsValue(currentSavings, annualReturn, years) {
  if (currentSavings <= 0) return 0;
  if (years <= 0) return currentSavings;
  const r = Math.max(0, annualReturn) / 100;
  const monthlyRate = r / 12;
  const n = years * 12;
  return currentSavings * Math.pow(1 + monthlyRate, n);
}

/**
 * 3. Calculate Funding Gap
 * Formula: max(0, Future Goal Value - Future Value of Current Savings)
 * If savings >= goal: Funding Gap = 0
 * @param {number} futureGoalValue
 * @param {number} futureSavingsValue
 * @returns {number} Net remaining gap to be funded
 */
function calculateFundingGap(futureGoalValue, futureSavingsValue) {
  return Math.max(0, futureGoalValue - futureSavingsValue);
}

/**
 * 4 & 5. Calculate Monthly Contribution
 * If monthlyRate > 0: Funding Gap * monthlyRate / ((1 + monthlyRate)^n - 1)
 * If monthlyRate = 0: Funding Gap / n (Linear division guard against division by zero)
 * Contributions assumed at end of each month.
 * Guarded against NaN, Infinity, and division by zero.
 * @param {number} fundingGap - Remaining funding requirement
 * @param {number} annualReturn - Annual investment return in percent
 * @param {number} years - Years remaining
 * @returns {number} Estimated monthly contribution
 */
function calculateMonthlyContribution(fundingGap, annualReturn, years) {
  if (fundingGap <= 0 || years <= 0) return 0;
  const n = years * 12;
  if (n <= 0) return 0;

  const r = Math.max(0, annualReturn) / 100;
  const monthlyRate = r / 12;

  // Zero-return scenario: linear division
  if (monthlyRate === 0) {
    return fundingGap / n;
  }

  const compoundingFactor = Math.pow(1 + monthlyRate, n) - 1;
  if (compoundingFactor <= 0 || !isFinite(compoundingFactor)) {
    return fundingGap / n;
  }

  const pmt = (fundingGap * monthlyRate) / compoundingFactor;
  return isFinite(pmt) && !isNaN(pmt) ? Math.max(0, pmt) : 0;
}

/**
 * 6, 7 & 8. Calculate Projected Growth & Breakdown
 * FV Contributions:
 *   If monthlyRate > 0: Monthly Contribution * (((1 + monthlyRate)^n - 1) / monthlyRate)
 *   If monthlyRate = 0: Monthly Contribution * n
 * Projected Growth = FV Contributions - Total Contributions
 * If return = 0%: Projected Growth = 0
 * @param {number} monthlyContribution
 * @param {number} annualReturn
 * @param {number} years
 * @returns {{ totalContributions: number, fvContributions: number, projectedGrowth: number }}
 */
function calculateProjectedGrowth(monthlyContribution, annualReturn, years) {
  const n = years * 12;
  const totalContributions = monthlyContribution * n;

  if (annualReturn <= 0 || monthlyContribution <= 0 || n <= 0) {
    return {
      totalContributions: Math.max(0, totalContributions),
      fvContributions: Math.max(0, totalContributions),
      projectedGrowth: 0
    };
  }

  const r = annualReturn / 100;
  const monthlyRate = r / 12;

  const compoundingRatio = (Math.pow(1 + monthlyRate, n) - 1) / monthlyRate;
  const fvContributions = monthlyContribution * compoundingRatio;
  const projectedGrowth = Math.max(0, fvContributions - totalContributions);

  return {
    totalContributions: Math.max(0, totalContributions),
    fvContributions: isFinite(fvContributions) ? fvContributions : totalContributions,
    projectedGrowth: isFinite(projectedGrowth) ? projectedGrowth : 0
  };
}

/**
 * Currency Formatter for Indian Rupee (en-IN)
 * Per specification:
 * Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
 * Displays: ₹12,00,000 / ₹10,00,00,000
 * Handles large currency amounts with correct Indian comma notation.
 * @param {number} amount
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
  if (isNaN(amount) || amount === null || amount === undefined || !isFinite(amount)) {
    return '₹0';
  }
  const rounded = Math.round(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(rounded);
}

/**
 * Formats a currency amount into compact Indian numbering for chart labels.
 * Examples: ₹19.12L / ₹19.1L, ₹3.33L / ₹3.3L, ₹15.79L / ₹15.8L
 * If >= 1 Crore (100 Lakhs): formats as ₹X.XX Cr
 * If < 1 Lakh: falls back to standard currency format
 * @param {number} amount
 * @returns {string} Compact Indian currency label
 */
function formatCompactLakh(amount) {
  if (isNaN(amount) || amount === null || amount === undefined || !isFinite(amount) || amount <= 0) {
    return '₹0';
  }
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2).replace(/\.?0+$/, '');
    return `₹${cr}Cr`;
  }
  if (amount >= 100000) {
    const lk = (amount / 100000).toFixed(2).replace(/\.?0+$/, '');
    return `₹${lk}L`;
  }
  return formatCurrency(amount);
}

/**
 * Formats a currency amount into written Indian denomination (lakh / crore)
 * For plain-language narrative sentences.
 * Examples: "₹19.1 lakh", "₹1.5 lakh", "₹3.3 lakh", "₹15.8 lakh"
 * @param {number} amount
 * @returns {string} Denominated word currency string
 */
function formatLakhWords(amount) {
  if (isNaN(amount) || amount === null || amount === undefined || !isFinite(amount) || amount <= 0) {
    return '₹0';
  }
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(1).replace(/\.0$/, '');
    return `₹${cr} crore`;
  }
  if (amount >= 100000) {
    const lk = (amount / 100000).toFixed(1).replace(/\.0$/, '');
    return `₹${lk} lakh`;
  }
  return formatCurrency(amount);
}

/**
 * High-level orchestration function to compute an entire scenario
 * Handles normal scenarios as well as special scenarios:
 * Special Scenario: If FV of Current Savings >= Future Goal Value:
 *   Funding Gap = ₹0, Monthly Contribution = ₹0, Projected Contribution = ₹0, Projected Growth = ₹0
 * @param {Object} inputs
 * @returns {Object} Complete scenario results
 */
function calculateScenario(inputs) {
  const costToday = Number(inputs.costToday) || 0;
  const inflationRate = Number(inputs.inflationRate) || 0;
  const annualReturn = Number(inputs.annualReturn) || 0;
  const years = Math.max(1, Number(inputs.years) || 1);
  const currentSavings = Math.max(0, Number(inputs.currentSavings) || 0);
  const n = years * 12;

  // 1. Future Goal Value
  const futureGoalValue = calculateFutureGoalValue(costToday, inflationRate, years);

  // 2. Future Value of Current Savings
  const futureSavingsValue = calculateFutureSavingsValue(currentSavings, annualReturn, years);

  // 3. Funding Gap
  const fundingGap = calculateFundingGap(futureGoalValue, futureSavingsValue);

  // Check Special Scenario: Existing savings cover or exceed future goal
  const isFullyFunded = futureSavingsValue >= futureGoalValue;

  let monthlyContribution = 0;
  let growthBreakdown = {
    totalContributions: 0,
    fvContributions: 0,
    projectedGrowth: 0
  };

  if (!isFullyFunded && fundingGap > 0) {
    // 4 & 5. Monthly Contribution
    monthlyContribution = calculateMonthlyContribution(fundingGap, annualReturn, years);

    // 6, 7 & 8. Total Contributions & Growth Breakdown
    growthBreakdown = calculateProjectedGrowth(monthlyContribution, annualReturn, years);
  }

  return {
    costToday,
    inflationRate,
    annualReturn,
    years,
    currentSavings,
    n,
    futureGoalValue,
    futureSavingsValue,
    fundingGap: isFullyFunded ? 0 : fundingGap,
    monthlyContribution,
    totalContributions: growthBreakdown.totalContributions,
    fvContributions: growthBreakdown.fvContributions,
    projectedGrowth: growthBreakdown.projectedGrowth,
    isFullyFunded
  };
}

/* ==========================================================================
   2. DOM Controller & UI Renderer
   ========================================================================= */

/**
 * Helper to escape HTML and prevent injection in user-entered goal names
 */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Updates all DOM elements across the results section, cards, visual comparison, and summary
 * @param {Object} results - Computed financial results
 * @param {Object} inputs - User inputs
 */
function renderResults(results, inputs) {
  const goalName = inputs.goalName.trim() || 'Goal';
  const yearsLabel = `${results.years} Yr${results.years > 1 ? 's' : ''}`;

  // 1. Header Scenario Badge
  const displayGoalBadge = document.getElementById('displayGoalBadge');
  if (displayGoalBadge) {
    displayGoalBadge.textContent = `${goalName} (${yearsLabel})`;
  }

  // 2. Prominent Monthly Contribution Card (Most Prominent Result)
  const monthlyContributionVal = document.getElementById('monthlyContributionVal');
  if (monthlyContributionVal) {
    monthlyContributionVal.textContent = formatCurrency(results.monthlyContribution);
  }

  const prominentSubtext = document.getElementById('prominentSubtext');
  if (prominentSubtext) {
    if (results.isFullyFunded || results.fundingGap <= 0) {
      prominentSubtext.textContent = 'Under these assumptions, your projected existing savings are enough to cover the estimated goal amount at the target date. No additional monthly contribution is estimated in this scenario.';
    } else {
      prominentSubtext.textContent = 'Illustrative estimate based on the assumptions entered.';
    }
  }

  const prominentAnnotation = document.getElementById('prominentAnnotation');
  if (prominentAnnotation) {
    prominentAnnotation.textContent = results.isFullyFunded ? 'Goal covered by projected savings' : 'Illustrative scenario estimate';
  }

  // 3. Core Metrics Grid
  // Metric 1: Future Goal Cost
  const futureGoalCostVal = document.getElementById('futureGoalCostVal');
  if (futureGoalCostVal) {
    futureGoalCostVal.textContent = formatCurrency(results.futureGoalValue);
  }
  const futureGoalCostExpl = document.getElementById('futureGoalCostExpl');
  if (futureGoalCostExpl) {
    if (results.inflationRate === 0) {
      futureGoalCostExpl.textContent = `Today's ${formatCurrency(results.costToday)} unchanged (0% inflation assumed over ${results.years} year${results.years > 1 ? 's' : ''}).`;
    } else {
      futureGoalCostExpl.textContent = `Today's ${formatCurrency(results.costToday)} adjusted for ${results.inflationRate}% annual inflation over ${results.years} year${results.years > 1 ? 's' : ''}.`;
    }
  }

  // Metric 2: Projected Savings
  const projectedSavingsVal = document.getElementById('projectedSavingsVal');
  if (projectedSavingsVal) {
    projectedSavingsVal.textContent = formatCurrency(results.futureSavingsValue);
  }
  const projectedSavingsExpl = document.getElementById('projectedSavingsExpl');
  if (projectedSavingsExpl) {
    if (results.currentSavings <= 0) {
      projectedSavingsExpl.textContent = 'No existing savings entered for this goal.';
    } else if (results.annualReturn === 0) {
      projectedSavingsExpl.textContent = `Existing ${formatCurrency(results.currentSavings)} with 0% return assumed over ${results.years} year${results.years > 1 ? 's' : ''}.`;
    } else {
      projectedSavingsExpl.textContent = `Existing ${formatCurrency(results.currentSavings)} with an illustrative projected value of ${formatCurrency(results.futureSavingsValue)} at an assumed ${results.annualReturn}% return over ${results.years} year${results.years > 1 ? 's' : ''}.`;
    }
  }

  // Metric 3: Funding Gap
  const fundingGapVal = document.getElementById('fundingGapVal');
  if (fundingGapVal) {
    fundingGapVal.textContent = formatCurrency(results.fundingGap);
  }
  const fundingGapExpl = document.getElementById('fundingGapExpl');
  if (fundingGapExpl) {
    fundingGapExpl.textContent = results.fundingGap > 0
      ? 'Target cost minus the projected future value of current savings.'
      : 'Target cost is fully covered by projected current savings under entered assumptions.';
  }

  // 4. Additional Scenario Details
  const totalContributionsVal = document.getElementById('totalContributionsVal');
  if (totalContributionsVal) {
    totalContributionsVal.textContent = formatCurrency(results.totalContributions);
  }
  const totalContributionsSubnote = document.getElementById('totalContributionsSubnote');
  if (totalContributionsSubnote) {
    if (results.isFullyFunded || results.fundingGap <= 0) {
      totalContributionsSubnote.textContent = '(No additional monthly contributions needed)';
    } else {
      totalContributionsSubnote.textContent = `(${results.n} monthly installments)`;
    }
  }
  const totalContributionsDesc = document.getElementById('totalContributionsDesc');
  if (totalContributionsDesc) {
    if (results.isFullyFunded || results.fundingGap <= 0) {
      totalContributionsDesc.textContent = 'Existing savings are projected to satisfy the goal without ongoing monthly contributions.';
    } else {
      totalContributionsDesc.textContent = `Total cumulative out-of-pocket amount contributed across ${results.years} year${results.years > 1 ? 's' : ''}.`;
    }
  }

  const projectedGrowthVal = document.getElementById('projectedGrowthVal');
  if (projectedGrowthVal) {
    projectedGrowthVal.textContent = formatCurrency(results.projectedGrowth);
  }
  const projectedGrowthSubnote = document.getElementById('projectedGrowthSubnote');
  if (projectedGrowthSubnote) {
    if (results.isFullyFunded || results.fundingGap <= 0) {
      projectedGrowthSubnote.textContent = '(Existing savings sufficient)';
    } else if (results.annualReturn <= 0) {
      projectedGrowthSubnote.textContent = '(No return assumed)';
    } else {
      projectedGrowthSubnote.textContent = '(From compounding)';
    }
  }
  const projectedGrowthDesc = document.getElementById('projectedGrowthDesc');
  if (projectedGrowthDesc) {
    projectedGrowthDesc.textContent = 'Illustrative projected growth based on the assumed return.';
  }

  // 5. Visual Comparison Component (3 Horizontal Comparison Bars)
  // Scale all bars relative to the largest value in this scenario
  const maxVal = Math.max(results.futureGoalValue, results.futureSavingsValue, results.fundingGap, 1);
  const costPct = (results.futureGoalValue / maxVal) * 100;
  const savingsPct = (results.futureSavingsValue / maxVal) * 100;
  const gapPct = (results.fundingGap / maxVal) * 100;

  // Bar 1: Estimated Goal Cost at Target Date
  const vizCostCompact = document.getElementById('vizCostCompact');
  if (vizCostCompact) vizCostCompact.textContent = formatCompactLakh(results.futureGoalValue);
  const vizCostPrecise = document.getElementById('vizCostPrecise');
  if (vizCostPrecise) vizCostPrecise.textContent = `(${formatCurrency(results.futureGoalValue)})`;
  const vizBarCost = document.getElementById('vizBarCost');
  if (vizBarCost) {
    vizBarCost.style.width = `${Math.min(100, Math.max(0, costPct))}%`;
  }
  const vizCostTrack = document.getElementById('vizCostTrack');
  if (vizCostTrack) {
    vizCostTrack.setAttribute('aria-valuenow', Math.round(results.futureGoalValue));
    vizCostTrack.setAttribute('aria-valuemax', Math.round(maxVal));
    vizCostTrack.setAttribute('aria-valuetext', formatCurrency(results.futureGoalValue));
  }

  // Bar 2: Projected Future Value of Current Savings
  const vizSavingsCompact = document.getElementById('vizSavingsCompact');
  if (vizSavingsCompact) vizSavingsCompact.textContent = formatCompactLakh(results.futureSavingsValue);
  const vizSavingsPrecise = document.getElementById('vizSavingsPrecise');
  if (vizSavingsPrecise) vizSavingsPrecise.textContent = `(${formatCurrency(results.futureSavingsValue)})`;
  const vizBarSavings = document.getElementById('vizBarSavings');
  if (vizBarSavings) {
    vizBarSavings.style.width = `${Math.min(100, Math.max(0, savingsPct))}%`;
  }
  const vizSavingsTrack = document.getElementById('vizSavingsTrack');
  if (vizSavingsTrack) {
    vizSavingsTrack.setAttribute('aria-valuenow', Math.round(results.futureSavingsValue));
    vizSavingsTrack.setAttribute('aria-valuemax', Math.round(maxVal));
    vizSavingsTrack.setAttribute('aria-valuetext', formatCurrency(results.futureSavingsValue));
  }

  // Bar 3: Estimated Funding Gap
  const vizGapCompact = document.getElementById('vizGapCompact');
  if (vizGapCompact) vizGapCompact.textContent = formatCompactLakh(results.fundingGap);
  const vizGapPrecise = document.getElementById('vizGapPrecise');
  if (vizGapPrecise) vizGapPrecise.textContent = `(${formatCurrency(results.fundingGap)})`;
  const vizBarGap = document.getElementById('vizBarGap');
  if (vizBarGap) {
    vizBarGap.style.width = `${Math.min(100, Math.max(0, gapPct))}%`;
  }
  const vizGapTrack = document.getElementById('vizGapTrack');
  if (vizGapTrack) {
    vizGapTrack.setAttribute('aria-valuenow', Math.round(results.fundingGap));
    vizGapTrack.setAttribute('aria-valuemax', Math.round(maxVal));
    vizGapTrack.setAttribute('aria-valuetext', formatCurrency(results.fundingGap));
  }

  // 6. Plain-Language Summary ("What this scenario means")
  const summaryPara1 = document.getElementById('summaryPara1');
  if (summaryPara1) {
    if (results.inflationRate === 0) {
      summaryPara1.innerHTML = `Your <strong>${escapeHTML(goalName)}</strong> is estimated to cost approximately <strong>${formatLakhWords(results.futureGoalValue)}</strong> at the goal date assuming <strong>0% annual inflation</strong>.`;
    } else {
      summaryPara1.innerHTML = `Your <strong>${escapeHTML(goalName)}</strong> could cost approximately <strong>${formatLakhWords(results.futureGoalValue)}</strong> at the goal date if inflation averages <strong>${results.inflationRate}% per year</strong>.`;
    }
  }

  const summaryPara2 = document.getElementById('summaryPara2');
  if (summaryPara2) {
    if (results.currentSavings <= 0) {
      summaryPara2.innerHTML = `You have no existing savings allocated toward this goal, meaning the entire estimated cost forms your funding requirement.`;
    } else if (results.annualReturn === 0) {
      summaryPara2.innerHTML = `Your existing <strong>${formatLakhWords(results.currentSavings)}</strong> remains unchanged at <strong>${formatLakhWords(results.futureSavingsValue)}</strong> under the assumed <strong>0% return</strong>.`;
    } else {
      summaryPara2.innerHTML = `Your existing <strong>${formatLakhWords(results.currentSavings)}</strong> has an illustrative projected value of approximately <strong>${formatLakhWords(results.futureSavingsValue)}</strong> under the assumed <strong>${results.annualReturn}% annual return</strong> based on the assumptions entered.`;
    }
  }

  const summaryPara3 = document.getElementById('summaryPara3');
  if (summaryPara3) {
    if (results.isFullyFunded || results.fundingGap <= 0) {
      summaryPara3.textContent = 'Under these assumptions, your projected existing savings are enough to cover the estimated goal amount at the target date. No additional monthly contribution is estimated in this scenario.';
    } else {
      summaryPara3.innerHTML = `That leaves an estimated funding gap of approximately <strong>${formatLakhWords(results.fundingGap)}</strong>. Under these assumptions, the illustrative monthly contribution is approximately <strong>${formatCurrency(results.monthlyContribution)}</strong>.`;
    }
  }

  const summaryPara4 = document.getElementById('summaryPara4');
  if (summaryPara4) {
    summaryPara4.textContent = 'These are scenario estimates for educational planning. Actual inflation, investment returns and future costs may differ.';
  }

  // 7. Screen Reader Live Announcement
  const statusMessage = document.getElementById('statusMessage');
  if (statusMessage) {
    if (results.isFullyFunded || results.fundingGap <= 0) {
      statusMessage.textContent = `Scenario updated. Existing savings are projected to fully cover your goal of ${formatCurrency(results.futureGoalValue)}. No additional monthly contribution is estimated in this scenario.`;
    } else {
      statusMessage.textContent = `Scenario updated. Estimated monthly contribution is ${formatCurrency(results.monthlyContribution)} for ${goalName}.`;
    }
  }
}

/* ==========================================================================
   3. Accessible Inline Error & Caution UI Helpers
   ========================================================================== */

/**
 * Creates accessible error message close to the field without relying only on red color
 * Uses an SVG alert icon, bold [Error] badge, aria-invalid, and aria-describedby
 */
function showFieldError(fieldId, errorMsg) {
  const inputEl = document.getElementById(fieldId);
  if (!inputEl) return;

  const formGroup = inputEl.closest('.form-group');
  if (!formGroup) return;

  // Clear any existing error first
  clearFieldError(fieldId);

  formGroup.classList.add('has-error');
  inputEl.setAttribute('aria-invalid', 'true');

  const errorEl = document.createElement('div');
  errorEl.id = `${fieldId}-error`;
  errorEl.className = 'input-error-msg';
  errorEl.setAttribute('role', 'alert');
  errorEl.setAttribute('aria-live', 'assertive');

  errorEl.innerHTML = `
    <svg class="error-icon" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="10" cy="10" r="9"></circle>
      <line x1="10" y1="6" x2="10" y2="11"></line>
      <line x1="10" y1="14" x2="10.01" y2="14"></line>
    </svg>
    <span class="error-badge" aria-hidden="true">Error</span>
    <span class="error-text">${escapeHTML(errorMsg)}</span>
  `;

  // Update aria-describedby
  const currentDescribedBy = inputEl.getAttribute('aria-describedby') || '';
  const describedIds = currentDescribedBy.split(/\s+/).filter(Boolean);
  if (!describedIds.includes(errorEl.id)) {
    describedIds.push(errorEl.id);
  }
  inputEl.setAttribute('aria-describedby', describedIds.join(' '));

  formGroup.appendChild(errorEl);
}

/**
 * Clears error state for a specific field and cleans up aria attributes
 */
function clearFieldError(fieldId) {
  const inputEl = document.getElementById(fieldId);
  if (!inputEl) return;

  const formGroup = inputEl.closest('.form-group');
  if (formGroup) {
    formGroup.classList.remove('has-error');
    const existingErr = formGroup.querySelector(`#${fieldId}-error`);
    if (existingErr) existingErr.remove();
  }

  inputEl.removeAttribute('aria-invalid');

  const currentDescribedBy = inputEl.getAttribute('aria-describedby') || '';
  const describedIds = currentDescribedBy.split(/\s+/).filter(id => id && id !== `${fieldId}-error`);
  if (describedIds.length > 0) {
    inputEl.setAttribute('aria-describedby', describedIds.join(' '));
  } else {
    inputEl.removeAttribute('aria-describedby');
  }
}

/**
 * Displays an educational caution for unusually high but technically valid values
 * Uses role="status" and aria-live="polite" so it is announced without interrupting navigation
 */
function showFieldCaution(fieldId, cautionMsg) {
  const inputEl = document.getElementById(fieldId);
  if (!inputEl) return;

  const formGroup = inputEl.closest('.form-group');
  if (!formGroup) return;

  // Clear existing caution first
  clearFieldCaution(fieldId);

  formGroup.classList.add('has-caution');

  const cautionEl = document.createElement('div');
  cautionEl.id = `${fieldId}-caution`;
  cautionEl.className = 'input-caution-msg';
  cautionEl.setAttribute('role', 'status');
  cautionEl.setAttribute('aria-live', 'polite');

  cautionEl.innerHTML = `
    <svg class="caution-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
    <span class="caution-badge" aria-hidden="true">Caution</span>
    <span class="caution-text">${escapeHTML(cautionMsg)}</span>
  `;

  const currentDescribedBy = inputEl.getAttribute('aria-describedby') || '';
  const describedIds = currentDescribedBy.split(/\s+/).filter(Boolean);
  if (!describedIds.includes(cautionEl.id)) {
    describedIds.push(cautionEl.id);
  }
  inputEl.setAttribute('aria-describedby', describedIds.join(' '));

  formGroup.appendChild(cautionEl);
}

/**
 * Clears caution message for a specific field
 */
function clearFieldCaution(fieldId) {
  const inputEl = document.getElementById(fieldId);
  if (!inputEl) return;

  const formGroup = inputEl.closest('.form-group');
  if (formGroup) {
    formGroup.classList.remove('has-caution');
    const existingCaution = formGroup.querySelector(`#${fieldId}-caution`);
    if (existingCaution) existingCaution.remove();
  }

  const currentDescribedBy = inputEl.getAttribute('aria-describedby') || '';
  const describedIds = currentDescribedBy.split(/\s+/).filter(id => id && id !== `${fieldId}-caution`);
  if (describedIds.length > 0) {
    inputEl.setAttribute('aria-describedby', describedIds.join(' '));
  } else {
    inputEl.removeAttribute('aria-describedby');
  }
}

/* ==========================================================================
   4. Comprehensive Input Validation & Edge-Case Controller
   ========================================================================== */

/**
 * Validates a single field according to strict specification rules.
 * Handles both blocking errors and educational cautions.
 * @param {string} fieldId
 * @param {boolean} showUi - Whether to trigger inline DOM updates
 * @returns {{ isValid: boolean, value: any, error: string|null, caution: string|null }}
 */
function validateField(fieldId, showUi = true) {
  const inputEl = document.getElementById(fieldId);
  if (!inputEl) return { isValid: true, value: null, error: null, caution: null };

  const raw = inputEl.value;
  const trimmed = raw.trim();

  let error = null;
  let caution = null;
  let value = null;

  switch (fieldId) {
    case 'goalName': {
      if (trimmed === '') {
        error = 'Please enter a goal name.';
      } else {
        value = trimmed;
      }
      break;
    }

    case 'goalCostToday': {
      if (trimmed === '') {
        error = 'Enter a goal amount greater than ₹0.';
      } else {
        const num = parseFloat(trimmed);
        if (isNaN(num) || num <= 0 || !isFinite(num)) {
          error = 'Enter a goal amount greater than ₹0.';
        } else {
          value = num;
        }
      }
      break;
    }

    case 'targetYears': {
      if (trimmed === '') {
        error = 'Enter a planning timeline between 1 and 100 years.';
      } else {
        const num = parseFloat(trimmed);
        if (isNaN(num) || num <= 0 || num > 100 || !isFinite(num)) {
          error = 'Enter a planning timeline between 1 and 100 years.';
        } else {
          value = num;
        }
      }
      break;
    }

    case 'inflationRate': {
      if (trimmed === '') {
        error = 'Enter an annual inflation rate between 0% and 50%.';
      } else {
        const num = parseFloat(trimmed);
        if (isNaN(num) || num < 0 || num > 50 || !isFinite(num)) {
          error = 'Enter an annual inflation rate between 0% and 50%.';
        } else {
          value = num;
          // Contextual educational caution for high inflation
          if (num > CAUTION_THRESHOLDS.inflationRate && num <= 50) {
            caution = 'That is a high inflation assumption. Consider checking the value.';
          }
        }
      }
      break;
    }

    case 'investmentReturn': {
      if (trimmed === '') {
        error = 'Enter an assumed return rate between 0% and 100%.';
      } else {
        const num = parseFloat(trimmed);
        if (isNaN(num) || num < 0 || num > 100 || !isFinite(num)) {
          error = 'Enter an assumed return rate between 0% and 100%.';
        } else {
          value = num;
          // Contextual educational caution for high return assumption
          if (num > CAUTION_THRESHOLDS.investmentReturn && num <= 100) {
            caution = 'That is a high return assumption. Actual investment outcomes can vary significantly.';
          }
        }
      }
      break;
    }

    case 'currentSavings': {
      if (trimmed === '') {
        error = 'Enter a current savings amount of ₹0 or greater.';
      } else {
        const num = parseFloat(trimmed);
        if (isNaN(num) || num < 0 || !isFinite(num)) {
          error = 'Enter a current savings amount of ₹0 or greater.';
        } else {
          value = num;
        }
      }
      break;
    }
  }

  // Update inline UI elements if requested
  if (showUi) {
    if (error) {
      clearFieldCaution(fieldId);
      showFieldError(fieldId, error);
    } else {
      clearFieldError(fieldId);
      if (caution) {
        showFieldCaution(fieldId, caution);
      } else {
        clearFieldCaution(fieldId);
      }
    }
  }

  return {
    isValid: error === null,
    value,
    error,
    caution
  };
}

/**
 * Validates all form inputs and returns clean sanitized values
 * @returns {{ isValid: boolean, values: Object|null, errors: Object }}
 */
function validateInputs() {
  const fields = ['goalName', 'goalCostToday', 'targetYears', 'inflationRate', 'investmentReturn', 'currentSavings'];
  const errors = {};
  const values = {};
  let firstInvalidEl = null;

  fields.forEach(fieldId => {
    const res = validateField(fieldId, true);
    if (!res.isValid) {
      errors[fieldId] = res.error;
      if (!firstInvalidEl) {
        firstInvalidEl = document.getElementById(fieldId);
      }
    } else {
      values[fieldId] = res.value;
    }
  });

  const errorCount = Object.keys(errors).length;
  if (errorCount > 0) {
    // Focus the first invalid field for keyboard & screen-reader users
    if (firstInvalidEl) {
      firstInvalidEl.focus();
    }

    const statusMessage = document.getElementById('statusMessage');
    if (statusMessage) {
      statusMessage.textContent = `Form has ${errorCount} error${errorCount > 1 ? 's' : ''}. Please review the highlighted fields to calculate.`;
    }

    return { isValid: false, values: null, errors };
  }

  return {
    isValid: true,
    values: {
      goalName: values.goalName,
      costToday: values.goalCostToday,
      years: values.targetYears,
      inflationRate: values.inflationRate,
      annualReturn: values.investmentReturn,
      currentSavings: values.currentSavings
    },
    errors: {}
  };
}

/**
 * Reads inputs, validates, calculates, and renders results
 * Prevents calculation until all required errors are resolved
 */
function handleCalculate(shouldScroll = false) {
  const validation = validateInputs();
  if (!validation.isValid) {
    return;
  }

  const results = calculateScenario(validation.values);
  renderResults(results, validation.values);

  // Smooth scroll on mobile if triggered by button tap
  if (shouldScroll && window.innerWidth < 1024) {
    const resultsColumn = document.querySelector('.scenario-results-column');
    if (resultsColumn) {
      resultsColumn.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

/**
 * Resets the scenario builder to original demonstration values and recalculates
 */
function handleReset() {
  const fields = ['goalName', 'goalCostToday', 'targetYears', 'inflationRate', 'investmentReturn', 'currentSavings'];
  
  // Clear all error & caution indicators
  fields.forEach(fieldId => {
    clearFieldError(fieldId);
    clearFieldCaution(fieldId);
  });

  // Restore demonstration values
  document.getElementById('goalName').value = DEFAULTS.goalName;
  document.getElementById('goalCostToday').value = DEFAULTS.goalCostToday;
  document.getElementById('targetYears').value = DEFAULTS.targetYears;
  document.getElementById('inflationRate').value = DEFAULTS.inflationRate;
  document.getElementById('investmentReturn').value = DEFAULTS.investmentReturn;
  document.getElementById('currentSavings').value = DEFAULTS.currentSavings;

  // Restore Goal Library selection to Higher Education Fund in Education & Career
  currentActiveCategory = 'education-career';
  currentSelectedGoalId = 'higher-education';
  renderGoalLibrary(currentActiveCategory, currentSelectedGoalId);

  // Update live header badge
  const displayGoalBadge = document.getElementById('displayGoalBadge');
  if (displayGoalBadge) {
    displayGoalBadge.textContent = `${DEFAULTS.goalName} (${DEFAULTS.targetYears} Yrs)`;
  }

  // Calculate and re-render demonstration scenario
  const defaultValues = {
    goalName: DEFAULTS.goalName,
    costToday: DEFAULTS.goalCostToday,
    years: DEFAULTS.targetYears,
    inflationRate: DEFAULTS.inflationRate,
    annualReturn: DEFAULTS.investmentReturn,
    currentSavings: DEFAULTS.currentSavings
  };

  const results = calculateScenario(defaultValues);
  renderResults(results, defaultValues);

  const statusMessage = document.getElementById('statusMessage');
  if (statusMessage) {
    statusMessage.textContent = 'Scenario has been reset to the original demonstration values.';
  }
}

/* ==========================================================================
   5. Initialization & Event Wiring
   ========================================================================== */

function initGoalBridge() {
  if (typeof document === 'undefined') return;

  const scenarioForm = document.getElementById('scenarioForm');
  const calculateBtn = document.getElementById('calculateBtn');
  const resetBtn = document.getElementById('resetBtn');
  const goalNameInput = document.getElementById('goalName');
  const targetYearsInput = document.getElementById('targetYears');
  const displayGoalBadge = document.getElementById('displayGoalBadge');

  const fields = ['goalName', 'goalCostToday', 'targetYears', 'inflationRate', 'investmentReturn', 'currentSavings'];

  // Initialize Goal Library rendering
  renderGoalLibrary(currentActiveCategory, currentSelectedGoalId);

  // Prevent form submission reload and run calculation
  if (scenarioForm) {
    scenarioForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleCalculate(true);
    });
  }

  // Calculate Button
  if (calculateBtn) {
    calculateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      calculateBtn.classList.add('btn-active-click');
      setTimeout(() => calculateBtn.classList.remove('btn-active-click'), 200);
      handleCalculate(true);
    });
  }

  // Reset Button
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleReset();
    });
  }

  // Live Scenario Header Badge Update on typing
  function updateLiveBadge() {
    const name = goalNameInput ? goalNameInput.value.trim() || 'Custom Goal' : 'Custom Goal';
    const years = targetYearsInput ? targetYearsInput.value || 0 : 0;
    if (displayGoalBadge) {
      displayGoalBadge.textContent = `${name} (${years} Yrs)`;
    }
  }

  if (goalNameInput) {
    goalNameInput.addEventListener('input', updateLiveBadge);
  }
  if (targetYearsInput) {
    targetYearsInput.addEventListener('input', updateLiveBadge);
  }

  // Real-time Field Listeners for inline validation & caution feedback
  fields.forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (!el) return;

    // Real-time re-evaluation on input
    el.addEventListener('input', () => {
      const formGroup = el.closest('.form-group');
      if (formGroup && formGroup.classList.contains('has-error')) {
        validateField(fieldId, true);
      } else if (fieldId === 'inflationRate' || fieldId === 'investmentReturn') {
        validateField(fieldId, true);
      }
    });

    // Validate on blur to provide immediate inline feedback after leaving a field
    el.addEventListener('blur', () => {
      validateField(fieldId, true);
    });
  });

  // Initial calculation run on page load to dynamically compute demonstration results
  handleCalculate(false);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGoalBridge);
  } else {
    initGoalBridge();
  }
}

/* ==========================================================================
   6. Universal Environment Exports (Browser, Node.js, Jest, Headless Runners)
   ========================================================================== */

const EXPORTS = {
  DEFAULTS,
  CAUTION_THRESHOLDS,
  GOAL_LIBRARY,
  findGoalById,
  renderGoalLibrary,
  selectGoal,
  calculateFutureGoalValue,
  calculateFutureSavingsValue,
  calculateFundingGap,
  calculateMonthlyContribution,
  calculateProjectedGrowth,
  calculateScenario,
  formatCurrency,
  formatCompactLakh,
  formatLakhWords,
  validateField,
  validateInputs,
  handleCalculate,
  handleReset
};

// Export to globalThis / window for browser and test runners
if (typeof globalThis !== 'undefined') {
  Object.assign(globalThis, EXPORTS);
}
if (typeof window !== 'undefined') {
  Object.assign(window, EXPORTS);
}
// Export for Node.js / CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EXPORTS;
}
