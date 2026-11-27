// HomeLedger app — hash router and one delegated listener for every
// control on the site. Every change saves to localStorage and re-renders.
import { loadState, resetState, saveState, addTransaction, deleteTransaction, setBudget, toggleBill, addBill, addToGoal } from './store.js';
import { viewDashboard, viewTransactions, viewBudgets, viewBills, viewGoals, viewReports, txFilter } from './views.js';

let state = loadState();

const NAV = [
  ['#/', 'Dashboard'],
  ['#/transactions', 'Transactions'],
  ['#/budgets', 'Budgets'],
  ['#/bills', 'Bills'],
  ['#/goals', 'Goals'],
  ['#/reports', 'Reports'],
];

const navEl = document.getElementById('nav');
navEl.innerHTML = NAV.map(([href, label]) => `<a href="${href}" data-nav="${href}">${label}</a>`).join('');

const appEl = document.getElementById('app');

function render() {
  const hash = location.hash || '#/';
  const route = NAV.some(([href]) => href === hash) ? hash : '#/';
  for (const link of navEl.querySelectorAll('a')) {
    link.classList.toggle('active', link.dataset.nav === route);
  }
  if (route === '#/transactions') appEl.innerHTML = viewTransactions(state);
  else if (route === '#/budgets') appEl.innerHTML = viewBudgets(state);
  else if (route === '#/bills') appEl.innerHTML = viewBills(state);
  else if (route === '#/goals') appEl.innerHTML = viewGoals(state);
  else if (route === '#/reports') appEl.innerHTML = viewReports(state);
  else appEl.innerHTML = viewDashboard(state);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);

// One listener for clicks: delete a transaction, mark a bill paid or
// unpaid, and reset the demo data from the footer.
document.addEventListener('click', (event) => {
  const del = event.target.closest('[data-delete-tx]');
  if (del) {
    deleteTransaction(state, del.dataset.deleteTx);
    render();
    return;
  }
  const bill = event.target.closest('[data-toggle-bill]');
  if (bill) {
    toggleBill(state, bill.dataset.toggleBill);
    render();
    return;
  }
  if (event.target.closest('[data-reset]')) {
    if (window.confirm('Reset all demo data back to the November seed?')) {
      state = resetState();
      txFilter.category = 'all';
      txFilter.search = '';
      render();
    }
  }
});

// One listener for input: the transaction filter updates as you type.
document.addEventListener('input', (event) => {
  if (event.target.id === 'filter-category') {
    txFilter.category = event.target.value;
    render();
    const select = document.getElementById('filter-category');
    if (select) select.focus();
  }
  if (event.target.id === 'filter-search') {
    txFilter.search = event.target.value;
    render();
    const input = document.getElementById('filter-search');
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }
});

// One listener for submits: add a transaction, add a bill, edit a budget
// plan, or add funds to a goal.
document.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  if (form.id === 'add-tx') {
    addTransaction(state, {
      date: String(data.get('date')),
      label: String(data.get('label')).trim(),
      category: String(data.get('category')),
      amount: Number(data.get('amount')),
    });
  } else if (form.id === 'add-bill') {
    addBill(state, {
      label: String(data.get('label')).trim(),
      amount: Number(data.get('amount')),
      due: String(data.get('due')),
    });
  } else if (form.classList.contains('edit-budget')) {
    setBudget(state, form.dataset.category, Number(data.get('planned')));
  } else if (form.classList.contains('add-goal')) {
    addToGoal(state, form.dataset.goal, Number(data.get('amount')));
  } else {
    return;
  }
  saveState(state);
  render();
});

render();
