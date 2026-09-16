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

let currentActiveCategory = 'financial-foundation';
let currentSelectedGoalId = null;

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
 * 9. Calculate Optional Step-up Contribution
 * Solves for starting monthly contribution P such that FV of all contributions equals Funding Gap.
 * Contributions occur at end of each month.
 * In year y (0 to n-1): monthly contribution is P * (1 + g)^y.
 * 
 * For r > 0:
 *   Annuity factor = ((1 + r)^12 - 1) / r
 *   Contribution factor = sum_{y=0}^{n-1} [ (1 + g)^y * annuityFactor * (1 + r)^(12 * (n - y - 1)) ]
 *   Starting Monthly Contribution P = Funding Gap / Contribution Factor
 * 
 * For r = 0:
 *   Contribution factor = 12 * sum_{y=0}^{n-1} [ (1 + g)^y ]
 *   P = Funding Gap / Contribution Factor
 * 
 * When g = 0:
 *   Mathematically identical to calculateMonthlyContribution()
 * 
 * @param {number} fundingGap
 * @param {number} annualReturn
 * @param {number} years
 * @param {number} stepUpRate - Annual contribution increase percentage (e.g. 5 for 5%)
 * @returns {{
 *   startingMonthly: number,
 *   finalYearMonthly: number,
 *   stepUpRate: number,
 *   contributionFactor: number,
 *   totalContributions: number,
 *   fvContributions: number,
 *   projectedGrowth: number
 * }}
 */
function calculateStepUpContribution(fundingGap, annualReturn, years, stepUpRate = 0) {
  const g = Math.max(0, Number(stepUpRate) || 0) / 100;
  const n = Math.max(1, Math.round(Number(years) || 1));
  const gap = Math.max(0, Number(fundingGap) || 0);

  if (gap <= 0 || n <= 0) {
    return {
      startingMonthly: 0,
      finalYearMonthly: 0,
      stepUpRate: g * 100,
      contributionFactor: 0,
      totalContributions: 0,
      fvContributions: 0,
      projectedGrowth: 0
    };
  }

  const r = Math.max(0, Number(annualReturn) || 0) / 100 / 12; // monthly rate

  let contributionFactor = 0;

  if (r > 0) {
    const annuityFactor12 = (Math.pow(1 + r, 12) - 1) / r;

    for (let y = 0; y < n; y++) {
      const stepFactor = Math.pow(1 + g, y);
      const remainingCompounding = Math.pow(1 + r, 12 * (n - y - 1));
      contributionFactor += stepFactor * annuityFactor12 * remainingCompounding;
    }
  } else {
    // Zero return: linear sum of uncompounded contributions
    let sumStep = 0;
    for (let y = 0; y < n; y++) {
      sumStep += Math.pow(1 + g, y);
    }
    contributionFactor = 12 * sumStep;
  }

  if (contributionFactor <= 0 || !isFinite(contributionFactor)) {
    contributionFactor = 12 * n;
  }

  const startingMonthly = gap / contributionFactor;
  const safeStarting = isFinite(startingMonthly) && !isNaN(startingMonthly) ? Math.max(0, startingMonthly) : 0;
  const finalYearMonthly = safeStarting * Math.pow(1 + g, n - 1);

  // Total out-of-pocket cumulative contributions across all years
  let totalContributions = 0;
  for (let y = 0; y < n; y++) {
    totalContributions += safeStarting * Math.pow(1 + g, y) * 12;
  }

  const fvContributions = gap;
  const projectedGrowth = Math.max(0, fvContributions - totalContributions);

  return {
    startingMonthly: safeStarting,
    finalYearMonthly: isFinite(finalYearMonthly) ? finalYearMonthly : safeStarting,
    stepUpRate: g * 100,
    contributionFactor,
    totalContributions: Math.round(totalContributions),
    fvContributions,
    projectedGrowth: Math.round(projectedGrowth)
  };
}

/**
 * 10. Calculate Scenario Comparison (Conservative, Base, Optimistic)
 * Educational exploration of different inflation & return assumptions:
 * - Base: User's exact entered assumptions
 * - Conservative: +2 percentage points inflation, -2 percentage points return (clamped >= 0)
 * - Optimistic: -2 percentage points inflation (clamped >= 0), +2 percentage points return
 * Current savings and timeline are preserved across all 3 scenarios.
 * 
 * @param {Object} baseInputs - { costToday, years, inflationRate, annualReturn, currentSavings, stepUpRate, goalName }
 * @returns {{ conservative: Object, base: Object, optimistic: Object }}
 */
function calculateScenarioComparison(baseInputs) {
  const costToday = Number(baseInputs.costToday) || 0;
  const years = Math.max(1, Number(baseInputs.years) || 1);
  const currentSavings = Math.max(0, Number(baseInputs.currentSavings) || 0);
  const baseInflation = Math.max(0, Number(baseInputs.inflationRate) || 0);
  const baseReturn = Math.max(0, Number(baseInputs.annualReturn) || 0);
  const stepUpRate = Math.max(0, Number(baseInputs.stepUpRate) || 0);
  const goalName = baseInputs.goalName || 'Goal';

  // Conservative Scenario (+2% Inflation, -2% Return)
  const conservativeInflation = baseInflation + 2;
  const conservativeReturn = Math.max(0, baseReturn - 2);
  const conservative = calculateScenario({
    goalName,
    costToday,
    years,
    inflationRate: conservativeInflation,
    annualReturn: conservativeReturn,
    currentSavings,
    stepUpRate
  });

  // Base Scenario (User's assumptions)
  const base = calculateScenario({
    goalName,
    costToday,
    years,
    inflationRate: baseInflation,
    annualReturn: baseReturn,
    currentSavings,
    stepUpRate
  });

  // Optimistic Scenario (-2% Inflation, +2% Return)
  const optimisticInflation = Math.max(0, baseInflation - 2);
  const optimisticReturn = baseReturn + 2;
  const optimistic = calculateScenario({
    goalName,
    costToday,
    years,
    inflationRate: optimisticInflation,
    annualReturn: optimisticReturn,
    currentSavings,
    stepUpRate
  });

  return { conservative, base, optimistic };
}

/**
 * Escapes HTML characters to prevent XSS.
 * @param {string} str
 * @returns {string} Safe escaped string
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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
  const goalName = inputs.goalName || 'Goal';
  const costToday = Number(inputs.costToday) || 0;
  const inflationRate = Number(inputs.inflationRate) || 0;
  const annualReturn = Number(inputs.annualReturn) || 0;
  const years = Math.max(1, Number(inputs.years) || 1);
  const currentSavings = Math.max(0, Number(inputs.currentSavings) || 0);
  const stepUpRate = Math.max(0, Number(inputs.stepUpRate) || 0);
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
  let stepUpResult = {
    startingMonthly: 0,
    finalYearMonthly: 0,
    stepUpRate,
    totalContributions: 0,
    fvContributions: 0,
    projectedGrowth: 0
  };
  let growthBreakdown = {
    totalContributions: 0,
    fvContributions: 0,
    projectedGrowth: 0
  };

  if (!isFullyFunded && fundingGap > 0) {
    if (stepUpRate > 0) {
      stepUpResult = calculateStepUpContribution(fundingGap, annualReturn, years, stepUpRate);
      monthlyContribution = stepUpResult.startingMonthly;
      growthBreakdown = {
        totalContributions: stepUpResult.totalContributions,
        fvContributions: stepUpResult.fvContributions,
        projectedGrowth: stepUpResult.projectedGrowth
      };
    } else {
      // 4 & 5. Monthly Contribution
      monthlyContribution = calculateMonthlyContribution(fundingGap, annualReturn, years);

      // 6, 7 & 8. Total Contributions & Growth Breakdown
      growthBreakdown = calculateProjectedGrowth(monthlyContribution, annualReturn, years);
      stepUpResult = {
        startingMonthly: monthlyContribution,
        finalYearMonthly: monthlyContribution,
        stepUpRate: 0,
        totalContributions: growthBreakdown.totalContributions,
        fvContributions: growthBreakdown.fvContributions,
        projectedGrowth: growthBreakdown.projectedGrowth
      };
    }
  }

  return {
    goalName,
    costToday,
    inflationRate,
    annualReturn,
    years,
    currentSavings,
    stepUpRate,
    n,
    futureGoalValue,
    futureSavingsValue,
    fundingGap: isFullyFunded ? 0 : fundingGap,
    monthlyContribution,
    stepUpResult,
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

  const monthlyLabel = document.getElementById('monthly-contrib-label');
  const prominentTag = document.querySelector('.prominent-tag');
  const prominentSubtext = document.getElementById('prominentSubtext');

  if (results.stepUpRate > 0 && !results.isFullyFunded && results.fundingGap > 0) {
    if (monthlyLabel) monthlyLabel.textContent = 'Starting monthly contribution';
    if (prominentTag) prominentTag.textContent = `Step-up Option (${results.stepUpRate}% / yr)`;
    if (prominentSubtext) {
      prominentSubtext.textContent = `Starts at ${formatCurrency(results.monthlyContribution)}/month, increasing by ${results.stepUpRate}% annually to an estimated ${formatCurrency(results.stepUpResult.finalYearMonthly)}/month in the final year.`;
    }
  } else {
    if (monthlyLabel) monthlyLabel.textContent = 'Estimated monthly contribution';
    if (prominentTag) prominentTag.textContent = 'Primary Planning Output';
    if (prominentSubtext) {
      if (results.isFullyFunded || results.fundingGap <= 0) {
        prominentSubtext.textContent = 'Under these assumptions, your projected existing savings are enough to cover the estimated goal amount at the target date. No additional monthly contribution is estimated in this scenario.';
      } else {
        prominentSubtext.textContent = 'Illustrative estimate based on the assumptions entered.';
      }
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

  // 5. Update Scenario State & User Controls
  lastScenarioResults = results;
  lastValidatedInputs = inputs;

  const saveActionsBar = document.getElementById('scenarioSaveActionsBar');
  if (saveActionsBar) saveActionsBar.style.display = 'block';

  const saveBtnText = document.getElementById('saveScenarioBtnText');
  if (saveBtnText) {
    saveBtnText.textContent = editingScenarioId ? 'Update this scenario' : 'Save this scenario';
  }

  const createAltBtn = document.getElementById('createAlternateBtn');
  if (createAltBtn) {
    createAltBtn.style.display = savedScenarios.length > 0 ? 'inline-flex' : 'none';
  }

  // Render Saved Scenarios and User Scenario Comparison
  renderSavedScenariosUI();
  renderUserScenarioComparison();

  // 6. Accessible Dynamic Chart & Visual Comparison (Feature 3)
  renderAccessibleChart(results, savedScenarios, currentChartMode);

  // 7. Plain-Language Summary ("What this scenario means")
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
    } else if (results.stepUpRate > 0) {
      summaryPara3.innerHTML = `That leaves an estimated funding gap of approximately <strong>${formatLakhWords(results.fundingGap)}</strong>. With a <strong>${results.stepUpRate}% annual step-up</strong>, the starting monthly contribution is approximately <strong>${formatCurrency(results.monthlyContribution)}</strong>, reaching an estimated <strong>${formatCurrency(results.stepUpResult.finalYearMonthly)}</strong> per month in the final year.`;
    } else {
      summaryPara3.innerHTML = `That leaves an estimated funding gap of approximately <strong>${formatLakhWords(results.fundingGap)}</strong>. Under these assumptions, the illustrative monthly contribution is approximately <strong>${formatCurrency(results.monthlyContribution)}</strong>.`;
    }
  }

  const summaryPara4 = document.getElementById('summaryPara4');
  if (summaryPara4) {
    summaryPara4.textContent = 'These are scenario estimates for educational planning. Actual inflation, investment returns and future costs may differ.';
  }

  // 8. Screen Reader Live Announcement
  const statusMessage = document.getElementById('statusMessage');
  if (statusMessage) {
    if (results.isFullyFunded || results.fundingGap <= 0) {
      statusMessage.textContent = `Scenario updated. Existing savings are projected to fully cover your goal of ${formatCurrency(results.futureGoalValue)}. No additional monthly contribution is estimated in this scenario.`;
    } else if (results.stepUpRate > 0) {
      statusMessage.textContent = `Scenario updated. Starting monthly contribution is ${formatCurrency(results.monthlyContribution)} with a ${results.stepUpRate}% annual step-up for ${goalName}.`;
    } else {
      statusMessage.textContent = `Scenario updated. Estimated monthly contribution is ${formatCurrency(results.monthlyContribution)} for ${goalName}.`;
    }
  }

  // 9. Sync dedicated clean print report DOM
  populatePrintReport(results, inputs, savedScenarios);
}

/**
 * State variable for chart display mode: 'base' or 'compare'
 */
let currentChartMode = 'base';
let lastScenarioResults = null;
let lastValidatedInputs = null;

/* ==========================================================================
   User-Oriented Scenario Management & Storage (sessionStorage)
   ========================================================================== */

const SCENARIO_STORAGE_KEY = 'goalbridge_saved_scenarios';

let savedScenarios = [];
let editingScenarioId = null;
let alternateFromScenarioId = null;
let sessionScenarioCounter = 1;

/**
 * Loads saved scenarios from sessionStorage on initialization.
 * Ensures data survives ordinary browser reload during the session.
 */
function loadSavedScenariosFromSession() {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return;
  try {
    const raw = sessionStorage.getItem(SCENARIO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        savedScenarios = parsed.filter(item => item && item.id && item.inputs && item.outputs);
        let maxNum = 0;
        savedScenarios.forEach(sc => {
          const m = String(sc.name || '').match(/Scenario\s+(\d+)/i);
          if (m) {
            const num = parseInt(m[1], 10);
            if (num > maxNum) maxNum = num;
          }
        });
        sessionScenarioCounter = Math.max(maxNum + 1, savedScenarios.length + 1);
      }
    }
  } catch (err) {
    console.warn('GoalBridge: Could not load scenarios from sessionStorage', err);
    savedScenarios = [];
  }
}

/**
 * Saves current scenarios array to sessionStorage.
 */
function saveScenariosToSession() {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(SCENARIO_STORAGE_KEY, JSON.stringify(savedScenarios));
  } catch (err) {
    console.warn('GoalBridge: Could not save scenarios to sessionStorage', err);
  }
}

/**
 * Generates an auto-incremented scenario name: Scenario 1, Scenario 2, etc.
 */
function generateDefaultScenarioName() {
  let name = `Scenario ${sessionScenarioCounter}`;
  while (savedScenarios.some(s => s.name.toLowerCase() === name.toLowerCase())) {
    sessionScenarioCounter++;
    name = `Scenario ${sessionScenarioCounter}`;
  }
  return name;
}

/**
 * Handles saving the current scenario (creates new or updates if editing).
 * @param {string} customName - Optional name from user input
 */
function handleSaveScenario(customName) {
  if (!lastScenarioResults || !lastValidatedInputs) {
    const validation = validateInputs();
    if (!validation.isValid) {
      if (typeof alert !== 'undefined') alert('Please enter valid assumptions before saving a scenario.');
      return null;
    }
    lastScenarioResults = calculateScenario(validation.values);
    lastValidatedInputs = validation.values;
  }

  const trimmedName = typeof customName === 'string' ? customName.trim() : '';
  const finalName = trimmedName || generateDefaultScenarioName();

  let savedItem = null;

  if (editingScenarioId) {
    // Edit mode: update existing scenario
    const index = savedScenarios.findIndex(s => s.id === editingScenarioId);
    if (index !== -1) {
      savedScenarios[index] = {
        ...savedScenarios[index],
        name: finalName,
        inputs: { ...lastValidatedInputs },
        outputs: { ...lastScenarioResults },
        updatedAt: Date.now()
      };
      savedItem = savedScenarios[index];
    }
    editingScenarioId = null;
    hideScenarioEditBanner();
  } else {
    // Create new scenario
    const newScenario = {
      id: 'scenario-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      name: finalName,
      createdAt: Date.now(),
      inputs: { ...lastValidatedInputs },
      outputs: { ...lastScenarioResults }
    };
    savedScenarios.push(newScenario);
    sessionScenarioCounter++;
    savedItem = newScenario;
  }

  alternateFromScenarioId = null;
  saveScenariosToSession();

  // Close inline naming popover
  const inline = document.getElementById('saveScenarioInline');
  if (inline) inline.style.display = 'none';

  // Update save button text
  const saveBtnText = document.getElementById('saveScenarioBtnText');
  if (saveBtnText) saveBtnText.textContent = 'Save this scenario';

  // Make "+ Create alternate scenario" button visible
  const createAltBtn = document.getElementById('createAlternateBtn');
  if (createAltBtn) createAltBtn.style.display = 'inline-flex';

  // Update UI components
  renderSavedScenariosUI();
  renderUserScenarioComparison();
  renderAccessibleChart(lastScenarioResults, savedScenarios, currentChartMode);
  populatePrintReport(lastScenarioResults, lastValidatedInputs, savedScenarios);

  // Announce to screen readers
  const statusMessage = document.getElementById('statusMessage');
  if (statusMessage) {
    statusMessage.textContent = `Scenario '${finalName}' has been saved to this browser session.`;
  }

  return savedItem;
}

/**
 * Prepares the calculator to create an alternate scenario by cloning assumptions.
 * @param {string} scenarioId - Optional scenario ID to clone from
 */
function handleCreateAlternateScenario(scenarioId) {
  let sourceInputs = lastValidatedInputs;
  let sourceName = 'Current Scenario';

  if (scenarioId) {
    const sc = savedScenarios.find(s => s.id === scenarioId);
    if (sc) {
      sourceInputs = sc.inputs;
      sourceName = sc.name;
    }
  } else if (savedScenarios.length > 0 && (!sourceInputs || !sourceInputs.goalName)) {
    const lastSc = savedScenarios[savedScenarios.length - 1];
    sourceInputs = lastSc.inputs;
    sourceName = lastSc.name;
  }

  if (!sourceInputs) {
    return;
  }

  // Populate inputs into form
  populateFormInputs(sourceInputs);
  editingScenarioId = null;
  alternateFromScenarioId = scenarioId || 'active';

  // Show status banner
  showScenarioEditBanner(
    'Creating Alternate Scenario',
    `Copied assumptions from '${sourceName}'. Adjust your numbers below, then click Calculate & Save to add a new scenario.`
  );

  // Recalculate
  handleCalculate(false);

  // Scroll to form on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    const formSection = document.getElementById('scenario-builder');
    if (formSection) formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Focus on the inflation rate input for quick variation
  const inflationInput = document.getElementById('inflationRate');
  if (inflationInput) inflationInput.focus();
}

/**
 * Loads a saved scenario into the calculator for editing.
 * @param {string} scenarioId
 */
function handleEditScenario(scenarioId) {
  const sc = savedScenarios.find(s => s.id === scenarioId);
  if (!sc) return;

  populateFormInputs(sc.inputs);
  editingScenarioId = scenarioId;
  alternateFromScenarioId = null;

  showScenarioEditBanner(
    `Editing Scenario: ${sc.name}`,
    `Modify assumptions below, click Calculate, then click 'Update this scenario'.`
  );

  const saveBtnText = document.getElementById('saveScenarioBtnText');
  if (saveBtnText) saveBtnText.textContent = 'Update this scenario';

  // Automatically recalculate
  handleCalculate(false);

  // Focus on form
  if (typeof window !== 'undefined') {
    const formSection = document.getElementById('scenario-builder');
    if (formSection) formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Cancels editing or alternate scenario creation.
 */
function handleCancelScenarioEdit() {
  editingScenarioId = null;
  alternateFromScenarioId = null;
  hideScenarioEditBanner();

  const saveBtnText = document.getElementById('saveScenarioBtnText');
  if (saveBtnText) saveBtnText.textContent = 'Save this scenario';
}

/**
 * Duplicates a saved scenario.
 * @param {string} scenarioId
 */
function handleDuplicateScenario(scenarioId) {
  const original = savedScenarios.find(s => s.id === scenarioId);
  if (!original) return;

  const clone = {
    id: 'scenario-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
    name: `${original.name} (Copy)`,
    createdAt: Date.now(),
    inputs: JSON.parse(JSON.stringify(original.inputs)),
    outputs: JSON.parse(JSON.stringify(original.outputs))
  };

  savedScenarios.push(clone);
  saveScenariosToSession();

  renderSavedScenariosUI();
  renderUserScenarioComparison();
  if (lastScenarioResults) {
    renderAccessibleChart(lastScenarioResults, savedScenarios, currentChartMode);
    populatePrintReport(lastScenarioResults, lastValidatedInputs, savedScenarios);
  }

  const statusMessage = document.getElementById('statusMessage');
  if (statusMessage) {
    statusMessage.textContent = `Scenario '${original.name}' duplicated as '${clone.name}'.`;
  }

  return clone;
}

/**
 * Deletes a saved scenario.
 * @param {string} scenarioId
 */
function handleDeleteScenario(scenarioId) {
  const index = savedScenarios.findIndex(s => s.id === scenarioId);
  if (index === -1) return;

  const name = savedScenarios[index].name;
  if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
    const ok = window.confirm(`Delete scenario '${name}'?`);
    if (!ok) return;
  }

  savedScenarios.splice(index, 1);

  if (editingScenarioId === scenarioId) {
    handleCancelScenarioEdit();
  }

  saveScenariosToSession();

  renderSavedScenariosUI();
  renderUserScenarioComparison();
  if (lastScenarioResults) {
    renderAccessibleChart(lastScenarioResults, savedScenarios, currentChartMode);
    populatePrintReport(lastScenarioResults, lastValidatedInputs, savedScenarios);
  }

  const createAltBtn = document.getElementById('createAlternateBtn');
  if (createAltBtn) {
    createAltBtn.style.display = savedScenarios.length > 0 ? 'inline-flex' : 'none';
  }

  const statusMessage = document.getElementById('statusMessage');
  if (statusMessage) {
    statusMessage.textContent = `Scenario '${name}' deleted.`;
  }
}

/**
 * Helper to populate calculator form inputs from an inputs object.
 */
function populateFormInputs(inputs) {
  if (!inputs) return;
  const goalNameEl = document.getElementById('goalName');
  if (goalNameEl) goalNameEl.value = inputs.goalName || '';

  const costEl = document.getElementById('goalCostToday');
  if (costEl) costEl.value = inputs.goalCostToday || inputs.costToday || '';

  const yearsEl = document.getElementById('targetYears');
  if (yearsEl) yearsEl.value = inputs.targetYears || inputs.years || '';

  const infEl = document.getElementById('inflationRate');
  if (infEl) infEl.value = inputs.inflationRate !== undefined ? inputs.inflationRate : '';

  const retEl = document.getElementById('investmentReturn');
  if (retEl) retEl.value = inputs.investmentReturn !== undefined ? inputs.investmentReturn : (inputs.annualReturn !== undefined ? inputs.annualReturn : '');

  const savEl = document.getElementById('currentSavings');
  if (savEl) savEl.value = inputs.currentSavings !== undefined ? inputs.currentSavings : 0;

  const stepUpEl = document.getElementById('stepUpRate');
  const stepUpRate = Number(inputs.stepUpRate) || 0;
  if (stepUpEl) stepUpEl.value = stepUpRate;

  const stepUpDetails = document.getElementById('stepUpDetails');
  if (stepUpDetails) {
    stepUpDetails.open = stepUpRate > 0;
  }

  ['goalName', 'goalCostToday', 'targetYears', 'inflationRate', 'investmentReturn', 'currentSavings', 'stepUpRate'].forEach(id => {
    clearFieldError(id);
    clearFieldCaution(id);
  });
}

function showScenarioEditBanner(title, desc) {
  const banner = document.getElementById('scenarioEditBanner');
  const titleEl = document.getElementById('scenarioEditBannerTitle');
  const descEl = document.getElementById('scenarioEditBannerDesc');
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc;
  if (banner) banner.style.display = 'flex';
}

function hideScenarioEditBanner() {
  const banner = document.getElementById('scenarioEditBanner');
  if (banner) banner.style.display = 'none';
}

/**
 * Renders "Your saved scenarios" list container.
 */
function renderSavedScenariosUI() {
  if (typeof document === 'undefined') return;

  const listEl = document.getElementById('savedScenariosList');
  const countEl = document.getElementById('savedScenariosCount');

  if (countEl) {
    countEl.textContent = `${savedScenarios.length} saved`;
  }

  if (!listEl) return;

  if (savedScenarios.length === 0) {
    listEl.innerHTML = `
      <div class="saved-scenarios-empty">
        <div class="saved-scenarios-empty-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
        </div>
        <p class="saved-scenarios-empty-text">No scenarios saved yet</p>
        <p class="saved-scenarios-empty-hint">
          Calculate a plan above and click <strong>"Save this scenario"</strong>. You can save multiple scenarios with different inflation, return, or timeline assumptions and compare them side by side.
        </p>
      </div>
    `;
    return;
  }

  let html = '';
  savedScenarios.forEach((sc) => {
    const name = escapeHTML(sc.name);
    const goal = escapeHTML(sc.inputs.goalName || 'Goal');
    const years = sc.inputs.targetYears || sc.inputs.years || 0;
    const inf = sc.inputs.inflationRate || 0;
    const ret = sc.inputs.investmentReturn !== undefined ? sc.inputs.investmentReturn : (sc.inputs.annualReturn || 0);
    const sav = sc.inputs.currentSavings || 0;
    const stepUp = Number(sc.inputs.stepUpRate) || 0;

    const monthly = sc.outputs.monthlyContribution || 0;
    const fvGoal = sc.outputs.futureGoalValue || 0;

    html += `
      <article class="saved-scenario-item" data-id="${sc.id}">
        <div class="saved-scenario-item-header">
          <div class="saved-scenario-name-group">
            <h4 class="saved-scenario-item-name">${name}</h4>
            <span class="saved-scenario-tag">${goal} • ${years} Yr${years > 1 ? 's' : ''}</span>
            ${stepUp > 0 ? `<span class="saved-scenario-tag">Step-up: ${stepUp}%/yr</span>` : ''}
          </div>
          <div class="saved-scenario-actions" role="toolbar" aria-label="Actions for ${name}">
            <button type="button" class="btn-scenario-action btn-edit" data-id="${sc.id}" aria-label="Edit scenario: ${name}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              <span>Edit</span>
            </button>
            <button type="button" class="btn-scenario-action btn-duplicate" data-id="${sc.id}" aria-label="Duplicate scenario: ${name}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span>Duplicate</span>
            </button>
            <button type="button" class="btn-scenario-action btn-delete" data-id="${sc.id}" aria-label="Delete scenario: ${name}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div class="saved-scenario-grid">
          <div class="saved-scenario-cell">
            <span class="saved-scenario-cell-label">Inflation Assumption</span>
            <span class="saved-scenario-cell-val">${inf}% / yr</span>
          </div>
          <div class="saved-scenario-cell">
            <span class="saved-scenario-cell-label">Assumed Return</span>
            <span class="saved-scenario-cell-val">${ret}% / yr</span>
          </div>
          <div class="saved-scenario-cell">
            <span class="saved-scenario-cell-label">Current Savings</span>
            <span class="saved-scenario-cell-val">${formatCurrency(sav)}</span>
          </div>
          <div class="saved-scenario-cell">
            <span class="saved-scenario-cell-label">Estimated Goal Cost</span>
            <span class="saved-scenario-cell-val">${formatCurrency(fvGoal)}</span>
          </div>
        </div>

        <div class="saved-scenario-highlight-bar">
          <span class="saved-scenario-highlight-label">
            ${stepUp > 0 ? 'Starting Monthly Contribution' : 'Estimated Monthly Contribution'}
          </span>
          <span class="saved-scenario-highlight-val">
            ${formatCurrency(monthly)} <span style="font-size:0.75rem;font-weight:500;">/ month</span>
          </span>
        </div>
      </article>
    `;
  });

  listEl.innerHTML = html;

  // Bind action buttons
  listEl.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => handleEditScenario(btn.getAttribute('data-id')));
  });
  listEl.querySelectorAll('.btn-duplicate').forEach(btn => {
    btn.addEventListener('click', () => handleDuplicateScenario(btn.getAttribute('data-id')));
  });
  listEl.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => handleDeleteScenario(btn.getAttribute('data-id')));
  });
}

/**
 * Renders the "Compare your scenarios" side-by-side comparison table & narrative.
 * Shown when 2 or more scenarios exist.
 */
function renderUserScenarioComparison() {
  if (typeof document === 'undefined') return;

  const card = document.getElementById('scenarioComparisonCard');
  const countBadge = document.getElementById('comparisonScenarioCountBadge');
  const contentEl = document.getElementById('comparisonContent');
  const narrativeEl = document.getElementById('comparisonNarrative');

  if (!card || !contentEl) return;

  if (savedScenarios.length < 2) {
    card.style.display = 'none';
    contentEl.innerHTML = '';
    if (narrativeEl) narrativeEl.innerHTML = '';
    return;
  }

  card.style.display = 'block';
  if (countBadge) {
    countBadge.textContent = `${savedScenarios.length} Scenarios`;
  }

  // Build comparison table
  let tableHtml = `
    <div class="user-comparison-table-wrap">
      <table class="user-comparison-table" aria-label="Side-by-side scenario comparison table">
        <thead>
          <tr>
            <th scope="col">Parameter</th>
            ${savedScenarios.map(s => `<th scope="col">${escapeHTML(s.name)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr class="row-section-header">
            <td colspan="${savedScenarios.length + 1}">Planning Assumptions</td>
          </tr>
          <tr>
            <td>Goal Name</td>
            ${savedScenarios.map(s => `<td>${escapeHTML(s.inputs.goalName || 'Goal')}</td>`).join('')}
          </tr>
          <tr>
            <td>Cost in Today's Money</td>
            ${savedScenarios.map(s => `<td>${formatCurrency(s.inputs.goalCostToday || s.inputs.costToday || 0)}</td>`).join('')}
          </tr>
          <tr>
            <td>Target Timeline</td>
            ${savedScenarios.map(s => `<td>${s.inputs.targetYears || s.inputs.years || 0} Years</td>`).join('')}
          </tr>
          <tr>
            <td>Expected Inflation</td>
            ${savedScenarios.map(s => `<td>${s.inputs.inflationRate || 0}%</td>`).join('')}
          </tr>
          <tr>
            <td>Assumed Annual Return</td>
            ${savedScenarios.map(s => `<td>${s.inputs.investmentReturn !== undefined ? s.inputs.investmentReturn : (s.inputs.annualReturn || 0)}%</td>`).join('')}
          </tr>
          <tr>
            <td>Current Savings Allocated</td>
            ${savedScenarios.map(s => `<td>${formatCurrency(s.inputs.currentSavings || 0)}</td>`).join('')}
          </tr>
          <tr>
            <td>Annual Step-up Rate</td>
            ${savedScenarios.map(s => `<td>${Number(s.inputs.stepUpRate) || 0}%</td>`).join('')}
          </tr>

          <tr class="row-section-header">
            <td colspan="${savedScenarios.length + 1}">Calculated Scenario Projections</td>
          </tr>
          <tr>
            <td>Future Goal Value</td>
            ${savedScenarios.map(s => `<td>${formatCurrency(s.outputs.futureGoalValue || 0)}</td>`).join('')}
          </tr>
          <tr>
            <td>Future Value of Current Savings</td>
            ${savedScenarios.map(s => `<td>${formatCurrency(s.outputs.futureSavingsValue || 0)}</td>`).join('')}
          </tr>
          <tr>
            <td>Estimated Funding Gap</td>
            ${savedScenarios.map(s => `<td>${formatCurrency(s.outputs.fundingGap || 0)}</td>`).join('')}
          </tr>
          <tr class="row-highlight">
            <td><strong>Estimated Monthly Contribution</strong></td>
            ${savedScenarios.map(s => `<td><strong>${formatCurrency(s.outputs.monthlyContribution || 0)} / mo</strong></td>`).join('')}
          </tr>
          <tr>
            <td>Total Projected Contributions</td>
            ${savedScenarios.map(s => `<td>${formatCurrency(s.outputs.totalContributions || 0)}</td>`).join('')}
          </tr>
          <tr>
            <td>Illustrative Projected Growth</td>
            ${savedScenarios.map(s => `<td>${formatCurrency(s.outputs.projectedGrowth || 0)}</td>`).join('')}
          </tr>
        </tbody>
      </table>
    </div>
  `;

  contentEl.innerHTML = tableHtml;

  // Neutral Plain-Language Narrative
  if (narrativeEl) {
    const bullets = savedScenarios.map(s => {
      const name = escapeHTML(s.name);
      const monthly = formatCurrency(s.outputs.monthlyContribution || 0);
      const inf = s.inputs.inflationRate || 0;
      const ret = s.inputs.investmentReturn !== undefined ? s.inputs.investmentReturn : (s.inputs.annualReturn || 0);
      return `<li><strong>${name}</strong> requires an estimated monthly contribution of <strong>${monthly}</strong> based on ${inf}% inflation and ${ret}% assumed return.</li>`;
    }).join('');

    narrativeEl.innerHTML = `
      <ul class="comparison-narrative-list">
        ${bullets}
        <li style="margin-top:0.4rem;color:var(--color-text-muted);font-style:italic;">
          Explore how changing your assumptions affects your illustrative contribution. These calculations are educational estimates based on entered parameters.
        </li>
      </ul>
    `;
  }
}

/**
 * Compatibility wrapper for legacy test / code paths.
 */
function renderScenarioComparison(scenarios, inputs) {
  // Legacy stub — user-facing scenario comparison is handled by renderUserScenarioComparison()
}

/**
 * Updates the accessible dynamic chart and comparison bars.
 * Supports Base Breakdown view and user Scenario Comparison view.
 */
function renderAccessibleChart(results, scenarios = savedScenarios, mode = currentChartMode) {
  if (typeof document === 'undefined') return;

  const vizAccessibleSummary = document.getElementById('vizAccessibleSummary');
  const baseTrackWrap = document.getElementById('vizTracksBase');
  const compareTrackWrap = document.getElementById('vizTracksCompare');
  const dynamicTracksContainer = document.getElementById('vizDynamicCompareTracks');

  if (mode === 'base' || !scenarios) {
    if (baseTrackWrap) baseTrackWrap.style.display = 'block';
    if (compareTrackWrap) compareTrackWrap.style.display = 'none';

    // Accessible Textual Summary
    if (vizAccessibleSummary) {
      if (!results || results.futureGoalValue === 0) {
        vizAccessibleSummary.textContent = 'Enter your assumptions and calculate to view the visual breakdown.';
      } else {
        vizAccessibleSummary.textContent = `Your estimated future goal cost is ${formatCurrency(results.futureGoalValue)}. Your projected current savings are ${formatCurrency(results.futureSavingsValue)}, leaving an estimated funding gap of ${formatCurrency(results.fundingGap)}.`;
      }
    }

    if (results) {
      const maxVal = Math.max(results.futureGoalValue, results.futureSavingsValue, results.fundingGap, 1);
      const costPct = (results.futureGoalValue / maxVal) * 100;
      const savingsPct = (results.futureSavingsValue / maxVal) * 100;
      const gapPct = (results.fundingGap / maxVal) * 100;

      // Bar 1: Goal Cost
      const vizCostCompact = document.getElementById('vizCostCompact');
      if (vizCostCompact) vizCostCompact.textContent = formatCompactLakh(results.futureGoalValue);
      const vizCostPrecise = document.getElementById('vizCostPrecise');
      if (vizCostPrecise) vizCostPrecise.textContent = `(${formatCurrency(results.futureGoalValue)})`;
      const vizBarCost = document.getElementById('vizBarCost');
      if (vizBarCost) vizBarCost.style.width = `${Math.min(100, Math.max(0, costPct))}%`;
      const vizCostTrack = document.getElementById('vizCostTrack');
      if (vizCostTrack) {
        vizCostTrack.setAttribute('aria-valuenow', Math.round(results.futureGoalValue));
        vizCostTrack.setAttribute('aria-valuemax', Math.round(maxVal));
        vizCostTrack.setAttribute('aria-valuetext', formatCurrency(results.futureGoalValue));
      }

      // Bar 2: Projected Savings
      const vizSavingsCompact = document.getElementById('vizSavingsCompact');
      if (vizSavingsCompact) vizSavingsCompact.textContent = formatCompactLakh(results.futureSavingsValue);
      const vizSavingsPrecise = document.getElementById('vizSavingsPrecise');
      if (vizSavingsPrecise) vizSavingsPrecise.textContent = `(${formatCurrency(results.futureSavingsValue)})`;
      const vizBarSavings = document.getElementById('vizBarSavings');
      if (vizBarSavings) vizBarSavings.style.width = `${Math.min(100, Math.max(0, savingsPct))}%`;
      const vizSavingsTrack = document.getElementById('vizSavingsTrack');
      if (vizSavingsTrack) {
        vizSavingsTrack.setAttribute('aria-valuenow', Math.round(results.futureSavingsValue));
        vizSavingsTrack.setAttribute('aria-valuemax', Math.round(maxVal));
        vizSavingsTrack.setAttribute('aria-valuetext', formatCurrency(results.futureSavingsValue));
      }

      // Bar 3: Funding Gap
      const vizGapCompact = document.getElementById('vizGapCompact');
      if (vizGapCompact) vizGapCompact.textContent = formatCompactLakh(results.fundingGap);
      const vizGapPrecise = document.getElementById('vizGapPrecise');
      if (vizGapPrecise) vizGapPrecise.textContent = `(${formatCurrency(results.fundingGap)})`;
      const vizBarGap = document.getElementById('vizBarGap');
      if (vizBarGap) vizBarGap.style.width = `${Math.min(100, Math.max(0, gapPct))}%`;
      const vizGapTrack = document.getElementById('vizGapTrack');
      if (vizGapTrack) {
        vizGapTrack.setAttribute('aria-valuenow', Math.round(results.fundingGap));
        vizGapTrack.setAttribute('aria-valuemax', Math.round(maxVal));
        vizGapTrack.setAttribute('aria-valuetext', formatCurrency(results.fundingGap));
      }
    }
  } else if (mode === 'compare') {
    if (baseTrackWrap) baseTrackWrap.style.display = 'none';
    if (compareTrackWrap) compareTrackWrap.style.display = 'block';

    const list = Array.isArray(scenarios) ? scenarios : savedScenarios;

    if (!list || list.length < 2) {
      if (vizAccessibleSummary) {
        vizAccessibleSummary.textContent = 'Save at least 2 scenarios to view a side-by-side visual comparison.';
      }
      if (dynamicTracksContainer) {
        dynamicTracksContainer.innerHTML = `
          <div style="padding: 1.25rem 1rem; text-align: center; color: var(--color-text-muted); font-size: 0.8125rem;">
            Save at least 2 scenarios to view visual comparison bars.
          </div>
        `;
      }
      return;
    }

    const maxMonthly = Math.max(...list.map(s => (s.outputs && s.outputs.monthlyContribution) || 0), 1);

    if (vizAccessibleSummary) {
      const summaries = list.map(s => `${s.name}: ${formatCurrency(s.outputs.monthlyContribution || 0)}/mo`).join(', ');
      vizAccessibleSummary.textContent = `User Scenario Comparison: ${summaries}.`;
    }

    if (dynamicTracksContainer) {
      let tracksHtml = '';
      list.forEach((sc, idx) => {
        const name = escapeHTML(sc.name);
        const monthly = (sc.outputs && sc.outputs.monthlyContribution) || 0;
        const pct = Math.min(100, Math.max(0, (monthly / maxMonthly) * 100));
        const colorClass = `color-variant-${idx % 6}`;

        tracksHtml += `
          <div class="comparison-row">
            <div class="comparison-label-row">
              <span class="comparison-label">
                <span class="comparison-bullet ${colorClass}" aria-hidden="true"></span>
                ${name}
              </span>
              <span class="comparison-values">
                <strong class="comparison-compact">${formatCompactLakh(monthly)}</strong>
                <span class="comparison-precise">(${formatCurrency(monthly)} / mo)</span>
              </span>
            </div>
            <div class="comparison-track" role="progressbar" aria-label="${name} monthly contribution" aria-valuemin="0" aria-valuemax="${Math.round(maxMonthly)}" aria-valuenow="${Math.round(monthly)}" aria-valuetext="${formatCurrency(monthly)}">
              <div class="comparison-bar-fill ${colorClass}" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
      });
      dynamicTracksContainer.innerHTML = tracksHtml;
    }
  }
}

/**
 * Switches the chart view mode between 'base' (breakdown) and 'compare' (scenario comparison).
 */
function switchChartMode(mode) {
  currentChartMode = mode;
  const baseBtn = document.getElementById('vizModeBase');
  const compareBtn = document.getElementById('vizModeCompare');
  if (baseBtn) {
    baseBtn.classList.toggle('is-active', mode === 'base');
    baseBtn.setAttribute('aria-selected', mode === 'base' ? 'true' : 'false');
  }
  if (compareBtn) {
    compareBtn.classList.toggle('is-active', mode === 'compare');
    compareBtn.setAttribute('aria-selected', mode === 'compare' ? 'true' : 'false');
  }

  const baseTrackWrap = document.getElementById('vizTracksBase');
  const compareTrackWrap = document.getElementById('vizTracksCompare');
  if (baseTrackWrap) baseTrackWrap.style.display = mode === 'base' ? 'block' : 'none';
  if (compareTrackWrap) compareTrackWrap.style.display = mode === 'compare' ? 'block' : 'none';

  renderAccessibleChart(lastScenarioResults, savedScenarios, currentChartMode);
}

/**
 * Populates the dedicated clean print report (#printReport) with calculated outputs.
 * Decouples the print document from the interactive web UI completely.
 * @param {Object|null} results - Calculated results from calculateScenario
 * @param {Object|null} inputs - Validated inputs object
 * @param {Array} scenarios - Array of user saved scenarios
 */
function populatePrintReport(results, inputs, scenarios = savedScenarios) {
  if (typeof document === 'undefined') return;

  const printReport = document.getElementById('printReport');
  if (!printReport) return;

  const printReportDate = document.getElementById('printReportDate');
  const printNeutralNotice = document.getElementById('printNeutralNotice');
  const printCalculatedContent = document.getElementById('printCalculatedContent');

  // Format local generation date
  if (printReportDate) {
    const now = new Date();
    printReportDate.textContent = `Date: ${now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  }

  // Handle neutral/empty state (no calculation or after reset)
  const hasValidCalculation = results && inputs && (results.futureGoalValue > 0 || (inputs.goalName && inputs.goalName.trim() !== ''));

  if (!hasValidCalculation) {
    if (printNeutralNotice) printNeutralNotice.style.display = 'block';
    if (printCalculatedContent) printCalculatedContent.style.display = 'none';
    return;
  }

  // Show calculated content, hide neutral notice
  if (printNeutralNotice) printNeutralNotice.style.display = 'none';
  if (printCalculatedContent) printCalculatedContent.style.display = 'block';

  // Section 2: YOUR GOAL
  const goalName = inputs.goalName ? inputs.goalName.trim() : 'Goal';
  const costToday = inputs.goalCostToday !== undefined ? inputs.goalCostToday : (inputs.costToday || 0);
  const years = inputs.targetYears !== undefined ? inputs.targetYears : (inputs.years || 0);
  const inflationRate = inputs.inflationRate !== undefined ? inputs.inflationRate : 0;
  const investmentReturn = inputs.investmentReturn !== undefined ? inputs.investmentReturn : (inputs.annualReturn !== undefined ? inputs.annualReturn : 0);
  const currentSavings = inputs.currentSavings !== undefined ? inputs.currentSavings : 0;
  const stepUpRate = Number(inputs.stepUpRate) || 0;

  const printGoalName = document.getElementById('printGoalName');
  if (printGoalName) printGoalName.textContent = goalName;

  const printGoalCostToday = document.getElementById('printGoalCostToday');
  if (printGoalCostToday) printGoalCostToday.textContent = formatCurrency(costToday);

  const printTargetYears = document.getElementById('printTargetYears');
  if (printTargetYears) printTargetYears.textContent = `${years} Year${years > 1 ? 's' : ''} (${years * 12} Months)`;

  const printInflationRate = document.getElementById('printInflationRate');
  if (printInflationRate) printInflationRate.textContent = `${inflationRate}% / year`;

  const printInvestmentReturn = document.getElementById('printInvestmentReturn');
  if (printInvestmentReturn) printInvestmentReturn.textContent = `${investmentReturn}% / year`;

  const printCurrentSavings = document.getElementById('printCurrentSavings');
  if (printCurrentSavings) printCurrentSavings.textContent = formatCurrency(currentSavings);

  // Section 3: PROJECTION AT GOAL DATE
  const printFutureGoalCost = document.getElementById('printFutureGoalCost');
  if (printFutureGoalCost) printFutureGoalCost.textContent = formatCurrency(results.futureGoalValue || 0);

  const printFutureSavings = document.getElementById('printFutureSavings');
  if (printFutureSavings) printFutureSavings.textContent = formatCurrency(results.futureSavingsValue || 0);

  const printFundingGap = document.getElementById('printFundingGap');
  if (printFundingGap) printFundingGap.textContent = formatCurrency(results.fundingGap || 0);

  // Section 4: ESTIMATED MONTHLY CONTRIBUTION
  const printMonthlyContribution = document.getElementById('printMonthlyContribution');
  if (printMonthlyContribution) {
    printMonthlyContribution.textContent = `${formatCurrency(results.monthlyContribution || 0)} / month`;
  }

  // Section 5: STEP-UP ASSUMPTION (Conditional)
  const printStepUpSection = document.getElementById('printStepUpSection');
  const printStepUpAssumptionNote = document.getElementById('printStepUpAssumptionNote');

  if (stepUpRate > 0) {
    if (printStepUpSection) printStepUpSection.style.display = 'block';
    if (printStepUpAssumptionNote) printStepUpAssumptionNote.style.display = 'list-item';

    const printStepUpRate = document.getElementById('printStepUpRate');
    if (printStepUpRate) printStepUpRate.textContent = `${stepUpRate}% / year`;

    const printStepUpStarting = document.getElementById('printStepUpStarting');
    if (printStepUpStarting) printStepUpStarting.textContent = `${formatCurrency(results.monthlyContribution || 0)} / month`;

    const printStepUpFinal = document.getElementById('printStepUpFinal');
    const finalYearVal = (results.stepUpResult && results.stepUpResult.finalYearMonthly !== undefined)
      ? results.stepUpResult.finalYearMonthly
      : (results.monthlyContribution || 0);
    if (printStepUpFinal) printStepUpFinal.textContent = `${formatCurrency(finalYearVal)} / month`;
  } else {
    if (printStepUpSection) printStepUpSection.style.display = 'none';
    if (printStepUpAssumptionNote) printStepUpAssumptionNote.style.display = 'none';
  }

  // Section 6: USER-CREATED SCENARIOS (Conditional)
  const printScenariosSection = document.getElementById('printScenariosSection');
  const printScenariosTitle = document.getElementById('printScenariosTitle');
  const printScenariosTableWrap = document.getElementById('printScenariosTableWrap');

  const scenarioList = Array.isArray(scenarios) ? scenarios : savedScenarios;

  if (printScenariosSection && printScenariosTableWrap) {
    if (scenarioList && scenarioList.length >= 2) {
      printScenariosSection.style.display = 'block';
      if (printScenariosTitle) printScenariosTitle.textContent = 'SCENARIO COMPARISON';

      let tableHtml = `
        <table class="print-scenario-table" aria-label="Print scenario comparison table">
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Assumptions (Inflation / Return / Savings)</th>
              <th>Future Goal Cost</th>
              <th>Future Value of Savings</th>
              <th>Funding Gap</th>
              <th>Monthly Contribution</th>
            </tr>
          </thead>
          <tbody>
      `;

      scenarioList.forEach(sc => {
        const scName = escapeHTML(sc.name);
        const scInf = sc.inputs.inflationRate || 0;
        const scRet = sc.inputs.investmentReturn !== undefined ? sc.inputs.investmentReturn : (sc.inputs.annualReturn || 0);
        const scSav = formatCurrency(sc.inputs.currentSavings || 0);
        const scCost = formatCurrency(sc.outputs.futureGoalValue || 0);
        const scFvSav = formatCurrency(sc.outputs.futureSavingsValue || 0);
        const scGap = formatCurrency(sc.outputs.fundingGap || 0);
        const scMo = formatCurrency(sc.outputs.monthlyContribution || 0);
        const scStepUp = Number(sc.inputs.stepUpRate) || 0;

        tableHtml += `
          <tr>
            <td class="text-bold">${scName}</td>
            <td>${scInf}% inf / ${scRet}% ret / ${scSav}${scStepUp > 0 ? ` / ${scStepUp}% step-up` : ''}</td>
            <td>${scCost}</td>
            <td>${scFvSav}</td>
            <td>${scGap}</td>
            <td class="text-highlight">${scMo} / mo</td>
          </tr>
        `;
      });

      tableHtml += `
          </tbody>
        </table>
      `;

      printScenariosTableWrap.innerHTML = tableHtml;
    } else if (scenarioList && scenarioList.length === 1) {
      printScenariosSection.style.display = 'block';
      if (printScenariosTitle) printScenariosTitle.textContent = 'SAVED SCENARIO DETAILS';

      const single = scenarioList[0];
      const scName = escapeHTML(single.name);
      const scInf = single.inputs.inflationRate || 0;
      const scRet = single.inputs.investmentReturn !== undefined ? single.inputs.investmentReturn : (single.inputs.annualReturn || 0);
      const scSav = formatCurrency(single.inputs.currentSavings || 0);
      const scCost = formatCurrency(single.outputs.futureGoalValue || 0);
      const scFvSav = formatCurrency(single.outputs.futureSavingsValue || 0);
      const scGap = formatCurrency(single.outputs.fundingGap || 0);
      const scMo = formatCurrency(single.outputs.monthlyContribution || 0);
      const scStepUp = Number(single.inputs.stepUpRate) || 0;

      printScenariosTableWrap.innerHTML = `
        <table class="print-scenario-table" aria-label="Saved scenario details table">
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Assumptions</th>
              <th>Future Goal Cost</th>
              <th>Future Value of Savings</th>
              <th>Funding Gap</th>
              <th>Monthly Contribution</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-bold">${scName}</td>
              <td>${scInf}% inf / ${scRet}% ret / ${scSav}${scStepUp > 0 ? ` / ${scStepUp}% step-up` : ''}</td>
              <td>${scCost}</td>
              <td>${scFvSav}</td>
              <td>${scGap}</td>
              <td class="text-highlight">${scMo} / mo</td>
            </tr>
          </tbody>
        </table>
      `;
    } else {
      printScenariosSection.style.display = 'none';
      printScenariosTableWrap.innerHTML = '';
    }
  }
}

/**
 * Triggers browser print dialog for a clean, print-friendly scenario summary report.
 * Ensures the dedicated #printReport container is freshly populated with current calculations.
 */
function handlePrintSummary() {
  populatePrintReport(lastScenarioResults, lastValidatedInputs, savedScenarios);
  window.print();
}

/**
 * Generates a clean client-side text report (goalbridge-summary.txt).
 * Zero server communication, zero tracking, entirely private in-browser.
 */
function handleDownloadSummary() {
  const dateStr = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  // Handle neutral/empty state (when invoked before calculation or after reset)
  if (!lastScenarioResults || !lastValidatedInputs || lastScenarioResults.futureGoalValue <= 0) {
    const neutralText = `================================================================================
                                   GOALBRIDGE
                     Goal Planning & Investment Illustration
                              Goal Planning Summary
================================================================================
Date: ${dateStr}

NOTICE: NO GOAL CALCULATION COMPLETED
--------------------------------------------------------------------------------
No active planning scenario has been calculated yet.
Please open GoalBridge in your web browser, select or enter your goal assumptions,
and click "Calculate My Scenario" to generate a complete personalized report.

================================================================================
GoalBridge • Educational Goal Planning Tool
Generated locally — no personal data is stored or transmitted.
================================================================================
`;
    downloadTextFile('goalbridge-summary.txt', neutralText);
    return;
  }

  const inputs = lastValidatedInputs;
  const results = lastScenarioResults;

  const goalName = inputs.goalName ? inputs.goalName.trim() : 'Goal';
  const costToday = inputs.goalCostToday !== undefined ? inputs.goalCostToday : (inputs.costToday || 0);
  const years = inputs.targetYears !== undefined ? inputs.targetYears : (inputs.years || 0);
  const inflationRate = inputs.inflationRate !== undefined ? inputs.inflationRate : 0;
  const annualReturn = inputs.investmentReturn !== undefined ? inputs.investmentReturn : (inputs.annualReturn !== undefined ? inputs.annualReturn : 0);
  const currentSavings = inputs.currentSavings !== undefined ? inputs.currentSavings : 0;
  const stepUpRate = Number(inputs.stepUpRate) || 0;

  let stepUpBlock = '';
  if (stepUpRate > 0) {
    const finalYearVal = (results.stepUpResult && results.stepUpResult.finalYearMonthly !== undefined)
      ? results.stepUpResult.finalYearMonthly
      : results.monthlyContribution;
    stepUpBlock = `
STEP-UP ASSUMPTION
--------------------------------------------------------------------------------
Annual Contribution Increase:      ${stepUpRate}% / year
Starting Monthly Contribution:     ${formatCurrency(results.monthlyContribution)} / month
Estimated Contribution in Final Year: ${formatCurrency(finalYearVal)} / month
`;
  }

  let scenariosBlock = '';
  if (savedScenarios.length >= 2) {
    let rows = savedScenarios.map(s => {
      const sName = s.name;
      const sInf = s.inputs.inflationRate || 0;
      const sRet = s.inputs.investmentReturn !== undefined ? s.inputs.investmentReturn : (s.inputs.annualReturn || 0);
      const sSav = formatCurrency(s.inputs.currentSavings || 0);
      const sCost = formatCurrency(s.outputs.futureGoalValue || 0);
      const sFvSav = formatCurrency(s.outputs.futureSavingsValue || 0);
      const sGap = formatCurrency(s.outputs.fundingGap || 0);
      const sMo = formatCurrency(s.outputs.monthlyContribution || 0);
      const sStep = Number(s.inputs.stepUpRate) || 0;

      return `• ${sName}:
    Assumptions:           ${sInf}% inflation, ${sRet}% return, ${sSav} savings${sStep > 0 ? `, ${sStep}% step-up` : ''}
    Future Goal Cost:      ${sCost}
    Future Value Savings:  ${sFvSav}
    Funding Gap:           ${sGap}
    Monthly Contribution:  ${sMo} / month`;
    }).join('\n\n');

    scenariosBlock = `
SCENARIO COMPARISON
--------------------------------------------------------------------------------
${rows}
`;
  } else if (savedScenarios.length === 1) {
    const s = savedScenarios[0];
    const sName = s.name;
    const sInf = s.inputs.inflationRate || 0;
    const sRet = s.inputs.investmentReturn !== undefined ? s.inputs.investmentReturn : (s.inputs.annualReturn || 0);
    const sSav = formatCurrency(s.inputs.currentSavings || 0);
    const sCost = formatCurrency(s.outputs.futureGoalValue || 0);
    const sFvSav = formatCurrency(s.outputs.futureSavingsValue || 0);
    const sGap = formatCurrency(s.outputs.fundingGap || 0);
    const sMo = formatCurrency(s.outputs.monthlyContribution || 0);

    scenariosBlock = `
SAVED SCENARIO DETAILS
--------------------------------------------------------------------------------
• ${sName}:
    Assumptions:           ${sInf}% inflation, ${sRet}% return, ${sSav} savings
    Future Goal Cost:      ${sCost}
    Future Value Savings:  ${sFvSav}
    Funding Gap:           ${sGap}
    Monthly Contribution:  ${sMo} / month
`;
  }

  let stepUpAssumptionsBullet = '';
  if (stepUpRate > 0) {
    stepUpAssumptionsBullet = `
• Step-up assumes the monthly contribution increases by the selected percentage
  once each year. This does not imply that income or affordability will increase.`;
  }

  const reportText = `================================================================================
                                   GOALBRIDGE
                     Goal Planning & Investment Illustration
                              Goal Planning Summary
================================================================================
Date: ${dateStr}

YOUR GOAL
--------------------------------------------------------------------------------
Goal Name:                         ${goalName}
Goal Amount Today:                 ${formatCurrency(costToday)}
Time Remaining:                    ${years} Year${years > 1 ? 's' : ''} (${years * 12} Months)
Inflation Assumption:              ${inflationRate}% / year
Expected Annual Investment Return: ${annualReturn}% / year
Current Savings:                   ${formatCurrency(currentSavings)}

PROJECTION AT GOAL DATE
--------------------------------------------------------------------------------
Estimated Cost at Goal Date:       ${formatCurrency(results.futureGoalValue)}
Future Value of Current Savings:   ${formatCurrency(results.futureSavingsValue)}
Estimated Funding Gap:             ${formatCurrency(results.fundingGap)}

ESTIMATED MONTHLY CONTRIBUTION
--------------------------------------------------------------------------------
Estimated Monthly Contribution:    ${formatCurrency(results.monthlyContribution)} / month
(Primary planning result based on assumptions entered. Educational illustration;
not investment advice or a guaranteed savings amount.)
${stepUpBlock}${scenariosBlock}
HOW THIS ESTIMATE IS CALCULATED
--------------------------------------------------------------------------------
• Future goal cost is estimated by growing today's goal cost using the inflation
  assumption entered by the user: Cost Today * (1 + Inflation)^Years.
• The future value of current savings is estimated using monthly compounding
  based on the assumed annual return: Current Savings * (1 + Return/12)^(Years * 12).
• The funding gap is the difference between the estimated future goal cost and
  the projected future value of current savings: max(0, Future Cost - Future Savings).
• The estimated monthly contribution is calculated using monthly compounding over
  the remaining months.

ASSUMPTIONS
--------------------------------------------------------------------------------
• Inflation is an assumption entered by the user.
• Investment return is an illustrative assumption and is not guaranteed.
• Actual inflation, investment returns and future costs may differ.
• Current savings are assumed to remain allocated to this goal.
• Monthly contributions are assumed to occur at the end of each month.
• Results are mathematical illustrations and not predictions.${stepUpAssumptionsBullet}

EDUCATIONAL DISCLAIMER
--------------------------------------------------------------------------------
This report is an educational illustration based on the assumptions entered
by the user. It is not investment, financial, tax or legal advice and does
not recommend any investment product or strategy. Actual results may differ.

================================================================================
GoalBridge • Educational Goal Planning Tool
Generated locally — no personal data is stored or transmitted.
================================================================================
`;

  downloadTextFile('goalbridge-summary.txt', reportText);
}

/**
 * Client-side helper to trigger file download in browser without server interaction.
 */
function downloadTextFile(filename, text) {
  if (typeof document === 'undefined') return;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Renders neutral/empty results state across the scenario dashboard.
 * Used on initial page load and when the Reset button is pressed.
 */
function renderNeutralState() {
  if (typeof document === 'undefined') return;

  lastScenarioResults = null;
  lastComparisonScenarios = null;
  lastValidatedInputs = null;
  currentChartMode = 'base';

  const displayGoalBadge = document.getElementById('displayGoalBadge');
  if (displayGoalBadge) displayGoalBadge.textContent = 'No goal selected';

  const monthlyContributionVal = document.getElementById('monthlyContributionVal');
  if (monthlyContributionVal) monthlyContributionVal.textContent = '₹0';

  const monthlyLabel = document.getElementById('monthly-contrib-label');
  if (monthlyLabel) monthlyLabel.textContent = 'Estimated monthly contribution';

  const prominentTag = document.querySelector('.prominent-tag');
  if (prominentTag) prominentTag.textContent = 'Primary Planning Output';

  const prominentSubtext = document.getElementById('prominentSubtext');
  if (prominentSubtext) {
    prominentSubtext.textContent = 'Choose an illustrative goal or enter your assumptions to calculate your monthly contribution.';
  }

  const prominentAnnotation = document.getElementById('prominentAnnotation');
  if (prominentAnnotation) prominentAnnotation.textContent = 'Awaiting scenario';

  const futureGoalCostVal = document.getElementById('futureGoalCostVal');
  if (futureGoalCostVal) futureGoalCostVal.textContent = '₹0';

  const futureGoalCostExpl = document.getElementById('futureGoalCostExpl');
  if (futureGoalCostExpl) {
    futureGoalCostExpl.textContent = 'Future goal cost will appear here after entering assumptions.';
  }

  const projectedSavingsVal = document.getElementById('projectedSavingsVal');
  if (projectedSavingsVal) projectedSavingsVal.textContent = '₹0';

  const projectedSavingsExpl = document.getElementById('projectedSavingsExpl');
  if (projectedSavingsExpl) {
    projectedSavingsExpl.textContent = 'Projected future value of current savings will appear here.';
  }

  const fundingGapVal = document.getElementById('fundingGapVal');
  if (fundingGapVal) fundingGapVal.textContent = '₹0';

  const fundingGapExpl = document.getElementById('fundingGapExpl');
  if (fundingGapExpl) {
    fundingGapExpl.textContent = 'Remaining funding requirement after current savings.';
  }

  const totalContributionsVal = document.getElementById('totalContributionsVal');
  if (totalContributionsVal) totalContributionsVal.textContent = '₹0';

  const totalContributionsSubnote = document.getElementById('totalContributionsSubnote');
  if (totalContributionsSubnote) totalContributionsSubnote.textContent = '(0 monthly installments)';

  const totalContributionsDesc = document.getElementById('totalContributionsDesc');
  if (totalContributionsDesc) {
    totalContributionsDesc.textContent = 'Total cumulative out-of-pocket amount contributed.';
  }

  const projectedGrowthVal = document.getElementById('projectedGrowthVal');
  if (projectedGrowthVal) projectedGrowthVal.textContent = '₹0';

  const projectedGrowthSubnote = document.getElementById('projectedGrowthSubnote');
  if (projectedGrowthSubnote) projectedGrowthSubnote.textContent = '(From compounding)';

  const projectedGrowthDesc = document.getElementById('projectedGrowthDesc');
  if (projectedGrowthDesc) {
    projectedGrowthDesc.textContent = 'Illustrative projected growth based on the assumed return.';
  }

  // Reset Step-up input & disclosure
  const stepUpInput = document.getElementById('stepUpRate');
  if (stepUpInput) stepUpInput.value = '0';
  const stepUpDetails = document.getElementById('stepUpDetails');
  if (stepUpDetails) stepUpDetails.open = false;
  clearFieldError('stepUpRate');
  clearFieldCaution('stepUpRate');

  // Hide scenario save actions & inline dialog
  const saveActionsBar = document.getElementById('scenarioSaveActionsBar');
  if (saveActionsBar) saveActionsBar.style.display = 'none';
  const saveInline = document.getElementById('saveScenarioInline');
  if (saveInline) saveInline.style.display = 'none';

  // Reset Visual Comparison Bars to 0% and Base mode
  const baseBtn = document.getElementById('vizModeBase');
  const compareBtn = document.getElementById('vizModeCompare');
  if (baseBtn) {
    baseBtn.classList.add('is-active');
    baseBtn.setAttribute('aria-selected', 'true');
  }
  if (compareBtn) {
    compareBtn.classList.remove('is-active');
    compareBtn.setAttribute('aria-selected', 'false');
  }

  const baseTrackWrap = document.getElementById('vizTracksBase');
  const compareTrackWrap = document.getElementById('vizTracksCompare');
  if (baseTrackWrap) baseTrackWrap.style.display = 'block';
  if (compareTrackWrap) compareTrackWrap.style.display = 'none';

  const vizAccessibleSummary = document.getElementById('vizAccessibleSummary');
  if (vizAccessibleSummary) {
    vizAccessibleSummary.textContent = 'Enter your assumptions and calculate to view the visual breakdown.';
  }

  const vizCostCompact = document.getElementById('vizCostCompact');
  if (vizCostCompact) vizCostCompact.textContent = '₹0';
  const vizCostPrecise = document.getElementById('vizCostPrecise');
  if (vizCostPrecise) vizCostPrecise.textContent = '(₹0)';
  const vizBarCost = document.getElementById('vizBarCost');
  if (vizBarCost) vizBarCost.style.width = '0%';
  const vizCostTrack = document.getElementById('vizCostTrack');
  if (vizCostTrack) {
    vizCostTrack.setAttribute('aria-valuenow', '0');
    vizCostTrack.setAttribute('aria-valuemax', '100');
    vizCostTrack.setAttribute('aria-valuetext', '₹0');
  }

  const vizSavingsCompact = document.getElementById('vizSavingsCompact');
  if (vizSavingsCompact) vizSavingsCompact.textContent = '₹0';
  const vizSavingsPrecise = document.getElementById('vizSavingsPrecise');
  if (vizSavingsPrecise) vizSavingsPrecise.textContent = '(₹0)';
  const vizBarSavings = document.getElementById('vizBarSavings');
  if (vizBarSavings) vizBarSavings.style.width = '0%';
  const vizSavingsTrack = document.getElementById('vizSavingsTrack');
  if (vizSavingsTrack) {
    vizSavingsTrack.setAttribute('aria-valuenow', '0');
    vizSavingsTrack.setAttribute('aria-valuemax', '100');
    vizSavingsTrack.setAttribute('aria-valuetext', '₹0');
  }

  const vizGapCompact = document.getElementById('vizGapCompact');
  if (vizGapCompact) vizGapCompact.textContent = '₹0';
  const vizGapPrecise = document.getElementById('vizGapPrecise');
  if (vizGapPrecise) vizGapPrecise.textContent = '(₹0)';
  const vizBarGap = document.getElementById('vizBarGap');
  if (vizBarGap) vizBarGap.style.width = '0%';
  const vizGapTrack = document.getElementById('vizGapTrack');
  if (vizGapTrack) {
    vizGapTrack.setAttribute('aria-valuenow', '0');
    vizGapTrack.setAttribute('aria-valuemax', '100');
    vizGapTrack.setAttribute('aria-valuetext', '₹0');
  }

  // Clear dynamic comparison tracks container
  const dynamicTracksContainer = document.getElementById('vizDynamicCompareTracks');
  if (dynamicTracksContainer) {
    dynamicTracksContainer.innerHTML = '';
  }

  // Narrative summary reset
  const summaryPara1 = document.getElementById('summaryPara1');
  if (summaryPara1) {
    summaryPara1.textContent = 'Select an illustrative goal from the library above or enter your goal details to explore your scenario.';
  }
  const summaryPara2 = document.getElementById('summaryPara2');
  if (summaryPara2) summaryPara2.textContent = '';
  const summaryPara3 = document.getElementById('summaryPara3');
  if (summaryPara3) summaryPara3.textContent = '';
  const summaryPara4 = document.getElementById('summaryPara4');
  if (summaryPara4) {
    summaryPara4.textContent = 'These are scenario estimates for educational planning. Actual inflation, investment returns and future costs may differ.';
  }

  // Sync dedicated clean print report to neutral state
  populatePrintReport(null, null, []);
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

    case 'stepUpRate': {
      if (trimmed === '') {
        value = 0;
      } else {
        const num = parseFloat(trimmed);
        if (isNaN(num) || num < 0 || num > 50 || !isFinite(num)) {
          error = 'Enter an annual step-up rate between 0% and 50%.';
        } else {
          value = num;
          if (num > 20 && num <= 50) {
            caution = 'A step-up rate above 20% assumes your contributions will increase rapidly each year.';
          }
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

  // Validate optional step-up contribution (0% - 50%)
  const stepUpInput = document.getElementById('stepUpRate');
  if (stepUpInput) {
    const stepUpRes = validateField('stepUpRate', true);
    if (!stepUpRes.isValid) {
      errors['stepUpRate'] = stepUpRes.error;
      if (!firstInvalidEl) {
        firstInvalidEl = stepUpInput;
      }
    } else {
      values['stepUpRate'] = stepUpRes.value !== null && stepUpRes.value !== undefined ? stepUpRes.value : 0;
    }
  } else {
    values['stepUpRate'] = 0;
  }

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
      currentSavings: values.currentSavings,
      stepUpRate: values.stepUpRate || 0
    },
    errors: {}
  };
}

/**
 * Reads inputs, validates, calculates, and renders results
 * Prevents calculation until all required errors are resolved
 */
function handleCalculate(shouldScroll = false) {
  const goalNameEl = document.getElementById('goalName');
  const goalCostEl = document.getElementById('goalCostToday');
  const targetYearsEl = document.getElementById('targetYears');

  const nameVal = (goalNameEl?.value || '').trim();
  const costVal = (goalCostEl?.value || '').trim();
  const yearsVal = (targetYearsEl?.value || '').trim();

  const isBlankScenario = !nameVal && (!costVal || costVal === '0') && (!yearsVal || yearsVal === '0');

  const validation = validateInputs();
  if (!validation.isValid) {
    const statusMessage = document.getElementById('statusMessage');
    if (statusMessage) {
      if (isBlankScenario) {
        statusMessage.textContent = 'Please choose a goal or enter your goal details to see your scenario.';
      } else {
        const errorCount = Object.keys(validation.errors).length;
        statusMessage.textContent = `Form has ${errorCount} error${errorCount > 1 ? 's' : ''}. Please review the highlighted fields to calculate.`;
      }
    }

    const monthlyContributionVal = document.getElementById('monthlyContributionVal');
    if (monthlyContributionVal && monthlyContributionVal.textContent === '₹0') {
      const summaryPara1 = document.getElementById('summaryPara1');
      if (summaryPara1) {
        summaryPara1.textContent = 'Please choose a goal or enter your goal details to see your scenario.';
      }
    }
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
 * Resets the scenario builder to clean empty/zero state and clears results.
 * Does not restore demonstration values.
 */
function handleReset() {
  if (savedScenarios.length > 0) {
    const confirmed = (typeof window !== 'undefined' && typeof window.confirm === 'function')
      ? window.confirm('Reset will clear your current inputs and all saved scenarios for this session. Continue?')
      : true;
    if (!confirmed) return;
  }

  const fields = ['goalName', 'goalCostToday', 'targetYears', 'inflationRate', 'investmentReturn', 'currentSavings', 'stepUpRate'];
  
  // Clear all error & caution indicators
  fields.forEach(fieldId => {
    clearFieldError(fieldId);
    clearFieldCaution(fieldId);
  });

  // Clear all 6 inputs to blank / 0
  const goalNameEl = document.getElementById('goalName');
  if (goalNameEl) {
    goalNameEl.value = '';
    goalNameEl.placeholder = 'e.g., Higher Education Fund, Home Down Payment';
  }

  const costEl = document.getElementById('goalCostToday');
  if (costEl) costEl.value = '';

  const yearsEl = document.getElementById('targetYears');
  if (yearsEl) yearsEl.value = '';

  const infEl = document.getElementById('inflationRate');
  if (infEl) infEl.value = '';

  const retEl = document.getElementById('investmentReturn');
  if (retEl) retEl.value = '';

  const savEl = document.getElementById('currentSavings');
  if (savEl) savEl.value = '0';

  // Clear optional step-up
  const stepUpInput = document.getElementById('stepUpRate');
  if (stepUpInput) stepUpInput.value = '0';
  const stepUpDetails = document.getElementById('stepUpDetails');
  if (stepUpDetails) stepUpDetails.open = false;

  // Clear active scenario editing state
  editingScenarioId = null;
  alternateFromScenarioId = null;
  hideScenarioEditBanner();

  // Clear all saved scenarios from state and sessionStorage
  savedScenarios = [];
  sessionScenarioCounter = 1;
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(SCENARIO_STORAGE_KEY);
  }

  // Deselect any selected goal card in the library
  currentSelectedGoalId = null;
  renderGoalLibrary(currentActiveCategory, null);

  // Render neutral results state across all metric cards, comparison bars, badge and summary
  renderNeutralState();
  renderSavedScenariosUI();
  renderUserScenarioComparison();

  const statusMessage = document.getElementById('statusMessage');
  if (statusMessage) {
    statusMessage.textContent = 'Scenario builder and session scenarios have been reset.';
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

  const fields = ['goalName', 'goalCostToday', 'targetYears', 'inflationRate', 'investmentReturn', 'currentSavings', 'stepUpRate'];

  // Initialize Goal Library rendering (no card selected initially)
  renderGoalLibrary(currentActiveCategory, currentSelectedGoalId);

  // Load saved scenarios from sessionStorage
  loadSavedScenariosFromSession();
  renderSavedScenariosUI();
  if (savedScenarios.length >= 2) {
    renderUserScenarioComparison();
  }

  // Wire Scenario Action Buttons
  const saveScenarioBtn = document.getElementById('saveScenarioBtn');
  const createAlternateBtn = document.getElementById('createAlternateBtn');
  const saveScenarioInline = document.getElementById('saveScenarioInline');
  const scenarioNameInput = document.getElementById('scenarioNameInput');
  const confirmSaveScenarioBtn = document.getElementById('confirmSaveScenarioBtn');
  const cancelSaveScenarioBtn = document.getElementById('cancelSaveScenarioBtn');
  const cancelScenarioEditBtn = document.getElementById('cancelScenarioEditBtn');

  if (saveScenarioBtn) {
    saveScenarioBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (saveScenarioInline) {
        const isVisible = saveScenarioInline.style.display !== 'none';
        if (isVisible) {
          saveScenarioInline.style.display = 'none';
        } else {
          saveScenarioInline.style.display = 'block';
          if (scenarioNameInput) {
            scenarioNameInput.value = editingScenarioId
              ? (savedScenarios.find(s => s.id === editingScenarioId)?.name || '')
              : generateDefaultScenarioName();
            scenarioNameInput.focus();
            scenarioNameInput.select();
          }
        }
      }
    });
  }

  if (confirmSaveScenarioBtn) {
    confirmSaveScenarioBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = scenarioNameInput ? scenarioNameInput.value : '';
      handleSaveScenario(name);
    });
  }

  if (cancelSaveScenarioBtn) {
    cancelSaveScenarioBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (saveScenarioInline) saveScenarioInline.style.display = 'none';
    });
  }

  if (scenarioNameInput) {
    scenarioNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSaveScenario(scenarioNameInput.value);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (saveScenarioInline) saveScenarioInline.style.display = 'none';
      }
    });
  }

  if (createAlternateBtn) {
    createAlternateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleCreateAlternateScenario();
    });
  }

  if (cancelScenarioEditBtn) {
    cancelScenarioEditBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleCancelScenarioEdit();
    });
  }

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

  // Print Summary Button (Feature 4)
  const printSummaryBtn = document.getElementById('printSummaryBtn');
  if (printSummaryBtn) {
    printSummaryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handlePrintSummary();
    });
  }

  // Download Text Summary Button (Feature 4)
  const downloadSummaryBtn = document.getElementById('downloadSummaryBtn');
  if (downloadSummaryBtn) {
    downloadSummaryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleDownloadSummary();
    });
  }

  // Visual Chart Mode Toggle Buttons (Feature 3)
  const vizModeBase = document.getElementById('vizModeBase');
  if (vizModeBase) {
    vizModeBase.addEventListener('click', (e) => {
      e.preventDefault();
      switchChartMode('base');
    });
  }
  const vizModeCompare = document.getElementById('vizModeCompare');
  if (vizModeCompare) {
    vizModeCompare.addEventListener('click', (e) => {
      e.preventDefault();
      switchChartMode('compare');
    });
  }

  // Live Scenario Header Badge Update on typing
  function updateLiveBadge() {
    const name = goalNameInput ? goalNameInput.value.trim() : '';
    const years = targetYearsInput ? targetYearsInput.value : '';
    if (displayGoalBadge) {
      if (!name && !years) {
        displayGoalBadge.textContent = 'No goal selected';
      } else {
        displayGoalBadge.textContent = `${name || 'Custom Goal'}${years ? ` (${years} Yrs)` : ''}`;
      }
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
      } else if (fieldId === 'inflationRate' || fieldId === 'investmentReturn' || fieldId === 'stepUpRate') {
        validateField(fieldId, true);
      }
    });

    // Validate on blur to provide immediate inline feedback after leaving a field
    el.addEventListener('blur', () => {
      validateField(fieldId, true);
    });
  });

  // Initialize to neutral empty state on initial page load
  renderNeutralState();
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
  renderNeutralState,
  calculateFutureGoalValue,
  calculateFutureSavingsValue,
  calculateFundingGap,
  calculateMonthlyContribution,
  calculateStepUpContribution,
  calculateProjectedGrowth,
  calculateScenario,
  calculateScenarioComparison,
  renderScenarioComparison,
  renderUserScenarioComparison,
  renderSavedScenariosUI,
  renderAccessibleChart,
  switchChartMode,
  populatePrintReport,
  handlePrintSummary,
  handleDownloadSummary,
  handleSaveScenario,
  handleCreateAlternateScenario,
  handleEditScenario,
  handleDuplicateScenario,
  handleDeleteScenario,
  loadSavedScenariosFromSession,
  saveScenariosToSession,
  populateFormInputs,
  formatCurrency,
  formatCompactLakh,
  formatLakhWords,
  escapeHTML,
  validateField,
  validateInputs,
  handleCalculate,
  handleReset,
  get savedScenarios() { return savedScenarios; },
  set savedScenarios(v) { savedScenarios = v; }
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
