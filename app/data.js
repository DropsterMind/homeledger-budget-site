// HomeLedger seed data — the Alvarez household, November 2026.
// Maya & Daniel, Sofia (9) and Leo (6). All figures are the household's
// own November books; the store derives every total from these lists.

export const HOUSEHOLD = {
  name: 'The Alvarez household',
  members: ['Maya', 'Daniel', 'Sofia (9)', 'Leo (6)'],
  month: 'November 2026',
  currency: 'USD',
};

export const INCOME = [
  { id: 'inc-1', date: '2026-11-01', label: "Maya's salary", amount: 3900.0 },
  { id: 'inc-2', date: '2026-11-01', label: "Daniel's salary", amount: 2750.0 },
  { id: 'inc-3', date: '2026-11-14', label: 'Weekend wiring job — Daniel', amount: 200.0 },
];

export const CATEGORIES = [
  { key: 'housing', label: 'Housing', color: '#1d4d3b' },
  { key: 'home', label: 'Home & repairs', color: '#8a6d3b' },
  { key: 'groceries', label: 'Groceries', color: '#2e7d32' },
  { key: 'transport', label: 'Transport', color: '#1565c0' },
  { key: 'utilities', label: 'Utilities', color: '#6a1b9a' },
  { key: 'dining', label: 'Dining out', color: '#c62828' },
  { key: 'entertainment', label: 'Entertainment', color: '#ef6c00' },
  { key: 'health', label: 'Health', color: '#00838f' },
  { key: 'kids', label: 'Kids & school', color: '#ad1457' },
  { key: 'clothing', label: 'Clothing', color: '#5d4037' },
];

// Monthly plan, in dollars. Savings is a plan too: the amount the
// household aims to keep, not spend.
export const BUDGETS = [
  { category: 'housing', planned: 1850 },
  { category: 'home', planned: 300 },
  { category: 'groceries', planned: 720 },
  { category: 'transport', planned: 380 },
  { category: 'utilities', planned: 290 },
  { category: 'dining', planned: 240 },
  { category: 'entertainment', planned: 150 },
  { category: 'health', planned: 210 },
  { category: 'kids', planned: 260 },
  { category: 'clothing', planned: 120 },
  { category: 'savings', planned: 1900 },
];

export const TRANSACTIONS = [
  { id: 'tx-01', date: '2026-11-01', label: 'Monthly rent — Maple St apartment', category: 'housing', amount: 1850.0 },
  { id: 'tx-02', date: '2026-11-02', label: 'GreenMart weekly shop', category: 'groceries', amount: 142.3 },
  { id: 'tx-03', date: '2026-11-02', label: 'School lunch plan — Sofia & Leo', category: 'kids', amount: 45.0 },
  { id: 'tx-04', date: '2026-11-03', label: 'Petrol — Shell, 38 litres', category: 'transport', amount: 48.0 },
  { id: 'tx-05', date: '2026-11-04', label: "Pizza night — Tony's", category: 'dining', amount: 38.5 },
  { id: 'tx-06', date: '2026-11-05', label: 'Electric bill — City Power', category: 'utilities', amount: 96.4 },
  { id: 'tx-07', date: '2026-11-06', label: 'Internet — Fibre 200 Mbps', category: 'utilities', amount: 59.99 },
  { id: 'tx-08', date: '2026-11-06', label: 'Car insurance — monthly premium', category: 'transport', amount: 132.0 },
  { id: 'tx-09', date: '2026-11-07', label: 'GreenMart weekly shop', category: 'groceries', amount: 98.45 },
  { id: 'tx-10', date: '2026-11-07', label: 'Cinema — family movie night', category: 'entertainment', amount: 32.0 },
  { id: 'tx-11', date: '2026-11-08', label: 'Sushi dinner — Sakura', category: 'dining', amount: 64.2 },
  { id: 'tx-12', date: '2026-11-09', label: 'Metro card top-up — Daniel', category: 'transport', amount: 34.0 },
  { id: 'tx-13', date: '2026-11-09', label: "Art supplies — Sofia's class", category: 'kids', amount: 32.4 },
  { id: 'tx-14', date: '2026-11-10', label: 'Pharmacy — cold medicine', category: 'health', amount: 46.8 },
  { id: 'tx-15', date: '2026-11-11', label: 'FreshFarm Market — vegetables', category: 'groceries', amount: 121.8 },
  { id: 'tx-16', date: '2026-11-12', label: 'Water bill — City Water', category: 'utilities', amount: 42.1 },
  { id: 'tx-17', date: '2026-11-12', label: 'School trip — science museum', category: 'kids', amount: 95.0 },
  { id: 'tx-18', date: '2026-11-13', label: 'Winter jackets — Sofia & Leo', category: 'clothing', amount: 89.99 },
  { id: 'tx-19', date: '2026-11-13', label: 'Streaming — films & series', category: 'entertainment', amount: 15.99 },
  { id: 'tx-20', date: '2026-11-14', label: 'Petrol — Shell, 36 litres', category: 'transport', amount: 45.5 },
  { id: 'tx-21', date: '2026-11-15', label: 'Family brunch — The Corner Cafe', category: 'dining', amount: 52.75 },
  { id: 'tx-22', date: '2026-11-16', label: 'GreenMart weekly shop', category: 'groceries', amount: 86.2 },
  { id: 'tx-23', date: '2026-11-16', label: 'Soccer fees — Leo, winter term', category: 'kids', amount: 60.0 },
  { id: 'tx-24', date: '2026-11-17', label: 'Dentist copay — Maya', category: 'health', amount: 75.0 },
  { id: 'tx-25', date: '2026-11-18', label: 'Phone plan — family, 2 lines', category: 'utilities', amount: 85.0 },
  { id: 'tx-26', date: '2026-11-18', label: 'GreenMart — top-up shop', category: 'groceries', amount: 78.9 },
  { id: 'tx-27', date: '2026-11-19', label: 'Board game — Catan, family night', category: 'entertainment', amount: 28.5 },
  { id: 'tx-28', date: '2026-11-20', label: 'Parking — downtown, 4 hours', category: 'transport', amount: 18.0 },
  { id: 'tx-29', date: '2026-11-21', label: 'Costco run — bulk pantry', category: 'groceries', amount: 154.6 },
  { id: 'tx-30', date: '2026-11-21', label: 'Anniversary dinner — La Mesa', category: 'dining', amount: 96.4 },
  { id: 'tx-31', date: '2026-11-22', label: 'Takeaway Thai — Baan Thai', category: 'dining', amount: 41.9 },
  { id: 'tx-32', date: '2026-11-23', label: 'Petrol — Shell, 33 litres', category: 'transport', amount: 41.25 },
  { id: 'tx-33', date: '2026-11-24', label: 'GreenMart weekly shop', category: 'groceries', amount: 64.15 },
  { id: 'tx-34', date: '2026-11-24', label: 'Flu shots — Maya & Daniel', category: 'health', amount: 58.0 },
  { id: 'tx-35', date: '2026-11-25', label: 'Plumber — fixed the kitchen leak', category: 'home', amount: 320.0 },
  { id: 'tx-36', date: '2026-11-25', label: 'Concert tickets — local jazz night', category: 'entertainment', amount: 110.0 },
  { id: 'tx-37', date: '2026-11-26', label: 'Heating — gas top-up, cold snap', category: 'utilities', amount: 64.2 },
  { id: 'tx-38', date: '2026-11-26', label: "School shoes — Leo", category: 'clothing', amount: 54.99 },
];

export const BILLS = [
  { id: 'bill-01', label: 'Rent — Maple St apartment', amount: 1850.0, due: '2026-11-01', paid: true },
  { id: 'bill-02', label: 'School lunch plan', amount: 45.0, due: '2026-11-02', paid: true },
  { id: 'bill-03', label: 'Electric — City Power', amount: 96.4, due: '2026-11-05', paid: true },
  { id: 'bill-04', label: 'Internet — Fibre 200 Mbps', amount: 59.99, due: '2026-11-06', paid: true },
  { id: 'bill-05', label: 'Car insurance — monthly premium', amount: 132.0, due: '2026-11-06', paid: true },
  { id: 'bill-06', label: 'Water — City Water', amount: 42.1, due: '2026-11-12', paid: true },
  { id: 'bill-07', label: 'Streaming — films & series', amount: 15.99, due: '2026-11-13', paid: true },
  { id: 'bill-08', label: 'Phone plan — family, 2 lines', amount: 85.0, due: '2026-11-18', paid: true },
  { id: 'bill-09', label: 'Gym membership', amount: 29.0, due: '2026-11-20', paid: false },
  { id: 'bill-10', label: 'Credit card — November statement', amount: 412.0, due: '2026-11-27', paid: false },
];

export const GOALS = [
  { id: 'goal-1', name: 'Emergency fund', saved: 8200, target: 10000, note: 'Six months of essentials, for the unexpected.' },
  { id: 'goal-2', name: 'Family holiday — Bali, July 2027', saved: 1450, target: 2500, note: 'Flights and a week by the sea for four.' },
  { id: 'goal-3', name: 'New car', saved: 3100, target: 12000, note: 'Replacing the old hatchback before next winter.' },
  { id: 'goal-4', name: "Kids' education", saved: 900, target: 5000, note: 'A head start on Sofia and Leo’s school years.' },
];

// June–November 2026: income vs spending, the shape of the household year.
export const HISTORY = [
  { month: 'Jun', income: 6700, spent: 4380 },
  { month: 'Jul', income: 6850, spent: 4720 },
  { month: 'Aug', income: 6700, spent: 4150 },
  { month: 'Sep', income: 6850, spent: 4890 },
  { month: 'Oct', income: 6850, spent: 4208 },
  { month: 'Nov', income: 6850, spent: 4620.26 },
];
