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

  /* 文字数カウント */
  document.getElementById('jobTitle').addEventListener('input', function () {
    document.getElementById('titleLen').textContent = this.value.length;
  });

  /* フォーム送信 */
  document.getElementById('jobForm').addEventListener('submit', saveJob);
})();

/* ===== ハンバーガー ===== */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
  document.body.classList.toggle('menu-open');
}

/* ===== 保存 ===== */
function saveJob(e) {
  e.preventDefault();

  const title   = document.getElementById('jobTitle').value.trim();
  const jobType = document.getElementById('jobType').value;
  const empType = (document.querySelector('input[name="empType"]:checked') || {}).value || '';
  const salary  = document.getElementById('salary').value.trim();
  const loc     = document.getElementById('location').value.trim();
  const desc    = document.getElementById('description').value.trim();

  if (!title)   { alert('求人タイトルを入力してください'); return; }
  if (!jobType) { alert('募集職種を選択してください'); return; }
  if (!empType) { alert('雇用形態を選択してください'); return; }
  if (!salary)  { alert('給与を入力してください'); return; }
  if (!loc)     { alert('勤務地を入力してください'); return; }
  if (!desc)    { alert('仕事内容を入力してください'); return; }

  const now  = new Date();
  const date = now.getFullYear() + '/' +
    String(now.getMonth() + 1).padStart(2, '0') + '/' +
    String(now.getDate()).padStart(2, '0');

  const newJob = {
    id:             'user-job-' + Date.now(),
    title:          title,
    jobType:        jobType,
    employmentType: empType,
    salary:         salary,
    location:       loc,
    description:    desc,
    requirements:   document.getElementById('requirements').value.trim(),
    date:           date,
    status:         'active',
    applicants:     0,
    reviewing:      0,
    matched:        0,
  };

  /* medispot_employer_jobs に追加 */
  const jobs = getEmployerJobs();
  jobs.push(newJob);
  localStorage.setItem('medispot_employer_jobs', JSON.stringify(jobs));

  /* 成功トースト → リダイレクト */
  showToast('求人を掲載しました！');
  setTimeout(function () { window.location.href = 'employer-jobs.html'; }, 1500);
}

/* ===== localStorage ===== */
function getEmployerJobs() {
  try { return JSON.parse(localStorage.getItem('medispot_employer_jobs') || '[]'); }
  catch (e) { return []; }
}

/* ===== トースト ===== */
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(function () { toast.classList.remove('show'); }, 2500);
}
/* ===== オーバーレイタップで閉じる ===== */
document.getElementById('mobileMenu').addEventListener('click', function(e) {
  if (e.target === this) toggleMenu();
});
