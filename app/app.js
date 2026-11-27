// HomeLedger v2 — the shell: hash router plus one delegated listener for
// every control on the site. Each change saves the state and re-renders
// the current page, so the numbers on every page always agree.

import { loadState, saveState, resetState, addTransaction, updateTransaction, deleteTransaction, setBudget, toggleBill, addBill, addToGoal, transactionsCsv } from './store.js';
import { viewDashboard, viewTransactions, viewBudgets, viewBills, viewGoals, viewReports } from './views.js';

const ROUTES = [
  { hash: '#/', label: 'Dashboard', view: viewDashboard },
  { hash: '#/transactions', label: 'Transactions', view: viewTransactions },
  { hash: '#/budgets', label: 'Budgets', view: viewBudgets },
  { hash: '#/bills', label: 'Bills', view: viewBills },
  { hash: '#/goals', label: 'Goals', view: viewGoals },
  { hash: '#/reports', label: 'Reports', view: viewReports },
];

let state = loadState();

// Transaction-page UI state (filter, search, sort, row being edited).
// Kept outside the saved state: it is how the page looks, not the data.
const ui = { txSearch: '', txCategory: 'all', txSort: 'date-desc', editingTx: null };

const app = document.getElementById('app');
const nav = document.getElementById('nav');

function route() {
  const hash = location.hash || '#/';
  const match = ROUTES.find((r) => r.hash === hash) || ROUTES[0];
  nav.innerHTML = ROUTES.map(
    (r) => `<a href="${r.hash}"${r.hash === match.hash ? ' aria-current="page"' : ''}>${r.label}</a>`,
  ).join('');
  app.innerHTML = match.view(state, ui);
  const h1 = app.querySelector('h1');
  if (h1) document.title = h1.textContent + ' — HomeLedger';
}

function rerender() {
  saveState(state);
  route();
}

function downloadCsv() {
  const blob = new Blob([transactionsCsv(state)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'homeledger-november-2026-transactions.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function readTxForm(form) {
  const data = new FormData(form);
  return {
    day: Math.min(30, Math.max(1, parseInt(data.get('day'), 10) || 1)),
    label: String(data.get('label') || ''),
    note: String(data.get('note') || ''),
    category: String(data.get('category') || 'groceries'),
    amount: parseFloat(data.get('amount')) || 0,
  };
}

document.addEventListener('click', (e) => {
  const t = e.target;
  if (!(t instanceof HTMLElement)) return;

  if (t.closest('[data-delete-tx]')) {
    const id = Number(t.closest('[data-delete-tx]').dataset.deleteTx);
    if (window.confirm('Delete this transaction?')) {
      deleteTransaction(state, id);
      if (ui.editingTx && ui.editingTx.id === id) ui.editingTx = null;
      rerender();
    }
    return;
  }
  if (t.closest('[data-edit-tx]')) {
    const id = Number(t.closest('[data-edit-tx]').dataset.editTx);
    ui.editingTx = state.transactions.find((x) => x.id === id) || null;
    rerender();
    const form = document.getElementById('tx-form');
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (t.closest('[data-cancel-edit]')) {
    ui.editingTx = null;
    rerender();
    return;
  }
  if (t.closest('[data-toggle-bill]')) {
    toggleBill(state, Number(t.closest('[data-toggle-bill]').dataset.toggleBill));
    rerender();
    return;
  }
  if (t.closest('[data-csv]')) {
    downloadCsv();
    return;
  }
  if (t.id === 'reset-demo') {
    if (window.confirm('Reset all demo data to the original November figures? Your edits will be lost.')) {
      state = resetState();
      ui.editingTx = null;
      ui.txSearch = '';
      ui.txCategory = 'all';
      ui.txSort = 'date-desc';
      rerender();
    }
  }
});

document.addEventListener('input', (e) => {
  const t = e.target;
  if (!(t instanceof HTMLElement)) return;
  if (t.id === 'tx-search') {
    ui.txSearch = t.value;
    // Re-rendering on every keystroke would drop focus, so only the table
    // and the count line are refreshed, not the whole page.
    const hash = location.hash || '#/';
    if (hash === '#/transactions') {
      const html = viewTransactions(state, ui);
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      const table = tmp.querySelector('table.tx-wide');
      const current = document.querySelector('table.tx-wide');
      if (table && current) current.replaceWith(table);
      const count = tmp.querySelector('p.muted');
      const currentCount = document.querySelector('p.muted');
      if (count && currentCount) currentCount.replaceWith(count);
    }
  }
});

document.addEventListener('change', (e) => {
  const t = e.target;
  if (!(t instanceof HTMLElement)) return;
  if (t.id === 'tx-category') {
    ui.txCategory = t.value;
    rerender();
  } else if (t.id === 'tx-sort') {
    ui.txSort = t.value;
    rerender();
  }
});

document.addEventListener('submit', (e) => {
  const form = e.target;
  if (!(form instanceof HTMLFormElement)) return;
  e.preventDefault();
  const data = new FormData(form);

  if (form.id === 'tx-form') {
    const tx = readTxForm(form);
    if (!tx.label || tx.amount <= 0) return;
    const editingId = form.dataset.editing ? Number(form.dataset.editing) : 0;
    if (editingId) {
      updateTransaction(state, editingId, tx);
      ui.editingTx = null;
    } else {
      addTransaction(state, tx);
    }
    rerender();
    return;
  }
  if (form.classList.contains('budget-form')) {
    const amount = parseFloat(data.get('amount'));
    if (!Number.isNaN(amount) && amount >= 0) {
      setBudget(state, form.dataset.budget, amount);
      rerender();
    }
    return;
  }
  if (form.id === 'bill-form') {
    const label = String(data.get('label') || '').trim();
    const day = Math.min(30, Math.max(1, parseInt(data.get('day'), 10) || 1));
    const amount = parseFloat(data.get('amount'));
    if (label && amount > 0) {
      addBill(state, { label, day, amount });
      rerender();
    }
    return;
  }
  if (form.classList.contains('goal-form')) {
    const amount = parseFloat(data.get('amount'));
    if (!Number.isNaN(amount) && amount > 0) {
      addToGoal(state, Number(form.dataset.goal), amount);
      rerender();
    }
  }
});

window.addEventListener('hashchange', route);
route();
