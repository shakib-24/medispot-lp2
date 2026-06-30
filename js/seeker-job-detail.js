/* ===== 求人マスタデータ ===== */
const JOBS = {
  'job-1': {
    jobType:        '看護師',
    employmentType: '非常勤',
    salary:         '時給2,200〜2,600円',
    title:          '【日勤のみ】外来看護師（ブランクOK・週3日〜）',
    company:        'ブランチ総合クリニック',
    location:       '東京都世田谷区',
    date:           '2026/05/12',
    workHours:      '9:00〜18:00（休憩60分）週3日〜応相談',
    description:
      '外来診療補助業務全般をお任せします。ブランクのある方も丁寧にフォローいたします。日勤のみ・週3日〜の勤務で、プライベートとの両立が可能です。\n\n【主な業務内容】\n・バイタル測定（血圧・体温・SpO2）\n・採血・点滴管理\n・医師の診療補助・処置介助\n・検査案内・患者誘導\n・電話応対・カルテ入力補助',
    requirements:
      '【必須要件】\n・看護師免許（正看護師・准看護師 どちらも可）\n\n【歓迎要件】\n・外来経験者（未経験・ブランクのある方も歓迎）\n・週3日〜勤務可能な方\n・コミュニケーションを大切にできる方',
    institution:
      '2012年に開院した地域密着型の総合クリニックです。内科・外科・整形外科を中心に、患者様一人ひとりに寄り添った医療を提供しています。スタッフ数100名超、年間外来患者数約8万人。働きやすい職場環境づくりに積極的に取り組み、子育て中のスタッフも多数活躍しています。',
  },
  'job-2': {
    jobType:        '放射線技師',
    employmentType: '常勤',
    salary:         '月給28〜35万円',
    title:          '放射線技師（健診・一般撮影／土日休み）',
    company:        'ブランチ総合クリニック',
    location:       '東京都世田谷区',
    date:           '2026/05/20',
    workHours:      '8:30〜17:30（休憩60分）土日祝休み',
    description:
      '健康診断センターおよび外来での画像撮影業務を担当していただきます。年間休日120日以上、残業月平均10時間以下の安定した環境です。\n\n【主な業務内容】\n・一般X線撮影\n・マンモグラフィ撮影\n・CT・骨密度測定\n・健診センターでの検査業務全般\n・画像管理・レポート作成補助',
    requirements:
      '【必須要件】\n・診療放射線技師免許\n\n【歓迎要件】\n・健診・一般撮影の経験者\n・マンモグラフィ認定技師\n・未経験可（充実した研修制度あり）\n・チームワークを大切にできる方',
    institution:
      '2012年開院。内科・外科・整形外科を中心とした総合クリニック。放射線部門は最新の医療機器を導入し、精度の高い検査を提供しています。スタッフの継続的なスキルアップを支援する研修制度が充実。残業が少なく働きやすい職場です。',
  },
  'job-3': {
    jobType:        'OT（作業療法士）',
    employmentType: '非常勤',
    salary:         '時給2,000〜2,400円',
    title:          '作業療法士（OT）（回復期リハ・週3日〜）',
    company:        'ブランチ総合クリニック',
    location:       '東京都狛江市',
    date:           '2026/05/28',
    workHours:      '9:00〜17:00（休憩60分）週3日〜',
    description:
      '回復期リハビリテーション病棟での作業療法業務をお任せします。PT・ST・MSWと連携したチームアプローチを重視した職場です。\n\n【主な業務内容】\n・入院患者へのADL改善・生活動作訓練\n・退院後の生活を見据えたリハビリテーション\n・家屋調査・環境調整のアドバイス\n・福祉用具の選定・指導\n・カンファレンス参加・記録作成',
    requirements:
      '【必須要件】\n・作業療法士免許\n\n【歓迎要件】\n・回復期リハビリテーション経験者\n・新卒・未経験可（OJTあり）\n・週3日〜勤務可能な方\n・向上心があり、チームで働ける方',
    institution:
      '東京都狛江市の総合クリニック。リハビリテーション部門はPT・OT・STが在籍する充実した体制で、質の高いリハビリを提供しています。スタッフ同士のコミュニケーションが活発で、風通しの良い職場環境が自慢です。',
  },
  'job-4': {
    jobType:        'PT（理学療法士）',
    employmentType: '常勤',
    salary:         '月給28〜34万円',
    title:          '理学療法士（PT）（整形外科クリニック・新設リハ室）',
    company:        'ブランチ総合クリニック',
    location:       '東京都調布市',
    date:           '2026/06/01',
    workHours:      '8:30〜17:30（休憩60分）土曜隔週出勤',
    description:
      '2026年新設のリハビリテーション室の立ち上げメンバーを募集しています。整形外科疾患を中心に幅広い患者様へのリハビリを担当していただきます。\n\n【主な業務内容】\n・術後リハビリテーション（関節・脊椎）\n・スポーツ障害・腰痛・膝痛へのアプローチ\n・物理療法の実施・管理\n・運動指導・自主トレーニング指導\n・記録作成・カンファレンス参加',
    requirements:
      '【必須要件】\n・理学療法士免許\n\n【歓迎要件】\n・整形外科・スポーツリハビリ経験者\n・新卒可（丁寧な指導体制あり）\n・向上心があり自ら学べる方\n・患者様と長期的な関係を築きたい方',
    institution:
      '調布市の整形外科クリニック。2026年にリハビリテーション室を新設し、最新の医療機器を完備。少人数のアットホームな職場で、スタッフ全員でクリニックを育てていく環境です。経験・資格取得支援制度あり。',
  },
  'job-5': {
    jobType:        'ST（言語聴覚士）',
    employmentType: '非常勤',
    salary:         '時給2,100〜2,500円',
    title:          '言語聴覚士（ST）（外来・小児言語訓練）',
    company:        'ブランチ総合クリニック',
    location:       '東京都世田谷区',
    date:           '2026/06/05',
    workHours:      '9:00〜17:00（休憩60分）週2〜3日応相談',
    description:
      '外来での言語・聴覚・嚥下リハビリ業務を担当していただきます。特に小児言語発達支援を中心とした業務です。\n\n【主な業務内容】\n・小児言語発達支援（言葉の遅れ・構音障害・吃音）\n・成人の嚥下訓練・失語症訓練\n・保護者へのホームプログラム指導\n・評価・記録・報告書作成\n・医師・OTとの連携',
    requirements:
      '【必須要件】\n・言語聴覚士免許\n\n【歓迎要件】\n・小児言語訓練の経験者\n・嚥下障害・失語症の経験者\n・保護者とのコミュニケーションが得意な方\n・週2日〜勤務可能な方',
    institution:
      '世田谷区のリハビリテーションクリニック。言語・聴覚・嚥下リハビリを専門とし、小児から成人まで幅広い患者様を対象としています。個室の訓練室を完備し、安心して訓練に集中できる環境です。',
  },
  'job-6': {
    jobType:        'ヘルパー',
    employmentType: '非常勤',
    salary:         '時給1,500〜1,800円',
    title:          'ヘルパー（訪問介護・直行直帰OK）',
    company:        'ブランチ総合クリニック',
    location:       '東京都調布市',
    date:           '2026/06/10',
    workHours:      '7:00〜22:00のシフト制（1日3〜6時間程度）週2日〜',
    description:
      '利用者様のご自宅への訪問介護業務です。直行直帰OK・シフト制で、プライベートとの両立が可能です。\n\n【主な業務内容】\n・身体介護（入浴・排泄・食事介助・移動介助）\n・生活援助（掃除・洗濯・調理・買い物同行）\n・服薬確認・バイタルチェック\n・利用者様との日常会話・精神的サポート\n・サービス記録の記入',
    requirements:
      '【必須要件】\n・介護職員初任者研修修了（旧ヘルパー2級）以上\n\n【歓迎要件】\n・訪問介護経験者\n・普通自動車免許（AT限定可）\n・地域を限定して働きたい方\n・週2日〜勤務可能な方',
    institution:
      '調布市を中心に訪問介護サービスを展開するホームヘルプ事業所です。「利用者様に寄り添った丁寧なケア」をモットーに、地域の高齢者・障がい者の生活を支援。スタッフ同士のフォロー体制が整っており、初めての訪問介護でも安心です。',
  },
  'job-7': {
    jobType:        '臨床検査技師',
    employmentType: '常勤',
    salary:         '月給26〜32万円',
    title:          '臨床検査技師（健診センター・年間休日125日）',
    company:        'ブランチ総合クリニック',
    location:       '東京都渋谷区',
    date:           '2026/06/08',
    workHours:      '8:00〜17:00（休憩60分）土日祝休み',
    description:
      '健診センターでの検体検査・生理検査業務を担当していただきます。年間休日125日・残業月平均10時間以下のワークライフバランス重視の職場です。\n\n【主な業務内容】\n・採血・検体検査（血液・尿・便）\n・心電図・肺機能検査\n・腹部超音波検査\n・眼底・眼圧検査\n・受診者へのオリエンテーション・案内',
    requirements:
      '【必須要件】\n・臨床検査技師免許\n\n【歓迎要件】\n・超音波検査士（腹部）資格保有者\n・健診業務の経験者\n・経験年数不問（研修制度あり）\n・明るく丁寧な接遇ができる方',
    institution:
      '渋谷区の総合健診センター。企業健診・人間ドック・特定健診を年間2万件以上実施し、地域の予防医療に貢献しています。最新の検査機器を完備。資格取得支援制度・産育休取得実績多数。',
  },
};

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

const EMP_TYPE_CLASS = {
  '常勤':           'badge-emp-full',
  '非常勤':         'badge-emp-part',
  'スポット（単発）': 'badge-emp-spot',
  '業務委託':       'badge-emp-contract',
};

/* ===== 現在の求人ID ===== */
const currentJobId = new URLSearchParams(window.location.search).get('id') || 'job-1';

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

  /* 求人データを取得して描画 */
  const job = JOBS[currentJobId];
  if (!job) {
    renderNotFound();
    return;
  }

  renderJob(job);
  updatePageTitle(job.title);

  /* 応募済みチェック */
  if (isApplied(currentJobId)) {
    showAppliedState();
  }

  /* 応募ボタンのトグル */
  document.getElementById('applyToggleBtn').addEventListener('click', function () {
    const area = document.getElementById('applyFormArea');
    const isOpen = !area.hidden;
    area.hidden = isOpen;
    this.textContent = '';
    const icon = document.createElement('i');
    icon.className = isOpen ? 'ti ti-send' : 'ti ti-chevron-up';
    this.appendChild(icon);
    this.appendChild(document.createTextNode(
      isOpen ? 'この求人に応募する' : '応募フォームを閉じる'
    ));
  });

  /* 応募確定ボタン */
  document.getElementById('applyConfirmBtn').addEventListener('click', function () {
    const applied = getAppliedJobs();
    if (!applied.includes(currentJobId)) {
      applied.push(currentJobId);
      localStorage.setItem('medispot_applied_jobs', JSON.stringify(applied));
    }
    showAppliedState();
  });
})();

/* ===== ハンバーガー ===== */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}

/* ===== 求人詳細の描画 ===== */
function renderJob(job) {
  /* ヒーローバッジ */
  const jobTypeClass  = JOB_TYPE_CLASS[job.jobType]        || 'badge-gray';
  const empTypeClass  = EMP_TYPE_CLASS[job.employmentType]  || 'badge-emp-contract';

  document.getElementById('jobBadges').innerHTML = (
    '<span class="badge badge-jobtype-hero">' + escapeHtml(job.jobType) + '</span>' +
    '<span class="badge badge-emptype-hero">' + escapeHtml(job.employmentType) + '</span>' +
    '<span class="badge badge-active">掲載中</span>'
  );

  /* テキスト要素 */
  setText('jobTitle',        job.title);
  setText('jobCompany',      job.company);
  setText('jobDate',         job.date);
  setText('detailSalary',    job.salary);
  setText('detailEmpType',   job.employmentType);
  setText('detailWorkHours', job.workHours);
  setText('detailLocation',  job.location);
  setText('applySalary',     job.salary);

  /* pre-line で改行を自然に表示 */
  setText('detailDescription',  job.description);
  setText('detailRequirements', job.requirements);
  setText('detailInstitution',  job.institution);
}

function updatePageTitle(title) {
  document.title = 'MediSpot - ' + title;
}

/* ===== 応募済み状態に切り替え ===== */
function showAppliedState() {
  document.getElementById('applyNotApplied').hidden = true;
  document.getElementById('applyApplied').hidden    = false;
}

/* ===== 求人が見つからない場合 ===== */
function renderNotFound() {
  document.querySelector('.content-grid').innerHTML = (
    '<div class="not-found">' +
      '<i class="ti ti-file-off"></i>' +
      '<h2>求人が見つかりませんでした</h2>' +
      '<p>URLをご確認いただくか、<a href="seeker-jobs.html">求人一覧</a>からお探しください。</p>' +
    '</div>'
  );
}

/* ===== localStorage ヘルパー ===== */
function getAppliedJobs() {
  try { return JSON.parse(localStorage.getItem('medispot_applied_jobs') || '[]'); }
  catch (e) { return []; }
}

function isApplied(jobId) {
  return getAppliedJobs().indexOf(jobId) !== -1;
}

/* ===== ユーティリティ ===== */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text || '—';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
