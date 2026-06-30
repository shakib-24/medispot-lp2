/* ===== 求人データ ===== */
const JOBS = [
  {
    id: 'job-1',
    jobType: '看護師',
    employmentType: '非常勤',
    salary: '時給2,200〜2,600円',
    title: '【日勤のみ】外来看護師（ブランクOK・週3日〜）',
    company: 'ブランチ総合クリニック',
    location: '東京都世田谷区',
    date: '2026/05/12',
  },
  {
    id: 'job-2',
    jobType: '放射線技師',
    employmentType: '常勤',
    salary: '月給28〜35万円',
    title: '放射線技師（健診・一般撮影／土日休み）',
    company: 'ブランチ総合クリニック',
    location: '東京都世田谷区',
    date: '2026/05/20',
  },
  {
    id: 'job-3',
    jobType: 'OT（作業療法士）',
    employmentType: '非常勤',
    salary: '時給2,000〜2,400円',
    title: '作業療法士（OT）（回復期リハ・週3日〜）',
    company: 'ブランチ総合クリニック',
    location: '東京都狛江市',
    date: '2026/05/28',
  },
  {
    id: 'job-4',
    jobType: 'PT（理学療法士）',
    employmentType: '常勤',
    salary: '月給28〜34万円',
    title: '理学療法士（PT）（整形外科クリニック・新設リハ室）',
    company: 'ブランチ総合クリニック',
    location: '東京都調布市',
    date: '2026/06/01',
  },
  {
    id: 'job-5',
    jobType: 'ST（言語聴覚士）',
    employmentType: '非常勤',
    salary: '時給2,100〜2,500円',
    title: '言語聴覚士（ST）（外来・小児言語訓練）',
    company: 'ブランチ総合クリニック',
    location: '東京都世田谷区',
    date: '2026/06/05',
  },
  {
    id: 'job-6',
    jobType: 'ヘルパー',
    employmentType: '非常勤',
    salary: '時給1,500〜1,800円',
    title: 'ヘルパー（訪問介護・直行直帰OK）',
    company: 'ブランチ総合クリニック',
    location: '東京都調布市',
    date: '2026/06/10',
  },
  {
    id: 'job-7',
    jobType: '臨床検査技師',
    employmentType: '常勤',
    salary: '月給26〜32万円',
    title: '臨床検査技師（健診センター・年間休日125日）',
    company: 'ブランチ総合クリニック',
    location: '東京都渋谷区',
    date: '2026/06/08',
  },
];

/* ===== 職種バッジ色マップ ===== */
const JOB_TYPE_CLASS = {
  '看護師':         'badge-pink',
  '保健師':         'badge-pink',
  '助産師':         'badge-pink',
  '放射線技師':     'badge-blue',
  '臨床検査技師':   'badge-purple',
  'PT（理学療法士）': 'badge-teal',
  'OT（作業療法士）': 'badge-teal',
  'ST（言語聴覚士）': 'badge-teal',
  'ヘルパー':       'badge-orange',
};

/* ===== 雇用形態バッジ色マップ ===== */
const EMP_TYPE_CLASS = {
  '常勤':         'badge-emp-full',
  '非常勤':       'badge-emp-part',
  'スポット（単発）': 'badge-emp-spot',
  '業務委託':     'badge-emp-contract',
};

/* ===== 初期化 ===== */
(function () {
  /* 認証チェック */
  const raw = localStorage.getItem('medispot_user');
  if (!raw) { window.location.href = 'login.html'; return; }
  let user;
  try { user = JSON.parse(raw); } catch (e) { window.location.href = 'login.html'; return; }
  if (!user || user.role !== 'seeker') { window.location.href = 'login.html'; return; }

  /* ユーザー名表示 */
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

  /* 応募済みデモデータを初回のみセット */
  if (localStorage.getItem('medispot_applied_jobs') === null) {
    localStorage.setItem('medispot_applied_jobs', JSON.stringify(['job-1']));
  }

  /* 検索ボタン */
  document.getElementById('searchBtn').addEventListener('click', runSearch);
  document.getElementById('searchKeyword').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') runSearch();
  });

  /* リセットボタン */
  document.getElementById('resetBtn').addEventListener('click', function () {
    document.getElementById('searchKeyword').value = '';
    document.getElementById('searchJobType').value = '';
    document.getElementById('searchEmpType').value = '';
    renderJobs(JOBS);
  });

  /* 初期描画 */
  renderJobs(JOBS);
})();

/* ===== ハンバーガー ===== */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
  document.body.classList.toggle('menu-open');
}

/* ===== 検索・フィルタリング ===== */
function runSearch() {
  const keyword = document.getElementById('searchKeyword').value.trim().toLowerCase();
  const jobType = document.getElementById('searchJobType').value;
  const empType = document.getElementById('searchEmpType').value;

  const filtered = JOBS.filter(function (job) {
    const keywordOk = !keyword || [job.title, job.company, job.location, job.jobType, job.salary]
      .some(function (field) { return field.toLowerCase().includes(keyword); });
    const jobTypeOk = !jobType || job.jobType === jobType;
    const empTypeOk = !empType || job.employmentType === empType;
    return keywordOk && jobTypeOk && empTypeOk;
  });

  renderJobs(filtered);
}

/* ===== 求人カード描画 ===== */
function renderJobs(jobs) {
  const applied = getAppliedJobs();
  const grid = document.getElementById('jobGrid');
  document.getElementById('resultsNum').textContent = jobs.length;

  if (jobs.length === 0) {
    grid.innerHTML = (
      '<div class="no-results">' +
        '<i class="ti ti-search-off"></i>' +
        '<p>条件に合う求人が見つかりませんでした</p>' +
        '<small>キーワードや絞り込み条件を変えてお試しください</small>' +
      '</div>'
    );
    return;
  }

  grid.innerHTML = jobs.map(function (job) {
    return renderJobCard(job, applied.indexOf(job.id) !== -1);
  }).join('');
}

function renderJobCard(job, isApplied) {
  const jobTypeClass = JOB_TYPE_CLASS[job.jobType] || 'badge-gray';
  const empTypeClass = EMP_TYPE_CLASS[job.employmentType] || 'badge-emp-contract';
  const appliedBadge = isApplied
    ? '<span class="badge badge-applied">応募済み</span>'
    : '';

  return (
    '<div class="job-card">' +
      '<div class="job-card-top">' +
        '<div class="job-badges">' +
          '<span class="badge ' + jobTypeClass + '">' + escapeHtml(job.jobType) + '</span>' +
          '<span class="badge ' + empTypeClass + '">' + escapeHtml(job.employmentType) + '</span>' +
        '</div>' +
        appliedBadge +
      '</div>' +
      '<h3 class="job-title">' + escapeHtml(job.title) + '</h3>' +
      '<div class="job-salary">' + escapeHtml(job.salary) + '</div>' +
      '<div class="job-meta">' +
        '<span><i class="ti ti-building"></i>' + escapeHtml(job.company) + '</span>' +
        '<span><i class="ti ti-map-pin"></i>' + escapeHtml(job.location) + '</span>' +
        '<span><i class="ti ti-calendar"></i>掲載日：' + escapeHtml(job.date) + '</span>' +
      '</div>' +
      '<div class="job-card-footer">' +
        '<a href="seeker-job-detail.html?id=' + job.id + '" class="btn-detail">' +
          '詳細を見る <i class="ti ti-arrow-right"></i>' +
        '</a>' +
      '</div>' +
    '</div>'
  );
}

/* ===== localStorage ヘルパー ===== */
function getAppliedJobs() {
  try {
    return JSON.parse(localStorage.getItem('medispot_applied_jobs') || '[]');
  } catch (e) {
    return [];
  }
}

/* ===== XSS対策 ===== */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
/* ===== オーバーレイタップで閉じる ===== */
document.getElementById('mobileMenu').addEventListener('click', function(e) {
  if (e.target === this) toggleMenu();
});
