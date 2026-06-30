/* ===== ダミー求人データ ===== */
const DUMMY_JOBS = [
  {
    id: 'job-1',
    jobType: '看護師', employmentType: '非常勤',
    salary: '時給2,200〜2,600円',
    title: '【日勤のみ】外来看護師（ブランクOK・週3日〜）',
    company: 'ブランチ総合クリニック', location: '東京都世田谷区',
    date: '2026/05/12', status: 'active',
    applicants: 1, reviewing: 1, matched: 0,
  },
  {
    id: 'job-2',
    jobType: '放射線技師', employmentType: '常勤',
    salary: '月給28〜35万円',
    title: '放射線技師（健診・一般撮影／土日休み）',
    company: 'ブランチ総合クリニック', location: '東京都世田谷区',
    date: '2026/05/20', status: 'active',
    applicants: 1, reviewing: 0, matched: 1,
  },
  {
    id: 'job-3',
    jobType: 'OT（作業療法士）', employmentType: '非常勤',
    salary: '時給2,000〜2,400円',
    title: '作業療法士（OT）（回復期リハ・週3日〜）',
    company: 'ブランチ総合クリニック', location: '東京都狛江市',
    date: '2026/05/28', status: 'active',
    applicants: 0, reviewing: 0, matched: 0,
  },
  {
    id: 'job-4',
    jobType: 'PT（理学療法士）', employmentType: '常勤',
    salary: '月給28〜34万円',
    title: '理学療法士（PT）（整形外科クリニック・新設リハ室）',
    company: 'ブランチ総合クリニック', location: '東京都調布市',
    date: '2026/06/01', status: 'active',
    applicants: 1, reviewing: 0, matched: 1,
  },
  {
    id: 'job-5',
    jobType: 'ST（言語聴覚士）', employmentType: '非常勤',
    salary: '時給2,100〜2,500円',
    title: '言語聴覚士（ST）（外来・小児言語訓練）',
    company: 'ブランチ総合クリニック', location: '東京都世田谷区',
    date: '2026/06/05', status: 'active',
    applicants: 0, reviewing: 0, matched: 0,
  },
  {
    id: 'job-6',
    jobType: '臨床検査技師', employmentType: '常勤',
    salary: '月給26〜32万円',
    title: '臨床検査技師（健診センター・年間休日125日）',
    company: 'ブランチ総合クリニック', location: '東京都渋谷区',
    date: '2026/06/08', status: 'active',
    applicants: 0, reviewing: 0, matched: 0,
  },
  {
    id: 'job-7',
    jobType: 'ヘルパー', employmentType: '非常勤',
    salary: '時給1,500〜1,800円',
    title: 'ヘルパー（訪問介護・直行直帰OK）',
    company: 'ブランチ総合クリニック', location: '東京都調布市',
    date: '2026/06/10', status: 'active',
    applicants: 0, reviewing: 0, matched: 0,
  },
];

/* ===== 職種バッジ色 ===== */
const JOB_TYPE_CLASS = {
  '看護師': 'badge-pink', '保健師': 'badge-pink', '助産師': 'badge-pink',
  '放射線技師': 'badge-blue', '臨床検査技師': 'badge-purple',
  'PT（理学療法士）': 'badge-teal', 'OT（作業療法士）': 'badge-teal', 'ST（言語聴覚士）': 'badge-teal',
  'ヘルパー': 'badge-orange',
};
const EMP_TYPE_CLASS = {
  '常勤': 'badge-emp-full', '非常勤': 'badge-emp-part',
  'スポット（単発）': 'badge-emp-spot', '業務委託': 'badge-emp-contract',
};

/* ===== 掲載終了状態 ===== */
let endedIds = {};
try { endedIds = JSON.parse(localStorage.getItem('medispot_ended_jobs') || '{}'); } catch (e) {}

/* ===== 初期化 ===== */
(function () {
  const raw = localStorage.getItem('medispot_user');
  if (!raw) { window.location.href = 'login.html'; return; }
  let user;
  try { user = JSON.parse(raw); } catch (e) { window.location.href = 'login.html'; return; }
  if (!user || user.role !== 'employer') { window.location.href = 'login.html'; return; }

  ['userName', 'userNameMobile'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.textContent = user.name;
  });
  function logout() { localStorage.removeItem('medispot_user'); window.location.href = 'login.html'; }
  ['logoutBtn', 'logoutBtnMobile'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', logout);
  });

  renderJobs();
})();

/* ===== ハンバーガー ===== */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
  document.body.classList.toggle('menu-open');
}

/* ===== 求人一覧描画 ===== */
function renderJobs() {
  /* ダミー + ユーザー作成求人 */
  const userJobs = getUserJobs();
  const allJobs  = DUMMY_JOBS.concat(userJobs);

  const active = allJobs.filter(function (j) { return !endedIds[j.id]; }).length;
  document.getElementById('activeCount').textContent = active;
  document.getElementById('totalCount').textContent  = allJobs.length;

  document.getElementById('jobList').innerHTML = allJobs.map(function (job) {
    return renderJobCard(job);
  }).join('');
}

function renderJobCard(job) {
  const isEnded  = !!endedIds[job.id];
  const jtClass  = JOB_TYPE_CLASS[job.jobType]       || 'badge-gray';
  const etClass  = EMP_TYPE_CLASS[job.employmentType] || 'badge-emp-contract';

  /* 応募状況テキスト */
  let statsHtml = '';
  if (job.applicants === 0) {
    statsHtml = '<span class="stat-zero">応募なし</span>';
  } else {
    statsHtml = '<span class="stat-total">応募 ' + job.applicants + '件</span>';
    if (job.reviewing > 0) {
      statsHtml += '<span class="stat-badge stat-reviewing"><i class="ti ti-clock-hour-3"></i>選考待ち ' + job.reviewing + '件</span>';
    }
    if (job.matched > 0) {
      statsHtml += '<span class="stat-badge stat-matched"><i class="ti ti-circle-check"></i>成立 ' + job.matched + '件</span>';
    }
  }

  return (
    '<div class="job-card' + (isEnded ? ' ended' : '') + '" id="jcard-' + job.id + '">' +
      '<div class="job-card-top">' +
        '<div class="job-badges">' +
          '<span class="badge ' + jtClass + '">' + escapeHtml(job.jobType) + '</span>' +
          '<span class="badge ' + etClass + '">' + escapeHtml(job.employmentType) + '</span>' +
          '<span class="badge ' + (isEnded ? 'badge-ended' : 'badge-active') + '">' +
            (isEnded ? '掲載終了' : '掲載中') +
          '</span>' +
        '</div>' +
      '</div>' +
      '<h3 class="job-title">' + escapeHtml(job.title) + '</h3>' +
      '<p class="job-salary">' + escapeHtml(job.salary) + '</p>' +
      '<div class="job-meta">' +
        '<span class="job-meta-item"><i class="ti ti-map-pin"></i>' + escapeHtml(job.location) + '</span>' +
        '<span class="job-meta-item"><i class="ti ti-calendar"></i>掲載日：' + escapeHtml(job.date) + '</span>' +
      '</div>' +
      '<div class="app-stats">' + statsHtml + '</div>' +
      '<div class="job-card-actions">' +
        '<a href="employer-applicants.html?jobId=' + job.id + '" class="btn-applicants">' +
          '<i class="ti ti-users"></i>応募者一覧（選考）' +
        '</a>' +
        '<button class="btn-end" onclick="endJob(\'' + job.id + '\')"' +
          (isEnded ? ' disabled' : '') + '>' +
          '<i class="ti ti-x"></i>掲載終了' +
        '</button>' +
      '</div>' +
    '</div>'
  );
}

/* ===== 掲載終了 ===== */
function endJob(jobId) {
  if (!confirm('この求人の掲載を終了しますか？')) return;
  endedIds[jobId] = true;
  localStorage.setItem('medispot_ended_jobs', JSON.stringify(endedIds));
  renderJobs();
}

/* ===== ヘルパー ===== */
function getUserJobs() {
  try { return JSON.parse(localStorage.getItem('medispot_employer_jobs') || '[]'); }
  catch (e) { return []; }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
/* ===== オーバーレイタップで閉じる ===== */
document.getElementById('mobileMenu').addEventListener('click', function(e) {
  if (e.target === this) toggleMenu();
});
