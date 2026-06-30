/* ===== 認証チェック ===== */
(function () {
  var raw = localStorage.getItem('medispot_user');
  if (!raw) { window.location.href = 'login.html'; return; }
  var user;
  try { user = JSON.parse(raw); } catch (e) { window.location.href = 'login.html'; return; }
  if (!user || user.role !== 'admin') { window.location.href = 'login.html'; return; }

  function logout() {
    localStorage.removeItem('medispot_user');
    window.location.href = 'login.html';
  }
  ['logoutBtn', 'logoutBtnMobile'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', logout);
  });
})();

/* ===== ダミーデータ ===== */
var SEEKERS = [
  { id: 'S001', name: '佐藤 花子',   type: '看護師',         registered: '2026/05/10', status: 'Active'  },
  { id: 'S002', name: '鈴木 あかり', type: '理学療法士',     registered: '2026/05/18', status: 'Active'  },
  { id: 'S003', name: '田中 めぐみ', type: '臨床検査技師',   registered: '2026/06/01', status: '審査中'  },
  { id: 'S004', name: '山本 けいこ', type: '作業療法士',     registered: '2026/04/22', status: 'Blocked' },
  { id: 'S005', name: '中村 ゆり',   type: '言語聴覚士',     registered: '2026/06/12', status: 'Active'  },
];

var EMPLOYERS = [
  { id: 'E001', name: 'ブランチ総合クリニック', type: '医療法人',   registered: '2026/04/05', status: 'Active'  },
  { id: 'E002', name: '山田病院',               type: '病院',       registered: '2026/05/02', status: 'Active'  },
  { id: 'E003', name: '鈴木介護施設',           type: '介護施設',   registered: '2026/06/08', status: '審査中'  },
];

/* ===== 状態 ===== */
var currentTab = 'seeker';

/* 会員データのコピー（ブロック操作をメモリで管理） */
var seekerData    = SEEKERS.map(function (m) { return Object.assign({}, m); });
var employerData  = EMPLOYERS.map(function (m) { return Object.assign({}, m); });

/* ===== 現在のデータ取得 ===== */
function getCurrentData() {
  return currentTab === 'seeker' ? seekerData : employerData;
}

/* ===== タブ切り替え ===== */
function switchTab(tab) {
  currentTab = tab;

  document.getElementById('tabSeeker').classList.toggle('active', tab === 'seeker');
  document.getElementById('tabEmployer').classList.toggle('active', tab === 'employer');

  var colType = document.getElementById('colType');
  colType.textContent = tab === 'seeker' ? '職種' : '種別';

  document.getElementById('searchInput').value = '';
  document.getElementById('statusFilter').value = '';

  applyFilters();
}

/* ===== フィルター適用 ===== */
function applyFilters() {
  var keyword = document.getElementById('searchInput').value.trim().toLowerCase();
  var status  = document.getElementById('statusFilter').value;
  var data    = getCurrentData();

  var filtered = data.filter(function (m) {
    var matchKeyword = !keyword ||
      m.name.toLowerCase().includes(keyword) ||
      m.type.toLowerCase().includes(keyword);
    var matchStatus = !status || m.status === status;
    return matchKeyword && matchStatus;
  });

  renderTable(filtered);
  renderCards(filtered);
}

/* ===== テーブル描画 ===== */
function renderTable(data) {
  var tbody  = document.getElementById('tableBody');
  var isSeeker = currentTab === 'seeker';

  if (data.length === 0) {
    tbody.innerHTML =
      '<tr class="empty-row">' +
        '<td colspan="5">' +
          '<i class="ti ti-search-off"></i>' +
          '該当する会員が見つかりませんでした' +
        '</td>' +
      '</tr>';
    document.getElementById('resultCount').textContent = '0件';
    updateHeaderCounts();
    return;
  }

  tbody.innerHTML = data.map(function (m) {
    var rowClass  = m.status === 'Blocked' ? ' class="row-blocked"' : '';
    var badgeCls  = statusBadgeClass(m.status);
    var badgeIcon = statusBadgeIcon(m.status);
    var blockBtn  = m.status === 'Blocked'
      ? '<button class="btn-unblock" onclick="toggleBlock(\'' + m.id + '\')"><i class="ti ti-lock-open"></i>解除</button>'
      : '<button class="btn-block"   onclick="toggleBlock(\'' + m.id + '\')"><i class="ti ti-ban"></i>ブロック</button>';
    var avatarIcon = isSeeker ? 'ti-user' : 'ti-building-hospital';

    return (
      '<tr' + rowClass + '>' +
        '<td>' +
          '<div class="member-identity">' +
            '<div class="member-avatar"><i class="ti ' + avatarIcon + '"></i></div>' +
            '<div>' +
              '<div class="member-name">' + escapeHtml(m.name) + '</div>' +
              '<div class="member-id">ID: ' + escapeHtml(m.id) + '</div>' +
            '</div>' +
          '</div>' +
        '</td>' +
        '<td>' + escapeHtml(m.type) + '</td>' +
        '<td>' + escapeHtml(m.registered) + '</td>' +
        '<td><span class="badge ' + badgeCls + '"><i class="ti ' + badgeIcon + '"></i>' + escapeHtml(m.status) + '</span></td>' +
        '<td>' +
          '<div class="actions">' +
            '<button class="btn-detail" onclick="openDetail(\'' + m.id + '\')"><i class="ti ti-pencil"></i>詳細/編集</button>' +
            blockBtn +
          '</div>' +
        '</td>' +
      '</tr>'
    );
  }).join('');

  document.getElementById('resultCount').textContent = data.length + '件表示中';
  updateHeaderCounts();
}

/* ===== カード描画（モバイル用） ===== */
function renderCards(data) {
  var container = document.getElementById('mobileCards');
  if (!container) return;

  var isSeeker   = currentTab === 'seeker';
  var typeLabel  = isSeeker ? '職種' : '種別';
  var avatarIcon = isSeeker ? 'ti-user' : 'ti-building-hospital';

  if (!data.length) {
    container.innerHTML =
      '<div class="member-card" style="text-align:center;padding:32px 16px;color:#bbb">' +
        '<i class="ti ti-search-off" style="font-size:32px;display:block;margin-bottom:8px;opacity:.3"></i>' +
        '該当する会員が見つかりませんでした' +
      '</div>';
    return;
  }

  container.innerHTML = data.map(function (m) {
    var badgeCls   = statusBadgeClass(m.status);
    var badgeIcon  = statusBadgeIcon(m.status);
    var blockedCls = m.status === 'Blocked' ? ' card-blocked' : '';
    var blockBtn   = m.status === 'Blocked'
      ? '<button class="btn-unblock" onclick="toggleBlock(\'' + escapeHtml(m.id) + '\')"><i class="ti ti-lock-open"></i>ブロック解除</button>'
      : '<button class="btn-block"   onclick="toggleBlock(\'' + escapeHtml(m.id) + '\')"><i class="ti ti-ban"></i>ブロック</button>';

    return (
      '<div class="member-card' + blockedCls + '">' +
        '<div class="card-member-header">' +
          '<div class="member-avatar"><i class="ti ' + avatarIcon + '"></i></div>' +
          '<div>' +
            '<div class="member-name">' + escapeHtml(m.name) + '</div>' +
            '<div class="member-id">ID: ' + escapeHtml(m.id) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="card-row">' +
          '<span class="card-label">' + typeLabel + '</span>' +
          '<span class="card-value">' + escapeHtml(m.type) + '</span>' +
        '</div>' +
        '<div class="card-row">' +
          '<span class="card-label">登録日</span>' +
          '<span class="card-value">' + escapeHtml(m.registered) + '</span>' +
        '</div>' +
        '<div class="card-row">' +
          '<span class="card-label">ステータス</span>' +
          '<span class="card-value">' +
            '<span class="badge ' + badgeCls + '"><i class="ti ' + badgeIcon + '"></i>' + escapeHtml(m.status) + '</span>' +
          '</span>' +
        '</div>' +
        '<div class="card-actions">' +
          '<button class="btn-detail" onclick="openDetail(\'' + escapeHtml(m.id) + '\')"><i class="ti ti-pencil"></i>詳細/編集</button>' +
          blockBtn +
        '</div>' +
      '</div>'
    );
  }).join('');
}

/* ===== ブロック切り替え ===== */
function toggleBlock(memberId) {
  var dataset = getCurrentData();
  var member  = dataset.find(function (m) { return m.id === memberId; });
  if (!member) return;

  if (member.status === 'Blocked') {
    if (!confirm(escapeHtml(member.name) + ' のブロックを解除しますか？')) return;
    member.status = 'Active';
  } else {
    if (!confirm(escapeHtml(member.name) + ' をブロックしますか？')) return;
    member.status = 'Blocked';
  }
  applyFilters();
}

/* ===== 詳細/編集（スタブ） ===== */
function openDetail(memberId) {
  alert('詳細/編集：' + memberId + '\n（詳細ページは今後実装予定です）');
}

/* ===== ヘッダー集計更新 ===== */
function updateHeaderCounts() {
  var all     = seekerData.concat(employerData);
  var active  = all.filter(function (m) { return m.status === 'Active'; }).length;
  var blocked = all.filter(function (m) { return m.status === 'Blocked'; }).length;

  document.getElementById('totalCount').textContent   = all.length;
  document.getElementById('activeCount').textContent  = active;
  document.getElementById('blockedCount').textContent = blocked;

  document.getElementById('seekerCount').textContent   = seekerData.length;
  document.getElementById('employerCount').textContent = employerData.length;
}

/* ===== ステータスバッジ ===== */
function statusBadgeClass(status) {
  if (status === 'Active')  return 'badge-active';
  if (status === 'Blocked') return 'badge-blocked';
  return 'badge-pending';
}
function statusBadgeIcon(status) {
  if (status === 'Active')  return 'ti-circle-check';
  if (status === 'Blocked') return 'ti-ban';
  return 'ti-clock';
}

/* ===== ハンバーガー ===== */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
  document.body.classList.toggle('menu-open');
}

/* ===== XSS対策 ===== */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ===== 初期描画 ===== */
applyFilters();
/* ===== オーバーレイタップで閉じる ===== */
document.getElementById('mobileMenu').addEventListener('click', function(e) {
  if (e.target === this) toggleMenu();
});
