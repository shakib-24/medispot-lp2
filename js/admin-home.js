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
}
