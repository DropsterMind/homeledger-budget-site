// HomeLedger charts — small SVG helpers, no library, no network.
import { money0 } from './store.js';

export function esc(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// Donut of spending by category, with the total in the middle.
export function donut(rows, size = 260) {
  const total = rows.reduce((sum, r) => sum + r.spent, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const stroke = 30;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const arcs = rows
    .filter((row) => row.spent > 0)
    .map((row) => {
      const frac = row.spent / total;
      const dash = `${(frac * circumference).toFixed(1)} ${(circumference - frac * circumference).toFixed(1)}`;
      const circle =
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${row.color}" stroke-width="${stroke}" ` +
        `stroke-dasharray="${dash}" stroke-dashoffset="${(-offset).toFixed(1)}" />`;
      offset += frac * circumference;
      return circle;
    })
    .join('\n      ');
  return `<svg class="donut" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Spending by category, total ${money0(total)}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#efe9dc" stroke-width="${stroke}" />
      ${arcs}
      <text x="${cx}" y="${cy - 6}" text-anchor="middle" class="donut-total">${money0(total)}</text>
      <text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-label">spent in November</text>
    </svg>`;
}

// Grouped bars: income (green) next to spending (amber) per month.
export function bars(rows, width = 640, height = 260) {
  const max = Math.max(...rows.map((r) => Math.max(r.income, r.spent)));
  const padTop = 26;
  const padBottom = 26;
  const plotH = height - padTop - padBottom;
  const groupW = width / rows.length;
  const barW = Math.min(34, groupW / 3.4);
  const y = (v) => padTop + plotH - (v / max) * plotH;
  const groups = rows
    .map((row, i) => {
      const x = i * groupW + groupW / 2;
      return `<g>
        <rect x="${(x - barW - 3).toFixed(1)}" y="${y(row.income).toFixed(1)}" width="${barW}" height="${(plotH - (y(row.income) - padTop)).toFixed(1)}" fill="#1d4d3b" rx="3" />
        <rect x="${(x + 3).toFixed(1)}" y="${y(row.spent).toFixed(1)}" width="${barW}" height="${(plotH - (y(row.spent) - padTop)).toFixed(1)}" fill="#d97706" rx="3" />
        <text x="${x}" y="${y(row.income) - 6}" text-anchor="middle" class="bar-value">${money0(row.income)}</text>
        <text x="${x}" y="${height - 6}" text-anchor="middle" class="bar-label">${row.month}</text>
      </g>`;
    })
    .join('\n      ');
  return `<svg class="bars" viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Income and spending, June to November 2026">
      ${groups}
    </svg>`;
}

export function legend(rows) {
  return `<ul class="legend">${rows
    .map(
      (row) =>
        `<li><span class="swatch" style="background:${row.color}"></span>${esc(row.label)} <strong>${money0(row.spent)}</strong></li>`,
    )
    .join('')}</ul>`;
}
