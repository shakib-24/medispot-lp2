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

/* ===== ステータス定義 ===== */
var STATUS_ORDER = ['応募済み', '選考中', 'マッチング成立', '決済待ち', '入金完了'];

var BADGE_MAP = {
  '応募済み':     { cls: 'badge-applied',   icon: 'ti-send' },
  '選考中':       { cls: 'badge-reviewing', icon: 'ti-loader' },
  'マッチング成立':{ cls: 'badge-matched',   icon: 'ti-heart-handshake' },
  '決済待ち':     { cls: 'badge-awaiting',  icon: 'ti-clock' },
  '入金完了':     { cls: 'badge-paid',       icon: 'ti-circle-check' },
};

/* ===== ダミーデータ ===== */
var data = [
  { no:1, seeker:'佐藤 花子',   job:'外来看護師求人',    hospital:'ブランチ総合クリニック', date:'2026/06/15', status:'選考中' },
  { no:2, seeker:'田中 太郎',   job:'理学療法士求人',    hospital:'ブランチ総合クリニック', date:'2026/06/10', status:'マッチング成立' },
  { no:3, seeker:'鈴木 一郎',   job:'放射線技師求人',    hospital:'ブランチ総合クリニック', date:'2026/06/12', status:'決済待ち' },
  { no:4, seeker:'山本 けいこ', job:'作業療法士求人',    hospital:'山田病院',               date:'2026/06/18', status:'応募済み' },
  { no:5, seeker:'中村 ゆり',   job:'言語聴覚士求人',    hospital:'山田病院',               date:'2026/06/20', status:'入金完了' },
];

/* ===== フィルター ===== */
function applyFilters() {
  var keyword = document.getElementById('searchInput').value.trim().toLowerCase();
  var status  = document.getElementById('statusFilter').value;

  var filtered = data.filter(function (r) {
    var matchK = !keyword ||
      r.seeker.toLowerCase().includes(keyword) ||
      r.job.toLowerCase().includes(keyword) ||
      r.hospital.toLowerCase().includes(keyword);
    var matchS = !status || r.status === status;
    return matchK && matchS;
  });

  renderTable(filtered);
  renderCards(filtered);
  updatePipeline(status || null);
}

/* ===== テーブル描画 ===== */
function renderTable(rows) {
  var tbody = document.getElementById('tableBody');

  if (!rows.length) {
    tbody.innerHTML =
      '<tr class="empty-row"><td colspan="7">' +
        '<i class="ti ti-search-off"></i>' +
        '該当するマッチングが見つかりませんでした' +
      '</td></tr>';
    document.getElementById('resultCount').textContent = '0件';
    return;
  }

  tbody.innerHTML = rows.map(function (r) {
    var b = BADGE_MAP[r.status] || { cls: 'badge-applied', icon: 'ti-circle' };
    return (
      '<tr>' +
        '<td><span style="font-size:12px;color:#888">' + r.no + '</span></td>' +
        '<td><strong>' + esc(r.seeker) + '</strong></td>' +
        '<td>' + esc(r.job) + '</td>' +
        '<td><span style="font-size:12px">' + esc(r.hospital) + '</span></td>' +
        '<td style="font-size:12px;color:#888">' + esc(r.date) + '</td>' +
        '<td><span class="badge ' + b.cls + '"><i class="ti ' + b.icon + '"></i>' + esc(r.status) + '</span></td>' +
        '<td>' +
          '<button class="btn-detail" onclick="showDetail(' + r.no + ')">' +
            '<i class="ti ti-eye"></i>詳細を見る' +
          '</button>' +
        '</td>' +
      '</tr>'
    );
  }).join('');

  document.getElementById('resultCount').textContent = rows.length + '件表示中';
  updateSummary();
}

/* ===== カード描画（モバイル用） ===== */
function renderCards(rows) {
  var container = document.getElementById('mobileCards');
  if (!container) return;

  if (!rows.length) {
    container.innerHTML =
      '<div class="member-card" style="text-align:center;padding:32px 16px;color:#bbb">' +
        '<i class="ti ti-search-off" style="font-size:32px;display:block;margin-bottom:8px;opacity:.3"></i>' +
        '該当するマッチングが見つかりませんでした' +
      '</div>';
    return;
  }

  container.innerHTML = rows.map(function (r) {
    var b = BADGE_MAP[r.status] || { cls: 'badge-applied', icon: 'ti-circle' };
    return (
      '<div class="member-card">' +
        '<div class="card-member-header">' +
          '<div class="card-header-icon"><i class="ti ti-heart-handshake"></i></div>' +
          '<div>' +
            '<div style="font-size:14px;font-weight:700;color:var(--ink)">' + esc(r.seeker) + '</div>' +
            '<div style="font-size:11px;color:#888">No.' + r.no + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="card-row">' +
          '<span class="card-label">求人タイトル</span>' +
          '<span class="card-value">' + esc(r.job) + '</span>' +
        '</div>' +
        '<div class="card-row">' +
          '<span class="card-label">医療機関名</span>' +
          '<span class="card-value">' + esc(r.hospital) + '</span>' +
        '</div>' +
        '<div class="card-row">' +
          '<span class="card-label">応募日</span>' +
          '<span class="card-value" style="color:#888">' + esc(r.date) + '</span>' +
        '</div>' +
        '<div class="card-row">' +
          '<span class="card-label">ステータス</span>' +
          '<span class="card-value"><span class="badge ' + b.cls + '"><i class="ti ' + b.icon + '"></i>' + esc(r.status) + '</span></span>' +
        '</div>' +
        '<div class="card-actions">' +
          '<button class="btn-detail" onclick="showDetail(' + r.no + ')"><i class="ti ti-eye"></i>詳細を見る</button>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

/* ===== サマリー ===== */
function updateSummary() {
  document.getElementById('totalCount').textContent = data.length;
  document.getElementById('doneCount').textContent  = data.filter(function (r) { return r.status === '入金完了'; }).length;
}

/* ===== パイプライン強調 ===== */
function updatePipeline(activeStatus) {
  document.querySelectorAll('.pipeline-step').forEach(function (el) {
    el.classList.remove('active');
    if (activeStatus && el.dataset.status === activeStatus) el.classList.add('active');
  });
}

/* ===== 詳細（スタブ） ===== */
function showDetail(no) {
  var r = data.find(function (d) { return d.no === no; });
  if (!r) return;
  alert(
    '【マッチング詳細】\n' +
    '求職者：' + r.seeker + '\n' +
    '求人：'   + r.job + '\n' +
    '医療機関：' + r.hospital + '\n' +
    '応募日：' + r.date + '\n' +
    'ステータス：' + r.status
  );
}

/* ===== ハンバーガー ===== */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
  document.body.classList.toggle('menu-open');
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ===== 初期描画 ===== */
applyFilters();
