// HomeLedger store — the household's books in localStorage, and every
// total the views show, derived from the seed data in data.js.
import { BILLS, BUDGETS, CATEGORIES, GOALS, INCOME, TRANSACTIONS } from './data.js';

export const STORAGE_KEY = 'homeledger-v1';

function seed() {
  return {
    transactions: TRANSACTIONS.map((t) => ({ ...t })),
    bills: BILLS.map((b) => ({ ...b })),
    goals: GOALS.map((g) => ({ ...g })),
    budgets: BUDGETS.map((b) => ({ ...b })),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.transactions) || !Array.isArray(parsed.bills)) return seed();
    return parsed;
  } catch {
    return seed();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  const fresh = seed();
  saveState(fresh);
  return fresh;
}

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const usd0 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function money(n) {
  return usd.format(n);
}

export function money0(n) {
  return usd0.format(n);
}

export function categoryOf(key) {
  return CATEGORIES.find((c) => c.key === key) ?? { key, label: key, color: '#6b7280' };
}

export function totalIncome() {
  return INCOME.reduce((sum, row) => sum + row.amount, 0);
}

export function totalSpent(state) {
  return state.transactions.reduce((sum, t) => sum + t.amount, 0);
}

export function spentByCategory(state) {
  const out = {};
  for (const c of CATEGORIES) out[c.key] = 0;
  for (const t of state.transactions) {
    if (out[t.category] === undefined) out[t.category] = 0;
    out[t.category] += t.amount;
  }
  return out;
}

// One row per budget, plus a savings row whose "spent" is what the
// household actually kept: income minus spending.
export function budgetRows(state) {
  const spent = spentByCategory(state);
  const income = totalIncome();
  const kept = income - totalSpent(state);
  return state.budgets.map((b) => {
    if (b.category === 'savings') {
      return { category: 'savings', label: 'Savings', color: '#1d4d3b', planned: b.planned, spent: kept, isSavings: true };
    }
    const cat = categoryOf(b.category);
    return { category: b.category, label: cat.label, color: cat.color, planned: b.planned, spent: spent[b.category] ?? 0 };
  });
}

export function billsDue(state) {
  return state.bills.filter((b) => !b.paid).reduce((sum, b) => sum + b.amount, 0);
}

let nextId = 1000;
export function addTransaction(state, { date, label, category, amount }) {
  const tx = { id: `tx-u${nextId++}`, date, label, category, amount: Number(amount) };
  state.transactions.push(tx);
  state.transactions.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  saveState(state);
  return tx;
}

export function deleteTransaction(state, id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  saveState(state);
}

export function setBudget(state, category, planned) {
  const row = state.budgets.find((b) => b.category === category);
  if (row) row.planned = Number(planned);
  saveState(state);
}

export function toggleBill(state, id) {
  const bill = state.bills.find((b) => b.id === id);
  if (bill) bill.paid = !bill.paid;
  saveState(state);
}

export function addBill(state, { label, amount, due }) {
  const bill = { id: `bill-u${nextId++}`, label, amount: Number(amount), due, paid: false };
  state.bills.push(bill);
  state.bills.sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : 0));
  saveState(state);
  return bill;
}

export function addToGoal(state, id, amount) {
  const goal = state.goals.find((g) => g.id === id);
  if (goal) goal.saved = Math.round((goal.saved + Number(amount)) * 100) / 100;
  saveState(state);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}`;
}
