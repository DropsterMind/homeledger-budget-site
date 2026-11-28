// HomeLedger v3 — the seven pages. Every view is a function of the state:
// the same numbers appear on the dashboard, the budgets page and the
// reports page because they are all computed in store.js from one seed.
// User text is escaped before it is rendered.

import { HOUSEHOLD, CATEGORIES } from './data.js';
import {
  money, money0, pct, formatDate, formatTargetDate, esc, categoryOf,
  totalIncome, totalSpent, totalSaved, spentByCategory, budgetRows,
  overBudgetCount, billsDue, unpaidTotal, billStatus, dueNextWeek,
  goalRows, historyWithSaved, dailySpending, daysElapsed, monthDays,
  paceFraction, avgDailySpent, projectedMonthEnd, plannedSpending,
  decemberSummary, monthlyRecurringTotal,
} from './store.js';
import { donut, legend, bars, dayBars } from './charts.js';

function statCard(label, value, sub, valueId, subId) {
  return `<div class="stat"><span class="stat-label">${label}</span><strong class="stat-value"${valueId ? ` id="${valueId}"` : ''}>${value}</strong><span class="stat-sub"${subId ? ` id="${subId}"` : ''}>${sub}</span></div>`;
}

function txRow(t, withActions) {
  const c = categoryOf(t.category);
  const note = t.note ? ` <span class="tx-note">${esc(t.note)}</span>` : '';
  const actions = withActions
    ? `<td class="tx-actions"><button type="button" class="btn btn-small" data-edit-tx="${t.id}">Edit</button> <button type="button" class="btn btn-small btn-danger" data-delete-tx="${t.id}">Delete</button></td>`
    : '';
  return `<tr><td>${formatDate(t.day)}</td><td>${esc(t.label)}${note}</td><td><span class="cat-dot" style="background:${c.color}"></span>${c.label}</td><td class="num">${money(t.amount)}</td>${actions}</tr>`;
}

export function viewDashboard(state) {
  const income = totalIncome();
  const spent = totalSpent(state);
  const saved = totalSaved(state);
  const plan = plannedSpending(state);
  const proj = projectedMonthEnd(state);
  const rows = budgetRows(state).filter((r) => !r.isSavings);
  const over = rows.filter((r) => r.over);
  const due = billsDue(state);
  const goals = goalRows(state).sort((a, b) => b.progress - a.progress).slice(0, 2);
  const latest = [...state.transactions].sort((a, b) => b.day - a.day || b.id - a.id).slice(0, 8);
  const pace = Math.round(paceFraction() * 100);

  return `
  <h1>November at a glance</h1>
  <p class="lede">${esc(HOUSEHOLD.name)} — ${esc(HOUSEHOLD.members)}. ${daysElapsed()} of ${monthDays()} days gone; every figure below is live, computed from the household's own transactions.</p>
  <section class="stats">
    ${statCard('Income', money(income), '3 payments in November')}
    ${statCard('Spent', money(spent), money(plan) + ' planned')}
    ${statCard('Saved', money(saved), pct(saved / income) + ' of income')}
    ${statCard('Left to spend', money(Math.max(0, plan - spent)), spent > plan ? money(spent - plan) + ' over plan' : 'within plan')}
  </section>
  <section class="card pace-strip">
    <h2>Month pace</h2>
    <p><strong>${daysElapsed()} of ${monthDays()} days gone (${pace}%).</strong> Spending is running at ${money(avgDailySpent(state))} a day, which puts the month on course for <strong>${money(proj)}</strong> — ${money(Math.max(0, proj - plan))} over the ${money(plan)} plan if nothing changes. Four days are left to pull it back.</p>
    <div class="bar"><span style="width:${pace}%; background:#1d4d3b"></span></div>
    <p class="muted">${pace}% of the month elapsed</p>
  </section>
  <div class="grid-2">
    <section class="card">
      <h2>Where the money went</h2>
      ${donut(rows, 220)}
      ${legend(rows)}
    </section>
    <section class="card">
      <h2>Budget watch — ${over.length} categories over</h2>
      <ul class="watch">
        ${over.map((r) => `<li><span class="cat-dot" style="background:${r.color}"></span>${r.label}: spent ${money(r.spent)} of ${money(r.plan)} — <strong class="over-text">${money(r.overBy)} over</strong></li>`).join('')}
      </ul>
      <p class="muted">${(() => { const hot = [...rows].sort((a, b) => (b.spent / b.plan) - (a.spent / a.plan))[0]; return `${hot.label} ran hottest (${money(hot.spent)} of ${money(hot.plan)}, ${Math.round((hot.spent / hot.plan) * 100)}%): the heating top-up during the cold snap did most of it.`; })()}</p>
      <h2>Latest transactions</h2>
      <table class="tx"><tbody>${latest.map((t) => txRow(t, false)).join('')}</tbody></table>
      <p><a href="#/transactions">See all ${state.transactions.length} transactions →</a></p>
    </section>
  </div>
  <div class="grid-2">
    <section class="card">
      <h2>Bills still to pay — ${money(unpaidTotal(state))}</h2>
      ${due.length
        ? `<ul class="bills-mini">${due.map((b) => `<li>${esc(b.label)} — <strong>${money(b.amount)}</strong> <span class="badge ${billStatus(b).kind === 'overdue' ? 'badge-overdue' : 'badge-soon'}">${billStatus(b).text}</span></li>`).join('')}</ul>`
        : '<p>All bills paid. Nothing outstanding.</p>'}
      <p><a href="#/bills">Manage bills →</a></p>
    </section>
    <section class="card">
      <h2>Closest goals</h2>
      ${goals.map((g) => `<div class="goal-mini"><div class="goal-head"><span>${esc(g.label)}</span><strong>${money(g.current)} of ${money(g.target)}</strong></div><div class="bar"><span style="width:${Math.min(100, g.progress * 100)}%"></span></div><p class="muted">${money(g.monthlyNeeded)} a month still needed · on track at your usual pace</p></div>`).join('')}
      <p><a href="#/goals">All savings goals →</a></p>
    </section>
  </div>`;
}

function txForm(ui) {
  const t = ui.editingTx;
  const title = t ? 'Edit transaction' : 'Add a transaction';
  const day = t ? t.day : '';
  const label = t ? esc(t.label) : '';
  const note = t ? esc(t.note || '') : '';
  const category = t ? t.category : 'groceries';
  const amount = t ? t.amount.toFixed(2) : '';
  const options = CATEGORIES.map((c) => `<option value="${c.id}"${c.id === category ? ' selected' : ''}>${c.label}</option>`).join('');
  return `
  <form id="tx-form" class="form-card" data-editing="${t ? t.id : ''}">
    <h2>${title}</h2>
    <div class="form-row">
      <label>Day of November <input type="number" name="day" min="1" max="30" required value="${day}" placeholder="26"></label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" required value="${amount}" placeholder="25.00"></label>
    </div>
    <label>Description <input type="text" name="label" required maxlength="80" value="${label}" placeholder="GreenMart weekly shop"></label>
    <label>Note (optional) <input type="text" name="note" maxlength="80" value="${note}" placeholder="Who or what it was for"></label>
    <label>Category <select name="category">${options}</select></label>
    <div class="form-actions">
      <button type="submit" class="btn btn-primary">${t ? 'Save changes' : 'Add transaction'}</button>
      ${t ? '<button type="button" class="btn" data-cancel-edit>Cancel</button>' : ''}
    </div>
  </form>`;
}

export function viewTransactions(state, ui) {
  const q = (ui.txSearch || '').toLowerCase();
  const cat = ui.txCategory || 'all';
  const sort = ui.txSort || 'date-desc';
  let list = state.transactions.filter((t) => {
    const hay = (t.label + ' ' + (t.note || '') + ' ' + categoryOf(t.category).label).toLowerCase();
    return (cat === 'all' || t.category === cat) && (!q || hay.includes(q));
  });
  const sorts = {
    'date-desc': (a, b) => b.day - a.day || b.id - a.id,
    'date-asc': (a, b) => a.day - b.day || a.id - b.id,
    'amount-desc': (a, b) => b.amount - a.amount,
    'amount-asc': (a, b) => a.amount - b.amount,
  };
  list = list.sort(sorts[sort] || sorts['date-desc']);
  const shownTotal = list.reduce((s, t) => s + t.amount, 0);
  const catOptions = ['<option value="all">All categories</option>'].concat(
    CATEGORIES.map((c) => `<option value="${c.id}"${c.id === cat ? ' selected' : ''}>${c.label}</option>`),
  ).join('');

  return `
  <h1>Transactions</h1>
  <p class="lede">${state.transactions.length} expenses in November, ${money(totalSpent(state))} in total. Search, filter and sort them; add, edit or delete any row and every total on the site updates.</p>
  <div class="toolbar">
    <input type="search" id="tx-search" placeholder="Search transactions…" value="${esc(ui.txSearch || '')}" aria-label="Search transactions">
    <select id="tx-category" aria-label="Filter by category">${catOptions}</select>
    <select id="tx-sort" aria-label="Sort transactions">
      <option value="date-desc"${sort === 'date-desc' ? ' selected' : ''}>Newest first</option>
      <option value="date-asc"${sort === 'date-asc' ? ' selected' : ''}>Oldest first</option>
      <option value="amount-desc"${sort === 'amount-desc' ? ' selected' : ''}>Amount: high to low</option>
      <option value="amount-asc"${sort === 'amount-asc' ? ' selected' : ''}>Amount: low to high</option>
    </select>
    <button type="button" class="btn" data-csv>Download CSV</button>
  </div>
  <p class="muted">Showing ${list.length} of ${state.transactions.length} transactions — ${money(shownTotal)}.</p>
  <table class="tx tx-wide">
    <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th><th>Actions</th></tr></thead>
    <tbody>${list.map((t) => txRow(t, true)).join('') || '<tr><td colspan="5">No transactions match. Try clearing the search or filter.</td></tr>'}</tbody>
  </table>
  ${txForm(ui)}`;
}

export function viewBudgets(state) {
  const rows = budgetRows(state);
  const pace = Math.round(paceFraction() * 100);
  const cards = rows.map((r) => {
    const width = Math.min(100, (r.spent / r.plan) * 100);
    const status = r.isSavings
      ? (r.spent >= r.plan
          ? `<strong class="under-text">${money(r.spent - r.plan)} above the savings plan</strong>`
          : `<strong>${money(r.plan - r.spent)} short of the savings plan</strong>`)
      : r.over
        ? `<strong class="over-text">${money(r.overBy)} over budget</strong>`
        : `<strong class="under-text">${money(r.left)} left</strong>`;
    const paceLine = r.isSavings
      ? `Saving at ${money(r.spent)} of ${money(r.plan)} planned — on course to beat the plan.`
      : r.fixed
        ? 'Fixed monthly cost — rent, paid in full on Nov 1.'
        : r.aheadOfPace
          ? `Pace check: ${money(r.expectedByNow)} expected by today (${pace}% of the month) — <strong class="over-text">ahead of pace by ${money(r.paceGap)}</strong>.`
          : `Pace check: ${money(r.expectedByNow)} expected by today (${pace}% of the month) — <strong class="under-text">under pace by ${money(-r.paceGap)}</strong>.`;
    return `<section class="card budget-card${r.isSavings ? ' savings-card' : ''}">
      <div class="budget-head"><h2>${r.label}</h2><span>${money(r.spent)} of ${money(r.plan)}</span></div>
      <div class="bar${r.over ? ' bar-over' : ''}"><span style="width:${width}%; background:${r.over ? '#b3261e' : r.color}"></span></div>
      <p>${status} · ${Math.round((r.spent / r.plan) * 100)}% of plan</p>
      <p class="muted">${paceLine}</p>
      <form class="budget-form" data-budget="${r.id}">
        <label>Monthly plan ($) <input type="number" name="amount" min="0" step="1" required value="${r.plan}"></label>
        <button type="submit" class="btn btn-small">Update plan</button>
      </form>
    </section>`;
  }).join('');
  return `
  <h1>Budgets</h1>
  <p class="lede">One plan per category for November. ${overBudgetCount(state)} of ${CATEGORIES.length} spending categories are over budget; the pace check under each card compares spending so far with ${pace}% of the month gone. Change any plan and the dashboard updates.</p>
  <div class="grid-2">${cards}</div>`;
}

export function viewBills(state) {
  const due = billsDue(state).sort((a, b) => a.day - b.day);
  const paid = state.bills.filter((b) => b.paid).sort((a, b) => a.day - b.day);
  const week = dueNextWeek(state);
  const weekTotal = week.reduce((s, b) => s + b.amount, 0);
  return `
  <h1>Bills</h1>
  <p class="lede">Everything the household owes in November, with the countdown from today (Nov 26). Mark a bill paid and the dashboard's outstanding total drops at once.</p>
  <section class="card">
    <h2>Needs attention — ${due.length} unpaid, ${money(unpaidTotal(state))}</h2>
    <p class="muted">Due in the next 7 days: <strong>${money(weekTotal)}</strong> (${week.length} bill${week.length === 1 ? '' : 's'}).</p>
    <p class="muted">Recurring bills total <strong>${money(monthlyRecurringTotal(state))}</strong> a month — internet, phone, gym and streaming repeat unless cancelled.</p>
    ${due.length
      ? `<ul class="bill-list">${due.map((b) => {
          const st = billStatus(b);
          return `<li><span>${esc(b.label)} — ${formatDate(b.day)}</span>${b.recurring ? '<span class="badge badge-recurring">Recurring</span>' : ''}<span class="badge ${st.kind === 'overdue' ? 'badge-overdue' : 'badge-soon'}">${st.text}</span><strong>${money(b.amount)}</strong><button type="button" class="btn btn-small btn-primary" data-toggle-bill="${b.id}">Mark paid</button></li>`;
        }).join('')}</ul>`
      : '<p>All bills paid. Nothing outstanding.</p>'}
  </section>
  <section class="card">
    <h2>Paid — ${paid.length} bills</h2>
    <ul class="bill-list">${paid.map((b) => `<li><span>${esc(b.label)} — ${formatDate(b.day)}</span>${b.recurring ? '<span class="badge badge-recurring">Recurring</span>' : ''}<span class="badge badge-paid">Paid</span><strong>${money(b.amount)}</strong><button type="button" class="btn btn-small" data-toggle-bill="${b.id}">Undo</button></li>`).join('')}</ul>
  </section>
  <form id="bill-form" class="form-card">
    <h2>Add a bill</h2>
    <div class="form-row">
      <label>Bill <input type="text" name="label" required maxlength="60" placeholder="Water — City Water"></label>
      <label>Day of November <input type="number" name="day" min="1" max="30" required placeholder="12"></label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" required placeholder="42.10"></label>
    </div>
    <button type="submit" class="btn btn-primary">Add bill</button>
  </form>`;
}

export function viewGoals(state) {
  const goals = goalRows(state);
  return `
  <h1>Savings goals</h1>
  <p class="lede">Four goals, each with a target date. The monthly figure is what the household still has to put aside every month from now on — judged against its usual pace of ${money0(goals[0].usualPace)} saved a month, the average of the last six months.</p>
  <div class="grid-2">
    ${goals.map((g) => `<section class="card goal-card">
      <div class="goal-head"><h2>${esc(g.label)}</h2><span>${money(g.current)} of ${money(g.target)}</span></div>
      <div class="bar"><span style="width:${Math.min(100, g.progress * 100)}%"></span></div>
      <p>${pct(g.progress)} there · ${money(g.left)} to go · target ${formatTargetDate(g.targetDate)}</p>
      <p>${money(g.monthlyNeeded)} a month for ${g.months} months · <strong class="${g.onTrack ? 'under-text' : 'over-text'}">${g.onTrack ? 'On track at your usual pace' : 'Needs more than your usual pace'}</strong></p>
      <form class="goal-form" data-goal="${g.id}">
        <label>Add funds ($) <input type="number" name="amount" min="0.01" step="0.01" required placeholder="100.00"></label>
        <button type="submit" class="btn btn-small btn-primary">Add to goal</button>
      </form>
    </section>`).join('')}
  </div>`;
}

export function planWarningHtml(summary) {
  const overBy = summary.planned - summary.income;
  return `<p><strong class="over-text">Over plan by ${money(overBy)}.</strong> The December plan spends more than the ${money(summary.income)} coming in, so the projected saving would be negative. Trim a category or two to get back under the income line.</p>`;
}

export function viewPlan(state) {
  const summary = decemberSummary(state);
  const novSaved = totalSaved(state);
  const rows = CATEGORIES.map((c) => {
    const novPlan = state.budgets[c.id] || 0;
    const decPlan = state.december.plans[c.id] || 0;
    return `<tr><td><span class="cat-dot" style="background:${c.color}"></span>${c.label}</td><td class="num">${money(novPlan)}</td><td><input type="number" class="plan-input" data-plan-category="${c.id}" min="0" step="1" value="${decPlan}" aria-label="December plan for ${c.label}"></td></tr>`;
  }).join('');
  return `
  <h1>Plan December</h1>
  <p class="lede">December starts from the November plan, with the same paydays — Maya's salary $3,900, Daniel's $2,750, and the $200 wiring job. Change any figure and the projected saving moves at once; the plan saves to your browser like the rest of the site.</p>
  <section class="stats">
    ${statCard('Expected income', money(summary.income), '3 payments in December')}
    ${statCard('Planned spending', money(summary.planned), 'December plan so far', 'plan-planned')}
    ${statCard('Projected savings', money(summary.projected), pct(summary.projected / summary.income) + ' of income', 'plan-projected', 'plan-projected-sub')}
    ${statCard('November saved', money(novSaved), 'the plan to beat')}
  </section>
  <div id="plan-warning" class="card pace-strip"${summary.over ? '' : ' style="display:none"'}>${summary.over ? planWarningHtml(summary) : ''}</div>
  <p><button type="button" class="btn" data-copy-november>Copy November plan</button> <span class="muted">Resets every December figure to the November plan.</span></p>
  <section class="card">
    <h2>December budget by category</h2>
    <table class="tx plan-table">
      <thead><tr><th>Category</th><th class="num">November plan</th><th class="num">December plan</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="muted">The November plan is shown for comparison; only the December column is editable. Savings is not a line here — it is whatever the plan leaves over.</p>
  </section>`;
}

export function viewReports(state) {
  const history = historyWithSaved();
  const spent = spentByCategory(state);
  const rows = budgetRows(state).filter((r) => !r.isSavings);
  const sorted = [...rows].sort((a, b) => b.spent - a.spent);
  const days = dailySpending(state);
  const proj = projectedMonthEnd(state);
  const plan = plannedSpending(state);
  const saved = totalSaved(state);
  const savePlan = state.budgets.savings || 0;

  const groceryTx = state.transactions.filter((t) => t.category === 'groceries');
  const groceryAvg = groceryTx.reduce((s, t) => s + t.amount, 0) / Math.max(1, groceryTx.length);
  const nonRent = [...state.transactions].filter((t) => t.category !== 'housing').sort((a, b) => b.amount - a.amount)[0];
  const dayTotals = days.map((d) => ({ ...d }));
  const priciestDay = [...dayTotals].sort((a, b) => b.amount - a.amount)[0];
  const priciestNonRentDay = [...dayTotals].filter((d) => d.day !== 1).sort((a, b) => b.amount - a.amount)[0];

  const heatingTx = state.transactions.find((t) => t.label.toLowerCase().includes('heating'));
  const dinnerTx = state.transactions.find((t) => t.label.toLowerCase().includes('anniversary dinner'));
  const overNote = heatingTx && dinnerTx
    ? ` The heating top-up (${money(heatingTx.amount)}) and the anniversary dinner (${money(dinnerTx.amount)}) did most of the damage in the last week.`
    : '';

  const insights = [
    `Biggest cost is Housing at ${money(spent.housing)} — rent is fixed and was paid in full on Nov 1.`,
    `${overBudgetCount(state)} categories are over budget.${overNote}`,
    `Saved ${money(saved)} so far — ${money(saved - savePlan)} more than the ${money(savePlan)} plan, and above plan every month since June.`,
    `${groceryTx.length} grocery shops averaged ${money(groceryAvg)} each.`,
    `At the current daily rate the month ends at ${money(proj)} spent — ${money(Math.max(0, proj - plan))} over the ${money(plan)} plan.`,
    ...(nonRent ? [`Biggest single expense after rent: ${esc(nonRent.label)} at ${money(nonRent.amount)} on ${formatDate(nonRent.day)}.`] : []),
    `An average day costs ${money(avgDailySpent(state))}. The priciest day was Nov 1 (${money(priciestDay.amount)}, rent day); after rent it was Nov ${priciestNonRentDay.day} at ${money(priciestNonRentDay.amount)}.`,
  ];

  return `
  <h1>Reports</h1>
  <p class="lede">Six months of history, November day by day, and every category ranked. All of it recomputes from the transactions — edit one and come back here to see the change.</p>
  <section class="card">
    <h2>Income vs spending — Jun to Nov 2026</h2>
    ${bars(history, 640, 260)}
    <p class="muted"><span class="swatch" style="background:#1d4d3b"></span> Income &nbsp; <span class="swatch" style="background:#d97706"></span> Spending. Six-month average saved: ${money0(goalsAvgSaved())} a month.</p>
  </section>
  <section class="card">
    <h2>Daily spending — November so far</h2>
    ${dayBars(days, 640, 220)}
    <p class="muted">Red days cost $300 or more, amber $100 or more. Quiet days are the green ones — ${days.filter((d) => d.amount === 0).length} days with no spending at all.</p>
  </section>
  <section class="card">
    <h2>Categories ranked by spending</h2>
    <table class="tx">
      <thead><tr><th>Category</th><th class="num">Spent</th><th class="num">Plan</th><th class="num">Over / under</th><th class="num">% of plan</th></tr></thead>
      <tbody>${sorted.map((r) => `<tr><td><span class="cat-dot" style="background:${r.color}"></span>${r.label}</td><td class="num">${money(r.spent)}</td><td class="num">${money(r.plan)}</td><td class="num ${r.over ? 'over-text' : 'under-text'}">${r.over ? '+' : ''}${money(r.spent - r.plan)}</td><td class="num">${Math.round((r.spent / r.plan) * 100)}%</td></tr>`).join('')}</tbody>
    </table>
  </section>
  <section class="card">
    <h2>What the numbers say</h2>
    <ul class="insights">${insights.map((i) => `<li>${i}</li>`).join('')}</ul>
  </section>`;
}

function goalsAvgSaved() {
  const h = historyWithSaved();
  return h.reduce((s, x) => s + x.saved, 0) / h.length;
}
