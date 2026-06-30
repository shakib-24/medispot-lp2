/* ===== 対象求人マスタ ===== */
const JOBS = {
  'job-1': { title: '【日勤のみ】外来看護師（ブランクOK・週3日〜）' },
  'job-2': { title: '放射線技師（健診・一般撮影／土日休み）' },
  'job-3': { title: '作業療法士（OT）（回復期リハ・週3日〜）' },
  'job-4': { title: '理学療法士（PT）（整形外科クリニック・新設リハ室）' },
  'job-5': { title: '言語聴覚士（ST）（外来・小児言語訓練）' },
  'job-6': { title: '臨床検査技師（健診センター・年間休日125日）' },
  'job-7': { title: 'ヘルパー（訪問介護・直行直帰OK）' },
};

/* ===== 応募者データ ===== */
const APPLICANTS = {
  'job-1': [{
    id: 'app-1a',
    label: '応募者A',
    jobType: '看護師', age: 34, experience: '7〜9年', status: '選考中',
    qualification: '正看護師免許',
    skills: ['一般病棟', 'クリニック', '健康診断施設'],
    desiredEmpType: 'こだわらない',
    desiredArea: '東京都・神奈川県',
    selfPR: '急性期病院での5年間の経験を活かし、即戦力として貢献できます。産後ブランクがありますが、ブランク研修を受講し復帰準備が整っています。チームワークを大切に、患者様に寄り添った看護を実践してきました。',
    applyMsg: '御クリニックの外来業務に興味を持ち応募いたしました。日勤のみで週3日〜の働き方は、子育てとの両立を考える私にとって大変ありがたい条件です。ぜひ貢献させていただきたいと思います。',
    applyDate: '2026/06/15 10:32',
  }],
  'job-2': [{
    id: 'app-2a',
    label: '応募者B',
    jobType: '放射線技師', age: 29, experience: '4〜6年', status: 'マッチング成立',
    qualification: '診療放射線技師免許',
    skills: ['一般撮影', 'CT', 'マンモグラフィ'],
    desiredEmpType: '常勤',
    desiredArea: '東京都世田谷区周辺',
    selfPR: '放射線技師として5年間、急性期病院に勤務してきました。一般撮影・CT・マンモグラフィに対応可能で、患者様への丁寧な説明と正確な撮影を心がけています。',
    applyMsg: '健診業務に興味を持ち応募しました。土日休みの安定した環境で長期的に働きたいと考えています。',
    applyDate: '2026/06/20 14:15',
  }],
  'job-4': [{
    id: 'app-4a',
    label: '応募者C',
    jobType: 'PT（理学療法士）', age: 26, experience: '1〜3年', status: 'マッチング成立',
    qualification: '理学療法士免許',
    skills: ['整形外科リハ', '神経内科リハ'],
    desiredEmpType: '常勤',
    desiredArea: '東京都調布市・府中市周辺',
    selfPR: '整形外科クリニックでのリハビリ経験があり、新設クリニックの立ち上げに携わりたいという強い意欲があります。患者様の日常生活復帰を目標にきめ細やかなリハビリを実践します。',
    applyMsg: '新設リハ室での業務に大きな可能性を感じ応募しました。チームの一員として全力で貢献いたします。',
    applyDate: '2026/06/01 09:45',
  }],
};

/* ===== 見送り状態 ===== */
let dismissed = {};
try { dismissed = JSON.parse(localStorage.getItem('medispot_dismissed_applicants') || '{}'); } catch (e) {}

/* ===== URLパラメータ ===== */
const jobId = new URLSearchParams(window.location.search).get('jobId');

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

  /* 対象求人名の表示 */
  if (!jobId) {
    document.getElementById('jobNameDisplay').textContent = '';
    document.getElementById('applicantsList').innerHTML = renderNoJobId();
    return;
  }

  const job = JOBS[jobId];
  const jobTitle = job ? job.title : '不明な求人';
  document.getElementById('jobNameDisplay').textContent = '対象求人：' + jobTitle;
  document.title = 'MediSpot - 応募者一覧 | ' + jobTitle;

  renderApplicants();
})();

/* ===== ハンバーガー ===== */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}

/* ===== 応募者一覧描画 ===== */
function renderApplicants() {
  const list = APPLICANTS[jobId];
  const el   = document.getElementById('applicantsList');

  if (!list || list.length === 0) {
    el.innerHTML = (
      '<div class="empty-state">' +
        '<div class="empty-icon"><i class="ti ti-user-off"></i></div>' +
        '<h2>まだ応募者はいません</h2>' +
        '<p>この求人への応募が届いたらここに表示されます</p>' +
      '</div>'
    );
    return;
  }

  el.innerHTML = list.map(function (app) {
    return renderApplicantCard(app);
  }).join('');
}

/* ===== 応募者カード ===== */
function renderApplicantCard(app) {
  const isDismissed = !!dismissed[app.id];
  let status = app.status;
  if (isDismissed) status = '見送り';

  const statusMap = {
    '選考中':       'badge-reviewing',
    'マッチング成立': 'badge-matched',
    '見送り':       'badge-dismissed',
  };
  const statusCls = statusMap[status] || 'badge-reviewing';

  return (
    '<div class="app-card' + (isDismissed ? ' dismissed' : '') + '" id="acard-' + app.id + '">' +

      /* ヘッダー */
      '<div class="app-card-header">' +
        '<div class="app-identity">' +
          '<div class="app-avatar"><i class="ti ti-user"></i></div>' +
          '<div>' +
            '<div class="app-label">' + escapeHtml(app.label) + '（氏名非公開）</div>' +
            '<div class="app-sub">' + escapeHtml(app.jobType) + '・' + app.age + '歳・実務経験' + escapeHtml(app.experience) + '</div>' +
          '</div>' +
        '</div>' +
        '<span class="badge ' + statusCls + '">' + escapeHtml(status) + '</span>' +
      '</div>' +

      /* ボディ */
      '<div class="app-card-body">' +
        '<div class="info-sections">' +

          /* 資格・スキル */
          '<div class="info-section">' +
            '<p class="info-section-title"><i class="ti ti-certificate"></i>資格・スキル・経験</p>' +
            '<div class="info-grid">' +
              '<div class="info-item"><span class="info-label">保有資格</span><span class="info-value">' + escapeHtml(app.qualification) + '</span></div>' +
              '<div class="info-item"><span class="info-label">実務経験</span><span class="info-value">' + escapeHtml(app.experience) + '</span></div>' +
            '</div>' +
            '<div style="margin-top:8px"><span class="info-label">経験スキル</span><div class="tag-list" style="margin-top:4px">' +
              app.skills.map(function (s) { return '<span class="tag">' + escapeHtml(s) + '</span>'; }).join('') +
            '</div></div>' +
          '</div>' +

          /* 希望条件 */
          '<div class="info-section">' +
            '<p class="info-section-title"><i class="ti ti-adjustments"></i>希望条件</p>' +
            '<div class="info-grid">' +
              '<div class="info-item"><span class="info-label">希望雇用形態</span><span class="info-value">' + escapeHtml(app.desiredEmpType) + '</span></div>' +
              '<div class="info-item"><span class="info-label">勤務希望エリア</span><span class="info-value">' + escapeHtml(app.desiredArea) + '</span></div>' +
            '</div>' +
          '</div>' +

          /* 書類（ロック） */
          '<div class="info-section">' +
            '<p class="info-section-title"><i class="ti ti-file-text"></i>資格証・職務経歴書</p>' +
            '<div class="locked-section">' +
              '<div class="locked-icon"><i class="ti ti-lock"></i></div>' +
              '<div><div class="locked-label">決済後に閲覧可能</div><div class="locked-hint">採用決定・決済完了後に資格証画像・職務経歴書PDFが開示されます</div></div>' +
            '</div>' +
          '</div>' +

          /* 自己PR */
          '<div class="info-section">' +
            '<p class="info-section-title"><i class="ti ti-message-smile"></i>自己PR</p>' +
            '<p class="pr-text">' + escapeHtml(app.selfPR) + '</p>' +
          '</div>' +

          /* 応募メッセージ */
          '<div class="info-section">' +
            '<p class="info-section-title"><i class="ti ti-mail"></i>応募メッセージ・応募日時</p>' +
            '<p class="apply-msg">' + escapeHtml(app.applyMsg) + '</p>' +
            '<p class="apply-date" style="margin-top:8px"><i class="ti ti-calendar-event"></i>応募日時：' + escapeHtml(app.applyDate) + '</p>' +
          '</div>' +

        '</div>' +
      '</div>' +

      /* アクション */
      '<div class="app-card-actions">' +
        '<div class="actions-left">' +
          '<a href="pay.html?appId=' + app.id + '&jobId=' + jobId + '" class="btn-hire">' +
            '<i class="ti ti-circle-check"></i>採用決定（決済へ）' +
          '</a>' +
          '<button class="btn-dismiss" onclick="dismissApplicant(\'' + app.id + '\')"' +
            (isDismissed ? ' disabled' : '') + '>' +
            '<i class="ti ti-x"></i>' + (isDismissed ? '見送り済み' : '見送り') +
          '</button>' +
        '</div>' +
        '<p class="action-note">成功報酬 ¥3,000（税込）は採用決定時のみ発生</p>' +
      '</div>' +

    '</div>'
  );
}

/* ===== 見送り処理 ===== */
function dismissApplicant(appId) {
  if (!confirm('この応募者を見送りますか？')) return;
  dismissed[appId] = true;
  localStorage.setItem('medispot_dismissed_applicants', JSON.stringify(dismissed));
  renderApplicants();
}

/* ===== jobId なし表示 ===== */
function renderNoJobId() {
  return (
    '<div class="no-jobid">' +
      '<i class="ti ti-list-search"></i>' +
      '<h2>求人が選択されていません</h2>' +
      '<p><a href="employer-jobs.html">求人管理ページ</a>から応募者を確認したい求人を選択してください</p>' +
    '</div>'
  );
}

/* ===== XSS対策 ===== */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
