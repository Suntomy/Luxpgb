/* ============================================================
   GLOBAL PILGRIM BANK — DEMO PLATFORM ENGINE
   SIMULATION ONLY. No real funds, no real interbank connectivity.
   All state is persisted in localStorage on this device.
   ============================================================ */

const STORE_KEY = 'gpb_demo_state_v3';

const BANKS = [
  { code: '920', name: 'Global Pilgrim Bank' },
  { code: '044', name: 'Access Bank' },
  { code: '058', name: 'GTBank' },
  { code: '011', name: 'First Bank' },
  { code: '033', name: 'UBA' },
  { code: '057', name: 'Zenith Bank' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '035', name: 'Wema Bank' },
  { code: '214', name: 'FCMB' },
  { code: '232', name: 'Sterling Bank' },
  { code: '076', name: 'Polaris Bank' },
  { code: '221', name: 'Stanbic IBTC' },
  { code: '100', name: 'Moniepoint MFB' },
  { code: '999', name: 'OPay Digital' },
  { code: '998', name: 'PalmPay' },
  { code: '505', name: 'Kuda MFB' }
];

const RATES = {
  NGN: { n: 'Nigerian Naira', r: 1, flag: '🇳🇬' },
  USD: { n: 'US Dollar', r: 1540, flag: '🇺🇸' },
  EUR: { n: 'Euro', r: 1668, flag: '🇪🇺' },
  GBP: { n: 'Pound Sterling', r: 1955, flag: '🇬🇧' },
  CNY: { n: 'Chinese Yuan', r: 213, flag: '🇨🇳' },
  RUB: { n: 'Russian Ruble', r: 17.2, flag: '🇷🇺' },
  CAD: { n: 'Canadian Dollar', r: 1128, flag: '🇨🇦' },
  UAH: { n: 'Ukrainian Hryvnia', r: 37.4, flag: '🇺🇦' },
  AUD: { n: 'Australian Dollar', r: 1012, flag: '🇦🇺' },
  XAF: { n: 'Central African CFA', r: 2.54, flag: '🇨🇲' },
  ZAR: { n: 'South African Rand', r: 84.5, flag: '🇿🇦' },
  GHS: { n: 'Ghanaian Cedi', r: 104, flag: '🇬🇭' }
};

const CRYPTOS = [
  { sym: 'BTC', n: 'Bitcoin', net: 'Bitcoin', price: 96500000 },
  { sym: 'ETH', n: 'Ethereum', net: 'ERC-20', price: 5100000 },
  { sym: 'USDT', n: 'Tether', net: 'TRC-20', price: 1540 },
  { sym: 'PGC', n: 'Pilgrim Coin', net: 'PGC Network', price: 250 },
  { sym: 'BNB', n: 'BNB', net: 'BEP-20', price: 940000 },
  { sym: 'HTX', n: 'Hotcoin', net: 'HTX Chain', price: 12.4 }
];

const NAME_POOL = [
  'CHINEDU OKAFOR', 'AISHA BELLO', 'EMEKA NWOSU', 'FATIMA YUSUF', 'TUNDE ADEYEMI',
  'NGOZI EZE', 'IBRAHIM MUSA', 'BLESSING ADEBAYO', 'KELECHI OBI', 'HALIMA SANI',
  'SEGUN OLAWALE', 'AMAKA UCHE', 'YUSUF DANJUMA', 'TOLULOPE ADELEKE', 'GRACE ETIM',
  'MUSA ABUBAKAR', 'IFEOMA NWACHUKWU', 'DAVID OGUNDIPE', 'ZAINAB LAWAL', 'PETER AKPAN'
];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = (n, cur = 'NGN') => {
  const sym = { NGN: '₦', USD: '$', EUR: '€', GBP: '£', CNY: '¥', RUB: '₽', CAD: 'C$', UAH: '₴', AUD: 'A$', XAF: 'FCFA ', ZAR: 'R', GHS: 'GH₵' }[cur] || '';
  return sym + Number(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
const dt = (iso) => new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
const todayKey = () => new Date().toISOString().slice(0, 10);
const uid = (p = '') => p + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 7).toUpperCase();
const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };

let state = null;
let session = null;

function seedState() {
  const now = Date.now();
  const customers = [
    { id: 'C001', name: 'OLAWALE ABDUL-GANIYU ADESHINA', account: '3855158987', bank: '920', type: 'Corporate Current', bvn: '22203477001', phone: '+234 803 000 0000', email: 'olawale@globalpilgrim.demo', balance: 2500000, kyc: 'Tier 3', status: 'ACTIVE', pin: '1234', dailyLimit: 20000000, password: 'GPB2024', createdAt: new Date(now - 86400000 * 420).toISOString() },
    { id: 'C002', name: 'CHINEDU OKAFOR', account: '4410278836', bank: '920', type: 'Savings', bvn: '31002244556', phone: '+234 805 111 2233', email: 'chinedu@example.demo', balance: 184300, kyc: 'Tier 2', status: 'ACTIVE', pin: '1234', dailyLimit: 5000000, password: 'GPB2024', createdAt: new Date(now - 86400000 * 190).toISOString() },
    { id: 'C003', name: 'AISHA BELLO', account: '7721904431', bank: '920', type: 'Savings', bvn: '33005566778', phone: '+234 807 444 5566', email: 'aisha@example.demo', balance: 92450, kyc: 'Tier 1', status: 'ACTIVE', pin: '1234', dailyLimit: 300000, password: 'GPB2024', createdAt: new Date(now - 86400000 * 45).toISOString() }
  ];

  const wallets = {};
  customers.forEach(c => {
    wallets[c.id] = { NGN: c.balance, USD: c.id === 'C001' ? 12500 : 0, EUR: c.id === 'C001' ? 3200 : 0, GBP: 0, CNY: 0, RUB: 0, CAD: 0, UAH: 0, AUD: 0, XAF: 0, ZAR: 0, GHS: 0 };
  });

  const crypto = {};
  customers.forEach(c => {
    crypto[c.id] = CRYPTOS.map(k => ({
      sym: k.sym,
      addr: 'gpb' + k.sym.toLowerCase() + '_' + hash(c.account + k.sym).toString(16).padStart(10, '0') + 'x' + hash(k.sym + c.account).toString(16).slice(0, 12),
      bal: c.id === 'C001' && k.sym === 'USDT' ? 4200 : (c.id === 'C001' && k.sym === 'BTC' ? 0.0184 : 0)
    }));
  });

  const txns = [
    mkTxn({ type: 'CREDIT', dir: 'in', amount: 850000, party: 'ZENITH BANK / ADEBAYO HOLDINGS', channel: 'NIP', status: 'SUCCESS', acct: '3855158987', note: 'Contract settlement', ago: 1000 * 60 * 60 * 3 }),
    mkTxn({ type: 'DEBIT', dir: 'out', amount: 45000, party: 'GTBANK / EMEKA NWOSU', channel: 'NIP', status: 'SUCCESS', acct: '3855158987', note: 'Supplier payment', ago: 1000 * 60 * 60 * 26 }),
    mkTxn({ type: 'CARD', dir: 'out', amount: 12500, party: 'Jumia Nigeria', channel: 'CARD', status: 'SUCCESS', acct: '3855158987', note: 'Online purchase', ago: 1000 * 60 * 60 * 50 }),
    mkTxn({ type: 'DEBIT', dir: 'out', amount: 220000, party: 'ACCESS BANK / NGOZI EZE', channel: 'NIP', status: 'SUCCESS', acct: '3855158987', note: 'Project milestone', ago: 1000 * 60 * 60 * 74 }),
    mkTxn({ type: 'CREDIT', dir: 'in', amount: 1200000, party: 'UBA / PILGRIM CAPITAL LTD', channel: 'NIP', status: 'SUCCESS', acct: '3855158987', note: 'Investment return', ago: 1000 * 60 * 60 * 120 }),
    mkTxn({ type: 'USSD', dir: 'out', amount: 5000, party: 'MTN Airtime', channel: 'USSD', status: 'SUCCESS', acct: '3855158987', note: 'Airtime top-up', ago: 1000 * 60 * 60 * 150 })
  ];

  return {
    customers, wallets, crypto, txns,
    ledger: [], audit: [], alerts: [], trades: [], miners: [], mineLog: [],
    counters: { serial: 100234, entry: 500001 },
    trading: { balance: 5000, profit: 1284.55, running: true, startedAt: Date.now() - 1000 * 60 * 60 * 6 },
    mining: { balance: 342.18, hashrate: 0 },
    beneficiaries: [
      { name: 'EMEKA NWOSU', bank: '058', account: '0123456789' },
      { name: 'NGOZI EZE', bank: '044', account: '0987654321' }
    ],
    meta: { createdAt: new Date().toISOString() }
  };
}

function mkTxn(o) {
  const t = Date.now() - (o.ago || 0);
  return {
    serial: 'SN' + (Math.floor(Math.random() * 900000) + 100000),
    id: 'TXN-' + Math.random().toString(36).slice(2, 8).toUpperCase() + '-' + Math.floor(Math.random() * 9000 + 1000),
    type: o.type, dir: o.dir, amount: o.amount, party: o.party, channel: o.channel,
    status: o.status, acct: o.acct, note: o.note || '', date: new Date(t).toISOString()
  };
}

function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) { state = JSON.parse(raw); return; }
  } catch (e) { console.warn('reset state', e); }
  state = seedState();
  save();
}

function postLedger(txnId, debitAcct, creditAcct, amount, memo) {
  const stamp = new Date().toISOString();
  state.ledger.unshift({ id: 'GL' + (state.counters.entry++), txn: txnId, account: debitAcct, debit: amount, credit: 0, date: stamp, memo });
  state.ledger.unshift({ id: 'GL' + (state.counters.entry++), txn: txnId, account: creditAcct, debit: 0, credit: amount, date: stamp, memo });
}

function audit(operator, action, detail) {
  state.audit.unshift({ n: state.audit.length + 1, operator, action, detail, at: new Date().toISOString() });
}

function notify(kind, title, body) {
  state.alerts.unshift({ kind, title, body, at: new Date().toISOString() });
  if (state.alerts.length > 60) state.alerts.pop();
}

function toast(title, msg, kind = '') {
  const el = document.createElement('div');
  el.className = 'toast ' + kind;
  el.innerHTML = `<b>${title}</b><small>${msg}</small>`;
  $('#toasts').appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(24px)'; el.style.transition = '.3s'; setTimeout(() => el.remove(), 320); }, 4200);
}

function openModal(html) { $('#modal').innerHTML = html; $('#modalBack').classList.add('show'); }
function closeModal() { $('#modalBack').classList.remove('show'); }
$('#modalBack').addEventListener('click', e => { if (e.target.id === 'modalBack') closeModal(); });

let loginMode = 'customer';
$$('.tabs button').forEach(b => b.addEventListener('click', () => {
  $$('.tabs button').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  loginMode = b.dataset.mode;
  const isAdmin = loginMode === 'admin';
  $('#acctField').style.display = isAdmin ? 'none' : 'block';
  $('#pwLabel').textContent = isAdmin ? 'Administrator Password' : 'Password';
  $('#loginPw').value = isAdmin ? 'admin123' : 'GPB2024';
  $('#loginErr').textContent = '';
}));

$('#loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const pw = $('#loginPw').value.trim();
  const err = $('#loginErr');
  if (loginMode === 'admin') {
    if (pw !== 'admin123') { err.textContent = 'Invalid administrator password.'; return; }
    session = { role: 'admin', accountId: 'C001' };
    enterApp();
    return;
  }
  const acct = $('#loginAcct').value.trim();
  const c = state.customers.find(x => x.account === acct);
  if (!c) { err.textContent = 'Account number not found in this demo bank.'; return; }
  if (c.status === 'BLOCKED') { err.textContent = 'This account is blocked. Contact support.'; return; }
  if (c.password !== pw) { err.textContent = 'Incorrect password.'; return; }
  session = { role: 'customer', accountId: c.id };
  enterApp();
});

function enterApp() {
  $('#loginView').style.display = 'none';
  $('#appView').style.display = 'grid';
  document.body.classList.toggle('is-admin', session.role === 'admin');
  const c = currentCustomer();
  $('#avatar').textContent = c.name.split(' ').map(w => w[0]).slice(0, 2).join('');
  audit(session.role === 'admin' ? 'ADMIN' : c.account, 'LOGIN', 'Session established from web channel');
  save();
  go('overview');
  renderAll();
  startTicker();
  toast('Signed in', 'Welcome back, ' + c.name.split(' ')[0], 'ok');
}

$('#logoutBtn').addEventListener('click', () => {
  audit(session ? (session.role === 'admin' ? 'ADMIN' : currentCustomer().account) : '—', 'LOGOUT', 'Session terminated');
  save();
  session = null;
  document.body.classList.remove('is-admin');
  $('#appView').style.display = 'none';
  $('#loginView').style.display = 'grid';
  $('#loginErr').textContent = '';
});

function currentCustomer() {
  return state.customers.find(c => c.id === session.accountId) || state.customers[0];
}

const PAGE_META = {
  overview: ['Overview', 'Your banking at a glance'],
  transfer: ['Transfer', 'Send money to any bank, wallet or crypto address'],
  transactions: ['Transactions', 'Complete transaction register'],
  wallets: ['Wallets & Crypto', 'Multi-asset balances and digital wallets'],
  exchange: ['Currency Exchange', 'Live FX conversion across 12 currencies'],
  cards: ['Cards & ATM', 'Card controls and ATM operations'],
  ussd: ['USSD & Alerts', 'Offline banking and notification centre'],
  trading: ['Trading Terminal', 'Automated strategy and profit ledger'],
  mining: ['Mining Terminal', 'Worker fleet and reward payouts'],
  statements: ['Statements', 'Generate and print account statements'],
  settings: ['Security', 'Authentication, devices and KYC'],
  admin: ['Admin Dashboard', 'Back-office operations and controls'],
  ledger: ['General Ledger', 'Double-entry accounting control'],
  audit: ['Audit Trail', 'Immutable operator activity log']
};

function go(page) {
  $$('.page').forEach(p => p.classList.remove('active'));
  const el = $('#page-' + page);
  if (el) el.classList.add('active');
  $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.page === page));
  const m = PAGE_META[page] || ['', ''];
  $('#pageTitle').textContent = m[0];
  $('#pageSub').textContent = m[1];
  $('#sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderPage(page);
}

$$('.nav-item[data-page]').forEach(b => b.addEventListener('click', () => go(b.dataset.page)));
$$('[data-goto]').forEach(b => b.addEventListener('click', () => go(b.dataset.goto)));

function renderAll() {
  renderHeader(); renderOverview(); renderTransfer(); renderTransactions();
  renderWallets(); renderExchange(); renderCards(); renderAlerts();
  renderTrading(); renderMining(); renderStatements(); renderSettings();
  renderAdmin(); renderLedger(); renderAudit();
}

function renderPage(p) {
  const map = {
    overview: renderOverview, transfer: renderTransfer, transactions: renderTransactions,
    wallets: renderWallets, exchange: renderExchange, cards: renderCards, ussd: renderAlerts,
    trading: renderTrading, mining: renderMining, statements: renderStatements,
    settings: renderSettings, admin: renderAdmin, ledger: renderLedger, audit: renderAudit
  };
  (map[p] || (() => {}))();
}

function renderHeader() {
  $('#netPill').textContent = 'LIVE FEED';
  $('#clockPill').textContent = new Date().toLocaleTimeString('en-GB');
}

function myTxns() {
  const c = currentCustomer();
  return state.txns.filter(t => t.acct === c.account);
}

function renderOverview() {
  const c = currentCustomer();
  const txs = myTxns();
  $('#ovBalance').textContent = money(c.balance);
  $('#ovAcctName').textContent = c.name;
  $('#ovAcctNo').textContent = c.account;
  $('#ovAcctType').textContent = c.type;
  $('#ovStatus').textContent = c.status;

  const inSum = txs.filter(t => t.dir === 'in').reduce((a, b) => a + b.amount, 0);
  const outSum = txs.filter(t => t.dir === 'out').reduce((a, b) => a + b.amount, 0);
  $('#ovIn').textContent = money(inSum);
  $('#ovOut').textContent = money(outSum);
  $('#ovCount').textContent = txs.length;
  $('#ovLimit').textContent = money(Math.max(0, c.dailyLimit - usedToday(c)));

  $('#liveFeed').innerHTML = txs.slice(0, 8).map(t => `
    <div class="feed-item">
      <span class="dot" style="background:${t.dir === 'in' ? 'var(--green)' : 'var(--red)'}"></span>
      <div style="flex:1">
        <b>${t.dir === 'in' ? 'Credit' : 'Debit'} · ${money(t.amount)}</b>
        <small>${t.party} · ${t.channel} · <span class="mono">${t.id}</span></small>
        <small>${dt(t.date)} · <span class="tag ${t.status === 'SUCCESS' ? 'ok' : t.status === 'PENDING' ? 'pend' : 'fail'}">${t.status}</span></small>
      </div>
    </div>`).join('') || '<div class="empty">No transactions yet</div>';

  $('#ovRecent').innerHTML = txs.slice(0, 4).map(t => `
    <div class="kv"><span>${t.party}</span><b class="${t.dir === 'in' ? 'amt-in' : 'amt-out'}">${t.dir === 'in' ? '+' : '−'}${money(t.amount)}</b></div>
  `).join('') || '<div class="empty">Nothing yet</div>';
}

function usedToday(c) {
  return state.txns.filter(t => t.acct === c.account && t.dir === 'out' && t.date && t.date.slice(0, 10) === todayKey()).reduce((a, b) => a + b.amount, 0);
}

function renderTransfer() {
  const sel = $('#trBank');
  if (!sel.options.length) sel.innerHTML = BANKS.map(b => `<option value="${b.code}">${b.name} (${b.code})</option>`).join('');
  const c = currentCustomer();
  $('#trUsedToday').textContent = money(usedToday(c));
  $('#beneficiaries').innerHTML = state.beneficiaries.map((b, i) => `
    <div class="kv"><span>${b.name} · ${bankName(b.bank)} · <span class="mono">${b.account}</span></span>
    <button class="btn btn-sm" data-ben="${i}">Use</button></div>`).join('') || '<div class="empty">No saved beneficiaries</div>';
  $$('[data-ben]').forEach(btn => btn.addEventListener('click', () => {
    const b = state.beneficiaries[+btn.dataset.ben];
    $('#trDest').value = 'bank'; $('#trBank').value = b.bank; $('#trAcct').value = b.account;
    $('#trName').value = b.name; toggleDest();
  }));
}

function bankName(code) { return (BANKS.find(b => b.code === code) || { name: 'Unknown Bank' }).name; }

function toggleDest() {
  const d = $('#trDest').value;
  $('#bankField').style.display = d === 'bank' ? 'block' : 'none';
  $('#trAcctLabel').textContent = d === 'bank' ? 'Account Number' : d === 'wallet' ? 'GPB Wallet ID' : 'Crypto Wallet Address';
  $('#trAcct').maxLength = d === 'crypto' ? 64 : 10;
  $('#trAcct').placeholder = d === 'crypto' ? 'Paste wallet address' : 'Enter 10-digit account number';
}
$('#trDest').addEventListener('change', toggleDest);

$('#trAcct').addEventListener('input', () => {
  const v = $('#trAcct').value.trim();
  const d = $('#trDest').value;
  if (d === 'crypto') { $('#trName').value = v.length > 20 ? 'On-chain address — format verified' : ''; return; }
  if (v.length === 10) {
    $('#trName').value = 'Verifying…';
    setTimeout(() => {
      const local = state.customers.find(c => c.account === v);
      const saved = state.beneficiaries.find(b => b.account === v);
      $('#trName').value = local ? local.name : saved ? saved.name : NAME_POOL[hash(v) % NAME_POOL.length];
    }, 420);
  } else $('#trName').value = '';
});

function feeFor(amt) { return amt < 5000 ? 10 : amt < 50000 ? 25 : 50; }

$('#trSend').addEventListener('click', () => {
  const c = currentCustomer();
  const dest = $('#trDest').value;
  const acct = $('#trAcct').value.trim();
  const name = $('#trName').value.trim();
  const amt = parseFloat($('#trAmount').value);
  const note = $('#trNote').value.trim() || 'Transfer';

  if (!acct) return toast('Missing account', 'Enter a destination account or address.', 'err');
  if (dest !== 'crypto' && acct.length !== 10) return toast('Invalid account', 'Account number must be 10 digits.', 'err');
  if (!amt || amt <= 0) return toast('Invalid amount', 'Enter an amount greater than zero.', 'err');
  if (!name || name === 'Verifying…') return toast('Name enquiry', 'Wait for the account name to resolve.', 'err');

  const fee = dest === 'crypto' ? 0 : feeFor(amt);
  const total = amt + fee;
  if (total > c.balance) return toast('Insufficient funds', 'Available balance is ' + money(c.balance), 'err');
  if (amt > 5000000) return toast('Limit exceeded', 'Per-transaction limit is ₦5,000,000.', 'err');
  if (usedToday(c) + amt > c.dailyLimit) return toast('Daily limit', 'This would exceed your daily limit.', 'err');

  openModal(`
    <h3>Confirm Transfer</h3>
    <p class="lead">Review the details below, then authorise with your transaction PIN.</p>
    <div class="kv"><span>Recipient</span><b>${name}</b></div>
    <div class="kv"><span>${dest === 'crypto' ? 'Address' : 'Account'}</span><b class="mono">${acct}</b></div>
    ${dest === 'bank' ? `<div class="kv"><span>Bank</span><b>${bankName($('#trBank').value)}</b></div>` : ''}
    <div class="kv"><span>Amount</span><b>${money(amt)}</b></div>
    <div class="kv"><span>Fee</span><b>${money(fee)}</b></div>
    <div class="kv"><span>Total debit</span><b class="amt-out">${money(total)}</b></div>
    <div class="field" style="margin-top:18px"><label>Transaction PIN</label>
      <input type="password" id="mPin" maxlength="4" inputmode="numeric" placeholder="••••">
    </div>
    <div class="err" id="mErr"></div>
    <div class="modal-actions">
      <button class="btn" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" id="mConfirm">Authorise</button>
    </div>`);

  $('#mConfirm').addEventListener('click', () => {
    if ($('#mPin').value !== c.pin) { $('#mErr').textContent = 'Incorrect transaction PIN.'; return; }
    closeModal();
    processTransfer(c, dest, acct, name, amt, fee, note);
  });
});

function processTransfer(c, dest, acct, name, amt, fee, note) {
  const txn = {
    serial: 'SN' + (state.counters.serial++),
    id: 'TXN-' + uid('').slice(0, 10),
    type: dest === 'crypto' ? 'CRYPTO' : dest === 'wallet' ? 'WALLET' : 'NIP',
    dir: 'out', amount: amt,
    party: `${dest === 'bank' ? bankName($('#trBank').value) : dest === 'wallet' ? 'GPB WALLET' : 'CRYPTO NETWORK'} / ${name}`,
    channel: dest === 'crypto' ? 'BLOCKCHAIN' : dest === 'wallet' ? 'INTERNAL' : 'NIP',
    status: 'PENDING', date: new Date().toISOString(), acct: c.account, note, fee
  };
  state.txns.unshift(txn);
  c.balance -= (amt + fee);
  state.wallets[c.id].NGN = c.balance;
  save(); renderAll();
  toast('Processing', 'Transaction ' + txn.id + ' submitted', '');

  setTimeout(() => {
    txn.status = 'SUCCESS';
    postLedger(txn.id, 'CUST-' + c.account, 'SETTLEMENT-NIP', amt, note);
    if (fee > 0) postLedger(txn.id + '-FEE', 'CUST-' + c.account, 'FEE-INCOME', fee, 'Transfer fee');
    notify('sms', 'Debit Alert', `Dear ${c.name.split(' ')[0]}, your account ${c.account} was debited ${money(amt + fee)} to ${name}. Ref: ${txn.id}. Bal: ${money(c.balance)}`);
    notify('email', 'Transaction Receipt', `A transfer of ${money(amt)} to ${name} (${acct}) was completed. Transaction ID ${txn.id}, serial ${txn.serial}.`);
    audit(c.account, 'TRANSFER', `${money(amt)} to ${name} (${acct}) ref ${txn.id}`);
    save(); renderAll();
    toast('Transfer successful', `${money(amt)} sent to ${name}`, 'ok');
    openModal(`
      <h3 style="color:var(--green)">✓ Transfer Successful</h3>
      <p class="lead">Your transaction has been completed and posted to the ledger.</p>
      <div class="kv"><span>Serial Number</span><b class="mono">${txn.serial}</b></div>
      <div class="kv"><span>Transaction ID</span><b class="mono">${txn.id}</b></div>
      <div class="kv"><span>Recipient</span><b>${name}</b></div>
      <div class="kv"><span>Amount</span><b>${money(amt)}</b></div>
      <div class="kv"><span>Fee</span><b>${money(fee)}</b></div>
      <div class="kv"><span>Status</span><b class="up">SUCCESS</b></div>
      <div class="kv"><span>Date &amp; Time</span><b>${dt(txn.date)}</b></div>
      <div class="kv"><span>New Balance</span><b>${money(c.balance)}</b></div>
      <div class="modal-actions"><button class="btn btn-primary" onclick="closeModal()">Done</button></div>`);
  }, 1800);
}

function renderTransactions() {
  const q = ($('#txSearch').value || '').toLowerCase();
  const f = $('#txFilter').value;
  const rows = myTxns().filter(t => (!f || t.status === f) && (!q || (t.id + t.serial + t.party + t.note).toLowerCase().includes(q)));
  $('#txBody').innerHTML = rows.map(t => `
    <tr>
      <td class="mono">${t.serial}</td>
      <td class="mono">${t.id}</td>
      <td>${t.type}</td>
      <td>${t.party}</td>
      <td class="${t.dir === 'in' ? 'amt-in' : 'amt-out'}">${t.dir === 'in' ? '+' : '−'}${money(t.amount)}</td>
      <td><span class="tag info">${t.channel}</span></td>
      <td><span class="tag ${t.status === 'SUCCESS' ? 'ok' : t.status === 'PENDING' ? 'pend' : 'fail'}">${t.status}</span></td>
      <td style="white-space:nowrap">${dt(t.date)}</td>
    </tr>`).join('') || '<tr><td colspan="8" class="empty">No matching transactions</td></tr>';
}
$('#txSearch').addEventListener('input', renderTransactions);
$('#txFilter').addEventListener('change', renderTransactions);

function renderWallets() {
  const c = currentCustomer();
  const w = state.wallets[c.id];
  $('#walletGrid').innerHTML = Object.keys(RATES).map(k => `
    <div class="wallet-card">
      <div class="between"><span class="cur">${RATES[k].flag} ${RATES[k].n}</span><b style="font-size:11px;color:var(--muted)">${k}</b></div>
      <div class="val">${money(w[k] || 0, k)}</div>
      <div class="addr">≈ ${money((w[k] || 0) * RATES[k].r)}</div>
    </div>`).join('');

  $('#cryptoList').innerHTML = state.crypto[c.id].map(k => {
    const meta = CRYPTOS.find(x => x.sym === k.sym);
    return `<div style="padding:12px 0;border-bottom:1px dashed rgba(30,44,71,.7)">
      <div class="between"><b>${meta.n} (${k.sym})</b><b>${k.bal} ${k.sym}</b></div>
      <div class="addr" style="margin-top:5px">${k.addr}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:4px">${meta.net} · ≈ ${money(k.bal * meta.price)}</div>
    </div>`;
  }).join('');

  $('#wAsset').innerHTML = [
    ...Object.keys(RATES).map(k => `<option value="${k}">${RATES[k].n} (${k})</option>`),
    ...CRYPTOS.map(k => `<option value="${k.sym}">${k.n} (${k.sym})</option>`)
  ].join('');
}

$('#wGo').addEventListener('click', () => {
  const c = currentCustomer();
  const amt = parseFloat($('#wAmount').value);
  const asset = $('#wAsset').value;
  const op = $('#wOp').value;
  if (!amt || amt <= 0) return toast('Invalid amount', 'Enter an amount.', 'err');
  const w = state.wallets[c.id];
  const crypto = state.crypto[c.id].find(k => k.sym === asset);

  if (op === 'bank2wallet' || op === 'fiat2crypto') {
    if (amt > c.balance) return toast('Insufficient funds', 'Not enough NGN.', 'err');
    c.balance -= amt; w.NGN = c.balance;
    if (op === 'fiat2crypto' && crypto) {
      crypto.bal += amt / CRYPTOS.find(x => x.sym === asset).price;
    } else if (RATES[asset]) w[asset] = (w[asset] || 0) + amt / RATES[asset].r;
    recordWalletOp(c, op, asset, amt, 'out');
  } else {
    if (op === 'crypto2fiat' && crypto) {
      if (crypto.bal < amt) return toast('Insufficient crypto', `You hold ${crypto.bal} ${asset}.`, 'err');
      crypto.bal -= amt;
      c.balance += amt * CRYPTOS.find(x => x.sym === asset).price; w.NGN = c.balance;
    } else {
      if (!RATES[asset]) return toast('Unsupported', 'Select a fiat currency for this operation.', 'err');
      const have = w[asset] || 0;
      if (have < amt) return toast('Insufficient balance', `You hold ${have} ${asset}.`, 'err');
      w[asset] = have - amt;
      c.balance += amt * RATES[asset].r; w.NGN = c.balance;
    }
    recordWalletOp(c, op, asset, amt, 'in');
  }
  save(); renderAll();
  toast('Wallet updated', `${op} of ${amt} ${asset} completed`, 'ok');
});

function recordWalletOp(c, op, asset, amt, dir) {
  const txn = { serial: 'SN' + (state.counters.serial++), id: 'TXN-' + uid('').slice(0, 10), type: 'WALLET', dir, amount: amt, party: 'WALLET ENGINE / ' + asset, channel: 'INTERNAL', status: 'SUCCESS', date: new Date().toISOString(), acct: c.account, note: op };
  state.txns.unshift(txn);
  postLedger(txn.id, dir === 'out' ? 'CUST-' + c.account : 'WALLET-POOL', dir === 'out' ? 'WALLET-POOL' : 'CUST-' + c.account, amt, op);
  audit(c.account, 'WALLET_OP', `${op} ${amt} ${asset}`);
  notify('sms', 'Wallet Alert', `${op} of ${amt} ${asset} completed. Ref ${txn.id}`);
}

function renderExchange() {
  const opts = Object.keys(RATES).map(k => `<option value="${k}">${RATES[k].flag} ${RATES[k].n} (${k})</option>`).join('');
  if (!$('#exFrom').options.length) {
    $('#exFrom').innerHTML = opts; $('#exTo').innerHTML = opts;
    $('#exFrom').value = 'NGN'; $('#exTo').value = 'USD';
  }
  $('#rateBody').innerHTML = Object.keys(RATES).filter(k => k !== 'NGN').map(k => {
    const buy = RATES[k].r * 1.0075, sell = RATES[k].r * 0.9925;
    return `<tr><td>${RATES[k].flag} ${RATES[k].n}</td><td class="mono">${k}</td>
      <td class="mono">${buy.toFixed(2)}</td><td class="mono">${sell.toFixed(2)}</td></tr>`;
  }).join('');
  calcExchange();
}
function calcExchange() {
  const f = $('#exFrom').value, t = $('#exTo').value;
  const amt = parseFloat($('#exAmount').value) || 0;
  const rate = RATES[f].r / RATES[t].r;
  const spread = amt * 0.0075;
  const out = Math.max(0, (amt - spread) * rate);
  $('#exRate').textContent = `1 ${f} = ${rate.toFixed(6)} ${t}`;
  $('#exSpread').textContent = `${spread.toFixed(2)} ${f}`;
  $('#exOut').textContent = money(out, t);
}
['#exFrom', '#exTo', '#exAmount'].forEach(s => $(s).addEventListener('input', calcExchange));
$('#exFrom').addEventListener('change', calcExchange);
$('#exTo').addEventListener('change', calcExchange);

$('#exGo').addEventListener('click', () => {
  const c = currentCustomer();
  const f = $('#exFrom').value, t = $('#exTo').value;
  const amt = parseFloat($('#exAmount').value);
  if (!amt || amt <= 0) return toast('Invalid amount', 'Enter an amount to convert.', 'err');
  if (f === t) return toast('Same currency', 'Choose two different currencies.', 'err');
  const w = state.wallets[c.id];
  if ((w[f] || 0) < amt) return toast('Insufficient balance', `You hold ${w[f] || 0} ${f}.`, 'err');
  const out = (amt - amt * 0.0075) * (RATES[f].r / RATES[t].r);
  w[f] -= amt; w[t] = (w[t] || 0) + out;
  if (f === 'NGN' || t === 'NGN') c.balance = w.NGN;
  const txn = { serial: 'SN' + (state.counters.serial++), id: 'TXN-' + uid('').slice(0, 10), type: 'FX', dir: 'out', amount: amt, party: `FX ENGINE ${f}→${t}`, channel: 'INTERNAL', status: 'SUCCESS', date: new Date().toISOString(), acct: c.account, note: `Converted to ${out.toFixed(2)} ${t}` };
  state.txns.unshift(txn);
  postLedger(txn.id, 'CUST-' + c.account, 'FX-POOL', amt, `FX ${f}->${t}`);
  audit(c.account, 'FX', `${amt} ${f} → ${out.toFixed(2)} ${t}`);
  notify('sms', 'FX Alert', `Converted ${amt} ${f} to ${out.toFixed(2)} ${t}. Ref ${txn.id}`);
  save(); renderAll(); calcExchange();
  toast('Conversion complete', `${amt} ${f} → ${out.toFixed(2)} ${t}`, 'ok');
});

function renderCards() {
  const c = currentCustomer();
  $('#cardHolder').textContent = c.name.split(' ').slice(0, 2).join(' ');
  const cardTx = state.txns.filter(t => t.acct === c.account && (t.channel === 'CARD' || t.type === 'CARD'));
  $('#cardTxBody').innerHTML = cardTx.map(t => `
    <tr><td>${t.party}</td><td class="amt-out">−${money(t.amount)}</td>
    <td><span class="tag info">${t.channel}</span></td>
    <td><span class="tag ok">${t.status}</span></td><td>${dt(t.date)}</td></tr>`).join('')
    || '<tr><td colspan="5" class="empty">No card transactions</td></tr>';
}
$('#cardFreeze').addEventListener('click', () => {
  const s = $('#cardStatus');
  const frozen = s.textContent === 'FROZEN';
  s.textContent = frozen ? 'ACTIVE' : 'FROZEN';
  s.className = frozen ? 'up' : 'down';
  toast(frozen ? 'Card unfrozen' : 'Card frozen', 'Card status updated instantly.', 'ok');
  audit(currentCustomer().account, 'CARD_STATUS', frozen ? 'UNFROZEN' : 'FROZEN'); save();
});
$('#cardPin').addEventListener('click', () => toast('PIN change', 'A one-time code was sent to your registered phone.', 'ok'));
$('#cardLimit').addEventListener('click', () => toast('Limit updated', 'Daily card limit set to ₦500,000.', 'ok'));

$$('[data-atm]').forEach(b => b.addEventListener('click', () => {
  const c = currentCustomer();
  const m = b.dataset.atm;
  if (m === 'balance') openModal(`<h3>ATM Balance Enquiry</h3><p class="lead">ISO 8583 · MTI 0200 · processing code 310000</p>
    <div class="kv"><span>Available</span><b>${money(c.balance)}</b></div>
    <div class="kv"><span>Ledger</span><b>${money(c.balance)}</b></div>
    <div class="modal-actions"><button class="btn btn-primary" onclick="closeModal()">Done</button></div>`);
  if (m === 'mini') openModal(`<h3>ATM Mini Statement</h3><p class="lead">Last 5 transactions</p>
    ${myTxns().slice(0, 5).map(t => `<div class="kv"><span>${t.party}</span><b class="${t.dir === 'in' ? 'amt-in' : 'amt-out'}">${t.dir === 'in' ? '+' : '−'}${money(t.amount)}</b></div>`).join('')}
    <div class="modal-actions"><button class="btn btn-primary" onclick="closeModal()">Done</button></div>`);
  if (m === 'withdraw') openModal(`<h3>ATM Withdrawal</h3><p class="lead">Simulated cash dispense authorisation.</p>
    <div class="field"><label>Amount</label><input type="number" id="atmAmt" placeholder="0.00"></div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="atmGo">Authorise</button></div>`);
  if (m === 'pin') toast('PIN change', 'Visit any GPB ATM to complete PIN change.', 'ok');

  const g = $('#atmGo');
  if (g) g.addEventListener('click', () => {
    const a = parseFloat($('#atmAmt').value);
    if (!a || a <= 0) return toast('Invalid', 'Enter an amount.', 'err');
    if (a > c.balance) return toast('Insufficient funds', 'Balance too low.', 'err');
    c.balance -= a; state.wallets[c.id].NGN = c.balance;
    const txn = { serial: 'SN' + (state.counters.serial++), id: 'TXN-' + uid('').slice(0, 10), type: 'ATM', dir: 'out', amount: a, party: 'GPB ATM / CASH DISPENSE', channel: 'ATM', status: 'SUCCESS', date: new Date().toISOString(), acct: c.account, note: 'Cash withdrawal' };
    state.txns.unshift(txn);
    postLedger(txn.id, 'CUST-' + c.account, 'ATM-CASH', a, 'ATM withdrawal');
    audit(c.account, 'ATM_WITHDRAWAL', money(a));
    save(); renderAll(); closeModal();
    toast('Cash dispensed', money(a) + ' withdrawn', 'ok');
  });
}));

function renderAlerts() {
  const c = currentCustomer();
  $('#ussdPhone').textContent = c.phone;
  $('#alertList').innerHTML = state.alerts.slice(0, 20).map(a => `
    <div class="alert-item">
      <b>${a.kind === 'sms' ? '📱 SMS' : a.kind === 'email' ? '✉️ EMAIL' : '🔔 ALERT'}</b> — ${a.title}<br>${a.body}
      <div class="t">${dt(a.at)}</div>
    </div>`).join('') || '<div class="empty">No alerts yet. Make a transaction to see SMS and email notifications.</div>';
}

const MARKET = [
  { s: 'BTC/USD', bid: 62450.2, chg: 1.24 },
  { s: 'ETH/USD', bid: 3312.8, chg: -0.62 },
  { s: 'XAU/USD', bid: 2384.4, chg: 0.41 },
  { s: 'EUR/USD', bid: 1.0842, chg: 0.11 },
  { s: 'USD/NGN', bid: 1540.2, chg: -0.08 },
  { s: 'USOIL', bid: 78.34, chg: 0.87 }
];

function renderTrading() {
  $('#tradeBal').textContent = '$' + state.trading.balance.toFixed(2);
  $('#profitBal').textContent = '$' + state.trading.profit.toFixed(2);
  $('#botStatus').textContent = state.trading.running ? 'RUNNING' : 'STOPPED';
  $('#botStatus').className = state.trading.running ? 'up' : 'down';
  const up = Math.floor((Date.now() - state.trading.startedAt) / 1000);
  $('#botUptime').textContent = `Uptime ${String(Math.floor(up / 3600)).padStart(2, '0')}:${String(Math.floor(up / 60) % 60).padStart(2, '0')}:${String(up % 60).padStart(2, '0')}`;

  $('#marketBody').innerHTML = MARKET.map(m => {
    const ask = m.bid * 1.0004;
    const sig = m.chg > 0.5 ? 'BUY' : m.chg < -0.5 ? 'SELL' : 'HOLD';
    const cls = sig === 'BUY' ? 'ok' : sig === 'SELL' ? 'fail' : 'mute';
    return `<tr><td><b>${m.s}</b></td><td class="mono">${m.bid.toFixed(4)}</td><td class="mono">${ask.toFixed(4)}</td>
      <td class="${m.chg >= 0 ? 'up' : 'down'}">${m.chg >= 0 ? '+' : ''}${m.chg.toFixed(2)}%</td>
      <td><span class="tag ${cls}">${sig}</span></td></tr>`;
  }).join('');

  $('#tradeLog').innerHTML = state.trades.slice(0, 12).map(t => `
    <div class="feed-item"><span class="dot" style="background:${t.pnl >= 0 ? 'var(--green)' : 'var(--red)'}"></span>
    <div><b>${t.side} ${t.sym} · ${t.pnl >= 0 ? '+' : ''}$${t.pnl.toFixed(2)}</b>
    <small>${t.note} · ${dt(t.at)}</small></div></div>`).join('') || '<div class="empty">Bot is warming up…</div>';
}

$('#botStart').addEventListener('click', () => { state.trading.running = true; state.trading.startedAt = Date.now(); save(); renderTrading(); toast('Bot started', 'Strategy engine is now scanning markets.', 'ok'); });
$('#botStop').addEventListener('click', () => { state.trading.running = false; save(); renderTrading(); toast('Bot stopped', 'No new positions will be opened.', ''); });
$('#profitSweep').addEventListener('click', () => {
  const p = state.trading.profit;
  if (p <= 0) return toast('Nothing to sweep', 'Profit ledger is empty.', 'err');
  const c = currentCustomer();
  c.balance += p * RATES.USD.r;
  state.wallets[c.id].NGN = c.balance;
  state.trading.profit = 0;
  const txn = { serial: 'SN' + (state.counters.serial++), id: 'TXN-' + uid('').slice(0, 10), type: 'TRADING', dir: 'in', amount: p * RATES.USD.r, party: 'TRADING PROFIT LEDGER', channel: 'INTERNAL', status: 'SUCCESS', date: new Date().toISOString(), acct: c.account, note: 'Profit sweep to main balance' };
  state.txns.unshift(txn);
  postLedger(txn.id, 'TRADING-PROFIT', 'CUST-' + c.account, p * RATES.USD.r, 'Profit sweep');
  audit(c.account, 'PROFIT_SWEEP', '$' + p.toFixed(2));
  notify('sms', 'Profit Credited', `$${p.toFixed(2)} trading profit swept to your main balance.`);
  save(); renderAll();
  toast('Profit swept', `$${p.toFixed(2)} moved to main balance`, 'ok');
});

function seedMiners() {
  if (state.miners.length) return;
  state.miners = [
    { id: 'WKR-01', algo: 'SHA-256', rate: 142.4, status: 'ONLINE' },
    { id: 'WKR-02', algo: 'Ethash', rate: 88.1, status: 'ONLINE' },
    { id: 'WKR-03', algo: 'Scrypt', rate: 34.7, status: 'ONLINE' },
    { id: 'WKR-04', algo: 'RandomX', rate: 12.2, status: 'DEGRADED' }
  ];
  state.mining.hashrate = state.miners.reduce((a, b) => a + b.rate, 0);
}
function renderMining() {
  seedMiners();
  $('#mineBal').textContent = '$' + state.mining.balance.toFixed(2);
  $('#hashRate').textContent = state.mining.hashrate.toFixed(1) + ' MH/s';
  $('#workerCount').textContent = state.miners.filter(m => m.status !== 'OFFLINE').length;
  $('#minerBody').innerHTML = state.miners.map(m => `
    <tr><td class="mono">${m.id}</td><td>${m.algo}</td><td class="mono">${m.rate.toFixed(1)} MH/s</td>
    <td><span class="tag ${m.status === 'ONLINE' ? 'ok' : 'pend'}">${m.status}</span></td></tr>`).join('');
  $('#mineLog').innerHTML = state.mineLog.slice(0, 12).map(l => `
    <div class="feed-item"><span class="dot" style="background:var(--gold)"></span>
    <div><b>+$${l.amt.toFixed(4)} ${l.coin}</b><small>Block reward · ${l.note} · ${dt(l.at)}</small></div></div>`).join('')
    || '<div class="empty">Waiting for first share…</div>';
}
$('#mineSweep').addEventListener('click', () => {
  const b = state.mining.balance;
  if (b <= 0) return toast('Nothing to sweep', 'Mining balance is empty.', 'err');
  const c = currentCustomer();
  c.balance += b * RATES.USD.r; state.wallets[c.id].NGN = c.balance; state.mining.balance = 0;
  const txn = { serial: 'SN' + (state.counters.serial++), id: 'TXN-' + uid('').slice(0, 10), type: 'MINING', dir: 'in', amount: b * RATES.USD.r, party: 'MINING POOL PAYOUT', channel: 'INTERNAL', status: 'SUCCESS', date: new Date().toISOString(), acct: c.account, note: 'Mining reward sweep' };
  state.txns.unshift(txn);
  postLedger(txn.id, 'MINING-POOL', 'CUST-' + c.account, b * RATES.USD.r, 'Mining sweep');
  audit(c.account, 'MINING_SWEEP', '$' + b.toFixed(2));
  save(); renderAll(); toast('Mining swept', `$${b.toFixed(2)} credited to main balance`, 'ok');
});

function renderStatements() {
  const c = currentCustomer();
  $('#stAcctLine').textContent = `${c.name} · ${c.account} · ${c.type}`;
  $('#stGenDate').textContent = dt(new Date().toISOString());
  const days = parseInt($('#stPeriod').value || '30');
  const cutoff = days ? Date.now() - days * 86400000 : 0;
  const list = myTxns().filter(t => new Date(t.date).getTime() >= cutoff).sort((a, b) => new Date(a.date) - new Date(b.date));
  let bal = c.balance - list.reduce((a, t) => a + (t.dir === 'in' ? t.amount : -t.amount), 0);
  $('#stBody').innerHTML = list.map(t => {
    bal += t.dir === 'in' ? t.amount : -t.amount;
    return `<tr><td style="white-space:nowrap">${new Date(t.date).toLocaleDateString('en-GB')}</td>
      <td>${t.party}<br><small style="color:var(--muted)">${t.note}</small></td>
      <td class="mono">${t.id}</td>
      <td class="amt-out">${t.dir === 'out' ? money(t.amount) : '—'}</td>
      <td class="amt-in">${t.dir === 'in' ? money(t.amount) : '—'}</td>
      <td class="mono">${money(bal)}</td></tr>`;
  }).join('') || '<tr><td colspan="6" class="empty">No transactions in this period</td></tr>';
}
$('#stPeriod').addEventListener('change', renderStatements);
$('#stPrint').addEventListener('click', () => window.print());

function renderSettings() {
  const c = currentCustomer();
  $('#setName').textContent = c.name;
  $('#setBvn').textContent = c.bvn.replace(/(\d{3})(\d{3})(\d{4})/, '$1****$3');
  $('#setPhone').textContent = c.phone;
  $('#setEmail').textContent = c.email;
  $('#setKyc').textContent = c.kyc;
  $('#setStatus').textContent = c.status;
}
$('#setPin').addEventListener('click', () => {
  openModal(`<h3>Change Transaction PIN</h3><p class="lead">Enter your current PIN and choose a new 4-digit PIN.</p>
    <div class="field"><label>Current PIN</label><input type="password" id="p0" maxlength="4"></div>
    <div class="field"><label>New PIN</label><input type="password" id="p1" maxlength="4"></div>
    <div class="err" id="pErr"></div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="pGo">Update</button></div>`);
  $('#pGo').addEventListener('click', () => {
    const c = currentCustomer();
    if ($('#p0').value !== c.pin) return $('#pErr').textContent = 'Current PIN incorrect.';
    if ($('#p1').value.length !== 4) return $('#pErr').textContent = 'New PIN must be 4 digits.';
    c.pin = $('#p1').value; audit(c.account, 'PIN_CHANGE', 'Transaction PIN updated'); save(); closeModal();
    toast('PIN updated', 'Your transaction PIN has been changed.', 'ok');
  });
});
$('#set2fa').addEventListener('click', () => toast('2FA', 'Two-factor authentication is enabled for this demo session.', 'ok'));

function renderAdmin() {
  const total = state.customers.reduce((a, c) => a + c.balance, 0);
  $('#adDeposits').textContent = money(total);
  $('#adCustomers').textContent = state.customers.length;
  $('#adTxToday').textContent = state.txns.filter(t => t.date && t.date.slice(0, 10) === todayKey()).length;
  $('#adFees').textContent = money(state.txns.reduce((a, t) => a + (t.fee || 0), 0));

  $('#adCustBody').innerHTML = state.customers.map(c => `
    <tr>
      <td class="mono">${c.account}</td>
      <td>${c.name}</td>
      <td>${c.type}</td>
      <td class="mono">${money(c.balance)}</td>
      <td><span class="tag ${c.kyc === 'Tier 3' ? 'ok' : 'pend'}">${c.kyc}</span></td>
      <td><span class="tag ${c.status === 'ACTIVE' ? 'ok' : c.status === 'FROZEN' ? 'pend' : 'fail'}">${c.status}</span></td>
      <td><div class="row" style="gap:6px">
        <button class="btn btn-sm" data-act="view" data-id="${c.id}">View</button>
        <button class="btn btn-sm" data-act="freeze" data-id="${c.id}">${c.status === 'ACTIVE' ? 'Freeze' : 'Activate'}</button>
        <button class="btn btn-sm" data-act="block" data-id="${c.id}">${c.status === 'BLOCKED' ? 'Unblock' : 'Block'}</button>
        <button class="btn btn-sm" data-act="kyc" data-id="${c.id}">KYC</button>
      </div></td>
    </tr>`).join('');

  $$('[data-act]').forEach(b => b.addEventListener('click', () => {
    const c = state.customers.find(x => x.id === b.dataset.id);
    const act = b.dataset.act;
    if (act === 'freeze') { c.status = c.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE'; audit('ADMIN', 'ACCOUNT_STATUS', `${c.account} → ${c.status}`); }
    if (act === 'block') { c.status = c.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED'; audit('ADMIN', 'ACCOUNT_STATUS', `${c.account} → ${c.status}`); }
    if (act === 'kyc') { c.kyc = c.kyc === 'Tier 3' ? 'Tier 1' : 'Tier 3'; audit('ADMIN', 'KYC_UPDATE', `${c.account} → ${c.kyc}`); }
    if (act === 'view') {
      openModal(`<h3>${c.name}</h3><p class="lead">Account ${c.account} · ${c.type}</p>
        <div class="kv"><span>Balance</span><b>${money(c.balance)}</b></div>
        <div class="kv"><span>BVN</span><b class="mono">${c.bvn}</b></div>
        <div class="kv"><span>Phone</span><b>${c.phone}</b></div>
        <div class="kv"><span>Email</span><b>${c.email}</b></div>
        <div class="kv"><span>KYC</span><b>${c.kyc}</b></div>
        <div class="kv"><span>Status</span><b>${c.status}</b></div>
        <div class="kv"><span>Opened</span><b>${dt(c.createdAt)}</b></div>
        <div class="modal-actions"><button class="btn btn-primary" onclick="closeModal()">Close</button></div>`);
      return;
    }
    save(); renderAll(); toast('Updated', `${c.name} is now ${c.status}`, 'ok');
  }));

  $('#adjAcct').innerHTML = state.customers.map(c => `<option value="${c.id}">${c.account} — ${c.name}</option>`).join('');
}

$('#adjGo').addEventListener('click', () => {
  const c = state.customers.find(x => x.id === $('#adjAcct').value);
  const amt = parseFloat($('#adjAmount').value);
  const op = $('#adjOp').value;
  const reason = $('#adjReason').value.trim();
  if (!amt || amt <= 0) return toast('Invalid amount', 'Enter an amount.', 'err');
  if (!reason) return toast('Reason required', 'Audit trail requires a reason.', 'err');
  if (op === 'debit' && amt > c.balance) return toast('Insufficient funds', 'Balance too low for this debit.', 'err');

  c.balance += op === 'credit' ? amt : -amt;
  state.wallets[c.id].NGN = c.balance;
  const txn = { serial: 'SN' + (state.counters.serial++), id: 'TXN-' + uid('').slice(0, 10), type: 'ADJUSTMENT', dir: op === 'credit' ? 'in' : 'out', amount: amt, party: 'ADMIN ADJUSTMENT', channel: 'BACKOFFICE', status: 'SUCCESS', date: new Date().toISOString(), acct: c.account, note: reason };
  state.txns.unshift(txn);
  if (op === 'credit') postLedger(txn.id, 'ADJUSTMENT-SUSPENSE', 'CUST-' + c.account, amt, reason);
  else postLedger(txn.id, 'CUST-' + c.account, 'ADJUSTMENT-SUSPENSE', amt, reason);
  audit('ADMIN', 'LEDGER_ADJUSTMENT', `${op.toUpperCase()} ${money(amt)} on ${c.account} — ${reason}`);
  notify('sms', 'Balance Adjustment', `Your account was ${op}ed by ${money(amt)}. Reason: ${reason}. Ref ${txn.id}`);
  save(); renderAll();
  toast('Adjustment posted', `${op} ${money(amt)} on ${c.account}`, 'ok');
});

$('#adNewCust').addEventListener('click', () => {
  openModal(`<h3>Open New Account</h3><p class="lead">Creates a 10-digit account with automatic activation.</p>
    <div class="field"><label>Full Name</label><input id="ncName" placeholder="Customer full name"></div>
    <div class="field"><label>Account Type</label><select id="ncType"><option>Savings</option><option>Current</option><option>Corporate Current</option><option>Joint</option></select></div>
    <div class="field"><label>BVN</label><input id="ncBvn" maxlength="11" placeholder="11-digit BVN"></div>
    <div class="field"><label>Phone</label><input id="ncPhone" placeholder="+234…"></div>
    <div class="field"><label>Email</label><input id="ncEmail" placeholder="name@email.com"></div>
    <div class="err" id="ncErr"></div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="ncGo">Create Account</button></div>`);
  $('#ncGo').addEventListener('click', () => {
    const name = $('#ncName').value.trim().toUpperCase();
    const bvn = $('#ncBvn').value.trim();
    if (!name) return $('#ncErr').textContent = 'Name is required.';
    if (bvn.length !== 11) return $('#ncErr').textContent = 'BVN must be 11 digits.';
    let acct;
    do { acct = String(Math.floor(1000000000 + Math.random() * 8999999999)); }
    while (state.customers.some(c => c.account === acct));
    const id = 'C' + String(state.customers.length + 1).padStart(3, '0');
    const c = { id, name, account: acct, bank: '920', type: $('#ncType').value, bvn, phone: $('#ncPhone').value || '+234 800 000 0000', email: $('#ncEmail').value || 'customer@demo.bank', balance: 0, kyc: 'Tier 1', status: 'ACTIVE', pin: '1234', dailyLimit: 300000, password: 'GPB2024', createdAt: new Date().toISOString() };
    state.customers.push(c);
    state.wallets[id] = { NGN: 0, USD: 0, EUR: 0, GBP: 0, CNY: 0, RUB: 0, CAD: 0, UAH: 0, AUD: 0, XAF: 0, ZAR: 0, GHS: 0 };
    state.crypto[id] = CRYPTOS.map(k => ({ sym: k.sym, addr: 'gpb' + k.sym.toLowerCase() + '_' + hash(acct + k.sym).toString(16), bal: 0 }));
    audit('ADMIN', 'ACCOUNT_OPEN', `${name} · ${acct}`);
    notify('email', 'Welcome to Global Pilgrim Bank', `Account ${acct} created for ${name}. Default password GPB2024, transaction PIN 1234.`);
    save(); renderAll(); closeModal();
    toast('Account created', `${name} · ${acct}`, 'ok');
  });
});

$('#sysMaint').addEventListener('click', () => toast('Maintenance mode', 'Toggled. Scheduled jobs paused.', ''));
$('#sysReport').addEventListener('click', () => toast('Daily report', 'Operational summary generated for ' + new Date().toLocaleDateString('en-GB'), 'ok'));

function renderLedger() {
  const d = state.ledger.reduce((a, e) => a + e.debit, 0);
  const c = state.ledger.reduce((a, e) => a + e.credit, 0);
  $('#lgDebit').textContent = money(d);
  $('#lgCredit').textContent = money(c);
  const balanced = Math.abs(d - c) < 0.01;
  $('#lgBal').textContent = balanced ? 'BALANCED' : 'OUT OF BALANCE';
  $('#lgBal').className = balanced ? 'up' : 'down';
  $('#ledgerBody').innerHTML = state.ledger.slice(0, 80).map(e => `
    <tr><td class="mono">${e.id}</td><td class="mono">${e.txn}</td><td class="mono">${e.account}</td>
    <td class="amt-out">${e.debit ? money(e.debit) : '—'}</td>
    <td class="amt-in">${e.credit ? money(e.credit) : '—'}</td>
    <td style="white-space:nowrap">${dt(e.date)}</td></tr>`).join('')
    || '<tr><td colspan="6" class="empty">No ledger entries yet. Post a transaction to generate double-entry records.</td></tr>';
}

function renderAudit() {
  $('#auditBody').innerHTML = state.audit.slice(0, 100).map(a => `
    <tr><td class="mono">${a.n}</td><td>${a.operator}</td><td><span class="tag info">${a.action}</span></td>
    <td>${a.detail}</td><td style="white-space:nowrap">${dt(a.at)}</td></tr>`).join('')
    || '<tr><td colspan="5" class="empty">No audit records yet</td></tr>';
}

let tickTimer = null;
function startTicker() {
  if (tickTimer) clearInterval(tickTimer);
  tickTimer = setInterval(() => {
    renderHeader();
    MARKET.forEach(m => { m.bid += (Math.random() - 0.5) * m.bid * 0.0008; m.chg += (Math.random() - 0.5) * 0.05; });
    if ($('#page-trading').classList.contains('active')) renderTrading();
    if ($('#page-mining').classList.contains('active')) renderMining();

    if (state.trading.running && Math.random() < 0.45) {
      const m = MARKET[Math.floor(Math.random() * MARKET.length)];
      const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
      const pnl = (Math.random() - 0.38) * 24;
      state.trading.profit += pnl;
      state.trades.unshift({ sym: m.s, side, pnl, note: `${side} @ ${m.bid.toFixed(2)} · auto-close`, at: new Date().toISOString() });
      if (state.trades.length > 40) state.trades.pop();
      if ($('#page-trading').classList.contains('active')) renderTrading();
      save();
    }

    if (Math.random() < 0.3) {
      const coin = ['BTC', 'ETH', 'PGC'][Math.floor(Math.random() * 3)];
      const amt = Math.random() * 0.9;
      state.mining.balance += amt;
      state.mineLog.unshift({ coin, amt, note: 'share accepted · pool #' + Math.floor(Math.random() * 9000 + 1000), at: new Date().toISOString() });
      if (state.mineLog.length > 40) state.mineLog.pop();
      if ($('#page-mining').classList.contains('active')) renderMining();
      save();
    }
  }, 5000);
}

load();
$('#loginAcct').value = '3855158987';
$('#loginPw').value = 'GPB2024';
$('#menuBtn').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
window.addEventListener('resize', () => { $('#menuBtn').style.display = window.innerWidth <= 900 ? 'inline-flex' : 'none'; });
$('#menuBtn').style.display = window.innerWidth <= 900 ? 'inline-flex' : 'none';
