/**
 * VERDANT — app.js
 * Handles: multi-step navigation, form validation,
 * password toggle, avatar upload, chip selection,
 * workspace type selection, character count, localStorage state.
 */

'use strict';

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
const state = {
  currentStep: 1,
  totalSteps: 3,
  token: localStorage.getItem('verdant_token') || null,
  formData: {
    // Step 1
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    // Step 2
    workspaceName: '',
    workspaceType: 'business',
    teamSize: '',
    // Step 3
    displayName: '',
    bio: '',
    interests: ['technology', 'product'],
    avatarDataURL: null,
  }
};

// ─────────────────────────────────────────────
// DOM HELPERS
// ─────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}

function markInvalid(inputEl, invalid) {
  if (!inputEl) return;
  inputEl.classList.toggle('invalid', invalid);
}

// ─────────────────────────────────────────────
// STEP NAVIGATION
// ─────────────────────────────────────────────
function goToStep(n) {
  if (n < 1 || n > state.totalSteps + 1) return;

  // Hide all pages
  $$('.page').forEach(p => p.classList.remove('active'));

  if (n <= state.totalSteps) {
    const page = document.getElementById(`page-${n}`);
    if (page) page.classList.add('active');
  } else {
    // Success page
    document.getElementById('page-success').classList.add('active');
  }

  // Update sidebar steps
  $$('.step').forEach(step => {
    const s = parseInt(step.dataset.step);
    step.classList.remove('active', 'done');
    if (s === n) step.classList.add('active');
    else if (s < n) step.classList.add('done');

    const numEl = step.querySelector('.step-num');
    if (s < n) {
      numEl.textContent = '✓';
    } else {
      numEl.textContent = s;
    }
  });

  state.currentStep = n;
  saveState();
}

// ─────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateStep1() {
  let valid = true;

  const firstName = $('#first-name');
  const lastName  = $('#last-name');
  const email     = $('#email');
  const password  = $('#password');

  // First name
  if (!firstName.value.trim()) {
    showError('err-first-name', 'First name is required.');
    markInvalid(firstName, true);
    valid = false;
  } else {
    clearError('err-first-name');
    markInvalid(firstName, false);
  }

  // Last name
  if (!lastName.value.trim()) {
    showError('err-last-name', 'Last name is required.');
    markInvalid(lastName, true);
    valid = false;
  } else {
    clearError('err-last-name');
    markInvalid(lastName, false);
  }

  // Email
  if (!email.value.trim()) {
    showError('err-email', 'Email is required.');
    markInvalid(email, true);
    valid = false;
  } else if (!EMAIL_RE.test(email.value.trim())) {
    showError('err-email', 'Enter a valid email address.');
    markInvalid(email, true);
    valid = false;
  } else {
    clearError('err-email');
    markInvalid(email, false);
  }

  // Password
  if (!password.value) {
    showError('err-password', 'Password is required.');
    markInvalid(password, true);
    valid = false;
  } else if (password.value.length < 8) {
    showError('err-password', 'Password must be at least 8 characters.');
    markInvalid(password, true);
    valid = false;
  } else {
    clearError('err-password');
    markInvalid(password, false);
  }

  if (valid) {
    state.formData.firstName = firstName.value.trim();
    state.formData.lastName  = lastName.value.trim();
    state.formData.email     = email.value.trim();
    state.formData.password  = password.value;
  }

  return valid;
}

function validateStep2() {
  let valid = true;

  const wsName   = $('#ws-name');
  const teamSize = $('#team-size');

  if (!wsName.value.trim()) {
    showError('err-ws-name', 'Workspace name is required.');
    markInvalid(wsName, true);
    valid = false;
  } else {
    clearError('err-ws-name');
    markInvalid(wsName, false);
  }

  if (!teamSize.value) {
    showError('err-team-size', 'Please select a team size.');
    markInvalid(teamSize, true);
    valid = false;
  } else {
    clearError('err-team-size');
    markInvalid(teamSize, false);
  }

  if (valid) {
    state.formData.workspaceName = wsName.value.trim();
    state.formData.teamSize = teamSize.value;
  }

  return valid;
}

function validateStep3() {
  let valid = true;

  const displayName = $('#display-name');

  if (!displayName.value.trim()) {
    showError('err-display-name', 'Display name is required.');
    markInvalid(displayName, true);
    valid = false;
  } else {
    clearError('err-display-name');
    markInvalid(displayName, false);
  }

  if (valid) {
    state.formData.displayName = displayName.value.trim();
    state.formData.bio = $('#bio').value.trim();
    state.formData.interests = [...state.formData.interests];
  }

  return valid;
}

// ─────────────────────────────────────────────
// API HELPERS
// ─────────────────────────────────────────────
const API_BASE = window.location.origin;

function setLoading(btn, loading, defaultLabel) {
  btn.disabled = loading;
  btn.innerHTML = loading
    ? `<span class="spinner"></span>Please wait...`
    : defaultLabel;
}

function showServerErrors(errorsObj) {
  Object.entries(errorsObj).forEach(([field, msg]) => {
    // Map field names to error element IDs
    const map = {
      firstName:     'err-first-name',
      lastName:      'err-last-name',
      email:         'err-email',
      password:      'err-password',
      workspaceName: 'err-ws-name',
      workspaceType: 'err-ws-type',
      teamSize:      'err-team-size',
      displayName:   'err-display-name',
    };
    const errId = map[field];
    if (errId) showError(errId, msg);
  });
}

// ─────────────────────────────────────────────
// FORM SUBMISSIONS
// ─────────────────────────────────────────────
document.getElementById('form-signup').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateStep1()) return;

  const btn = e.target.querySelector('.btn-primary');
  setLoading(btn, true, 'Sign Up');

  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: state.formData.firstName,
        lastName:  state.formData.lastName,
        email:     state.formData.email,
        password:  state.formData.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.errors) showServerErrors(data.errors);
      else showError('err-email', data.error || 'Something went wrong.');
      setLoading(btn, false, 'Sign Up');
      return;
    }

    // Save JWT token
    state.token = data.token;
    localStorage.setItem('verdant_token', data.token);
    setLoading(btn, false, 'Sign Up');
    goToStep(2);

  } catch (err) {
    console.error(err);
    showError('err-email', 'Network error — is the server running?');
    setLoading(btn, false, 'Sign Up');
  }
});

document.getElementById('form-workspace').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateStep2()) return;

  const btn = e.target.querySelector('.btn-primary');
  setLoading(btn, true, 'Continue →');

  try {
    const res = await fetch(`${API_BASE}/api/workspace`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`,
      },
      body: JSON.stringify({
        workspaceName: state.formData.workspaceName,
        workspaceType: state.formData.workspaceType,
        teamSize:      state.formData.teamSize,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.errors) showServerErrors(data.errors);
      setLoading(btn, false, 'Continue →');
      return;
    }

    setLoading(btn, false, 'Continue →');
    goToStep(3);

  } catch (err) {
    console.error(err);
    showError('err-ws-name', 'Network error — is the server running?');
    setLoading(btn, false, 'Continue →');
  }
});

document.getElementById('form-profile').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateStep3()) return;

  const btn = e.target.querySelector('.btn-primary');
  setLoading(btn, true, 'Complete Setup 🎉');

  try {
    // Use FormData so we can send the avatar file
    const formData = new FormData();
    formData.append('displayName', state.formData.displayName);
    formData.append('bio',         state.formData.bio || '');
    formData.append('interests',   JSON.stringify(state.formData.interests));

    const avatarInput = document.getElementById('avatar-input');
    if (avatarInput.files[0]) {
      formData.append('avatar', avatarInput.files[0]);
    }

    const res = await fetch(`${API_BASE}/api/profile`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${state.token}` },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.errors) showServerErrors(data.errors);
      else showError('err-display-name', data.error || 'Something went wrong.');
      setLoading(btn, false, 'Complete Setup 🎉');
      return;
    }

    setLoading(btn, false, 'Complete Setup 🎉');
    saveState();
    goToStep(4);

  } catch (err) {
    console.error(err);
    showError('err-display-name', 'Network error — is the server running?');
    setLoading(btn, false, 'Complete Setup 🎉');
  }
});

// Dashboard button
document.getElementById('btn-dashboard').addEventListener('click', () => {
  window.location.href = 'roadmaps.html';
});

// ─────────────────────────────────────────────
// PASSWORD TOGGLE
// ─────────────────────────────────────────────
document.getElementById('toggle-pw').addEventListener('click', () => {
  const pw = document.getElementById('password');
  const eyeShow = document.getElementById('eye-show');
  const eyeHide = document.getElementById('eye-hide');

  if (pw.type === 'password') {
    pw.type = 'text';
    eyeShow.style.display = 'none';
    eyeHide.style.display = 'block';
  } else {
    pw.type = 'password';
    eyeShow.style.display = 'block';
    eyeHide.style.display = 'none';
  }
});

// ─────────────────────────────────────────────
// WORKSPACE CARD SELECTION
// ─────────────────────────────────────────────
$$('.workspace-card').forEach(card => {
  card.addEventListener('click', () => {
    $$('.workspace-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.formData.workspaceType = card.dataset.type;
    clearError('err-ws-type');
  });
});

// ─────────────────────────────────────────────
// INTEREST CHIPS
// ─────────────────────────────────────────────
$$('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chip.classList.toggle('selected');
    const val = chip.dataset.value;
    const idx = state.formData.interests.indexOf(val);
    if (idx === -1) {
      state.formData.interests.push(val);
    } else {
      state.formData.interests.splice(idx, 1);
    }
  });
});

// ─────────────────────────────────────────────
// AVATAR UPLOAD
// ─────────────────────────────────────────────
document.getElementById('avatar-trigger').addEventListener('click', () => {
  document.getElementById('avatar-input').click();
});

document.getElementById('avatar-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    alert('Image is too large. Max size is 2 MB.');
    e.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (evt) => {
    const url = evt.target.result;
    const preview = document.getElementById('avatar-preview');
    const placeholder = document.querySelector('.avatar-placeholder');

    preview.src = url;
    preview.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';

    state.formData.avatarDataURL = url;
  };
  reader.readAsDataURL(file);
});

// ─────────────────────────────────────────────
// BIO CHARACTER COUNT
// ─────────────────────────────────────────────
document.getElementById('bio').addEventListener('input', (e) => {
  const count = e.target.value.length;
  document.getElementById('bio-count').textContent = count;
  state.formData.bio = e.target.value;
});

// ─────────────────────────────────────────────
// OAUTH — Google & GitHub
// ─────────────────────────────────────────────
document.getElementById('btn-google').addEventListener('click', () => {
  window.location.href = '/api/auth/google';
});

document.getElementById('btn-github').addEventListener('click', () => {
  window.location.href = '/api/auth/github';
});

document.getElementById('link-login').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Login page coming soon!');
});

// ─────────────────────────────────────────────
// HANDLE OAUTH REDIRECT — pick up ?token= from URL
// After Google/GitHub login, server redirects back with token
// ─────────────────────────────────────────────
function handleOAuthRedirect() {
  const params = new URLSearchParams(window.location.search);
  const token  = params.get('token');
  const oauth  = params.get('oauth');
  const error  = params.get('error');

  if (error) {
    alert('OAuth login failed. Please try again or use email.');
    window.history.replaceState({}, '', '/');
    return;
  }

  if (token) {
    // Store token and skip to step 2 (account already created via OAuth)
    state.token = token;
    localStorage.setItem('verdant_token', token);

    // Fetch user info to prefill
    fetch('/api/me', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          state.formData.firstName = data.user.firstName || '';
          state.formData.lastName  = data.user.lastName  || '';
          state.formData.email     = data.user.email     || '';
        }
        // Clean URL then go to workspace step
        window.history.replaceState({}, '', '/');
        // Show a quick welcome toast
        showToast('Signed in with ' + (oauth === 'github' ? 'GitHub' : 'Google') + ' ✓');
        goToStep(2);
      })
      .catch(() => {
        window.history.replaceState({}, '', '/');
        goToStep(2);
      });
  }
}

// ─────────────────────────────────────────────
// TOAST NOTIFICATION
// ─────────────────────────────────────────────
function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
    background:#3bba82; color:#000; font-family:'DM Sans',sans-serif;
    font-size:13px; font-weight:600; padding:10px 20px; border-radius:20px;
    box-shadow:0 8px 32px rgba(0,0,0,0.4); z-index:9999;
    animation: toastIn 0.3s ease;
  `;
  const style = document.createElement('style');
  style.textContent = `@keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }`;
  document.head.appendChild(style);
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ─────────────────────────────────────────────
// LIVE INLINE VALIDATION (on blur)
// ─────────────────────────────────────────────
['first-name', 'last-name', 'email', 'password'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('blur', () => {
    // Trigger light validation on individual field
    if (!el.value.trim() && id !== 'password') {
      const label = el.previousElementSibling?.textContent || id;
      // Only show if field was touched
    }
    if (id === 'email' && el.value && !EMAIL_RE.test(el.value.trim())) {
      showError('err-email', 'Enter a valid email address.');
      markInvalid(el, true);
    } else if (el.value && id === 'password' && el.value.length < 8) {
      showError('err-password', 'Password must be at least 8 characters.');
      markInvalid(el, true);
    } else if (el.value) {
      const errId = 'err-' + id;
      clearError(errId);
      markInvalid(el, false);
    }
  });

  el.addEventListener('input', () => {
    if (el.classList.contains('invalid') && el.value.trim()) {
      markInvalid(el, false);
      clearError('err-' + id);
    }
  });
});

// ─────────────────────────────────────────────
// PERSIST STATE TO LOCALSTORAGE
// ─────────────────────────────────────────────
function saveState() {
  try {
    const toSave = { ...state.formData };
    delete toSave.password;       // never persist password
    delete toSave.avatarDataURL;  // too large for localStorage
    localStorage.setItem('verdant_state', JSON.stringify(toSave));
    localStorage.setItem('verdant_step', state.currentStep);
  } catch (_) { /* quota exceeded or private browsing */ }
}

function loadState() {
  try {
    const saved = localStorage.getItem('verdant_state');
    const step  = localStorage.getItem('verdant_step');
    if (saved) {
      Object.assign(state.formData, JSON.parse(saved));
      prefillForms();
    }
    // Don't auto-advance to avoid confusion on page reload
  } catch (_) {}
}

function prefillForms() {
  const d = state.formData;
  const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
  set('first-name',    d.firstName);
  set('last-name',     d.lastName);
  set('email',         d.email);
  set('ws-name',       d.workspaceName);
  set('team-size',     d.teamSize);
  set('display-name',  d.displayName);
  set('bio',           d.bio);

  if (d.bio) document.getElementById('bio-count').textContent = d.bio.length;

  if (d.workspaceType) {
    $$('.workspace-card').forEach(c => {
      c.classList.toggle('selected', c.dataset.type === d.workspaceType);
    });
  }

  if (d.interests && d.interests.length) {
    $$('.chip').forEach(chip => {
      chip.classList.toggle('selected', d.interests.includes(chip.dataset.value));
    });
  }
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
loadState();
handleOAuthRedirect(); // check if we just came back from Google/GitHub
if (!new URLSearchParams(window.location.search).get('token')) {
  goToStep(1);
}