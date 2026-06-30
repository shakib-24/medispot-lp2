/* ===== COUNTERS for unique element IDs ===== */
let eduId = 0, licId = 0, expId = 0;

/* ===== INIT ===== */
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

  /* フォーム送信 */
  document.getElementById('resumeForm').addEventListener('submit', saveResume);

  /* 初期データ読み込み */
  loadPersonalInfo(user.name);
  loadResume();
})();

/* ===== HAMBURGER ===== */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}

/* ===== 基本情報（プロフィールから取得） ===== */
function loadPersonalInfo(userName) {
  const profile = getProfile();

  /* 氏名: medispot_user の name を優先、プロフィールに名前があれば上書き */
  document.getElementById('piName').textContent = userName || '—';

  if (profile.birthdate) {
    const d = new Date(profile.birthdate);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    document.getElementById('piBirthdate').textContent = y + '年' + m + '月' + day + '日';
    document.getElementById('piAge').textContent = calcAge(profile.birthdate) + '歳';
  }
}

function calcAge(birthdate) {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/* ===== EDUCATION ===== */
function addEducation(data) {
  data = data || {};
  eduId++;
  const id = eduId;
  const yearMonthVal  = escapeHtml(data.yearMonth  || '');
  const schoolVal     = escapeHtml(data.school     || '');
  const departmentVal = escapeHtml(data.department || '');
  const typeVal       = data.type || '卒業';

  const options = ['入学', '卒業', '修了', '中退'].map(function (t) {
    return '<option value="' + t + '"' + (t === typeVal ? ' selected' : '') + '>' + t + '</option>';
  }).join('');

  const html = (
    '<div class="dyn-item" id="edu-' + id + '">' +
      '<div class="dyn-header">' +
        '<span class="dyn-num">' + id + '</span>' +
        '<button type="button" class="btn-remove" onclick="removeEdu(' + id + ')">' +
          '<i class="ti ti-trash"></i>削除' +
        '</button>' +
      '</div>' +
      '<div class="dyn-body">' +
        '<div class="field-grid-4">' +
          '<div class="form-group">' +
            '<label class="form-label">年月</label>' +
            '<input type="month" name="yearMonth" value="' + yearMonthVal + '">' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">区分</label>' +
            '<select name="type">' + options + '</select>' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">学校名</label>' +
            '<input type="text" name="school" placeholder="例）○○大学" value="' + schoolVal + '">' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">学部・学科</label>' +
            '<input type="text" name="department" placeholder="例）医学部看護学科" value="' + departmentVal + '">' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );

  document.getElementById('educationList').insertAdjacentHTML('beforeend', html);
  renumberItems('educationList', 'dyn-num');
}

function removeEdu(id) {
  const el = document.getElementById('edu-' + id);
  if (el) el.remove();
  renumberItems('educationList', 'dyn-num');
}

function getEducationData() {
  return Array.from(
    document.querySelectorAll('#educationList .dyn-item')
  ).map(function (el) {
    return {
      yearMonth:  el.querySelector('[name="yearMonth"]').value,
      type:       el.querySelector('[name="type"]').value,
      school:     el.querySelector('[name="school"]').value,
      department: el.querySelector('[name="department"]').value,
    };
  });
}

/* ===== LICENSE ===== */
function addLicense(data) {
  data = data || {};
  licId++;
  const id = licId;
  const yearMonthVal = escapeHtml(data.yearMonth || '');
  const nameVal      = escapeHtml(data.name      || '');

  const html = (
    '<div class="dyn-item" id="lic-' + id + '">' +
      '<div class="dyn-header">' +
        '<span class="dyn-num">' + id + '</span>' +
        '<button type="button" class="btn-remove" onclick="removeLic(' + id + ')">' +
          '<i class="ti ti-trash"></i>削除' +
        '</button>' +
      '</div>' +
      '<div class="dyn-body">' +
        '<div class="field-grid-2">' +
          '<div class="form-group">' +
            '<label class="form-label">取得年月</label>' +
            '<input type="month" name="yearMonth" value="' + yearMonthVal + '">' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">免許・資格名</label>' +
            '<input type="text" name="name" placeholder="例）看護師免許、普通自動車免許" value="' + nameVal + '">' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  );

  document.getElementById('licenseList').insertAdjacentHTML('beforeend', html);
  renumberItems('licenseList', 'dyn-num');
}

function removeLic(id) {
  const el = document.getElementById('lic-' + id);
  if (el) el.remove();
  renumberItems('licenseList', 'dyn-num');
}

function getLicenseData() {
  return Array.from(
    document.querySelectorAll('#licenseList .dyn-item')
  ).map(function (el) {
    return {
      yearMonth: el.querySelector('[name="yearMonth"]').value,
      name:      el.querySelector('[name="name"]').value,
    };
  });
}

/* ===== EXPERIENCE ===== */
function addExperience(data) {
  data = data || {};
  expId++;
  const id = expId;
  const startMonthVal  = escapeHtml(data.startMonth  || '');
  const endMonthVal    = escapeHtml(data.endMonth    || '');
  const isCurrent      = !!data.isCurrent;
  const companyVal     = escapeHtml(data.company     || '');
  const departmentVal  = escapeHtml(data.department  || '');
  const descriptionVal = escapeHtml(data.description || '');

  const html = (
    '<div class="dyn-item" id="exp-' + id + '">' +
      '<div class="dyn-header">' +
        '<span class="dyn-num">' + id + '</span>' +
        '<button type="button" class="btn-remove" onclick="removeExp(' + id + ')">' +
          '<i class="ti ti-trash"></i>削除' +
        '</button>' +
      '</div>' +
      '<div class="dyn-body">' +
        /* 在籍期間 */
        '<div class="field-period">' +
          '<div class="form-group">' +
            '<label class="form-label">開始年月</label>' +
            '<input type="month" name="startMonth" value="' + startMonthVal + '">' +
          '</div>' +
          '<div class="field-period-sep">〜</div>' +
          '<div class="form-group">' +
            '<label class="form-label">終了年月</label>' +
            '<input type="month" name="endMonth" value="' + endMonthVal + '"' +
              (isCurrent ? ' disabled' : '') + ' id="expEnd-' + id + '">' +
          '</div>' +
          '<label class="current-check">' +
            '<input type="checkbox" name="isCurrent"' +
              (isCurrent ? ' checked' : '') +
              ' onchange="toggleEndMonth(' + id + ')">' +
            '現在も在籍' +
          '</label>' +
        '</div>' +
        /* 勤務先・部署 */
        '<div class="field-grid-2">' +
          '<div class="form-group">' +
            '<label class="form-label">勤務先</label>' +
            '<input type="text" name="company" placeholder="例）○○病院" value="' + companyVal + '">' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">部署・役職</label>' +
            '<input type="text" name="department" placeholder="例）内科病棟・看護師" value="' + departmentVal + '">' +
          '</div>' +
        '</div>' +
        /* 業務内容 */
        '<div class="form-group field-full">' +
          '<label class="form-label">業務内容</label>' +
          '<textarea name="description" rows="3" placeholder="主な業務内容・担当業務をご記入ください">' +
            descriptionVal +
          '</textarea>' +
        '</div>' +
      '</div>' +
    '</div>'
  );

  document.getElementById('experienceList').insertAdjacentHTML('beforeend', html);
  renumberItems('experienceList', 'dyn-num');
}

function removeExp(id) {
  const el = document.getElementById('exp-' + id);
  if (el) el.remove();
  renumberItems('experienceList', 'dyn-num');
}

/* 「現在も在籍」チェックで終了年月を切り替え */
function toggleEndMonth(id) {
  const endInput = document.getElementById('expEnd-' + id);
  const expEl    = document.getElementById('exp-' + id);
  const cb       = expEl.querySelector('[name="isCurrent"]');
  if (!endInput || !cb) return;
  endInput.disabled = cb.checked;
  if (cb.checked) endInput.value = '';
}

function getExperienceData() {
  return Array.from(
    document.querySelectorAll('#experienceList .dyn-item')
  ).map(function (el) {
    const isCurrent = el.querySelector('[name="isCurrent"]').checked;
    return {
      startMonth:  el.querySelector('[name="startMonth"]').value,
      endMonth:    isCurrent ? '' : el.querySelector('[name="endMonth"]').value,
      isCurrent:   isCurrent,
      company:     el.querySelector('[name="company"]').value,
      department:  el.querySelector('[name="department"]').value,
      description: el.querySelector('[name="description"]').value,
    };
  });
}

/* ===== RENUMBER ===== */
function renumberItems(listId, numClass) {
  const items = document.querySelectorAll('#' + listId + ' .' + numClass);
  items.forEach(function (el, i) { el.textContent = i + 1; });
}

/* ===== SAVE ===== */
function saveResume(e) {
  e.preventDefault();

  const data = {
    personalNote: document.getElementById('personalNote').value,
    education:    getEducationData(),
    licenses:     getLicenseData(),
    workSummary:  document.getElementById('workSummary').value,
    experiences:  getExperienceData(),
    workSkills:   document.getElementById('workSkills').value,
    workPR:       document.getElementById('workPR').value,
  };

  localStorage.setItem('medispot_resume', JSON.stringify(data));
  showToast('履歴書・職務経歴書を保存しました');
}

/* ===== LOAD ===== */
function loadResume() {
  const data = getResume();
  if (!data) return;

  document.getElementById('personalNote').value = data.personalNote || '';
  document.getElementById('workSummary').value  = data.workSummary  || '';
  document.getElementById('workSkills').value   = data.workSkills   || '';
  document.getElementById('workPR').value       = data.workPR       || '';

  (data.education   || []).forEach(function (item) { addEducation(item); });
  (data.licenses    || []).forEach(function (item) { addLicense(item); });
  (data.experiences || []).forEach(function (item) { addExperience(item); });
}

/* ===== DOWNLOAD MOCK ===== */
function downloadMock() {
  alert('📄 PDFダウンロード機能は現在準備中です。\n近日公開予定です。');
}

/* ===== TOAST ===== */
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(function () { toast.classList.remove('show'); }, 3000);
}

/* ===== STORAGE HELPERS ===== */
function getProfile() {
  try { return JSON.parse(localStorage.getItem('medispot_profile') || '{}'); } catch (e) { return {}; }
}

function getResume() {
  try { return JSON.parse(localStorage.getItem('medispot_resume') || 'null'); } catch (e) { return null; }
}

/* ===== XSS ===== */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
