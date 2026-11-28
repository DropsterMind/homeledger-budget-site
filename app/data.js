// HomeLedger v3 — seed data for the Alvarez household, November 2026.
// A fictional family (Maya & Daniel, Sofia 9, Leo 6) keeping its monthly
// budget. Every figure below is the seed the whole site computes from:
// edit a transaction, a budget or a bill and every total on every page
// recomputes from these numbers. Nothing here is fetched over the network.

export const HOUSEHOLD = {
  name: 'Alvarez household',
  members: 'Maya & Daniel, Sofia (9), Leo (6)',
  month: 'November 2026',
  // The demo's "today": the last day with transactions so far. All
  // countdowns, pace figures and projections are measured from this date.
  today: { year: 2026, month: 11, day: 26 },
  monthDays: 30,
  currency: 'USD',
};

export const INCOME = [
  { label: "Maya's salary", day: 1, amount: 3900.0 },
  { label: "Daniel's salary", day: 1, amount: 2750.0 },
  { label: 'Daniel — weekend wiring job', day: 14, amount: 200.0 },
];

// December uses the same paydays as November: the plan page starts
// from the same $6,850 coming in.
export const DECEMBER_INCOME = [
  { label: "Maya's salary", day: 1, amount: 3900.0 },
  { label: "Daniel's salary", day: 1, amount: 2750.0 },
  { label: 'Daniel — weekend wiring job', day: 14, amount: 200.0 },
];

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#1d4d3b', fixed: true },
  { id: 'home', label: 'Home & repairs', color: '#8a6d3b' },
  { id: 'transport', label: 'Transport', color: '#1565c0' },
  { id: 'groceries', label: 'Groceries', color: '#2e7d32' },
  { id: 'utilities', label: 'Utilities', color: '#6a1b9a' },
  { id: 'dining', label: 'Dining out', color: '#c62828' },
  { id: 'entertainment', label: 'Entertainment', color: '#ef6c00' },
  { id: 'health', label: 'Health', color: '#00838f' },
  { id: 'kids', label: 'Kids & school', color: '#ad1457' },
  { id: 'clothing', label: 'Clothing', color: '#5d4037' },
];

// Planned monthly budget per category. Savings is the plan for what stays
// in the bank, not a spending category.
export const BUDGETS = {
  housing: 1850,
  home: 300,
  groceries: 720,
  transport: 380,
  utilities: 290,
  dining: 240,
  entertainment: 150,
  health: 210,
  kids: 260,
  clothing: 120,
  savings: 1900,
};

export const TRANSACTIONS = [
  { id: 1, day: 1, label: 'Monthly rent', note: 'Maple St apartment', category: 'housing', amount: 1850.0 },
  { id: 2, day: 2, label: 'GreenMart weekly shop', note: '', category: 'groceries', amount: 142.3 },
  { id: 3, day: 2, label: 'School lunch plan', note: 'Sofia & Leo', category: 'kids', amount: 45.0 },
  { id: 4, day: 3, label: 'Petrol — Shell', note: '38 litres', category: 'transport', amount: 48.0 },
  { id: 5, day: 4, label: "Pizza night — Tony's", note: '', category: 'dining', amount: 38.5 },
  { id: 6, day: 5, label: 'Electric bill — City Power', note: '', category: 'utilities', amount: 96.4 },
  { id: 7, day: 6, label: 'Internet — Fibre 200 Mbps', note: '', category: 'utilities', amount: 59.99 },
  { id: 8, day: 6, label: 'Car insurance', note: 'monthly premium', category: 'transport', amount: 132.0 },
  { id: 9, day: 7, label: 'GreenMart weekly shop', note: '', category: 'groceries', amount: 98.45 },
  { id: 10, day: 7, label: 'Cinema — family movie night', note: '', category: 'entertainment', amount: 32.0 },
  { id: 11, day: 8, label: 'Sushi dinner — Sakura', note: '', category: 'dining', amount: 64.2 },
  { id: 12, day: 9, label: 'Metro card top-up — Daniel', note: '', category: 'transport', amount: 34.0 },
  { id: 13, day: 9, label: 'Art supplies', note: "Sofia's class", category: 'kids', amount: 32.4 },
  { id: 14, day: 10, label: 'Pharmacy — cold medicine', note: '', category: 'health', amount: 46.8 },
  { id: 15, day: 11, label: 'FreshFarm Market', note: 'vegetables', category: 'groceries', amount: 121.8 },
  { id: 16, day: 12, label: 'Water bill — City Water', note: '', category: 'utilities', amount: 42.1 },
  { id: 17, day: 12, label: 'School trip — science museum', note: '', category: 'kids', amount: 95.0 },
  { id: 18, day: 13, label: 'Winter jackets', note: 'Sofia & Leo', category: 'clothing', amount: 89.99 },
  { id: 19, day: 13, label: 'Streaming — films & series', note: '', category: 'entertainment', amount: 15.99 },
  { id: 20, day: 14, label: 'Petrol — Shell', note: '36 litres', category: 'transport', amount: 45.5 },
  { id: 21, day: 15, label: 'Family brunch — The Corner Cafe', note: '', category: 'dining', amount: 52.75 },
  { id: 22, day: 16, label: 'GreenMart weekly shop', note: '', category: 'groceries', amount: 86.2 },
  { id: 23, day: 16, label: 'Soccer fees — Leo', note: 'winter term', category: 'kids', amount: 60.0 },
  { id: 24, day: 17, label: 'Dentist copay — Maya', note: '', category: 'health', amount: 75.0 },
  { id: 25, day: 18, label: 'Phone plan — family', note: '2 lines', category: 'utilities', amount: 85.0 },
  { id: 26, day: 18, label: 'GreenMart — top-up shop', note: '', category: 'groceries', amount: 78.9 },
  { id: 27, day: 19, label: 'Board game — Catan', note: 'family night', category: 'entertainment', amount: 28.5 },
  { id: 28, day: 20, label: 'Parking — downtown', note: '4 hours', category: 'transport', amount: 18.0 },
  { id: 29, day: 21, label: 'Costco run — bulk pantry', note: '', category: 'groceries', amount: 154.6 },
  { id: 30, day: 21, label: 'Anniversary dinner — La Mesa', note: '', category: 'dining', amount: 96.4 },
  { id: 31, day: 22, label: 'Takeaway Thai — Baan Thai', note: '', category: 'dining', amount: 41.9 },
  { id: 32, day: 23, label: 'Petrol — Shell', note: '33 litres', category: 'transport', amount: 41.25 },
  { id: 33, day: 24, label: 'GreenMart weekly shop', note: '', category: 'groceries', amount: 64.15 },
  { id: 34, day: 24, label: 'Flu shots', note: 'Maya & Daniel', category: 'health', amount: 58.0 },
  { id: 35, day: 25, label: 'Plumber', note: 'fixed the kitchen leak', category: 'home', amount: 320.0 },
  { id: 36, day: 25, label: 'Concert tickets', note: 'local jazz night', category: 'entertainment', amount: 110.0 },
  { id: 37, day: 26, label: 'Heating — gas top-up', note: 'cold snap', category: 'utilities', amount: 64.2 },
  { id: 38, day: 26, label: 'School shoes — Leo', note: '', category: 'clothing', amount: 54.99 },
];

export const BILLS = [
  { id: 1, label: 'Rent', day: 1, amount: 1850.0, paid: true },
  { id: 2, label: 'School lunch plan', day: 2, amount: 45.0, paid: true },
  { id: 3, label: 'Electric — City Power', day: 5, amount: 96.4, paid: true },
  { id: 4, label: 'Internet — Fibre 200 Mbps', day: 6, amount: 59.99, paid: true, recurring: true },
  { id: 5, label: 'Car insurance', day: 6, amount: 132.0, paid: true },
  { id: 6, label: 'Water — City Water', day: 12, amount: 42.1, paid: true },
  { id: 7, label: 'Streaming — films & series', day: 13, amount: 15.99, paid: true, recurring: true },
  { id: 8, label: 'Phone plan — family', day: 18, amount: 85.0, paid: true, recurring: true },
  { id: 9, label: 'Gym membership', day: 20, amount: 29.0, paid: false, recurring: true },
  { id: 10, label: 'Credit card', day: 27, amount: 412.0, paid: false },
];

// Savings goals. targetDate is new in v2: the site turns it into a
// monthly amount still needed and an on-track check against the
// household's usual saving pace (six-month average, $2,305 a month).
export const GOALS = [
  { id: 1, label: 'Emergency fund', current: 8200, target: 10000, targetDate: '2027-12-31' },
  { id: 2, label: 'Family holiday — Bali, Jul 2027', current: 1450, target: 2500, targetDate: '2027-07-01' },
  { id: 3, label: 'New car', current: 3100, target: 12000, targetDate: '2028-06-30' },
  { id: 4, label: "Kids' education", current: 900, target: 5000, targetDate: '2030-12-31' },
];

// June–November 2026, income and spending per month. The six-month
// average saved is $2,305 a month — the pace every goal is judged by.
export const HISTORY = [
  { month: 'Jun', income: 6700, spent: 4380 },
  { month: 'Jul', income: 6850, spent: 4720 },
  { month: 'Aug', income: 6700, spent: 4150 },
  { month: 'Sep', income: 6850, spent: 4890 },
  { month: 'Oct', income: 6850, spent: 4208 },
  { month: 'Nov', income: 6850, spent: 4620.26 },
];
