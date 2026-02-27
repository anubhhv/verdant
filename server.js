/**
 * VERDANT — server.js
 * Express backend with:
 *  - Email/password registration & login (bcrypt + JWT)
 *  - Google OAuth 2.0 (passport-google-oauth20)
 *  - GitHub OAuth (passport-github2)
 *  - Avatar upload (multer)
 *  - Workspace & Profile APIs
 */

'use strict';

require('dotenv').config();

const express        = require('express');
const cors           = require('cors');
const helmet         = require('helmet');
const session        = require('express-session');
const passport       = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const path           = require('path');
const fs             = require('fs');
const bcrypt         = require('bcryptjs');
const jwt            = require('jsonwebtoken');
const multer         = require('multer');
const { v4: uuidv4 } = require('uuid');

const PORT        = process.env.PORT        || 3000;
const JWT_SECRET  = process.env.JWT_SECRET  || 'verdant-dev-secret';
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ── In-memory DB (swap for real DB in production) ──
const db = { users: [], workspaces: [], profiles: [] };

function findUserByEmail(email) { return db.users.find(u => u.email === email?.toLowerCase()); }
function findUserById(id)        { return db.users.find(u => u.id === id); }

function findOrCreateOAuthUser({ provider, providerId, email, firstName, lastName, avatarUrl }) {
  let user = db.users.find(u => u[provider + 'Id'] === providerId);
  if (user) return user;
  if (email) { user = findUserByEmail(email); if (user) { user[provider + 'Id'] = providerId; return user; } }
  user = { id: uuidv4(), firstName: firstName || 'User', lastName: lastName || '',
           email: email?.toLowerCase() || provider + '_' + providerId + '@oauth.verdant',
           passwordHash: null, avatarUrl: avatarUrl || null,
           [provider + 'Id']: providerId, createdAt: new Date().toISOString() };
  db.users.push(user);
  console.log('[OAuth] New user via ' + provider + ': ' + user.email);
  return user;
}

function issueToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

// ── Multer ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename:    (req, file, cb) => cb(null, 'avatar-' + uuidv4() + path.extname(file.originalname).toLowerCase()),
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => ['image/jpeg','image/png','image/webp'].includes(file.mimetype)
    ? cb(null, true) : cb(new Error('Only JPG, PNG, WEBP allowed.')) });

// ── Passport ──
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, findUserById(id) || false));

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here') {
  passport.use(new GoogleStrategy(
    { clientID: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL },
    (at, rt, profile, done) => done(null, findOrCreateOAuthUser({
      provider: 'google', providerId: profile.id,
      email: profile.emails?.[0]?.value,
      firstName: profile.name?.givenName, lastName: profile.name?.familyName,
      avatarUrl: profile.photos?.[0]?.value }))
  ));
  console.log('[Passport] Google strategy ready');
} else { console.warn('[Passport] Google not configured — add keys to .env'); }

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_ID !== 'your_github_client_id_here') {
  passport.use(new GitHubStrategy(
    { clientID: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL, scope: ['user:email'] },
    (at, rt, profile, done) => {
      const email = profile.emails?.find(e => e.primary)?.value || profile.emails?.[0]?.value;
      const parts = (profile.displayName || profile.username || '').split(' ');
      done(null, findOrCreateOAuthUser({ provider: 'github', providerId: String(profile.id),
        email, firstName: parts[0] || profile.username, lastName: parts.slice(1).join(' '),
        avatarUrl: profile.photos?.[0]?.value }));
    }
  ));
  console.log('[Passport] GitHub strategy ready');
} else { console.warn('[Passport] GitHub not configured — add keys to .env'); }

// ── JWT middleware ──
function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized.' });
  try { req.user = jwt.verify(h.slice(7), JWT_SECRET); next(); }
  catch { return res.status(401).json({ error: 'Invalid or expired token.' }); }
}

// ── Validation ──
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateSignup({ firstName, lastName, email, password }) {
  const e = {};
  if (!firstName?.trim())         e.firstName = 'First name is required.';
  if (!lastName?.trim())          e.lastName  = 'Last name is required.';
  if (!email?.trim())             e.email     = 'Email is required.';
  else if (!EMAIL_RE.test(email)) e.email     = 'Invalid email address.';
  if (!password)                  e.password  = 'Password is required.';
  else if (password.length < 8)   e.password  = 'Password must be at least 8 characters.';
  return e;
}
function validateWorkspace({ workspaceName, workspaceType, teamSize }) {
  const e = {};
  if (!workspaceName?.trim())                                   e.workspaceName = 'Required.';
  if (!['business','creative','research','startup'].includes(workspaceType)) e.workspaceType = 'Select a type.';
  if (!['solo','small','medium','large','enterprise'].includes(teamSize))    e.teamSize = 'Select a size.';
  return e;
}
function validateProfile({ displayName }) {
  return displayName?.trim() ? {} : { displayName: 'Display name is required.' };
}

// ── App ──
const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: ['http://localhost:' + PORT, 'http://127.0.0.1:' + PORT], credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET || 'verdant-session',
  resave: false, saveUninitialized: false, cookie: { secure: false, maxAge: 86400000 } }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(UPLOADS_DIR));

// ── Routes ──

app.get('/api/health', (req, res) => res.json({ status: 'ok',
  oauth: { google: !!process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here',
           github: !!process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_ID !== 'your_github_client_id_here' } }));

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const errors = validateSignup({ firstName, lastName, email, password });
    if (Object.keys(errors).length) return res.status(422).json({ errors });
    if (findUserByEmail(email)) return res.status(409).json({ errors: { email: 'Email already registered.' } });
    const user = { id: uuidv4(), firstName: firstName.trim(), lastName: lastName.trim(),
      email: email.toLowerCase().trim(), passwordHash: await bcrypt.hash(password, 12),
      googleId: null, githubId: null, avatarUrl: null, createdAt: new Date().toISOString() };
    db.users.push(user);
    console.log('[Register]', user.email);
    res.status(201).json({ message: 'Account created.', token: issueToken(user),
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
  } catch (err) { console.error('[Register]', err); res.status(500).json({ error: 'Server error.' }); }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = findUserByEmail(email);
    if (!user || !user.passwordHash || !await bcrypt.compare(password, user.passwordHash))
      return res.status(401).json({ error: 'Invalid email or password.' });
    console.log('[Login]', user.email);
    res.json({ token: issueToken(user), user: { id: user.id, firstName: user.firstName, email: user.email } });
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
});

// Google OAuth
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile','email'] }));
app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/?error=google_failed' }),
  (req, res) => res.redirect('/?token=' + issueToken(req.user) + '&oauth=google'));

// GitHub OAuth
app.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/api/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/?error=github_failed' }),
  (req, res) => res.redirect('/?token=' + issueToken(req.user) + '&oauth=github'));

// Workspace
app.post('/api/workspace', authMiddleware, (req, res) => {
  try {
    const { workspaceName, workspaceType, teamSize } = req.body;
    const errors = validateWorkspace({ workspaceName, workspaceType, teamSize });
    if (Object.keys(errors).length) return res.status(422).json({ errors });
    const idx = db.workspaces.findIndex(w => w.userId === req.user.userId);
    if (idx !== -1) db.workspaces.splice(idx, 1);
    const w = { id: uuidv4(), userId: req.user.userId, name: workspaceName.trim(),
      type: workspaceType, teamSize, createdAt: new Date().toISOString() };
    db.workspaces.push(w);
    res.status(201).json({ message: 'Workspace saved.', workspace: w });
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
});

// Profile
app.post('/api/profile', authMiddleware, upload.single('avatar'), (req, res) => {
  try {
    const { displayName, bio, interests } = req.body;
    const errors = validateProfile({ displayName });
    if (Object.keys(errors).length) return res.status(422).json({ errors });
    let parsedInterests = []; try { parsedInterests = interests ? JSON.parse(interests) : []; } catch {}
    const avatarPath = req.file ? '/uploads/' + req.file.filename : null;
    const idx = db.profiles.findIndex(p => p.userId === req.user.userId);
    if (idx !== -1) db.profiles.splice(idx, 1);
    const p = { id: uuidv4(), userId: req.user.userId, displayName: displayName.trim(),
      bio: bio?.trim() || '', interests: parsedInterests, avatarPath, updatedAt: new Date().toISOString() };
    db.profiles.push(p);
    res.status(201).json({ message: 'Profile saved!', profile: { ...p,
      avatarUrl: avatarPath ? 'http://localhost:' + PORT + avatarPath : null } });
  } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Avatar must be under 2 MB.' });
    res.status(500).json({ error: err.message });
  }
});

// Me
app.get('/api/me', authMiddleware, (req, res) => {
  const user = findUserById(req.user.userId);
  if (!user) return res.status(404).json({ error: 'Not found.' });
  res.json({ user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, avatarUrl: user.avatarUrl },
    workspace: db.workspaces.find(w => w.userId === user.id) || null,
    profile:   db.profiles.find(p => p.userId === user.id)   || null });
});

// Catch-all
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).send('Error: ' + err.message);
});

app.listen(PORT, () => {
  console.log('\n✦ Verdant running → http://localhost:' + PORT);
  console.log('  Health check    → http://localhost:' + PORT + '/api/health\n');
});