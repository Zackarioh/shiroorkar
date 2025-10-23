// Tiny JS: greet, counter, and theme toggle (persisted)
(function init() {
  // Restore theme
  try {
    const saved = localStorage.getItem('theme-basic');
    if (saved === 'dark') document.documentElement.classList.add('dark');
  } catch {}

  // Greet
  const nameInput = document.getElementById('name');
  const greetBtn = document.getElementById('greet-btn');
  const greetMsg = document.getElementById('greet-msg');
  greetBtn?.addEventListener('click', () => {
    const name = (nameInput?.value || '').trim();
    greetMsg.textContent = name ? `Hello, ${name}!` : 'Please enter your name.';
  });

  // Counter
  const countBtn = document.getElementById('count-btn');
  const countEl = document.getElementById('count');
  let count = 0;
  countBtn?.addEventListener('click', () => {
    count += 1;
    if (countEl) countEl.textContent = String(count);
  });

  // Theme toggle
  const themeBtn = document.getElementById('theme-btn');
  themeBtn?.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('theme-basic', dark ? 'dark' : 'light'); } catch {}
  });
})();

// Theme toggle with persistence + meta theme-color sync
(function() {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const text = btn?.querySelector('.theme-text');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const stored = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (systemPrefersDark ? 'dark' : 'light');
  setTheme(initial);

  btn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
  });

  function setTheme(mode) {
    root.setAttribute('data-theme', mode);
    if (btn) btn.setAttribute('aria-pressed', String(mode === 'dark'));
    if (icon) icon.textContent = mode === 'dark' ? '🌙' : '☀️';
    if (text) text.textContent = mode === 'dark' ? 'Dark' : 'Light';
    if (themeMeta) themeMeta.setAttribute('content', mode === 'dark' ? '#0b0c10' : '#ffffff');
  }
})();

// Newsletter form validation (demo)
(function() {
  const form = document.getElementById('newsletter-form');
  const input = document.getElementById('email');
  const msg = document.getElementById('form-msg');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      msg.textContent = 'Please enter a valid email address.';
      msg.style.color = 'var(--danger)';
      input.focus();
      return;
    }
    msg.textContent = 'Thanks! You will receive early access soon.';
    msg.style.color = 'var(--success)';
    form.reset();
  });
})();

// State
const state = {
  products: [],
  view: [], // filtered/sorted
  filters: { q: '', category: 'all', sort: 'featured' },
  cart: []
};

// Elements
const els = {
  grid: document.getElementById('product-grid'),
  empty: document.getElementById('empty-state'),
  live: document.getElementById('live-region'),
  search: document.getElementById('catalog-search'),
  filterCategory: document.getElementById('filter-category'),
  sort: document.getElementById('sort-select'),
  reset: document.getElementById('catalog-reset'),
  cartCount: document.getElementById('cart-count'),
  cartDrawer: document.getElementById('cart-drawer'),
  cartItems: document.getElementById('cart-items'),
  cartSubtotal: document.getElementById('cart-subtotal')
};

// Utils
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = (n) => `$${Number(n).toFixed(0)}`;
const announce = (msg) => { if (els.live) els.live.textContent = msg; };
const toast = $('#toast');
const showToast = (txt, ms = 2000) => {
  if (!toast) return;
  toast.textContent = txt;
  toast.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => (toast.hidden = true), ms);
};

// Theme
function setTheme(mode) {
  const root = document.documentElement;
  if (mode === 'system') {
    localStorage.removeItem('theme-basic');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', !!prefersDark);
    return;
  }
  root.classList.toggle('dark', mode === 'dark');
  try { localStorage.setItem('theme-basic', mode); } catch {}
}
(function initTheme() {
  // Sync with system when not set
  try {
    if (!localStorage.getItem('theme-basic') && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener?.('change', e => document.documentElement.classList.toggle('dark', e.matches));
    }
  } catch {}
})();

// Smooth scroll
$$('.nav a, .site-footer a, .actions a').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    const target = $(href);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', href);
  });
});

// Widgets
(function greet() {
  const input = $('#name');
  const btn = $('#greet-btn');
  const msg = $('#greet-msg');
  btn?.addEventListener('click', () => {
    const name = (input?.value || '').trim();
    msg.textContent = name ? `Hello, ${name}!` : 'Please enter your name.';
    if (!name) input?.focus();
  });
  // Shortcut: '/' to focus input
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
      e.preventDefault(); input?.focus();
    }
  });
})();

(function counter() {
  const btn = $('#count-btn');
  const el = $('#count');
  let n = 0;
  btn?.addEventListener('click', () => { el.textContent = String(++n); });
})();

(function themeControls() {
  const headerBtn = $('#theme-btn');
  const localBtn = $('#theme-btn-local');
  const resetBtn = $('#theme-reset');

  const toggle = () => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
    showToast(`Theme: ${isDark ? 'Light' : 'Dark'}`);
  };
  headerBtn?.addEventListener('click', toggle);
  localBtn?.addEventListener('click', toggle);
  resetBtn?.addEventListener('click', () => { setTheme('system'); showToast('Theme: System'); });

  // Keyboard shortcut: 't'
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 't') toggle();
    if (e.key === '?') showToast('Shortcuts: T toggle, / focus name, ? help', 3000);
  });
})();

// Reveal sections on view
(function reveal() {
  const items = $$('.reveal');
  if (!items.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in-view');
        io.unobserve(en.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  items.forEach(el => io.observe(el));
})();

// Online/offline
(function network() {
  const on = () => showToast('You are back online');
  const off = () => showToast('You are offline');
  window.addEventListener('online', on);
  window.addEventListener('offline', off);
})();

// Footer year
(function year() {
  const y = $('#year');
  if (y) y.textContent = String(new Date().getFullYear());
})();

// State
const state = {
  products: [],
  view: [], // filtered/sorted
  filters: { q: '', category: 'all', sort: 'featured' },
  cart: []
};

// Elements
const els = {
  grid: document.getElementById('product-grid'),
  empty: document.getElementById('empty-state'),
  live: document.getElementById('live-region'),
  search: document.getElementById('catalog-search'),
  filterCategory: document.getElementById('filter-category'),
  sort: document.getElementById('sort-select'),
  reset: document.getElementById('catalog-reset'),
  cartCount: document.getElementById('cart-count'),
  cartDrawer: document.getElementById('cart-drawer'),
  cartItems: document.getElementById('cart-items'),
  cartSubtotal: document.getElementById('cart-subtotal')
};

// Utils
const money = (n) => `$${Number(n).toFixed(0)}`;
const announce = (msg) => { if (els.live) els.live.textContent = msg; };

// Products hydration + controls
(async function setupCatalog() {
  if (!els.grid) return;

  // Load products
  try {
    const res = await fetch('./data/products.json', { cache: 'no-store' });
    const products = await res.json();
    state.products = products.map(p => ({ ...p }));
    // Populate categories
    const cats = Array.from(new Set(state.products.map(p => p.category))).sort();
    for (const c of cats) {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c[0].toUpperCase() + c.slice(1);
      els.filterCategory?.appendChild(opt);
    }
    renderProducts(state.products);
    applyFilters();

  } catch (e) {
    console.warn('[products] hydration skipped:', e);
    // Still enhance SSR cards with buttons
    enhanceSSRGrid();
  }

  // Wire controls
  els.search?.addEventListener('input', (e) => {
    state.filters.q = e.target.value.trim().toLowerCase();
    applyFilters();
  });
  els.filterCategory?.addEventListener('change', (e) => {
    state.filters.category = e.target.value;
    applyFilters();
  });
  els.sort?.addEventListener('change', (e) => {
    state.filters.sort = e.target.value;
    applyFilters();
  });
  els.reset?.addEventListener('click', () => {
    state.filters = { q: '', category: 'all', sort: 'featured' };
    if (els.search) els.search.value = '';
    if (els.filterCategory) els.filterCategory.value = 'all';
    if (els.sort) els.sort.value = 'featured';
    applyFilters();
  });

  // Header search anchor: focus catalog search
  document.querySelector('a[href="#search"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('new')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => els.search?.focus(), 200);
  });
})();

function renderProducts(products) {
  if (!els.grid) return;
  const frag = document.createDocumentFragment();
  products.forEach((p, i) => {
    const article = document.createElement('article');
    article.className = 'card fade-in';
    article.style.animationDelay = `${Math.min(i, 8) * 60}ms`;
    article.setAttribute('role', 'listitem');
    article.dataset.id = String(p.id);
    article.innerHTML = `
      <div class="card-media">
        ${p.badge ? `<span class="badge"${p.badgeColor ? ` style="${p.badgeColor}"` : ''}>${p.badge}</span>` : ''}
        <img class="card-img" alt="${p.alt}" src="${srcFor(900, p.image)}"
             srcset="${srcFor(400, p.image)} 400w, ${srcFor(600, p.image)} 600w, ${srcFor(900, p.image)} 900w"
             sizes="(max-width:768px) 50vw, (max-width:480px) 100vw, 25vw"
             width="900" height="900" loading="lazy" decoding="async" />
        <span class="price-tag" aria-label="Price ${p.price} dollars">${money(p.price)}</span>
      </div>
      <div class="card-body">
        <h3 class="title">${p.title}</h3>
        <div class="meta">
          <span class="rating" aria-label="Rating ${p.rating} out of 5">★ ${p.rating}</span>
          <span class="muted">${p.meta}</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn btn-sm" data-action="quick-view" aria-label="Quick view ${p.title}">Quick view</button>
        <button class="btn btn-accent btn-sm" data-action="add" aria-label="Add ${p.title} to cart">Add to cart</button>
      </div>
    `;
    frag.appendChild(article);
  });
  els.grid.replaceChildren(frag);
  wireCardActions();
}

function srcFor(w, baseUrl) {
  try {
    const u = new URL(baseUrl);
    u.searchParams.set('w', String(w));
    u.searchParams.set('q', '80');
    u.searchParams.set('auto', 'format');
    u.searchParams.set('fit', 'crop');
    return u.toString();
  } catch { return baseUrl; }
}

function applyFilters() {
  const { q, category, sort } = state.filters;
  let list = [...state.products];

  if (q) list = list.filter(p => [p.title, p.meta, p.category].join(' ').toLowerCase().includes(q));
  if (category && category !== 'all') list = list.filter(p => p.category === category);

  switch (sort) {
    case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
    case 'rating-desc': list.sort((a,b)=>b.rating-a.rating); break;
    case 'title-asc': list.sort((a,b)=>a.title.localeCompare(b.title)); break;
    default: /* featured: keep original order */ break;
  }

  state.view = list;
  if (list.length) {
    els.empty?.setAttribute('hidden', 'true');
    renderProducts(list);
  } else {
    els.grid?.replaceChildren();
    els.empty?.removeAttribute('hidden');
  }
}

function enhanceSSRGrid() {
  // For SSR markup: add buttons to existing cards
  if (!els.grid) return;
  els.grid.querySelectorAll('.card').forEach(card => {
    if (card.querySelector('.card-actions')) return;
    const title = card.querySelector('.title')?.textContent || 'Item';
    const actions = document.createElement('div');
    actions.className = 'card-actions';
    actions.innerHTML = `
      <button class="btn btn-sm" data-action="quick-view" aria-label="Quick view ${title}">Quick view</button>
      <button class="btn btn-accent btn-sm" data-action="add" aria-label="Add ${title} to cart">Add to cart</button>
    `;
    card.appendChild(actions);
  });
  wireCardActions();
}

function wireCardActions() {
  els.grid?.querySelectorAll('[data-action="add"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.card');
      const id = Number(card?.dataset.id) || inferIdFromTitle(card);
      const p = state.products.find(x => x.id === id) || inferProductFromSSR(card);
      if (!p) return;
      addToCart(p);
      announce(`${p.title} added to cart`);
    });
  });
  els.grid?.querySelectorAll('[data-action="quick-view"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.card');
      const id = Number(card?.dataset.id) || inferIdFromTitle(card);
      const p = state.products.find(x => x.id === id) || inferProductFromSSR(card);
      if (!p) return;
      openProductModal(p);
    });
  });
}

function inferIdFromTitle(card) {
  const title = card?.querySelector('.title')?.textContent?.trim();
  const found = state.products.find(p => p.title === title);
  return found?.id ?? 0;
}
function inferProductFromSSR(card) {
  const title = card?.querySelector('.title')?.textContent?.trim() || '';
  const price = Number((card?.querySelector('.price-tag')?.textContent || '').replace(/[^0-9.]/g,''));
  return { id: 0, title, price, rating: 0, meta: '', alt: title, image: card?.querySelector('img')?.src || '', category: 'misc', description: '' };
}

// Cart
(function cartInit() {
  try { state.cart = JSON.parse(localStorage.getItem('cart') || '[]') || []; } catch { state.cart = []; }
  updateCartCount();
  renderCart();

  document.querySelector('a[href="#cart"]')?.addEventListener('click', (e) => {
    e.preventDefault(); openCart();
  });
  document.querySelectorAll('[data-close="cart"]').forEach(el => el.addEventListener('click', closeCart));
  document.getElementById('cart-clear')?.addEventListener('click', () => { state.cart = []; persistCart(); renderCart(); announce('Cart cleared'); });
  document.getElementById('cart-checkout')?.addEventListener('click', () => { announce('Proceeding to checkout...'); closeCart(); });
})();

function addToCart(p) {
  const existing = state.cart.find(i => i.id === p.id);
  if (existing) existing.qty += 1;
  else state.cart.push({ id: p.id, title: p.title, price: p.price, image: p.image, alt: p.alt, qty: 1 });
  persistCart();
  updateCartCount();
  renderCart();
}
function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  persistCart();
  updateCartCount();
  renderCart();
}
function changeQty(id, delta) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { persistCart(); updateCartCount(); renderCart(); }
}
function updateCartCount() {
  if (els.cartCount) els.cartCount.textContent = String(state.cart.reduce((n,i)=>n+i.qty,0));
}
function renderCart() {
  if (!els.cartItems) return;
  const frag = document.createDocumentFragment();
  let subtotal = 0;
  state.cart.forEach(i => {
    subtotal += i.price * i.qty;
    const row = document.createElement('div');
    row.className = 'drawer-item';
    row.innerHTML = `
      <img src="${srcFor(200, i.image)}" alt="${i.alt}" width="64" height="64" loading="lazy" decoding="async" />
      <div>
        <div class="title">${i.title}</div>
        <span class="muted">${money(i.price)} • Qty ${i.qty}</span>
      </div>
      <div style="display:grid; gap:6px">
        <button class="btn btn-sm" aria-label="Increase quantity">+</button>
        <button class="btn btn-sm" aria-label="Decrease quantity">−</button>
        <button class="btn btn-sm" aria-label="Remove item">Remove</button>
      </div>
    `;
    const [inc, dec, rem] = row.querySelectorAll('button');
    inc.addEventListener('click', () => changeQty(i.id, +1));
    dec.addEventListener('click', () => changeQty(i.id, -1));
    rem.addEventListener('click', () => removeFromCart(i.id));
    frag.appendChild(row);
  });
  els.cartItems.replaceChildren(frag);
  if (els.cartSubtotal) els.cartSubtotal.textContent = money(subtotal);
}
function persistCart() { localStorage.setItem('cart', JSON.stringify(state.cart)); }

function openCart() {
  const d = els.cartDrawer;
  if (!d) return;
  d.setAttribute('aria-hidden', 'false');
  trapFocus(d);
}
function closeCart() {
  const d = els.cartDrawer;
  if (!d) return;
  d.setAttribute('aria-hidden', 'true');
  releaseFocus();
}

// Product modal
const modal = document.getElementById('product-modal');
function openProductModal(p) {
  if (!modal) return;
  const body = document.getElementById('modal-body');
  body.innerHTML = `
    <div class="quick-view">
      <div class="qv-media">
        <img src="${srcFor(900, p.image)}"
             srcset="${srcFor(400, p.image)} 400w, ${srcFor(600, p.image)} 600w, ${srcFor(900, p.image)} 900w"
             sizes="(max-width:720px) 100vw, 50vw"
             alt="${p.alt}" width="900" height="900" decoding="async" loading="lazy" />
      </div>
      <div class="qv-info">
        <h3 class="qv-title">${p.title}</h3>
        <div class="muted">${p.category?.toUpperCase() || ''}</div>
        <p style="margin:10px 0 14px">${p.description || ''}</p>
        <div class="qv-price">${money(p.price)}</div>
        <div class="qv-actions">
          <button class="btn btn-accent" id="qv-add">Add to cart</button>
          <button class="btn" data-close="modal">Close</button>
        </div>
      </div>
    </div>
  `;
  modal.setAttribute('aria-hidden', 'false');
  trapFocus(modal);
  document.getElementById('qv-add')?.addEventListener('click', () => { addToCart(p); announce(`${p.title} added to cart`); });
}
function closeProductModal() { modal?.setAttribute('aria-hidden', 'true'); releaseFocus(); }

// Global close handlers + shortcuts
document.querySelectorAll('[data-close="modal"]').forEach(el => el.addEventListener('click', closeProductModal));
document.addEventListener('click', (e) => {
  const t = e.target;
  if (t?.dataset?.close === 'cart') closeCart();
  if (t?.dataset?.close === 'modal') closeProductModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeCart(); closeProductModal(); }
  if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
    e.preventDefault(); document.getElementById('new')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); els.search?.focus();
  }
  if (e.key.toLowerCase() === 't') document.getElementById('theme-toggle')?.click();
  if (e.key.toLowerCase() === 'c') openCart();
});

// Focus trap
let lastFocus = null;
function trapFocus(container) {
  lastFocus = document.activeElement;
  const focusables = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first = focusables[0], last = focusables[focusables.length - 1];
  (first || container).focus();
  function onKey(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  container._trap = onKey;
  document.addEventListener('keydown', onKey);
}
function releaseFocus() {
  const open = document.querySelector('.drawer[aria-hidden="false"], .modal[aria-hidden="false"]');
  if (open) return; // keep trapped if something still open
  if (document._trap) document.removeEventListener('keydown', document._trap);
  if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch {} }
}

// Service worker
(function() {
  if ('serviceWorker' in navigator && window.isSecureContext) {
    navigator.serviceWorker.register('./service-worker.js').catch(err => console.warn('SW registration failed:', err));
  }
})();
