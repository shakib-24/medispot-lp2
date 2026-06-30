/* ===== 認証チェック ===== */
(function () {
  var raw = localStorage.getItem('medispot_user');
  if (!raw) { window.location.href = 'login.html'; return; }
  var user;
  try { user = JSON.parse(raw); } catch (e) { window.location.href = 'login.html'; return; }
  if (!user || user.role !== 'admin') { window.location.href = 'login.html'; return; }
  function logout() { localStorage.removeItem('medispot_user'); window.location.href = 'login.html'; }
  ['logoutBtn', 'logoutBtnMobile'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', logout);
  });
})();

/* ===== バッジ定義 ===== */
var BADGE_MAP = {
  '未請求':  { cls: 'badge-unbilled', icon: 'ti-clock' },
  '請求済み': { cls: 'badge-billed',   icon: 'ti-send' },
  '支払済み': { cls: 'badge-paid',     icon: 'ti-circle-check' },
};

/* ===== ダミーデータ ===== */
var data = [
  { no:1, client:'ブランチ総合クリニック', job:'外来看護師求人',     amount:150000, issued:'2026/06/01', due:'2026/06/30', status:'支払済み' },
  { no:2, client:'山田病院',               job:'理学療法士（常勤）', amount:200000, issued:'2026/06/10', due:'2026/07/10', status:'請求済み' },
  { no:3, client:'鈴木介護施設',           job:'作業療法士求人',     amount:120000, issued:'',           due:'—',           status:'未請求'  },
];

/* ===== サマリーカード ===== */
function updateSummary() {
  var total   = data.length;
  var revenue = data.filter(function (r) { return r.status === '支払済み'; })
                    .reduce(function (acc, r) { return acc + r.amount; }, 0);
  var unpaid  = data.filter(function (r) { return r.status === '請求済み'; }).length;

  document.getElementById('totalCount').textContent   = total;
  document.getElementById('totalRevenue').textContent = revenue.toLocaleString();
  document.getElementById('unpaidCount').textContent  = unpaid;
}

/* ===== フィルター ===== */
function applyFilters() {
  var keyword = document.getElementById('searchInput').value.trim().toLowerCase();
  var status  = document.getElementById('statusFilter').value;

  var filtered = data.filter(function (r) {
    var matchK = !keyword ||
      r.client.toLowerCase().includes(keyword) ||
      r.job.toLowerCase().includes(keyword);
    var matchS = !status || r.status === status;
    return matchK && matchS;
  });

  renderTable(filtered);
}

/* ===== テーブル描画 ===== */
function renderTable(rows) {
  var tbody = document.getElementById('tableBody');

  if (!rows.length) {
    tbody.innerHTML =
      '<tr class="empty-row"><td colspan="8">' +
        '<i class="ti ti-search-off"></i>' +
        '該当する請求データが見つかりませんでした' +
      '</td></tr>';
    document.getElementById('resultCount').textContent = '0件';
    return;
  }

  var today = new Date();
  tbody.innerHTML = rows.map(function (r) {
    var b = BADGE_MAP[r.status] || { cls: 'badge-unbilled', icon: 'ti-circle' };

    var dueCls = '';
    if (r.due !== '—' && r.status !== '支払済み') {
      var d = new Date(r.due.replace(/\//g, '-'));
      if (!isNaN(d) && d <= today) dueCls = 'deadline-warn';
    }

    var amountStr = r.amount ? '¥' + r.amount.toLocaleString() : '—';
    var issuedStr = r.issued || '—';

    return (
      '<tr>' +
        '<td><span style="font-size:12px;color:#888">' + r.no + '</span></td>' +
        '<td><strong>' + esc(r.client) + '</strong></td>' +
        '<td>' + esc(r.job) + '</td>' +
        '<td><span class="amount">' + amountStr + '</span></td>' +
        '<td style="font-size:12px;color:#888">' + esc(issuedStr) + '</td>' +
        '<td class="' + dueCls + '" style="font-size:12px">' + esc(r.due) + '</td>' +
        '<td><span class="badge ' + b.cls + '"><i class="ti ' + b.icon + '"></i>' + esc(r.status) + '</span></td>' +
        '<td>' +
          '<button class="btn-invoice" onclick="issueInvoice(' + r.no + ')">' +
            '<i class="ti ti-file-invoice"></i>請求書発行' +
          '</button>' +
        '</td>' +
      '</tr>'
    );
  }).join('');

  document.getElementById('resultCount').textContent = rows.length + '件表示中';
}

/* ===== 請求書発行（スタブ） ===== */
function issueInvoice(no) {
  var r = data.find(function (d) { return d.no === no; });
  if (!r) return;
  if (r.status === '支払済み') { alert('この請求はすでに支払済みです。'); return; }
  if (r.status === '未請求') {
    r.status  = '請求済み';
    r.issued  = new Date().toLocaleDateString('ja-JP', { year:'numeric', month:'2-digit', day:'2-digit' }).replace(/\//g, '/');
    var due = new Date(); due.setDate(due.getDate() + 30);
    r.due = due.toLocaleDateString('ja-JP', { year:'numeric', month:'2-digit', day:'2-digit' }).replace(/\//g, '/');
    updateSummary();
    applyFilters();
    alert('請求書を発行しました。\n請求先：' + r.client + '\n金額：¥' + r.amount.toLocaleString());
  } else {
    alert('請求書\n請求先：' + r.client + '\n案件：' + r.job + '\n金額：¥' + r.amount.toLocaleString() + '\n支払期限：' + r.due);
  }
}

/* ===== ハンバーガー ===== */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ===== 初期描画 ===== */
updateSummary();
applyFilters();
