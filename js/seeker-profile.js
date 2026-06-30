/* ===== 職種別スキル定義 ===== */
const SKILLS_BY_JOB = {
  '看護師':        ['一般病棟', 'ICU/CCU', 'クリニック', '健康診断施設', '訪問看護', '高齢者施設', 'その他'],
  '保健師':        ['行政保健師', '産業保健師', '学校保健師', 'その他'],
  '助産師':        ['分娩室', '産科病棟', '助産所', 'その他'],
  '臨床検査技師':  ['採血', '生化学検査', '細菌検査', '病理検査', '生理検査', 'その他'],
  '放射線技師':    ['一般撮影', 'CT', 'MRI', '放射線治療', '核医学', 'その他'],
  'PT（理学療法士）': ['整形外科リハ', '神経内科リハ', '小児リハ', '心臓リハ', '訪問リハ', 'その他'],
  'OT（作業療法士）': ['身体障害', '精神科', '老年期', '小児', '訪問', 'その他'],
  'ST（言語聴覚士）': ['嚥下障害', '失語症', '小児言語', '難聴', 'その他'],
  'ヘルパー':      ['訪問介護', 'デイサービス', '施設介護', 'その他'],
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

  /* イベント登録 */
  document.getElementById('qualification').addEventListener('change', onQualificationChange);
  document.getElementById('birthdate').addEventListener('change', updateAge);
  document.getElementById('postalSearchBtn').addEventListener('click', lookupPostal);
  document.getElementById('postalCode').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); lookupPostal(); }
  });
  document.getElementById('selfPR').addEventListener('input', updateCharCount);
  document.getElementById('fileInput').addEventListener('change', handleFileSelect);

  /* アップロードエリア */
  const uploadArea = document.getElementById('uploadArea');
  uploadArea.addEventListener('click', function (e) {
    if (e.target !== document.getElementById('fileInput')) {
      document.getElementById('fileInput').click();
    }
  });
  uploadArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });
  uploadArea.addEventListener('dragleave', function () {
    uploadArea.classList.remove('drag-over');
  });
  uploadArea.addEventListener('drop', function (e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    handleFileSelect({ target: { files: e.dataTransfer.files } });
  });

  /* フォーム送信 */
  document.getElementById('profileForm').addEventListener('submit', saveProfile);

  /* 初期データ読み込み */
  loadProfile();
  renderUploadedList();
})();

/* ===== ハンバーガーメニュー ===== */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
  document.body.classList.toggle('menu-open');
}

/* ===== 年齢計算 ===== */
function updateAge() {
  const val = document.getElementById('birthdate').value;
  const el = document.getElementById('ageDisplay');
  if (!val) { el.textContent = ''; return; }
  const birth = new Date(val);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  if (age < 0 || age > 120) { el.textContent = ''; return; }
  el.innerHTML = '<i class="ti ti-cake"></i> 現在 ' + age + ' 歳';
}

/* ===== 職種変更 → スキル更新 ===== */
function onQualificationChange() {
  const job = document.getElementById('qualification').value;
  updateSkills(job, []);
}

function updateSkills(job, selectedSkills) {
  const hint = document.getElementById('skillsHint');
  const grid = document.getElementById('skillsGrid');
  const skills = SKILLS_BY_JOB[job];

  if (!skills) {
    hint.classList.remove('hidden');
    grid.innerHTML = '';
    return;
  }

  hint.classList.add('hidden');
  grid.innerHTML = skills.map(function (skill) {
    const checked = selectedSkills.indexOf(skill) !== -1 ? 'checked' : '';
    return (
      '<label class="checkbox-item">' +
        '<input type="checkbox" name="skills" value="' + escapeHtml(skill) + '" ' + checked + '>' +
        escapeHtml(skill) +
      '</label>'
    );
  }).join('');
}

/* ===== 郵便番号 → 住所検索 ===== */
function lookupPostal() {
  const raw = document.getElementById('postalCode').value.replace(/[^0-9]/g, '');
  const result = document.getElementById('addressResult');
  const btn = document.getElementById('postalSearchBtn');

  if (raw.length !== 7) {
    result.textContent = '7桁の郵便番号を入力してください';
    result.className = 'address-result error';
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="ti ti-loader"></i>検索中...';
  result.textContent = '';
  result.className = 'address-result';

  fetch('https://zipcloud.ibsnet.co.jp/api/search?zipcode=' + raw)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (data.results && data.results.length > 0) {
        const r = data.results[0];
        const address = r.address1 + r.address2 + r.address3;
        result.innerHTML = '<i class="ti ti-map-pin"></i>' + escapeHtml(address);
        result.className = 'address-result';
        /* localStorageに住所を一時保存 */
        const profile = getProfile();
        profile.postalCode = raw;
        profile.address = address;
        saveProfileToStorage(profile);
      } else {
        result.textContent = '住所が見つかりませんでした';
        result.className = 'address-result error';
      }
    })
    .catch(function () {
      result.textContent = '住所の取得に失敗しました。郵便番号をご確認ください。';
      result.className = 'address-result error';
    })
    .finally(function () {
      btn.disabled = false;
      btn.innerHTML = '<i class="ti ti-map-pin"></i>住所を検索';
    });
}

/* ===== 文字数カウント ===== */
function updateCharCount() {
  const len = document.getElementById('selfPR').value.length;
  const counter = document.getElementById('charCount');
  const wrap = counter.closest('.char-count');
  counter.textContent = len;
  wrap.className = 'char-count' + (len >= 500 ? ' at-limit' : len >= 400 ? ' near-limit' : '');
}

/* ===== ファイルアップロード（モック） ===== */
function handleFileSelect(e) {
  const files = Array.from(e.target.files || []);
  if (files.length === 0) return;
  const uploaded = getUploadedFiles();
  files.forEach(function (f) {
    if (!uploaded.includes(f.name)) uploaded.push(f.name);
  });
  localStorage.setItem('medispot_uploaded_files', JSON.stringify(uploaded));
  renderUploadedList();
  /* input をリセットして同じファイルを再選択可能にする */
  document.getElementById('fileInput').value = '';
}

function getUploadedFiles() {
  try {
    return JSON.parse(localStorage.getItem('medispot_uploaded_files') || '[]');
  } catch (e) {
    return [];
  }
}

function renderUploadedList() {
  const files = getUploadedFiles();
  const list = document.getElementById('uploadedList');
  if (files.length === 0) { list.innerHTML = ''; return; }
  list.innerHTML = files.map(function (name, i) {
    return (
      '<div class="uploaded-item">' +
        '<i class="ti ' + getFileIcon(name) + '"></i>' +
        '<span class="uploaded-name" title="' + escapeHtml(name) + '">' + escapeHtml(name) + '</span>' +
        '<button type="button" class="uploaded-delete" onclick="deleteFile(' + i + ')" aria-label="削除">' +
          '<i class="ti ti-x"></i>' +
        '</button>' +
      '</div>'
    );
  }).join('');
}

function deleteFile(index) {
  const files = getUploadedFiles();
  files.splice(index, 1);
  localStorage.setItem('medispot_uploaded_files', JSON.stringify(files));
  renderUploadedList();
}

function getFileIcon(name) {
  const ext = (name.split('.').pop() || '').toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'ti-photo';
  if (ext === 'pdf') return 'ti-file-type-pdf';
  return 'ti-file';
}

/* ===== プロフィール保存 ===== */
function saveProfile(e) {
  e.preventDefault();

  if (!document.getElementById('qualification').value) {
    alert('保有資格（職種）を選択してください');
    document.getElementById('qualification').focus();
    return;
  }
  if (!document.getElementById('birthdate').value) {
    alert('生年月日を入力してください');
    document.getElementById('birthdate').focus();
    return;
  }

  const profile = collectFormData();
  saveProfileToStorage(profile);
  showToast('プロフィールを保存しました');
}

function collectFormData() {
  const skills = Array.from(
    document.querySelectorAll('input[name="skills"]:checked')
  ).map(function (el) { return el.value; });

  const experience = (document.querySelector('input[name="experience"]:checked') || {}).value || '';
  const employmentType = (document.querySelector('input[name="employmentType"]:checked') || {}).value || '';

  const existing = getProfile();

  return {
    qualification:       document.getElementById('qualification').value,
    qualificationDetail: document.getElementById('qualificationDetail').value,
    birthdate:           document.getElementById('birthdate').value,
    experience:          experience,
    skills:              skills,
    employmentType:      employmentType,
    postalCode:          document.getElementById('postalCode').value,
    address:             existing.address || '',
    streetAddress:       document.getElementById('streetAddress').value,
    selfPR:              document.getElementById('selfPR').value,
  };
}

function saveProfileToStorage(profile) {
  localStorage.setItem('medispot_profile', JSON.stringify(profile));
}

/* ===== プロフィール読み込み ===== */
function loadProfile() {
  const profile = getProfile();
  if (!profile.qualification) return;

  document.getElementById('qualification').value = profile.qualification || '';
  document.getElementById('qualificationDetail').value = profile.qualificationDetail || '';
  document.getElementById('birthdate').value = profile.birthdate || '';
  document.getElementById('selfPR').value = profile.selfPR || '';
  document.getElementById('postalCode').value = profile.postalCode || '';
  document.getElementById('streetAddress').value = profile.streetAddress || '';

  if (profile.birthdate) updateAge();
  if (profile.selfPR) updateCharCount();

  /* 都道府県・市区町村の自動表示を復元 */
  if (profile.address) {
    const result = document.getElementById('addressResult');
    result.innerHTML = '<i class="ti ti-map-pin"></i>' + escapeHtml(profile.address);
    result.className = 'address-result';
  }

  /* スキル */
  if (profile.qualification) {
    updateSkills(profile.qualification, profile.skills || []);
  }

  /* 経験年数 */
  if (profile.experience) {
    const radio = document.querySelector('input[name="experience"][value="' + profile.experience + '"]');
    if (radio) radio.checked = true;
  }

  /* 雇用形態 */
  if (profile.employmentType) {
    const radio = document.querySelector('input[name="employmentType"][value="' + profile.employmentType + '"]');
    if (radio) radio.checked = true;
  }
}

function getProfile() {
  try {
    return JSON.parse(localStorage.getItem('medispot_profile') || '{}');
  } catch (e) {
    return {};
  }
}

/* ===== トースト表示 ===== */
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(function () { toast.classList.remove('show'); }, 3000);
}

/* ===== XSS対策 ===== */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
