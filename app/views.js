// HomeLedger views — one function per page, plain HTML strings.
import { HISTORY } from './data.js';
import { bars, donut, esc, legend } from './charts.js';
import {
  addToGoal,
  billsDue,
  budgetRows,
  categoryOf,
  formatDate,
  money,
  money0,
  totalIncome,
  totalSpent,
} from './store.js';

// The books cover November 2026; "today" for bill badges is the 26th,
// the last day the household has entered so far.
const TODAY = '2026-11-26';

export const txFilter = { category: 'all', search: '' };

function statCard(label, value, sub) {
  return `<div class="stat"><p class="stat-label">${label}</p><p class="stat-value">${value}</p><p class="stat-sub">${sub}</p></div>`;
}

function billBadge(bill) {
  if (bill.paid) return '<span class="badge paid">Paid</span>';
  if (bill.due < TODAY) return '<span class="badge overdue">Overdue</span>';
  return '<span class="badge soon">Due soon</span>';
}

export function viewDashboard(state) {
  const income = totalIncome();
  const spent = totalSpent(state);
  const saved = income - spent;
  const rows = budgetRows(state).filter((r) => !r.isSavings);
  const over = rows.filter((r) => r.spent > r.planned);
  const due = state.bills.filter((b) => !b.paid);
  const latest = [...state.transactions].sort((a, b) => (a.date < b.date ? -1 : 1)).slice(-8).reverse();
  const topGoals = [...state.goals].sort((a, b) => b.saved / b.target - a.saved / a.target).slice(0, 2);
  const pct = Math.round((saved / income) * 100);

  return `
  <section class="page-head">
    <h1>November at a glance</h1>
    <p class="lede">The Alvarez household took in ${money(income)}, spent ${money(spent)} and kept ${money(saved)} — ${pct}% of everything that came in.</p>
  </section>
  <section class="stats">
    ${statCard('Income', money(income), '3 paydays in November')}
    ${statCard('Spent', money(spent), `${state.transactions.length} transactions`)}
    ${statCard('Saved', money(saved), `${pct}% of income — plan was ${money(1900)}`)}
    ${statCard('Bills still due', money(billsDue(state)), `${due.length} unpaid bills`)}
  </section>
  <section class="grid-2">
    <div class="card">
      <h2>Where the money went</h2>
      ${donut(rows)}
      ${legend(rows)}
    </div>
    <div class="card">
      <h2>Budget watch</h2>
      <p class="card-note">${over.length} of ${rows.length} categories are over their November plan.</p>
      <ul class="watch">${over
        .map(
          (r) =>
            `<li><span><span class="swatch" style="background:${r.color}"></span>${esc(r.label)} — ${money(r.spent)} of ${money(r.planned)}</span><strong class="over">+${money(r.spent - r.planned)}</strong></li>`,
        )
        .join('')}</ul>
      <h2>Latest spending</h2>
      <ul class="latest">${latest
        .map(
          (t) =>
            `<li><span>${formatDate(t.date)} — ${esc(t.label)}</span><strong>${money(t.amount)}</strong></li>`,
        )
        .join('')}</ul>
      <p><a class="link" href="#/transactions">See all ${state.transactions.length} transactions →</a></p>
    </div>
  </section>
  <section class="grid-2">
    <div class="card">
      <h2>Bills to pay</h2>
      ${due.length === 0 ? '<p class="card-note">All caught up — nothing due.</p>' : `<ul class="bills">${due
        .map(
          (b) =>
            `<li><span>${esc(b.label)} <small>due ${formatDate(b.due)}</small></span><span>${billBadge(b)} <strong>${money(b.amount)}</strong></span></li>`,
        )
        .join('')}</ul>`}
      <p><a class="link" href="#/bills">Manage all bills →</a></p>
    </div>
    <div class="card">
      <h2>Goals, closest first</h2>
      <ul class="goals-mini">${topGoals
        .map(
          (g) =>
            `<li><span>${esc(g.name)}</span><strong>${Math.round((g.saved / g.target) * 100)}%</strong><div class="bar"><span style="width:${Math.min(100, (g.saved / g.target) * 100).toFixed(1)}%"></span></div><small>${money(g.saved)} of ${money(g.target)}</small></li>`,
        )
        .join('')}</ul>
      <p><a class="link" href="#/goals">All savings goals →</a></p>
    </div>
  </section>`;
}

export function viewTransactions(state) {
  const q = txFilter.search.trim().toLowerCase();
  const rows = state.transactions.filter((t) => {
    if (txFilter.category !== 'all' && t.category !== txFilter.category) return false;
    if (q && !t.label.toLowerCase().includes(q) && !categoryOf(t.category).label.toLowerCase().includes(q)) return false;
    return true;
  });
  const total = rows.reduce((sum, t) => sum + t.amount, 0);
  return `
  <section class="page-head">
    <h1>Transactions</h1>
    <p class="lede">Every dollar the household spent in November — ${rows.length} shown, ${money(total)} in total.</p>
  </section>
  <section class="card">
    <form id="tx-filter" class="filter-row">
      <label>Category
        <select name="category" id="filter-category">
          <option value="all">All categories</option>
          ${state.budgets
            .filter((b) => b.category !== 'savings')
            .map((b) => `<option value="${b.category}" ${txFilter.category === b.category ? 'selected' : ''}>${esc(categoryOf(b.category).label)}</option>`)
            .join('')}
        </select>
      </label>
      <label>Search
        <input type="search" name="search" id="filter-search" placeholder="e.g. GreenMart" value="${esc(txFilter.search)}">
      </label>
    </form>
    <table class="tx-wide">
      <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
      <tbody>${rows
        .map(
          (t) => `<tr>
            <td>${formatDate(t.date)}</td>
            <td>${esc(t.label)}</td>
            <td><span class="swatch" style="background:${categoryOf(t.category).color}"></span>${esc(categoryOf(t.category).label)}</td>
            <td class="num">${money(t.amount)}</td>
            <td><button type="button" class="btn small danger" data-delete-tx="${t.id}">Delete</button></td>
          </tr>`,
        )
        .join('') || '<tr><td colspan="5">Nothing matches — try another search.</td></tr>'}
      </tbody>
    </table>
  </section>
  <section class="card">
    <h2>Add a transaction</h2>
    <form id="add-tx" class="form-grid">
      <label>Date <input type="date" name="date" value="2026-11-26" required></label>
      <label>What <input type="text" name="label" placeholder="e.g. GreenMart weekly shop" required maxlength="80"></label>
      <label>Category
        <select name="category">${state.budgets
          .filter((b) => b.category !== 'savings')
          .map((b) => `<option value="${b.category}">${esc(categoryOf(b.category).label)}</option>`)
          .join('')}</select>
      </label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <button type="submit" class="btn">Add transaction</button>
    </form>
  </section>`;
}

export function viewBudgets(state) {
  const rows = budgetRows(state);
  const plannedSpend = rows.filter((r) => !r.isSavings).reduce((s, r) => s + r.planned, 0);
  const actualSpend = totalSpent(state);
  return `
  <section class="page-head">
    <h1>Budgets</h1>
    <p class="lede">The November plan was ${money(plannedSpend)} of spending. The household spent ${money(actualSpend)} — ${money(Math.abs(actualSpend - plannedSpend))} ${actualSpend > plannedSpend ? 'over' : 'under'} plan.</p>
  </section>
  <section class="budget-grid">${rows
    .map((r) => {
      const pct = r.planned > 0 ? (r.spent / r.planned) * 100 : 0;
      const over = r.spent > r.planned;
      return `<article class="card budget-card${r.isSavings ? ' savings' : ''}">
        <h2><span class="swatch" style="background:${r.color}"></span>${esc(r.label)}</h2>
        <p class="big">${money(r.spent)} <small>of ${money(r.planned)} planned</small></p>
        <div class="bar${over ? ' over' : ''}"><span style="width:${Math.min(100, pct).toFixed(1)}%"></span></div>
        <p class="budget-line">${over ? `<strong class="over">${money(r.spent - r.planned)} over plan</strong>` : `<strong class="under">${money(r.planned - r.spent)} left</strong>`} · ${pct.toFixed(0)}% used</p>
        <form class="edit-budget" data-category="${r.category}">
          <label>Monthly plan ($) <input type="number" name="planned" min="0" step="1" value="${r.planned}" required></label>
          <button type="submit" class="btn small">Update plan</button>
        </form>
      </article>`;
    })
    .join('')}</section>`;
}

export function viewBills(state) {
  const unpaid = state.bills.filter((b) => !b.paid).sort((a, b) => (a.due < b.due ? -1 : 1));
  const paid = state.bills.filter((b) => b.paid).sort((a, b) => (a.due < b.due ? -1 : 1));
  return `
  <section class="page-head">
    <h1>Bills</h1>
    <p class="lede">${unpaid.length} bills still to pay, ${money(billsDue(state))} in total. Mark one paid and it moves to the paid list below.</p>
  </section>
  <section class="card">
    <h2>Needs attention</h2>
    ${unpaid.length === 0 ? '<p class="card-note">All caught up — nothing due.</p>' : `<ul class="bills">${unpaid
      .map(
        (b) =>
          `<li><span>${esc(b.label)} <small>due ${formatDate(b.due)}</small></span><span>${billBadge(b)} <strong>${money(b.amount)}</strong> <button type="button" class="btn small" data-toggle-bill="${b.id}">Mark paid</button></span></li>`,
      )
      .join('')}</ul>`}
  </section>
  <section class="card">
    <h2>Paid this month</h2>
    <ul class="bills">${paid
      .map(
        (b) =>
          `<li><span>${esc(b.label)} <small>due ${formatDate(b.due)}</small></span><span>${billBadge(b)} <strong>${money(b.amount)}</strong> <button type="button" class="btn small" data-toggle-bill="${b.id}">Undo</button></span></li>`,
      )
      .join('')}</ul>
  </section>
  <section class="card">
    <h2>Add a bill</h2>
    <form id="add-bill" class="form-grid">
      <label>What <input type="text" name="label" placeholder="e.g. Gym membership" required maxlength="80"></label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <label>Due date <input type="date" name="due" value="2026-11-30" required></label>
      <button type="submit" class="btn">Add bill</button>
    </form>
  </section>`;
}

export function viewGoals(state) {
  return `
  <section class="page-head">
    <h1>Savings goals</h1>
    <p class="lede">November's ${money(totalIncome() - totalSpent(state))} kept goes toward these four goals — ${money(state.goals.reduce((s, g) => s + g.saved, 0))} saved across them so far.</p>
  </section>
  <section class="budget-grid">${state.goals
    .map((g) => {
      const pct = (g.saved / g.target) * 100;
      return `<article class="card goal-card">
        <h2>${esc(g.name)}</h2>
        <p class="card-note">${esc(g.note)}</p>
        <p class="big">${money(g.saved)} <small>of ${money(g.target)}</small></p>
        <div class="bar"><span style="width:${Math.min(100, pct).toFixed(1)}%"></span></div>
        <p class="budget-line"><strong>${pct.toFixed(0)}% there</strong> · ${money(g.target - g.saved)} to go</p>
        <form class="add-goal" data-goal="${g.id}">
          <label>Add funds ($) <input type="number" name="amount" min="1" step="1" placeholder="50" required></label>
          <button type="submit" class="btn small">Add to goal</button>
        </form>
      </article>`;
    })
    .join('')}</section>`;
}

export function viewReports(state) {
  const spent = totalSpent(state);
  const rows = budgetRows(state)
    .filter((r) => !r.isSavings)
    .sort((a, b) => b.spent - a.spent);
  const over = rows.filter((r) => r.spent > r.planned);
  const saved = totalIncome() - spent;
  const savedOverPlan = saved - 1900;
  const groceryShops = state.transactions.filter((t) => t.category === 'groceries' && /GreenMart|FreshFarm|Costco/.test(t.label));
  const groceryAvg = groceryShops.reduce((s, t) => s + t.amount, 0) / groceryShops.length;
  const avgSaved =
    HISTORY.reduce((s, h) => s + (h.income - h.spent), 0) / HISTORY.length;
  return `
  <section class="page-head">
    <h1>Reports</h1>
    <p class="lede">Six months of the Alvarez household, June to November 2026 — income against spending, and what November taught them.</p>
  </section>
  <section class="card">
    <h2>Income vs spending</h2>
    ${bars(HISTORY)}
    <p class="legend-line"><span class="swatch" style="background:#1d4d3b"></span>Income <span class="swatch" style="background:#d97706"></span>Spending</p>
    <p class="card-note">The household saved ${money0(avgSaved)} a month on average over the last six months.</p>
  </section>
  <section class="card">
    <h2>November by category</h2>
    <table>
      <thead><tr><th>Category</th><th class="num">Planned</th><th class="num">Spent</th><th class="num">Difference</th></tr></thead>
      <tbody>${rows
        .map(
          (r) =>
            `<tr><td><span class="swatch" style="background:${r.color}"></span>${esc(r.label)}</td><td class="num">${money(r.planned)}</td><td class="num">${money(r.spent)}</td><td class="num ${r.spent > r.planned ? 'over-text' : 'under-text'}">${r.spent > r.planned ? '+' : '−'}${money(Math.abs(r.spent - r.planned))}</td></tr>`,
        )
        .join('')}</tbody>
    </table>
  </section>
  <section class="card">
    <h2>What November taught us</h2>
    <ul class="insights">
      <li><strong>Biggest cost is housing.</strong> Rent alone is ${money(1850)} — 40% of everything the household spent.</li>
      <li><strong>${over.length} categories ran over budget.</strong> The heating top-up (${money(64.2)}) and the anniversary dinner (${money(96.4)}) did most of it.</li>
      <li><strong>Saved ${money(savedOverPlan)} more than the ${money(1900)} plan</strong> — the third month in a row above plan.</li>
      <li><strong>Seven grocery shops averaged ${money(groceryAvg)} each.</strong> The Costco bulk run (${money(154.6)}) was the dearest; the mid-week top-ups were the cheapest.</li>
    </ul>
  </section>`;
}

// Re-exported for the router: adding funds is a store call the view needs.
export { addToGoal };
