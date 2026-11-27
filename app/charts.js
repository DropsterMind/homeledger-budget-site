// HomeLedger v2 — SVG charts, drawn by hand, no libraries and no network.
// donut: spending by category with the total in the middle.
// bars: monthly income vs spending for the six-month history.
// dayBars (new in v2): daily spending across November so far, so the
// household can see which days were expensive and which were quiet.

import { money0 } from './store.js';

function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function arcPath(cx, cy, rOuter, rInner, a0, a1) {
  const [x0, y0] = polar(cx, cy, rOuter, a0);
  const [x1, y1] = polar(cx, cy, rOuter, a1);
  const [x2, y2] = polar(cx, cy, rInner, a1);
  const [x3, y3] = polar(cx, cy, rInner, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${rOuter} ${rOuter} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} A ${rInner} ${rInner} 0 ${large} 0 ${x3.toFixed(2)} ${y3.toFixed(2)} Z`;
}

export function donut(rows, size) {
  const total = rows.reduce((s, r) => s + r.spent, 0);
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size / 2 - 4;
  const rInner = size / 2 - 34;
  let angle = 0;
  const parts = rows.map((r) => {
    const frac = total > 0 ? r.spent / total : 0;
    const a0 = angle;
    const a1 = angle + frac * 360;
    angle = a1;
    if (frac <= 0) return '';
    // A hairline gap between slices so neighbours stay readable.
    const d = arcPath(cx, cy, rOuter, rInner, a0 + 0.4, Math.max(a0 + 0.5, a1 - 0.4));
    return `<path d="${d}" fill="${r.color}"><title>${r.label}: ${money0(r.spent)}</title></path>`;
  });
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Spending by category, total ${money0(total)}" class="donut">${parts.join('')}<text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-total">${money0(total)}</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" class="donut-label">spent in Nov</text></svg>`;
}

export function legend(rows) {
  return `<ul class="legend">${rows
    .map(
      (r) =>
        `<li><span class="swatch" style="background:${r.color}"></span>${r.label}<strong>${money0(r.spent)}</strong></li>`,
    )
    .join('')}</ul>`;
}

export function bars(history, width, height) {
  const max = Math.max(...history.flatMap((h) => [h.income, h.spent]));
  const padL = 44;
  const padB = 22;
  const padT = 8;
  const innerW = width - padL - 8;
  const innerH = height - padT - padB;
  const groupW = innerW / history.length;
  const barW = Math.min(26, (groupW - 14) / 2);
  const y = (v) => padT + innerH - (v / max) * innerH;
  const parts = [];
  const grid = [0.25, 0.5, 0.75, 1];
  for (const f of grid) {
    const gy = padT + innerH * (1 - f);
    parts.push(`<line x1="${padL}" y1="${gy}" x2="${width - 8}" y2="${gy}" class="grid-line"/><text x="${padL - 6}" y="${gy + 4}" text-anchor="end" class="axis-label">${money0(max * f)}</text>`);
  }
  history.forEach((h, i) => {
    const x0 = padL + i * groupW + (groupW - barW * 2 - 6) / 2;
    parts.push(
      `<rect x="${x0.toFixed(1)}" y="${y(h.income).toFixed(1)}" width="${barW}" height="${(padT + innerH - y(h.income)).toFixed(1)}" fill="#1d4d3b" rx="2"><title>${h.month} income ${money0(h.income)}</title></rect>`,
      `<rect x="${(x0 + barW + 6).toFixed(1)}" y="${y(h.spent).toFixed(1)}" width="${barW}" height="${(padT + innerH - y(h.spent)).toFixed(1)}" fill="#d97706" rx="2"><title>${h.month} spent ${money0(h.spent)}</title></rect>`,
      `<text x="${(x0 + barW + 3).toFixed(1)}" y="${height - 6}" text-anchor="middle" class="axis-label">${h.month}</text>`,
    );
  });
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Income and spending by month" class="bars">${parts.join('')}</svg>`;
}

export function dayBars(days, width, height) {
  const max = Math.max(...days.map((d) => d.amount), 1);
  const padL = 44;
  const padB = 22;
  const padT = 8;
  const innerW = width - padL - 8;
  const innerH = height - padT - padB;
  const slotW = innerW / days.length;
  const barW = Math.max(3, Math.min(14, slotW - 3));
  const y = (v) => padT + innerH - (v / max) * innerH;
  const parts = [];
  for (const f of [0.5, 1]) {
    const gy = padT + innerH * (1 - f);
    parts.push(`<line x1="${padL}" y1="${gy}" x2="${width - 8}" y2="${gy}" class="grid-line"/><text x="${padL - 6}" y="${gy + 4}" text-anchor="end" class="axis-label">${money0(max * f)}</text>`);
  }
  days.forEach((d, i) => {
    const x = padL + i * slotW + (slotW - barW) / 2;
    const h = padT + innerH - y(d.amount);
    const fill = d.amount >= 300 ? '#b3261e' : d.amount >= 100 ? '#d97706' : '#1d4d3b';
    parts.push(
      `<rect x="${x.toFixed(1)}" y="${y(d.amount).toFixed(1)}" width="${barW}" height="${Math.max(0, h).toFixed(1)}" fill="${fill}" rx="1"><title>Nov ${d.day}: ${money0(d.amount)}</title></rect>`,
    );
    if (d.day % 5 === 1 || d.day === days.length) {
      parts.push(`<text x="${(x + barW / 2).toFixed(1)}" y="${height - 6}" text-anchor="middle" class="axis-label">${d.day}</text>`);
    }
  });
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Daily spending in November" class="bars">${parts.join('')}</svg>`;
}
