# HomeLedger — a household budget site that works

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/DropsterMind/homeledger-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/DropsterMind/homeledger-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

HomeLedger is a working household budget site for the fictional Alvarez
household (Maya & Daniel, Sofia 9, Leo 6) for November 2026. It runs
entirely offline from static files — no build step, no network, no
framework — on a desktop and on a phone. Every figure is real and every
control does what it says: edit a transaction and every total on every
page recomputes.

## The month so far

- **Income:** $6,850 (Maya's salary $3,900, Daniel's salary $2,750, plus a $200 weekend wiring job)
- **Spent:** $4,620.26 across 38 transactions — **saved $2,229.74 (33%)**
- **Plan:** $4,520 of spending plus $1,900 of savings — so the month is $100.26 over the spending plan, but $329.74 ahead of the savings plan
- **Bills:** 8 of 10 paid; $441.00 still outstanding (gym $29 overdue, credit card $412 due Nov 27)
- **Goals:** emergency fund $8,200 of $10,000; Bali holiday $1,450 of $2,500; new car $3,100 of $12,000; kids' education $900 of $5,000

## What it does

- **Dashboard** — income, spent, saved and left-to-spend cards; a month-pace strip (26 of 30 days gone, spending projected to $5,331.07 by month-end); spending donut with legend; budget watch; latest transactions; unpaid bills; closest goals.
- **Transactions** — search, filter by category, sort by date or amount; add, edit and delete transactions; download the month as CSV. All totals update live.
- **Budgets** — one card per category with a progress bar, over/under line and a pace check (spending so far vs the share of the month gone); plans are editable inline, including the savings plan.
- **Bills** — countdowns from today ("overdue by 6 days", "due tomorrow"), mark paid / undo, add-a-bill form, and the total due in the next 7 days. Recurring bills (internet, phone, gym, streaming) carry a Recurring tag, with a monthly recurring total of $189.98.
- **Plan December** — a forward-looking page: per-category December budget inputs starting from the November plan, live projected savings against the same $6,850 of December income, a "Copy November plan" button, and an over-plan warning when the plan spends more than the income.
- **Goals** — each goal shows its target date, the monthly amount still needed, and whether the household's usual saving pace ($2,305 a month) covers it; add funds to any goal.
- **Reports** — income vs spending for Jun–Nov 2026, daily spending bars for November, categories ranked by spending, and insights computed from the data (biggest costs, pace, projected month-end).

Edits persist in the browser (localStorage); **Reset demo data** in the
footer restores the original November figures.

## Run it

```sh
node serve.ts          # http://localhost:8080
# or serve app/ with any static server and open app/index.html
```

## v2 — what changed

v1 scored 1809 of 4675 in blind round 1. v2 keeps the same household and
the same verified figures, and adds the tools a household actually
reaches for: editing transactions instead of only adding and deleting,
sorting and CSV export, a pace check on every budget, goal tracking
against target dates and the household's usual saving pace, daily
spending bars and a month-end projection on Reports, and bill countdowns.
Nothing is a placeholder — every button on every page works.

## v3 — what changed

v2 climbed to 514 of 5,723 in blind round 2. v3 keeps the same household
and the same verified figures, and adds the one thing v2 lacked: a way to
look forward. A seventh page, **Plan December**, starts from the November
plan with the same $6,850 of December income and shows the projected
saving live as any figure changes, with an over-plan warning and a
"Copy November plan" reset. Bills now tag the recurring ones (internet,
phone, gym, streaming) with a monthly recurring total, and the fourth
screenshot shows the new planning page instead of Reports. Nothing is a
placeholder — every button on every page works.

## Entered on make.fun

Built for the [best-household-budget-site-20261126-1457](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) bounty on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457).

## License

MIT — see [LICENSE](LICENSE).
