(function () {
  const raw = localStorage.getItem('medispot_user');
  if (!raw) {
    window.location.href = 'login.html';
    return;
  }

  let user;
  try {
    user = JSON.parse(raw);
  } catch (e) {
    window.location.href = 'login.html';
    return;
  }

  if (!user || user.role !== 'seeker') {
    window.location.href = 'login.html';
    return;
  }

  const name = user.name || 'ゲスト';

  ['userName', 'userNameWelcome', 'userNameMobile'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.textContent = name;
  });

  const dateEl = document.getElementById('todayDate');
  if (dateEl) {
    const today = new Date();
    dateEl.textContent = today.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }

  function logout() {
    localStorage.removeItem('medispot_user');
    window.location.href = 'login.html';
  }

  ['logoutBtn', 'logoutBtnMobile'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', logout);
  });
})();

function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
  document.body.classList.toggle('menu-open');
}
