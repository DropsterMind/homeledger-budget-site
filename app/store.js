// HomeLedger v2 — state and arithmetic. The seed lives in data.js; this
// module owns the editable copy (localStorage), every total the site
// shows, and the v2 derived figures: month pace, month-end projection,
// per-goal monthly need, and bill countdowns. All of it is pure
// arithmetic on the seed — change a transaction and every page agrees.

import { HOUSEHOLD, INCOME, CATEGORIES, BUDGETS, TRANSACTIONS, BILLS, GOALS, HISTORY } from './data.js';

const KEY = 'homeledger-v2';

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

export function seedState() {
  return {
    transactions: clone(TRANSACTIONS),
    budgets: clone(BUDGETS),
    bills: clone(BILLS),
    goals: clone(GOALS),
    nextTxId: 39,
    nextBillId: 11,
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedState();
    const s = JSON.parse(raw);
    if (!Array.isArray(s.transactions) || !s.budgets || !Array.isArray(s.bills) || !Array.isArray(s.goals)) {
      return seedState();
    }
    return s;
  } catch {
    return seedState();
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(KEY);
  return seedState();
}

// --- formatting ----------------------------------------------------------

export function money(n) {
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function money0(n) {
  return '$' + Math.round(Number(n)).toLocaleString('en-US');
}

export function pct(n) {
  return Math.round(n * 100) + '%';
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(day) {
  return MONTHS[HOUSEHOLD.today.month - 1] + ' ' + day;
}

export function formatTargetDate(iso) {
  const [y, m] = iso.split('-').map(Number);
  return MONTHS[m - 1] + ' ' + y;
}

// --- lookups --------------------------------------------------------------

export function categoryOf(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, label: id, color: '#6b7280' };
}

// --- month totals ---------------------------------------------------------

export function totalIncome() {
  return INCOME.reduce((s, i) => s + i.amount, 0);
}

export function totalSpent(state) {
  return state.transactions.reduce((s, t) => s + t.amount, 0);
}

export function totalSaved(state) {
  return totalIncome() - totalSpent(state);
}

export function spentByCategory(state) {
  const out = {};
  for (const c of CATEGORIES) out[c.id] = 0;
  for (const t of state.transactions) {
    if (out[t.category] === undefined) out[t.category] = 0;
    out[t.category] += t.amount;
  }
  return out;
}

// --- v2: month pace and projection ---------------------------------------
// "Today" is Nov 26 of a 30-day month: 26 of 30 days gone (87%). The
// projection carries the spending so far forward at the same daily rate.

export function daysElapsed() {
  return HOUSEHOLD.today.day;
}

export function monthDays() {
  return HOUSEHOLD.monthDays;
}

export function paceFraction() {
  return daysElapsed() / monthDays();
}

export function avgDailySpent(state) {
  return totalSpent(state) / daysElapsed();
}

export function projectedMonthEnd(state) {
  return avgDailySpent(state) * monthDays();
}

export function plannedSpending(state) {
  // Planned spending is every budget except savings.
  return CATEGORIES.reduce((s, c) => s + (state.budgets[c.id] || 0), 0);
}

// --- budgets --------------------------------------------------------------

export function budgetRows(state) {
  const spent = spentByCategory(state);
  const rows = CATEGORIES.map((c) => {
    const plan = state.budgets[c.id] || 0;
    const actual = spent[c.id] || 0;
    // What this category "should" have spent by today if it ran evenly.
    const expectedByNow = c.fixed ? plan : plan * paceFraction();
    return {
      ...c,
      plan,
      spent: actual,
      left: plan - actual,
      over: actual > plan,
      overBy: actual - plan,
      // Pace: ahead means spent more than the even share of the month.
      aheadOfPace: !c.fixed && actual > expectedByNow,
      paceGap: actual - expectedByNow,
      expectedByNow,
    };
  });
  const saved = totalSaved(state);
  const savePlan = state.budgets.savings || 0;
  rows.push({
    id: 'savings',
    label: 'Savings',
    color: '#1d4d3b',
    plan: savePlan,
    spent: saved,
    left: savePlan - saved,
    over: false,
    overBy: 0,
    aheadOfPace: false,
    paceGap: 0,
    expectedByNow: savePlan * paceFraction(),
    isSavings: true,
  });
  return rows;
}

export function overBudgetCount(state) {
  return budgetRows(state).filter((r) => !r.isSavings && r.over).length;
}

// --- bills ----------------------------------------------------------------

export function billsDue(state) {
  return state.bills.filter((b) => !b.paid);
}

export function unpaidTotal(state) {
  return billsDue(state).reduce((s, b) => s + b.amount, 0);
}

// Days from the demo's today (Nov 26) to a bill's day: negative = overdue.
export function daysToBill(bill) {
  return bill.day - HOUSEHOLD.today.day;
}

export function billStatus(bill) {
  const d = daysToBill(bill);
  if (d < 0) return { kind: 'overdue', text: 'Overdue by ' + -d + (d === -1 ? ' day' : ' days') };
  if (d === 0) return { kind: 'soon', text: 'Due today' };
  if (d === 1) return { kind: 'soon', text: 'Due tomorrow' };
  return { kind: 'soon', text: 'Due in ' + d + ' days' };
}

// Unpaid bills falling due in the next 7 days (today included).
export function dueNextWeek(state) {
  return billsDue(state).filter((b) => daysToBill(b) >= 0 && daysToBill(b) <= 7);
}

// --- goals (v2) -----------------------------------------------------------
// Monthly amount still needed, from the demo's today to the target date,
// and whether the household's usual saving pace covers it. The usual pace
// is the six-month average saved per month, computed from HISTORY.

export function avgMonthlySaved() {
  const saved = HISTORY.map((h) => h.income - h.spent);
  return saved.reduce((s, v) => s + v, 0) / saved.length;
}

function monthsLeft(targetDate) {
  const [y, m, d] = targetDate.split('-').map(Number);
  const target = Date.UTC(y, m - 1, d);
  const today = Date.UTC(HOUSEHOLD.today.year, HOUSEHOLD.today.month - 1, HOUSEHOLD.today.day);
  const days = Math.max(1, Math.round((target - today) / 86400000));
  return Math.max(1, Math.ceil(days / 30.44));
}

export function goalRows(state) {
  const pace = avgMonthlySaved();
  return state.goals.map((g) => {
    const left = Math.max(0, g.target - g.current);
    const months = monthsLeft(g.targetDate);
    const monthlyNeeded = left / months;
    return {
      ...g,
      left,
      months,
      monthlyNeeded,
      progress: g.current / g.target,
      onTrack: monthlyNeeded <= pace,
      usualPace: pace,
    };
  });
}

// --- history --------------------------------------------------------------

export function historyWithSaved() {
  return HISTORY.map((h) => ({ ...h, saved: h.income - h.spent }));
}

export function dailySpending(state) {
  // Spending per day, Nov 1..26. Days with no transaction are 0.
  const days = [];
  for (let d = 1; d <= daysElapsed(); d++) days.push({ day: d, amount: 0 });
  for (const t of state.transactions) {
    if (t.day >= 1 && t.day <= daysElapsed()) days[t.day - 1].amount += t.amount;
  }
  return days;
}

// --- mutations ------------------------------------------------------------

export function addTransaction(state, tx) {
  const item = {
    id: state.nextTxId++,
    day: tx.day,
    label: tx.label.trim(),
    note: (tx.note || '').trim(),
    category: tx.category,
    amount: Math.round(tx.amount * 100) / 100,
  };
  state.transactions.push(item);
  return item;
}

export function updateTransaction(state, id, tx) {
  const item = state.transactions.find((t) => t.id === id);
  if (!item) return null;
  item.day = tx.day;
  item.label = tx.label.trim();
  item.note = (tx.note || '').trim();
  item.category = tx.category;
  item.amount = Math.round(tx.amount * 100) / 100;
  return item;
}

export function deleteTransaction(state, id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
}

export function setBudget(state, id, amount) {
  state.budgets[id] = Math.round(amount * 100) / 100;
}

export function toggleBill(state, id) {
  const bill = state.bills.find((b) => b.id === id);
  if (bill) bill.paid = !bill.paid;
  return bill;
}

export function addBill(state, bill) {
  const item = {
    id: state.nextBillId++,
    label: bill.label.trim(),
    day: bill.day,
    amount: Math.round(bill.amount * 100) / 100,
    paid: false,
  };
  state.bills.push(item);
  return item;
}

export function addToGoal(state, id, amount) {
  const goal = state.goals.find((g) => g.id === id);
  if (!goal) return null;
  goal.current = Math.round((goal.current + amount) * 100) / 100;
  return goal;
}

// --- CSV export (v2) ------------------------------------------------------

export function transactionsCsv(state) {
  const lines = ['Date,Description,Category,Amount'];
  const rows = [...state.transactions].sort((a, b) => a.day - b.day || a.id - b.id);
  for (const t of rows) {
    const desc = '"' + (t.label + (t.note ? ' — ' + t.note : '')).replace(/"/g, '""') + '"';
    lines.push(`${formatDate(t.day)},${desc},${categoryOf(t.category).label},${t.amount.toFixed(2)}`);
  }
  lines.push(`,Total spent,,${totalSpent(state).toFixed(2)}`);
  return lines.join('\n');
}

// --- escaping -------------------------------------------------------------

export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
