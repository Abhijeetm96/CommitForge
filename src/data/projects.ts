export interface ProjectDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  files: Record<string, string>;
  previewEntryPoint: string; // usually 'index.html'
}

export const PROJECTS: Record<string, ProjectDefinition> = {
  'personal-website': {
    id: 'personal-website',
    name: 'Personal Website',
    category: 'Frontend Portfolio',
    description: 'A responsive developer portfolio with project highlights, skills grid, and contact form.',
    previewEntryPoint: 'index.html',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Alex Rivera | Software Engineer</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="hero">
    <h1>Alex Rivera</h1>
    <p class="subtitle">Full-Stack Engineer & Open Source Contributor</p>
    <div class="tags">
      <span>React</span> <span>Node.js</span> <span>TypeScript</span> <span>Git</span>
    </div>
  </header>
  <main class="container">
    <section class="card">
      <h2>About Me</h2>
      <p>I build reliable web software and contribute to developer tools.</p>
    </section>
    <section class="card">
      <h2>Featured Project: CommitForge</h2>
      <p>An interactive academy for mastering Git version control.</p>
      <button id="likeBtn" class="btn">⭐ Star Project (<span id="count">42</span>)</button>
    </section>
  </main>
  <script src="script.js"></script>
</body>
</html>`,
      'style.css': `* { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, sans-serif; }
body { background: #0b0f19; color: #f1f5f9; padding: 2rem; }
.hero { text-align: center; margin-bottom: 2rem; }
.hero h1 { font-size: 2.2rem; color: #f05033; }
.subtitle { color: #94a3b8; margin: 0.5rem 0 1rem; }
.tags span { background: #1e293b; padding: 0.3rem 0.8rem; border-radius: 999px; font-size: 0.85rem; margin: 0 0.2rem; color: #38bdf8; }
.container { max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
.card { background: #151c2c; border: 1px solid #334155; border-radius: 8px; padding: 1.5rem; }
.card h2 { font-size: 1.2rem; margin-bottom: 0.5rem; color: #e2e8f0; }
.card p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin-bottom: 1rem; }
.btn { background: #f05033; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; font-weight: bold; }
.btn:hover { background: #d94125; }`,
      'script.js': `const btn = document.getElementById('likeBtn');
const count = document.getElementById('count');
if (btn && count) {
  let stars = 42;
  btn.addEventListener('click', () => {
    stars++;
    count.textContent = stars;
  });
}`,
      'README.md': `# Personal Website
Source code for my developer portfolio website.
Created with HTML, CSS, and vanilla JS.`,
    },
  },

  'coffee-shop': {
    id: 'coffee-shop',
    name: 'Coffee Shop Website',
    category: 'E-Commerce / Food',
    description: 'An interactive artisan coffee shop with live ordering menu and bill calculator.',
    previewEntryPoint: 'index.html',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Roast & Ground Coffee</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>☕ Roast & Ground</h1>
    <p>Artisan Beans & Hand-Crafted Brews</p>
  </header>
  <div class="shop-layout">
    <section class="menu">
      <h2>Today's Specials</h2>
      <div class="items">
        <div class="item">
          <div>
            <strong>Espresso</strong>
            <p>$3.50</p>
          </div>
          <button onclick="addToOrder('Espresso', 3.50)">+ Add</button>
        </div>
        <div class="item">
          <div>
            <strong>Caramel Macchiato</strong>
            <p>$4.75</p>
          </div>
          <button onclick="addToOrder('Caramel Macchiato', 4.75)">+ Add</button>
        </div>
        <div class="item">
          <div>
            <strong>Cold Brew</strong>
            <p>$4.25</p>
          </div>
          <button onclick="addToOrder('Cold Brew', 4.25)">+ Add</button>
        </div>
      </div>
    </section>
    <aside class="cart">
      <h2>Your Cup</h2>
      <ul id="cartItems"></ul>
      <div class="total-row">
        <span>Total:</span>
        <strong id="totalPrice">$0.00</strong>
      </div>
      <button class="checkout-btn" onclick="checkout()">Place Order</button>
    </aside>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      'style.css': `* { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, sans-serif; }
body { background: #181412; color: #fdf8f5; padding: 1.5rem; }
header { text-align: center; margin-bottom: 2rem; border-bottom: 1px solid #3e2f26; padding-bottom: 1rem; }
header h1 { color: #d4a373; }
header p { color: #a98467; }
.shop-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; max-width: 800px; margin: 0 auto; }
.menu, .cart { background: #231b17; border: 1px solid #4a3728; border-radius: 8px; padding: 1.2rem; }
.menu h2, .cart h2 { font-size: 1.1rem; color: #ccd5ae; margin-bottom: 1rem; }
.item { display: flex; justify-content: space-between; align-items: center; padding: 0.8rem 0; border-bottom: 1px solid #33261d; }
.item button { background: #d4a373; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; font-weight: bold; cursor: pointer; color: #181412; }
.item button:hover { background: #faedcd; }
#cartItems { list-style: none; min-height: 80px; margin-bottom: 1rem; font-size: 0.9rem; }
#cartItems li { display: flex; justify-content: space-between; padding: 0.3rem 0; color: #e6ccb2; }
.total-row { display: flex; justify-content: space-between; font-size: 1.1rem; border-top: 1px solid #4a3728; padding-top: 0.8rem; margin-bottom: 1rem; }
.checkout-btn { width: 100%; background: #606c38; color: white; border: none; padding: 0.7rem; border-radius: 6px; font-weight: bold; cursor: pointer; }
.checkout-btn:hover { background: #283618; }`,
      'script.js': `let total = 0;
const cart = [];

function addToOrder(name, price) {
  cart.push({ name, price });
  total += price;
  renderCart();
}

function renderCart() {
  const list = document.getElementById('cartItems');
  const totalEl = document.getElementById('totalPrice');
  if (!list || !totalEl) return;

  list.innerHTML = cart.map(i => '<li><span>' + i.name + '</span><span>$' + i.price.toFixed(2) + '</span></li>').join('');
  totalEl.textContent = '$' + total.toFixed(2);
}

function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  alert('Thank you for ordering! Total: $' + total.toFixed(2));
  cart.length = 0;
  total = 0;
  renderCart();
}`,
      '.gitignore': `node_modules/
dist/
*.log
.env`,
    },
  },

  'ecommerce-store': {
    id: 'ecommerce-store',
    name: 'E-Commerce Store',
    category: 'Full Application',
    description: 'A modular storefront with catalog, shopping cart, discounts, and order processing.',
    previewEntryPoint: 'index.html',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PulseTech Store</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <nav class="navbar">
    <div class="logo">⚡ PulseTech</div>
    <div class="cart-badge">🛒 Cart: <span id="cartCount">0</span> items</div>
  </nav>
  <main class="store-grid">
    <div class="product-card">
      <div class="product-image">🎧</div>
      <h3>Wireless ANC Headphones</h3>
      <p class="price">$149.99</p>
      <button onclick="addToCart('Headphones', 149.99)">Add to Cart</button>
    </div>
    <div class="product-card">
      <div class="product-image">⌨️</div>
      <h3>Mechanical Keyboard</h3>
      <p class="price">$89.99</p>
      <button onclick="addToCart('Keyboard', 89.99)">Add to Cart</button>
    </div>
    <div class="product-card">
      <div class="product-image">🖱️</div>
      <h3>Precision Wireless Mouse</h3>
      <p class="price">$49.99</p>
      <button onclick="addToCart('Mouse', 49.99)">Add to Cart</button>
    </div>
  </main>
  <div class="checkout-panel">
    <h3>Apply Discount Code</h3>
    <div class="discount-input">
      <input type="text" id="coupon" placeholder="e.g. FORGE20">
      <button onclick="applyDiscount()">Apply</button>
    </div>
    <p id="discountMsg"></p>
    <p class="final-total">Subtotal: <span id="subtotal">$0.00</span></p>
  </div>
  <script src="cart.js"></script>
</body>
</html>`,
      'style.css': `* { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, sans-serif; }
body { background: #0a0e17; color: #e2e8f0; padding: 1.5rem; }
.navbar { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid #1e293b; margin-bottom: 2rem; }
.logo { font-size: 1.4rem; font-weight: bold; color: #38bdf8; }
.cart-badge { background: #1e293b; padding: 0.5rem 1rem; border-radius: 999px; font-size: 0.9rem; }
.store-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.product-card { background: #111827; border: 1px solid #1f2937; border-radius: 8px; padding: 1.2rem; text-align: center; }
.product-image { font-size: 2.5rem; margin-bottom: 0.5rem; }
.product-card h3 { font-size: 1rem; margin-bottom: 0.5rem; }
.price { color: #10b981; font-weight: bold; margin-bottom: 1rem; }
.product-card button { background: #2563eb; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
.product-card button:hover { background: #1d4ed8; }
.checkout-panel { background: #111827; border: 1px solid #1f2937; border-radius: 8px; padding: 1.5rem; max-width: 400px; margin: 0 auto; }
.discount-input { display: flex; gap: 0.5rem; margin: 0.8rem 0; }
.discount-input input { flex: 1; padding: 0.5rem; background: #1f2937; border: 1px solid #374151; color: white; border-radius: 4px; }
.discount-input button { background: #10b981; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
.final-total { font-size: 1.1rem; font-weight: bold; margin-top: 1rem; }`,
      'cart.js': `let items = [];
let discount = 0;

function addToCart(name, price) {
  items.push({ name, price });
  updateUI();
}

function applyDiscount() {
  const code = document.getElementById('coupon').value.trim().toUpperCase();
  const msg = document.getElementById('discountMsg');
  if (code === 'FORGE20') {
    discount = 0.20;
    msg.textContent = '20% Discount applied!';
    msg.style.color = '#10b981';
  } else {
    msg.textContent = 'Invalid promo code.';
    msg.style.color = '#ef4444';
  }
  updateUI();
}

function updateUI() {
  document.getElementById('cartCount').textContent = items.length;
  let sub = items.reduce((acc, i) => acc + i.price, 0);
  let total = sub * (1 - discount);
  document.getElementById('subtotal').textContent = '$' + total.toFixed(2);
}`,
      'README.md': `# PulseTech E-Commerce Store
Production-ready interactive shopping cart and product catalog.`,
    },
  },

  'expense-tracker': {
    id: 'expense-tracker',
    name: 'Expense Tracker',
    category: 'Finance Tool',
    description: 'Personal finance application with transaction ledger and live balance computation.',
    previewEntryPoint: 'index.html',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Smart Expense Tracker</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="app-card">
    <h2>💰 Smart Expenses</h2>
    <div class="balance-box">
      <span>Total Balance:</span>
      <h1 id="balanceDisplay">$0.00</h1>
    </div>
    <form id="txForm" onsubmit="event.preventDefault(); addTx();">
      <input id="txDesc" placeholder="Description (e.g. Groceries)" required>
      <input id="txAmount" type="number" step="0.01" placeholder="Amount (+/-)" required>
      <button type="submit">+ Add Transaction</button>
    </form>
    <ul id="txList" class="tx-list"></ul>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
      'style.css': `* { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, sans-serif; }
body { background: #0f172a; color: #f8fafc; padding: 2rem; display: flex; justify-content: center; }
.app-card { background: #1e293b; border-radius: 12px; padding: 1.5rem; width: 100%; max-width: 420px; border: 1px solid #334155; }
.balance-box { text-align: center; margin: 1rem 0; padding: 1rem; background: #0f172a; border-radius: 8px; }
.balance-box h1 { color: #38bdf8; }
form { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem; }
form input { padding: 0.6rem; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: white; }
form button { background: #0284c7; color: white; border: none; padding: 0.7rem; border-radius: 6px; font-weight: bold; cursor: pointer; }
.tx-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
.tx-list li { display: flex; justify-content: space-between; padding: 0.6rem; background: #0f172a; border-radius: 6px; font-size: 0.95rem; }
.pos { color: #10b981; }
.neg { color: #ef4444; }`,
      'app.js': `let transactions = [];

function addTx() {
  const desc = document.getElementById('txDesc').value;
  const amount = parseFloat(document.getElementById('txAmount').value);
  if (!desc || isNaN(amount)) return;

  transactions.push({ desc, amount });
  document.getElementById('txDesc').value = '';
  document.getElementById('txAmount').value = '';
  render();
}

function render() {
  const list = document.getElementById('txList');
  const bal = document.getElementById('balanceDisplay');
  const total = transactions.reduce((a, b) => a + b.amount, 0);

  bal.textContent = (total < 0 ? '-$' : '$') + Math.abs(total).toFixed(2);
  bal.style.color = total >= 0 ? '#10b981' : '#ef4444';

  list.innerHTML = transactions.map(t =>
    '<li><span>' + t.desc + '</span><strong class="' + (t.amount >= 0 ? 'pos' : 'neg') + '">' + (t.amount >= 0 ? '+' : '') + '$' + t.amount.toFixed(2) + '</strong></li>'
  ).join('');
}`,
    },
  },

  'todo-app': {
    id: 'todo-app',
    name: 'Todo Application',
    category: 'Productivity',
    description: 'A clean task management application with status toggles and filtering.',
    previewEntryPoint: 'index.html',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Forge Tasks</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="todo-card">
    <h2>📋 Forge Tasks</h2>
    <div class="input-row">
      <input id="taskInput" placeholder="Add a new goal...">
      <button onclick="addTask()">Add</button>
    </div>
    <ul id="taskList"></ul>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      'style.css': `* { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, sans-serif; }
body { background: #121824; color: #e2e8f0; padding: 2rem; display: flex; justify-content: center; }
.todo-card { background: #1c2436; border: 1px solid #2d3748; border-radius: 8px; padding: 1.5rem; width: 100%; max-width: 400px; }
.input-row { display: flex; gap: 0.5rem; margin: 1rem 0; }
.input-row input { flex: 1; padding: 0.6rem; background: #121824; border: 1px solid #4a5568; color: white; border-radius: 4px; }
.input-row button { background: #3b82f6; color: white; border: none; padding: 0.6rem 1rem; border-radius: 4px; cursor: pointer; }
#taskList { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
#taskList li { padding: 0.6rem; background: #121824; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; }
.done { text-decoration: line-through; opacity: 0.5; }`,
      'script.js': `const tasks = [
  { text: 'Learn git init', done: true },
  { text: 'Understand staging area', done: true },
  { text: 'Master branching and merge', done: false }
];

function render() {
  const el = document.getElementById('taskList');
  el.innerHTML = tasks.map((t, idx) =>
    '<li class="' + (t.done ? 'done' : '') + '"><span>' + t.text + '</span><button onclick="toggle(' + idx + ')">' + (t.done ? '↩️' : '✅') + '</button></li>'
  ).join('');
}

function addTask() {
  const inp = document.getElementById('taskInput');
  if (inp.value.trim()) {
    tasks.push({ text: inp.value.trim(), done: false });
    inp.value = '';
    render();
  }
}

function toggle(idx) {
  tasks[idx].done = !tasks[idx].done;
  render();
}

render();`,
    },
  },

  'customer-crm': {
    id: 'customer-crm',
    name: 'Customer Management System',
    category: 'Enterprise CRM',
    description: 'A multi-table CRM with lead tracking, status filtering, and search.',
    previewEntryPoint: 'index.html',
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Customer Hub CRM</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="crm-container">
    <header class="crm-header">
      <h2>👥 Customer Hub CRM</h2>
      <input type="text" id="search" placeholder="Search accounts..." onkeyup="filterUsers()">
    </header>
    <table class="crm-table">
      <thead>
        <tr><th>Name</th><th>Role</th><th>Company</th><th>Status</th></tr>
      </thead>
      <tbody id="userRows"></tbody>
    </table>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
      'style.css': `* { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, sans-serif; }
body { background: #090d16; color: #e2e8f0; padding: 1.5rem; }
.crm-container { max-width: 800px; margin: 0 auto; background: #131b2e; border: 1px solid #1e293b; border-radius: 8px; padding: 1.5rem; }
.crm-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.crm-header input { padding: 0.5rem 1rem; background: #090d16; border: 1px solid #334155; color: white; border-radius: 6px; }
.crm-table { width: 100%; border-collapse: collapse; text-align: left; }
.crm-table th, .crm-table td { padding: 0.8rem; border-bottom: 1px solid #1e293b; font-size: 0.9rem; }
.crm-table th { color: #94a3b8; font-weight: 600; }
.badge-active { background: #064e3b; color: #34d399; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.8rem; }
.badge-lead { background: #451a03; color: #fbbf24; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.8rem; }`,
      'app.js': `const customers = [
  { name: 'Sarah Connor', role: 'VP Engineering', company: 'Cyberdyne', status: 'Active' },
  { name: 'Bruce Wayne', role: 'Chairman', company: 'Wayne Ent', status: 'Active' },
  { name: 'Tony Stark', role: 'Chief Architect', company: 'Stark Ind', status: 'Lead' },
  { name: 'Diana Prince', role: 'Curator', company: 'Museum Intl', status: 'Active' }
];

function render(list) {
  const tb = document.getElementById('userRows');
  tb.innerHTML = list.map(c =>
    '<tr><td>' + c.name + '</td><td>' + c.role + '</td><td>' + c.company + '</td><td><span class="' + (c.status === 'Active' ? 'badge-active' : 'badge-lead') + '">' + c.status + '</span></td></tr>'
  ).join('');
}

function filterUsers() {
  const q = document.getElementById('search').value.toLowerCase();
  render(customers.filter(c => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)));
}

render(customers);`,
    },
  },
};
