/* ===== 認証・基本機能 ===== */
(function () {
  var raw = localStorage.getItem('medispot_user');
  if (!raw) { window.location.href = 'login.html'; return; }
  var user;
  try { user = JSON.parse(raw); } catch (e) { window.location.href = 'login.html'; return; }
  if (!user || user.role !== 'admin') { window.location.href = 'login.html'; return; }

  var nameEl = document.getElementById('adminName');
  if (nameEl) nameEl.textContent = user.name || '管理者';

  var dateEl = document.getElementById('todayDate');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('ja-JP', {
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
    });
  }

  function logout() {
    localStorage.removeItem('medispot_user');
    window.location.href = 'login.html';
  }
  ['logoutBtn', 'logoutBtnMobile'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', logout);
  });
})();

function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
  document.body.classList.toggle('menu-open');
}

/* ==========================================================
 * ライブ通知システム（モック実装）
 *
 * ※現在はlocalStorageを使用したモック実装です。
 * 本番環境ではFirebase Firestoreのonsnapshot()を
 * 使用してリアルタイム同期を行う想定です。
 * コレクション名：notifications
 * フィールド：type, title, message, timestamp, read, userId
 * ========================================================== */

var NOTIF_KEY = 'medispot_admin_notifications';

/* ===== デフォルト通知データ ===== */
var NOTIF_DEFAULTS = [
  {
    id: 'notif-1',
    type: 'new_user',
    title: '新しい求職者が登録しました',
    message: '佐藤 花子さんが看護師として登録しました',
    timestamp: '2026-06-30 10:30',
    read: false
  },
  {
    id: 'notif-2',
    type: 'matching',
    title: 'マッチングが成立しました',
    message: '佐藤 花子さんとブランチ総合クリニックのマッチングが成立しました',
    timestamp: '2026-06-30 09:15',
    read: false
  },
  {
    id: 'notif-3',
    type: 'new_employer',
    title: '新しい求人者が登録しました',
    message: '山田病院が求人者として登録しました',
    timestamp: '2026-06-29 16:45',
    read: true
  }
];

/* ===== アイコン・色マッピング ===== */
var ICON_MAP = {
  'new_user':     { icon: 'ti-user-plus',        cls: 'type-new_user' },
  'matching':     { icon: 'ti-heart-handshake',  cls: 'type-matching' },
  'new_employer': { icon: 'ti-building-hospital', cls: 'type-new_employer' }
};

var notifications = [];
var _dropdownOpen = false;
var _toastCounter = 0;

/* ===== localStorage ===== */
function loadNotifications() {
  var raw = localStorage.getItem(NOTIF_KEY);
  if (raw) {
    try {
      notifications = JSON.parse(raw);
      return;
    } catch (e) {}
  }
  notifications = NOTIF_DEFAULTS.map(function (n) { return Object.assign({}, n); });
  saveNotifications();
}

function saveNotifications() {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
}

/* ===== バッジ更新 ===== */
function updateBadge() {
  var badge = document.getElementById('bellBadge');
  if (!badge) return;
  var count = notifications.filter(function (n) { return !n.read; }).length;
  if (count > 0) {
    badge.textContent = count > 9 ? '9+' : String(count);
    badge.style.display = '';
  } else {
    badge.style.display = 'none';
  }
}

/* ===== ドロップダウン描画 ===== */
function renderNotifList() {
  var list   = document.getElementById('notifList');
  var footer = document.getElementById('notifFooter');
  if (!list) return;

  if (!notifications.length) {
    list.innerHTML =
      '<li style="padding:28px 16px;text-align:center;color:#bbb;font-size:12px">' +
        '<i class="ti ti-bell-off" style="font-size:28px;display:block;margin-bottom:8px;opacity:.3"></i>' +
        '通知はありません' +
      '</li>';
    if (footer) footer.textContent = '';
    return;
  }

  list.innerHTML = notifications.map(function (n) {
    var m       = ICON_MAP[n.type] || { icon: 'ti-bell', cls: 'type-new_user' };
    var unread  = !n.read;
    var itemCls = unread ? ' unread' : '';
    var dot     = unread ? '<span class="unread-dot"></span>' : '';
    return (
      '<li class="notif-list-item' + itemCls + '" onclick="markRead(\'' + esc(n.id) + '\')">' +
        '<div class="notif-item-icon ' + m.cls + '"><i class="ti ' + m.icon + '"></i></div>' +
        '<div class="notif-item-body">' +
          '<div class="notif-item-title">' + esc(n.title) + '</div>' +
          '<div class="notif-item-msg">' + esc(n.message) + '</div>' +
          '<div class="notif-item-time"><i class="ti ti-clock"></i>' + esc(n.timestamp) + '</div>' +
        '</div>' +
        dot +
      '</li>'
    );
  }).join('');

  if (footer) {
    var unreadCnt = notifications.filter(function (n) { return !n.read; }).length;
    footer.textContent = '全' + notifications.length + '件' +
      (unreadCnt > 0 ? ' ／ 未読 ' + unreadCnt + '件' : ' ／ すべて既読');
  }
}

/* ===== ドロップダウン開閉 ===== */
function toggleNotifDropdown() {
  _dropdownOpen = !_dropdownOpen;
  var dd = document.getElementById('notifDropdown');
  if (dd) dd.classList.toggle('open', _dropdownOpen);
}

function closeNotifDropdown() {
  _dropdownOpen = false;
  var dd = document.getElementById('notifDropdown');
  if (dd) dd.classList.remove('open');
}

/* ===== 既読操作 ===== */
function markRead(id) {
  var n = notifications.find(function (x) { return x.id === id; });
  if (n && !n.read) {
    n.read = true;
    saveNotifications();
    updateBadge();
    renderNotifList();
  }
}

function markAllRead() {
  notifications.forEach(function (n) { n.read = true; });
  saveNotifications();
  updateBadge();
  renderNotifList();
}

/* ===== トースト通知 ===== */
function showToast(type, title, message) {
  var container = document.getElementById('toastContainer');
  if (!container) return;

  var m   = ICON_MAP[type] || { icon: 'ti-bell', cls: 'type-new_user' };
  var id  = 'toast-' + (++_toastCounter);
  var extraCls = type === 'matching' ? ' toast-matching' : '';

  var div = document.createElement('div');
  div.className = 'toast' + extraCls;
  div.id = id;
  div.innerHTML =
    '<div class="toast-icon ' + m.cls + '"><i class="ti ' + m.icon + '"></i></div>' +
    '<div class="toast-body">' +
      '<div class="toast-title">' + esc(title) + '</div>' +
      '<div class="toast-msg">' + esc(message) + '</div>' +
    '</div>' +
    '<button class="toast-close" onclick="dismissToast(\'' + id + '\')" aria-label="閉じる">' +
      '<i class="ti ti-x"></i>' +
    '</button>';

  container.appendChild(div);
  setTimeout(function () { dismissToast(id); }, 3000);
}

function dismissToast(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.add('hide');
  setTimeout(function () {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 280);
}

/* ===== ドロップダウン外クリックで閉じる ===== */
document.addEventListener('click', function (e) {
  var wrap = document.getElementById('notifBellWrap');
  if (wrap && !wrap.contains(e.target)) closeNotifDropdown();
});

/* ===== イベントバインド（script は body 末尾のため DOM 構築済み） ===== */
(function bindNotifEvents() {
  var bellBtn   = document.getElementById('notifBellBtn');
  var readAllBtn = document.getElementById('btnReadAll');

  if (bellBtn) {
    bellBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleNotifDropdown();
    });
  }
  if (readAllBtn) {
    readAllBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      markAllRead();
    });
  }
})();

/* ===== 初期化 ===== */
loadNotifications();
updateBadge();
renderNotifList();

/* ===== デモ用トースト（リアルタイム通知のシミュレーション） ===== */
setTimeout(function () {
  showToast(
    'new_user',
    '新しい求職者が登録しました',
    '中村 ゆりさんが言語聴覚士として登録しました'
  );
}, 2000);

setTimeout(function () {
  showToast(
    'matching',
    'マッチングが成立しました',
    '鈴木 あかりさんとブランチ総合クリニックのマッチングが成立しました'
  );
}, 5500);

/* ===== XSS対策 ===== */
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
/* ===== オーバーレイタップで閉じる ===== */
document.getElementById('mobileMenu').addEventListener('click', function(e) {
  if (e.target === this) toggleMenu();
});
