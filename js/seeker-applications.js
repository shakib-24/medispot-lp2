/* ===== デモ応募データ（ステータス・応募日） ===== */
const DEMO_APP_DATA = {
  'job-1': { date: '2026/06/15', status: '選考中' },
  'job-2': { date: '2026/06/20', status: 'マッチング成立' },
  'job-3': { date: '2026/06/25', status: '不採用' },
};

/* ===== 求人マスタ（表示用） ===== */
const JOBS = {
  'job-1': {
    jobType:        '看護師',
    employmentType: '非常勤',
    title:          '【日勤のみ】外来看護師（ブランクOK・週3日〜）',
    company:        'ブランチ総合クリニック',
    location:       '東京都世田谷区',
  },
  'job-2': {
    jobType:        '放射線技師',
    employmentType: '常勤',
    title:          '放射線技師（健診・一般撮影／土日休み）',
    company:        'ブランチ総合クリニック',
    location:       '東京都世田谷区',
  },
  'job-3': {
    jobType:        'OT（作業療法士）',
    employmentType: '非常勤',
    title:          '作業療法士（OT）（回復期リハ・週3日〜）',
    company:        'ブランチ総合クリニック',
    location:       '東京都狛江市',
  },
  'job-4': {
    jobType:        'PT（理学療法士）',
    employmentType: '常勤',
    title:          '理学療法士（PT）（整形外科クリニック・新設リハ室）',
    company:        'ブランチ総合クリニック',
    location:       '東京都調布市',
  },
  'job-5': {
    jobType:        'ST（言語聴覚士）',
    employmentType: '非常勤',
    title:          '言語聴覚士（ST）（外来・小児言語訓練）',
    company:        'ブランチ総合クリニック',
    location:       '東京都世田谷区',
  },
  'job-6': {
    jobType:        'ヘルパー',
    employmentType: '非常勤',
    title:          'ヘルパー（訪問介護・直行直帰OK）',
    company:        'ブランチ総合クリニック',
    location:       '東京都調布市',
  },
  'job-7': {
    jobType:        '臨床検査技師',
    employmentType: '常勤',
    title:          '臨床検査技師（健診センター・年間休日125日）',
    company:        'ブランチ総合クリニック',
    location:       '東京都渋谷区',
  },
};

/* ===== 職種バッジ色 ===== */
const JOB_TYPE_CLASS = {
  '看護師':           'badge-pink',
  '保健師':           'badge-pink',
  '助産師':           'badge-pink',
  '放射線技師':       'badge-blue',
  '臨床検査技師':     'badge-purple',
  'PT（理学療法士）': 'badge-teal',
  'OT（作業療法士）': 'badge-teal',
  'ST（言語聴覚士）': 'badge-teal',
  'ヘルパー':         'badge-orange',
};

/* ===== 雇用形態バッジ色 ===== */
const EMP_TYPE_CLASS = {
  '常勤':             'badge-emp-full',
  '非常勤':           'badge-emp-part',
  'スポット（単発）': 'badge-emp-spot',
  '業務委託':         'badge-emp-contract',
};

/* ===== ステータスバッジ設定 ===== */
const STATUS_CONFIG = {
  '選考中':       { cls: 'badge-reviewing', icon: 'ti-clock-hour-3' },
  'マッチング成立': { cls: 'badge-matched',   icon: 'ti-circle-check' },
  '不採用':       { cls: 'badge-rejected',   icon: 'ti-x'           },
};

/* ===== 初期化 ===== */
(function () {
  /* 認証チェック */
  const raw = localStorage.getItem('medispot_user');
  if (!raw) { window.location.href = 'login.html'; return; }
  let user;
  try { user = JSON.parse(raw); } catch (e) { window.location.href = 'login.html'; return; }
  if (!user || user.role !== 'seeker') { window.location.href = 'login.html'; return; }

  /* ユーザー名 */
  ['userName', 'userNameMobile'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.textContent = user.name;
  });

  /* ログアウト */
  function logout() {
    localStorage.removeItem('medispot_user');
    window.location.href = 'login.html';
  }
  ['logoutBtn', 'logoutBtnMobile'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', logout);
  });

  /* デモ3件を localStorage に確実に追加（初回のみ） */
  const applied = getAppliedJobs();
  var changed = false;
  ['job-1', 'job-2', 'job-3'].forEach(function (id) {
    if (applied.indexOf(id) === -1) { applied.push(id); changed = true; }
  });
  if (changed) localStorage.setItem('medispot_applied_jobs', JSON.stringify(applied));

  renderApplications(applied);
})();

/* ===== ハンバーガー ===== */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}

/* ===== 応募一覧描画 ===== */
function renderApplications(appliedIds) {
  const countBar = document.getElementById('countBar');
  const list     = document.getElementById('applicationsList');

  if (appliedIds.length === 0) {
    countBar.innerHTML = '';
    list.innerHTML = renderEmptyState();
    return;
  }

  /* 応募日の新しい順に並べる（デモ以外は今日の日付なので後ろに来る） */
  const sorted = appliedIds.slice().sort(function (a, b) {
    const dateA = getAppDate(a);
    const dateB = getAppDate(b);
    return dateB.localeCompare(dateA);
  });

  countBar.innerHTML =
    '<span class="count-num">' + sorted.length + '</span>件の応募があります';

  list.innerHTML = sorted.map(function (id) {
    return renderCard(id);
  }).join('');
}

/* ===== 応募カード描画 ===== */
function renderCard(jobId) {
  const job = JOBS[jobId];

  /* 求人マスタにない ID はスキップ */
  if (!job) return '';

  const appData    = DEMO_APP_DATA[jobId] || { date: getTodayFormatted(), status: '選考中' };
  const status     = appData.status;
  const statusConf = STATUS_CONFIG[status] || STATUS_CONFIG['選考中'];
  const jtClass    = JOB_TYPE_CLASS[job.jobType]        || 'badge-gray';
  const etClass    = EMP_TYPE_CLASS[job.employmentType] || 'badge-emp-contract';

  return (
    '<div class="app-card">' +
      '<div class="app-card-info">' +
        '<div class="app-badges">' +
          '<span class="badge ' + jtClass + '">' + escapeHtml(job.jobType) + '</span>' +
          '<span class="badge ' + etClass + '">' + escapeHtml(job.employmentType) + '</span>' +
        '</div>' +
        '<p class="app-title">' + escapeHtml(job.title) + '</p>' +
        '<div class="app-meta">' +
          '<span class="app-meta-item"><i class="ti ti-building"></i>' + escapeHtml(job.company) + '</span>' +
          '<span class="app-meta-item"><i class="ti ti-map-pin"></i>' + escapeHtml(job.location) + '</span>' +
        '</div>' +
        '<span class="app-date"><i class="ti ti-calendar-event"></i>応募日：' + escapeHtml(appData.date) + '</span>' +
      '</div>' +
      '<div class="app-card-side">' +
        '<span class="badge app-status-badge ' + statusConf.cls + '">' +
          '<i class="ti ' + statusConf.icon + '"></i> ' + escapeHtml(status) +
        '</span>' +
        '<a href="seeker-job-detail.html?id=' + jobId + '" class="btn-detail">' +
          '詳細 <i class="ti ti-arrow-right"></i>' +
        '</a>' +
      '</div>' +
    '</div>'
  );
}

/* ===== 空状態 ===== */
function renderEmptyState() {
  return (
    '<div class="empty-state">' +
      '<div class="empty-state-icon"><i class="ti ti-clipboard-list"></i></div>' +
      '<h2>まだ応募した求人はありません</h2>' +
      '<p>気になる求人を見つけて、まず応募してみましょう</p>' +
      '<a href="seeker-jobs.html" class="btn-find-jobs">' +
        '<i class="ti ti-search"></i>求人を探す' +
      '</a>' +
    '</div>'
  );
}

/* ===== ヘルパー ===== */
function getAppliedJobs() {
  try { return JSON.parse(localStorage.getItem('medispot_applied_jobs') || '[]'); }
  catch (e) { return []; }
}

function getAppDate(jobId) {
  return DEMO_APP_DATA[jobId] ? DEMO_APP_DATA[jobId].date : getTodayFormatted();
}

function getTodayFormatted() {
  const d   = new Date();
  const y   = d.getFullYear();
  const m   = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return y + '/' + m + '/' + day;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
