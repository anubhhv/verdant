/**
 * VERDANT — login.js
 * Handles login form, validation, API call, remember me
 */

'use strict';

const API_BASE = window.location.origin;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Helpers ──
const $ = id => document.getElementById(id);

function showError(id, msg) {
  const el = $(id);
  if (el) el.textContent = msg;
}

function clearError(id) {
  const el = $(id);
  if (el) el.textContent = '';
}

function markInvalid(el, invalid) {
  el?.classList.toggle('invalid', invalid);
}

function showGeneralError(msg) {
  const el = $('general-error');
  el.textContent = msg;
  el.classList.add('visible');
}

function hideGeneralError() {
  const el = $('general-error');
  el.classList.remove('visible');
}

function setLoading(loading) {
  const btn = $('btn-login');
  btn.disabled = loading;
  btn.innerHTML = loading
    ? `<span class="spinner"></span>Signing in...`
    : 'Sign In';
}

// ── Password toggle ──
$('toggle-pw').addEventListener('click', () => {
  const pw = $('password');
  const show = $('eye-show');
  const hide = $('eye-hide');
  if (pw.type === 'password') {
    pw.type = 'text';
    show.style.display = 'none';
    hide.style.display = 'block';
  } else {
    pw.type = 'password';
    show.style.display = 'block';
    hide.style.display = 'none';
  }
});

// ── Inline validation ──
$('email').addEventListener('blur', () => {
  const val = $('email').value.trim();
  if (val && !EMAIL_RE.test(val)) {
    showError('err-email', 'Enter a valid email address.');
    markInvalid($('email'), true);
  } else {
    clearError('err-email');
    markInvalid($('email'), false);
  }
});

$('email').addEventListener('input', () => {
  if ($('email').classList.contains('invalid') && EMAIL_RE.test($('email').value.trim())) {
    clearError('err-email');
    markInvalid($('email'), false);
  }
  hideGeneralError();
});

$('password').addEventListener('input', () => {
  clearError('err-password');
  markInvalid($('password'), false);
  hideGeneralError();
});

// ── Prefill email from localStorage (remember me) ──
const savedEmail = localStorage.getItem('verdant_remembered_email');
if (savedEmail) {
  $('email').value = savedEmail;
  $('remember-me').checked = true;
}

// ── Form submit ──
$('form-login').addEventListener('submit', async (e) => {
  e.preventDefault();
  hideGeneralError();

  const email    = $('email').value.trim();
  const password = $('password').value;
  let valid = true;

  // Validate email
  if (!email) {
    showError('err-email', 'Email is required.');
    markInvalid($('email'), true);
    valid = false;
  } else if (!EMAIL_RE.test(email)) {
    showError('err-email', 'Enter a valid email address.');
    markInvalid($('email'), true);
    valid = false;
  } else {
    clearError('err-email');
    markInvalid($('email'), false);
  }

  // Validate password
  if (!password) {
    showError('err-password', 'Password is required.');
    markInvalid($('password'), true);
    valid = false;
  } else {
    clearError('err-password');
    markInvalid($('password'), false);
  }

  if (!valid) return;

  setLoading(true);

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      showGeneralError(data.error || 'Invalid email or password.');
      markInvalid($('email'), true);
      markInvalid($('password'), true);
      setLoading(false);
      return;
    }

    // Save token
    localStorage.setItem('verdant_token', data.token);

    // Remember me
    if ($('remember-me').checked) {
      localStorage.setItem('verdant_remembered_email', email);
    } else {
      localStorage.removeItem('verdant_remembered_email');
    }

    // Success — redirect to roadmaps
    showToast(`Welcome back, ${data.user.firstName}! 🌿`);
    setTimeout(() => {
      window.location.href = 'roadmaps.html';
    }, 1200);

  } catch (err) {
    console.error('[Login]', err);
    showGeneralError('Network error — is the server running?');
    setLoading(false);
  }
});

// ── OAuth buttons ──
$('btn-google').addEventListener('click', () => {
  window.location.href = '/api/auth/google';
});

$('btn-github').addEventListener('click', () => {
  window.location.href = '/api/auth/github';
});

// ── Forgot password ──
$('link-forgot').addEventListener('click', (e) => {
  e.preventDefault();
  const email = $('email').value.trim();
  if (email) {
    alert(`Password reset link would be sent to:\n${email}\n\n(Hook this up to your email provider like SendGrid or Nodemailer)`);
  } else {
    showError('err-email', 'Enter your email first.');
    markInvalid($('email'), true);
    $('email').focus();
  }
});

// ── Toast ──
function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
    background:#3bba82; color:#000; font-family:'DM Sans',sans-serif;
    font-size:13px; font-weight:600; padding:10px 20px; border-radius:20px;
    box-shadow:0 8px 32px rgba(0,0,0,0.4); z-index:9999; white-space:nowrap;
    animation: toastIn 0.3s ease;
  `;
  const style = document.createElement('style');
  style.textContent = `@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`;
  document.head.appendChild(style);
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ── Handle OAuth redirect back to login page ──
const params = new URLSearchParams(window.location.search);
const token  = params.get('token');
const oauth  = params.get('oauth');
const error  = params.get('error');

if (error) {
  showGeneralError('OAuth sign-in failed. Please try again.');
  window.history.replaceState({}, '', '/login.html');
}

if (token) {
  localStorage.setItem('verdant_token', token);
  window.history.replaceState({}, '', '/login.html');
  showToast('Signed in with ' + (oauth === 'github' ? 'GitHub' : 'Google') + ' ✓');
  setTimeout(() => { window.location.href = 'roadmaps.html'; }, 1200);
}