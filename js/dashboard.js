'use strict';

// ── ROADMAP DATA (mirrors roadmaps.js) ───────────────────────────────────────
const RM_DATA = [
  { id:1, icon:'🌐', title:'Frontend Developer',  difficulty:'beginner',   total:12 },
  { id:2, icon:'⚙️', title:'Backend Developer',   difficulty:'intermediate',total:9  },
  { id:3, icon:'🚀', title:'DevOps Engineer',      difficulty:'advanced',   total:9  },
  { id:4, icon:'📱', title:'Mobile Developer',     difficulty:'intermediate',total:6  },
  { id:5, icon:'🤖', title:'AI / ML Engineer',     difficulty:'advanced',   total:9  },
  { id:6, icon:'🎨', title:'UI / UX Designer',     difficulty:'beginner',   total:6  },
  { id:7, icon:'🔐', title:'Cybersecurity',        difficulty:'advanced',   total:9  },
  { id:8, icon:'☁️', title:'Cloud Architect',      difficulty:'advanced',   total:6  },
];

const ACHIEVEMENTS = [
  { id:'first_step',  icon:'🌱', name:'First Step',     desc:'Complete your first topic',        req: d => d.totalDone >= 1 },
  { id:'on_a_roll',   icon:'🔥', name:'On a Roll',      desc:'Complete 10 topics total',          req: d => d.totalDone >= 10 },
  { id:'deep_dive',   icon:'🤿', name:'Deep Dive',      desc:'Start 3 different roadmaps',        req: d => d.mapsStarted >= 3 },
  { id:'halfway',     icon:'⚡', name:'Halfway There',  desc:'Reach 50% on any roadmap',          req: d => d.bestPct >= 50 },
  { id:'completionist',icon:'🏆',name:'Completionist',  desc:'Reach 100% on any roadmap',         req: d => d.bestPct >= 100 },
  { id:'scholar',     icon:'📚', name:'Scholar',        desc:'Complete 25 topics total',          req: d => d.totalDone >= 25 },
];

// ── AUTH GUARD ────────────────────────────────────────────────────────────────
const TOKEN = localStorage.getItem('verdant_token');
if (!TOKEN) { window.location.href = 'login.html'; }

// ── STATE ─────────────────────────────────────────────────────────────────────
let state = {
  user: null,
  progress: {},      // { [rmId]: Set<nodeIdx> }
  interests: [],
  avatarDataUrl: null,
  activity: [],
  currentView: 'overview',
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
function toast(msg, type='') {
  const t = $('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function calcStats() {
  let totalDone = 0, mapsStarted = 0, bestPct = 0;
  RM_DATA.forEach(rm => {
    const done = (state.progress[rm.id] || new Set()).size;
    if (done > 0) mapsStarted++;
    totalDone += done;
    const pct = Math.round((done / rm.total) * 100);
    if (pct > bestPct) bestPct = pct;
  });
  return { totalDone, mapsStarted, bestPct };
}

function loadProgress() {
  try {
    const raw = localStorage.getItem('verdant_progress');
    if (raw) {
      const parsed = JSON.parse(raw);
      Object.keys(parsed).forEach(id => {
        state.progress[id] = new Set(parsed[id]);
      });
    }
  } catch {}
}

function loadActivity() {
  try {
    const raw = localStorage.getItem('verdant_activity');
    state.activity = raw ? JSON.parse(raw) : [];
  } catch { state.activity = []; }
}

function saveActivity() {
  localStorage.setItem('verdant_activity', JSON.stringify(state.activity.slice(0,20)));
}

function addActivity(msg) {
  state.activity.unshift({ msg, time: Date.now() });
  saveActivity();
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return d + 'd ago';
  if (h > 0) return h + 'h ago';
  if (m > 0) return m + 'm ago';
  return 'just now';
}

// ── AVATAR ────────────────────────────────────────────────────────────────────
function setAvatarEls(initial, imgSrc) {
  const els = ['sbAvatar','apImg','pcAvatar'];
  els.forEach(id => {
    const el = $(id);
    if (!el) return;
    if (imgSrc) {
      el.innerHTML = `<img src="${imgSrc}" alt="avatar"/>`;
    } else {
      el.textContent = initial;
      el.innerHTML = initial;
    }
  });
}

function loadAvatarFromStorage() {
  const saved = localStorage.getItem('verdant_avatar');
  if (saved) { state.avatarDataUrl = saved; }
}

// ── FETCH USER ────────────────────────────────────────────────────────────────
async function loadUser() {
  try {
    const res = await fetch('/api/me', { headers: { 'Authorization': 'Bearer ' + TOKEN } });
    if (!res.ok) { localStorage.removeItem('verdant_token'); window.location.href = 'login.html'; return; }
    const data = await res.json();
    state.user = data.user;
    if (data.profile) {
      state.user.displayName = data.profile.displayName;
      state.user.bio = data.profile.bio;
      state.interests = data.profile.interests || [];
    }
    if (data.workspace) {
      state.user.workspace = data.workspace.name;
    }
  } catch {
    // Fallback: decode JWT for basic info
    try {
      const payload = JSON.parse(atob(TOKEN.split('.')[1]));
      state.user = { id: payload.userId, email: payload.email, firstName: 'User', lastName: '' };
    } catch {}
  }
}

// ── RENDER ALL ────────────────────────────────────────────────────────────────
function renderAll() {
  const u = state.user;
  if (!u) return;

  const displayName = u.displayName || u.firstName || 'there';
  const initial = (u.firstName || u.email || 'U')[0].toUpperCase();
  const stats = calcStats();
  const streak = Number(localStorage.getItem('verdant_streak') || 0);

  // Sidebar
  $('sbName').textContent = displayName;
  $('sbEmail').textContent = u.email || '';

  // Avatar pill
  $('apName').textContent = displayName;

  // Avatars
  setAvatarEls(initial, state.avatarDataUrl);

  // ── Overview ──
  $('wbGreeting').textContent = greeting();
  $('wbName').textContent = displayName + ' 👋';
  $('streakNum').textContent = streak;
  $('stTopics').textContent = stats.totalDone;
  $('stMaps').textContent = stats.mapsStarted;
  $('stBest').textContent = stats.mapsStarted ? stats.bestPct + '%' : '—';
  $('stAch').textContent = ACHIEVEMENTS.filter(a => a.req(stats)).length;

  renderActiveRoadmaps(stats);
  renderActivity();
  renderAchievements(stats);

  // ── Profile view ──
  $('pcName').textContent = displayName;
  $('pcEmail').textContent = u.email || '';
  $('pcBio').textContent = u.bio || 'No bio yet.';
  $('pcsTopics').textContent = stats.totalDone;
  $('pcsMaps').textContent = stats.mapsStarted;
  $('pcsStreak').textContent = streak;

  // Profile chips
  const pcc = $('pcChips');
  pcc.innerHTML = state.interests.map(i => `<span class="pc-chip">${i}</span>`).join('') || '';

  // Edit form prefill
  $('fFirstName').value   = u.firstName || '';
  $('fLastName').value    = u.lastName  || '';
  $('fDisplay').value     = u.displayName || u.firstName || '';
  $('fEmail').value       = u.email || '';
  $('fBio').value         = u.bio || '';
  $('bioCount').textContent = ($('fBio').value).length;

  // Interest chips
  document.querySelectorAll('.ichip').forEach(c => {
    c.classList.toggle('on', state.interests.includes(c.dataset.v));
  });

  // ── Progress view ──
  renderProgress();
}

function renderActiveRoadmaps() {
  const container = $('activeRmList');
  const active = RM_DATA.filter(rm => (state.progress[rm.id] || new Set()).size > 0);

  if (!active.length) {
    container.innerHTML = `
      <div class="empty">
        <div class="empty-icon">🗺️</div>
        <p>No roadmaps started yet.</p>
        <a href="roadmaps.html" class="btn-sm">Browse Roadmaps</a>
      </div>`;
    return;
  }

  container.innerHTML = active.map(rm => {
    const done = (state.progress[rm.id] || new Set()).size;
    const pct  = Math.round((done / rm.total) * 100);
    return `
      <div class="rm-row">
        <div class="rm-row-icon">${rm.icon}</div>
        <div class="rm-row-body">
          <div class="rm-row-title">${rm.title}</div>
          <div class="rm-row-bar"><div class="rm-row-fill" style="width:${pct}%"></div></div>
          <div class="rm-row-meta">${done}/${rm.total} topics</div>
        </div>
        <div class="rm-row-pct">${pct}%</div>
      </div>`;
  }).join('');
}

function renderActivity() {
  const feed = $('activityList');
  if (!state.activity.length) {
    feed.innerHTML = `<div class="empty"><div class="empty-icon">⚡</div><p>No activity yet. Start a roadmap!</p></div>`;
    return;
  }
  feed.innerHTML = state.activity.slice(0,8).map(a => `
    <div class="act-item">
      <div class="act-dot"></div>
      <div class="act-text">${a.msg}</div>
      <div class="act-time">${timeAgo(a.time)}</div>
    </div>`).join('');
}

function renderAchievements(stats) {
  $('achGrid').innerHTML = ACHIEVEMENTS.map(a => {
    const unlocked = a.req(stats);
    return `
      <div class="ach-item${unlocked ? '' : ' locked'}" title="${unlocked ? 'Unlocked!' : 'Locked'}">
        <div class="ach-icon">${a.icon}</div>
        <div class="ach-info">
          <div class="ach-name">${a.name}</div>
          <div class="ach-desc">${a.desc}</div>
        </div>
      </div>`;
  }).join('');
}

function renderProgress() {
  const container = $('progressCards');
  const badgeClass = { beginner:'prog-badge-b', intermediate:'prog-badge-i', advanced:'prog-badge-a' };

  container.innerHTML = RM_DATA.map(rm => {
    const done = (state.progress[rm.id] || new Set()).size;
    const pct  = Math.round((done / rm.total) * 100);
    return `
      <div class="prog-card">
        <div class="prog-top">
          <div class="prog-icon">${rm.icon}</div>
          <div class="prog-title">${rm.title}</div>
          <span class="prog-badge ${badgeClass[rm.difficulty]}">${rm.difficulty}</span>
        </div>
        <div class="prog-bar-wrap">
          <div class="prog-bar-header">
            <span class="prog-bar-label">${done} / ${rm.total} topics completed</span>
            <span class="prog-pct">${pct}%</span>
          </div>
          <div class="prog-bar"><div class="prog-fill" style="width:${pct}%"></div></div>
        </div>
        <div class="prog-meta">${pct === 100 ? '🎉 Completed!' : pct === 0 ? 'Not started' : 'In progress'}</div>
      </div>`;
  }).join('');
}

// ── VIEW SWITCHING ────────────────────────────────────────────────────────────
const viewTitles = { overview:'Overview', profile:'Profile', progress:'My Progress', settings:'Settings' };

function switchView(name) {
  state.currentView = name;

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = $('view-' + name);
  if (el) el.classList.add('active');

  document.querySelectorAll('.sb-item').forEach(i => {
    i.classList.toggle('active', i.dataset.view === name);
  });

  $('topbarBreadcrumb').textContent = viewTitles[name] || name;

  // Close sidebar on mobile
  $('sidebar').classList.remove('open');
  $('sbOverlay').classList.remove('show');
  document.body.style.overflow = '';

  // Close dropdown
  $('apDropdown').classList.remove('open');
}

// ── EVENTS ────────────────────────────────────────────────────────────────────
// Sidebar nav
document.querySelectorAll('.sb-item[data-view]').forEach(item => {
  item.addEventListener('click', e => { e.preventDefault(); switchView(item.dataset.view); });
});

// Topbar avatar pill
$('avatarPill').addEventListener('click', e => {
  e.stopPropagation();
  $('apDropdown').classList.toggle('open');
});

document.addEventListener('click', () => $('apDropdown').classList.remove('open'));
$('apDropdown').addEventListener('click', e => e.stopPropagation());

// Dropdown items
document.querySelectorAll('.ap-dd-item[data-view]').forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

// Logout
function doLogout() {
  localStorage.removeItem('verdant_token');
  window.location.href = 'login.html';
}
$('sbLogout').addEventListener('click', doLogout);
$('apLogout').addEventListener('click', doLogout);

// Mobile sidebar
$('topbarBurger').addEventListener('click', () => {
  $('sidebar').classList.toggle('open');
  $('sbOverlay').classList.toggle('show');
});
$('sbClose').addEventListener('click', () => {
  $('sidebar').classList.remove('open');
  $('sbOverlay').classList.remove('show');
});
$('sbOverlay').addEventListener('click', () => {
  $('sidebar').classList.remove('open');
  $('sbOverlay').classList.remove('show');
});

// Bio counter
$('fBio').addEventListener('input', () => {
  $('bioCount').textContent = $('fBio').value.length;
  if (state.user) state.user.bio = $('fBio').value;
  $('pcBio').textContent = $('fBio').value || 'No bio yet.';
});

// Interest chips
document.querySelectorAll('.ichip').forEach(chip => {
  chip.addEventListener('click', () => {
    chip.classList.toggle('on');
    const v = chip.dataset.v;
    if (chip.classList.contains('on')) {
      if (!state.interests.includes(v)) state.interests.push(v);
    } else {
      state.interests = state.interests.filter(i => i !== v);
    }
    // Live update profile card
    const pcc = $('pcChips');
    pcc.innerHTML = state.interests.map(i => `<span class="pc-chip">${i}</span>`).join('');
  });
});

// Profile form
$('profileForm').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = $('btnSave');
  const status = $('saveStatus');

  btn.disabled = true;
  btn.textContent = 'Saving…';
  status.textContent = '';

  if (state.user) {
    state.user.firstName   = $('fFirstName').value.trim();
    state.user.lastName    = $('fLastName').value.trim();
    state.user.displayName = $('fDisplay').value.trim();
    state.user.bio         = $('fBio').value.trim();
  }

  // Try API save
  try {
    const fd = new FormData();
    fd.append('displayName', $('fDisplay').value.trim());
    fd.append('bio', $('fBio').value.trim());
    fd.append('interests', JSON.stringify(state.interests));
    if (state.avatarDataUrl && state.avatarDataUrl.startsWith('data:')) {
      const blob = await (await fetch(state.avatarDataUrl)).blob();
      fd.append('avatar', blob, 'avatar.jpg');
    }
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + TOKEN },
      body: fd,
    });
  } catch {}

  // Always update display
  renderAll();
  addActivity(`Updated profile — "${$('fDisplay').value.trim()}"`);

  btn.disabled = false;
  btn.textContent = 'Save Changes';
  status.textContent = '✓ Saved!';
  setTimeout(() => { status.textContent = ''; }, 3000);
  toast('Profile updated ✓');
});

// Avatar upload
$('pcAvatarBtn').addEventListener('click', () => $('avatarInput').click());
$('avatarInput').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    state.avatarDataUrl = ev.target.result;
    localStorage.setItem('verdant_avatar', ev.target.result);
    setAvatarEls('', ev.target.result);
    toast('Photo updated ✓');
    addActivity('Changed profile photo');
  };
  reader.readAsDataURL(file);
});

// Settings — reset progress
$('btnResetProg').addEventListener('click', () => {
  if (!confirm('Reset ALL roadmap progress? This cannot be undone.')) return;
  localStorage.removeItem('verdant_progress');
  state.progress = {};
  addActivity('Reset all progress');
  renderAll();
  toast('Progress reset', 'error');
});

// Change password modal
$('btnChangePw').addEventListener('click', () => $('pwModal').classList.add('open'));
$('pwModalClose').addEventListener('click', () => $('pwModal').classList.remove('open'));
$('pwCancelBtn').addEventListener('click', () => $('pwModal').classList.remove('open'));
$('pwModal').addEventListener('click', e => { if (e.target === $('pwModal')) $('pwModal').classList.remove('open'); });

$('pwSaveBtn').addEventListener('click', async () => {
  const cur = $('pwCurrent').value;
  const nw  = $('pwNew').value;
  const cf  = $('pwConfirm').value;
  const err = $('pwErr');

  if (!cur || !nw || !cf)   { err.textContent = 'All fields are required.'; return; }
  if (nw.length < 8)        { err.textContent = 'New password must be at least 8 characters.'; return; }
  if (nw !== cf)             { err.textContent = 'Passwords do not match.'; return; }

  err.textContent = '';
  $('pwSaveBtn').textContent = 'Updating…';

  await new Promise(r => setTimeout(r, 800)); // simulate

  $('pwModal').classList.remove('open');
  $('pwSaveBtn').textContent = 'Update Password';
  $('pwCurrent').value = $('pwNew').value = $('pwConfirm').value = '';
  toast('Password updated ✓');
  addActivity('Changed account password');
});

// Streak tracking
function updateStreak() {
  const today    = new Date().toDateString();
  const lastDay  = localStorage.getItem('verdant_last_day');
  let streak     = Number(localStorage.getItem('verdant_streak') || 0);

  if (lastDay === today) return; // already visited today

  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (lastDay === yesterday) {
    streak++;
  } else if (lastDay && lastDay !== yesterday) {
    streak = 1; // streak broken
  } else {
    streak = 1; // first time
  }

  localStorage.setItem('verdant_streak', streak);
  localStorage.setItem('verdant_last_day', today);
}

// ── INIT ─────────────────────────────────────────────────────────────────────
(async () => {
  updateStreak();
  loadProgress();
  loadActivity();
  loadAvatarFromStorage();
  await loadUser();
  renderAll();

  // If no activity yet, seed with a welcome entry
  if (state.activity.length === 0) {
    addActivity('Joined Verdant 🌿');
    renderActivity();
  }
})();