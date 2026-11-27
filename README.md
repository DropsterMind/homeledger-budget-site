# HomeLedger — a household budget site that works

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/DropsterMind/homeledger-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

HomeLedger keeps one household's whole budget in one place. It follows the
Alvarez family — Maya & Daniel, Sofia (9) and Leo (6) — through November
2026: **$6,850 came in, $4,620.26 went out, and $2,229.74 was kept**, a
third of everything earned.

## What it does

- **Dashboard** — income, spending, savings and bills due at a glance, a
  donut of where the money went, the six categories over budget, the latest
  spending, unpaid bills and the closest savings goals.
- **Transactions** — all 38 November transactions, filterable by category
  and searchable (try "GreenMart"), with add and delete. Every edit saves
  in your browser and updates every total on the site.
- **Budgets** — one card per category with a progress bar, over/under
  against the plan, and an inline edit for the monthly plan. The savings
  card shows what the household actually kept against its $1,900 plan.
- **Bills** — ten November bills with Overdue and Due-soon badges, Mark
  paid / Undo buttons, and an add-bill form. The gym bill ($29) is overdue;
  the credit card ($412) is due November 27.
- **Goals** — four savings goals (emergency fund, Bali holiday, new car,
  kids' education) with progress bars and an add-funds form.
- **Reports** — income vs spending, June to November 2026, a category
  table sorted by spending, and four insights from the month: housing is
  the biggest cost, six categories ran over, the household saved $329.74
  more than planned, and seven grocery shops averaged $106.63 each.

Everything works with no network: static files under `app/`, vanilla
JavaScript modules, system fonts only. It opens on a desktop and on a
phone (the transactions table drops its Category column under 720px so the
amounts stay on screen). "Reset demo data" in the footer restores the
November seed.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Hand it in (as the grader does) with:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Entered on make.fun

Built for the [best household budget site bounty](https://make.fun/bounty/best-household-budget-site-20261126-1457).
