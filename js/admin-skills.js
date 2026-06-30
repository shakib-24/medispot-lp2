/* ===== 認証チェック ===== */
(function () {
  var raw = localStorage.getItem('medispot_user');
  if (!raw) { window.location.href = 'login.html'; return; }
  var user;
  try { user = JSON.parse(raw); } catch (e) { window.location.href = 'login.html'; return; }
  if (!user || user.role !== 'admin') { window.location.href = 'login.html'; return; }
  function logout() { localStorage.removeItem('medispot_user'); window.location.href = 'login.html'; }
  ['logoutBtn', 'logoutBtnMobile'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', logout);
  });
})();

/* ===== デフォルトデータ ===== */
var DEFAULT_DATA = [
  {
    id: 'type-1',
    name: '看護師',
    skills: ['急性期看護', '慢性期看護', '手術室', '外来業務', 'ICU・CCU', '透析看護', '精神科看護', '夜勤専従']
  },
  {
    id: 'type-2',
    name: '理学療法士',
    skills: ['整形外科リハビリ', '神経系リハビリ', '心肺リハビリ', '訪問リハビリ', '小児リハビリ']
  },
  {
    id: 'type-3',
    name: '作業療法士',
    skills: ['ADL訓練', '認知症ケア', '精神科作業療法', '退院支援', '義肢・装具']
  },
  {
    id: 'type-4',
    name: '言語聴覚士',
    skills: ['嚥下リハビリ', '失語症訓練', '発達障害支援', '構音障害訓練']
  },
  {
    id: 'type-5',
    name: '臨床検査技師',
    skills: ['血液検査', '生化学検査', '微生物検査', '超音波検査', '病理検査']
  },
];

/* ===== 状態 ===== */
var types = [];
var selectedTypeId = null;

/* ===== localStorage ===== */
var STORAGE_KEY = 'medispot_admin_skills';

function loadData() {
  var raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { types = JSON.parse(raw); } catch (e) { types = DEFAULT_DATA.map(deepClone); }
  } else {
    types = DEFAULT_DATA.map(deepClone);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(types));
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/* ===== ID生成 ===== */
function genId() {
  return 'type-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
}

/* ===== 職種パネル描画 ===== */
function renderTypeList() {
  var list  = document.getElementById('typeList');
  var count = document.getElementById('typeCount');
  count.textContent = types.length;

  if (!types.length) {
    list.innerHTML = '<div style="padding:32px;text-align:center;color:#aaa;font-size:13px">職種がありません</div>';
    return;
  }

  list.innerHTML = types.map(function (t) {
    var cls = t.id === selectedTypeId ? ' active' : '';
    return (
      '<div class="type-item' + cls + '" data-id="' + esc(t.id) + '" onclick="selectType(\'' + esc(t.id) + '\')">' +
        '<div class="type-item-left">' +
          '<i class="ti ti-stethoscope" style="font-size:15px;color:#7cb342;flex-shrink:0"></i>' +
          '<span class="type-name">' + esc(t.name) + '</span>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          '<span class="type-skill-count">' + t.skills.length + '件</span>' +
          '<button class="btn-delete-type" onclick="event.stopPropagation();deleteType(\'' + esc(t.id) + '\')" title="職種を削除">' +
            '<i class="ti ti-trash"></i>' +
          '</button>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

/* ===== スキルパネル描画 ===== */
function renderSkillPanel() {
  var placeholder = document.getElementById('skillPlaceholder');
  var content     = document.getElementById('skillContent');
  var typeNameEl  = document.getElementById('selectedTypeName');

  if (!selectedTypeId) {
    placeholder.style.display = '';
    content.style.display = 'none';
    typeNameEl.textContent = '職種を選択してください';
    return;
  }

  var t = types.find(function (x) { return x.id === selectedTypeId; });
  if (!t) {
    placeholder.style.display = '';
    content.style.display = 'none';
    return;
  }

  typeNameEl.textContent = t.name;
  placeholder.style.display = 'none';
  content.style.display = '';

  var tags = document.getElementById('skillTags');
  tags.innerHTML = t.skills.length
    ? t.skills.map(function (s, i) {
        return (
          '<span class="skill-tag">' +
            esc(s) +
            '<button class="btn-delete-skill" onclick="deleteSkill(' + i + ')" title="削除">' +
              '<i class="ti ti-x"></i>' +
            '</button>' +
          '</span>'
        );
      }).join('')
    : '<span style="font-size:13px;color:#aaa">スキルがありません。追加してください。</span>';
}

/* ===== 職種選択 ===== */
function selectType(id) {
  selectedTypeId = id;
  hideAddSkillRow();
  renderTypeList();
  renderSkillPanel();
}

/* ===== 職種追加フォーム ===== */
function showAddTypeForm() {
  var bar = document.getElementById('addTypeBar');
  bar.style.display = '';
  document.getElementById('newTypeName').value = '';
  document.getElementById('newTypeName').focus();
}

function hideAddTypeForm() {
  document.getElementById('addTypeBar').style.display = 'none';
}

function addJobType() {
  var input = document.getElementById('newTypeName');
  var name  = input.value.trim();
  if (!name) { input.focus(); return; }
  if (types.some(function (t) { return t.name === name; })) {
    alert('同じ名前の職種がすでに存在します。');
    input.focus();
    return;
  }
  var newType = { id: genId(), name: name, skills: [] };
  types.push(newType);
  saveData();
  hideAddTypeForm();
  selectedTypeId = newType.id;
  renderTypeList();
  renderSkillPanel();
}

/* ===== 職種削除 ===== */
function deleteType(id) {
  var t = types.find(function (x) { return x.id === id; });
  if (!t) return;
  if (!confirm('「' + t.name + '」とそのスキル（' + t.skills.length + '件）を削除しますか？')) return;
  types = types.filter(function (x) { return x.id !== id; });
  if (selectedTypeId === id) selectedTypeId = null;
  saveData();
  renderTypeList();
  renderSkillPanel();
}

/* ===== スキル追加 ===== */
function showAddSkillRow() {
  var row = document.getElementById('addSkillRow');
  var btn = document.getElementById('btnAddSkill');
  row.style.display = '';
  btn.style.display = 'none';
  document.getElementById('newSkillName').value = '';
  document.getElementById('newSkillName').focus();
}

function hideAddSkillRow() {
  var row = document.getElementById('addSkillRow');
  var btn = document.getElementById('btnAddSkill');
  if (row) row.style.display = 'none';
  if (btn) btn.style.display = '';
}

function addSkill() {
  if (!selectedTypeId) return;
  var input = document.getElementById('newSkillName');
  var name  = input.value.trim();
  if (!name) { input.focus(); return; }
  var t = types.find(function (x) { return x.id === selectedTypeId; });
  if (!t) return;
  if (t.skills.indexOf(name) !== -1) { alert('同じスキルがすでに存在します。'); input.focus(); return; }
  t.skills.push(name);
  saveData();
  renderTypeList();
  hideAddSkillRow();
  renderSkillPanel();
}

function skillInputKeydown(e) {
  if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
  if (e.key === 'Escape') { hideAddSkillRow(); }
}

/* ===== スキル削除 ===== */
function deleteSkill(index) {
  if (!selectedTypeId) return;
  var t = types.find(function (x) { return x.id === selectedTypeId; });
  if (!t) return;
  t.skills.splice(index, 1);
  saveData();
  renderTypeList();
  renderSkillPanel();
}

/* ===== ハンバーガー ===== */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
  document.body.classList.toggle('menu-open');
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ===== 初期描画 ===== */
loadData();
renderTypeList();
renderSkillPanel();
/* ===== オーバーレイタップで閉じる ===== */
document.getElementById('mobileMenu').addEventListener('click', function(e) {
  if (e.target === this) toggleMenu();
});
