'use strict';

// ── NAV SCROLL ────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('stuck', scrollY > 30));
document.getElementById('navBurger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// ── DRAG & DROP UPLOAD ────────────────────────────────────────
const uploadZone = document.getElementById('uploadZone');
const resumeFile = document.getElementById('resumeFile');
const uzFilename = document.getElementById('uzFilename');

uploadZone.addEventListener('click', () => resumeFile.click());
uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('dragover'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) setFile(file);
});
resumeFile.addEventListener('change', () => { if (resumeFile.files[0]) setFile(resumeFile.files[0]); });

function setFile(file) {
  const allowed = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
    toast('Only PDF, DOC, or DOCX files are supported', 'error'); return;
  }
  if (file.size > 5 * 1024 * 1024) { toast('File too large (max 5MB)', 'error'); return; }
  uploadZone.classList.add('has-file');
  uzFilename.textContent = '✓ ' + file.name;
  toast('Resume uploaded: ' + file.name);
}

// ── JOB ROLE CHIPS ────────────────────────────────────────────
let selectedRole = 'frontend';
document.querySelectorAll('.jr-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.jr-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    selectedRole = chip.dataset.role;
  });
});

// ── SCREENER ─────────────────────────────────────────────────
const MOCK_RESULTS = {
  frontend:   { score:78, grade:'B+', tagline:'Strong foundation, close to job-ready.',
    breakdown:[['Keyword Match',82,'#3bba82'],['Experience Depth',74,'#3bba82'],['Skills Coverage',80,'#3bba82'],['Format & ATS',76,'#fbbf24']],
    present:['React','JavaScript','CSS','HTML','Git'],
    missing:['TypeScript','Next.js','Testing (Jest)','GraphQL'],
    tips:['Add measurable achievements (e.g. "reduced load time by 40%")','Mention TypeScript experience prominently — it\'s listed in 90% of job postings','Include a link to a live portfolio or GitHub','Quantify your team size and project scope'] },
  backend:    { score:65, grade:'B−', tagline:'Solid backend, gaps in modern tooling.',
    breakdown:[['Keyword Match',61,'#fbbf24'],['Experience Depth',70,'#3bba82'],['Skills Coverage',62,'#fbbf24'],['Format & ATS',71,'#3bba82']],
    present:['Node.js','REST APIs','SQL','Git'],
    missing:['Microservices','Docker','Redis','gRPC','System Design'],
    tips:['Add Docker/containerisation experience to match modern roles','Describe database query optimisation you\'ve done','Mention any CI/CD pipelines you\'ve set up','Include a project with 1M+ requests or high-load context'] },
  devops:     { score:55, grade:'C+', tagline:'Needs more DevOps-specific depth.',
    breakdown:[['Keyword Match',52,'#f87171'],['Experience Depth',60,'#fbbf24'],['Skills Coverage',50,'#f87171'],['Format & ATS',68,'#3bba82']],
    present:['Linux','Git','Shell scripting'],
    missing:['Kubernetes','Terraform','Helm','ArgoCD','Prometheus','AWS/GCP'],
    tips:['Kubernetes is essential — highlight K8s experience or get CKA certified','Add IaC (Terraform/Ansible) prominently — every JD requires it','Show monitoring & observability work (Prometheus, Grafana)','Describe any on-call, incident response, or SLA ownership'] },
  aiml:       { score:71, grade:'B', tagline:'Good ML fundamentals, needs production experience.',
    breakdown:[['Keyword Match',74,'#3bba82'],['Experience Depth',68,'#fbbf24'],['Skills Coverage',72,'#3bba82'],['Format & ATS',70,'#3bba82']],
    present:['Python','TensorFlow','NumPy','Data Analysis'],
    missing:['MLOps','LangChain','RAG','Model Deployment','A/B Testing'],
    tips:['Add any deployed ML model to production — even a small side project','Mention LLM/GenAI experience if any — it\'s the hottest requirement in 2025','Include model performance metrics (accuracy, F1, AUC)','Show MLOps work: model versioning, monitoring, retraining pipelines'] },
};
const DEFAULT_RESULT = { score:70, grade:'B', tagline:'Decent resume, room to grow.',
  breakdown:[['Keyword Match',68,'#fbbf24'],['Experience Depth',72,'#3bba82'],['Skills Coverage',65,'#fbbf24'],['Format & ATS',75,'#3bba82']],
  present:['Communication','Problem Solving','Teamwork'],
  missing:['Domain-specific keywords','Quantified achievements','Technical depth'],
  tips:['Add numbers and metrics to every bullet point','Research top keywords for your target role and mirror them','Keep resume to 1 page for under 5 years experience','Add a strong professional summary at the top'] };

document.getElementById('screenBtn').addEventListener('click', () => {
  if (!uploadZone.classList.contains('has-file')) {
    toast('Please upload your resume first', 'error'); return;
  }
  const btn = document.getElementById('screenBtn');
  btn.classList.add('loading');
  btn.innerHTML = '<span class="screen-btn-icon">⏳</span> Analysing…';

  document.getElementById('srEmpty').style.display = 'none';
  setTimeout(() => {
    btn.classList.remove('loading');
    btn.innerHTML = '<span class="screen-btn-icon">🔍</span> Analyse Resume';
    renderResults(MOCK_RESULTS[selectedRole] || DEFAULT_RESULT);
  }, 2200);
});

function renderResults(data) {
  // Score ring
  const scoreEl = document.getElementById('srScore');
  const fill     = document.getElementById('srFill');
  scoreEl.style.display = 'flex';
  scoreEl.style.flexDirection = 'column';
  scoreEl.style.alignItems = 'center';

  document.getElementById('scoreGrade').textContent   = data.grade;
  document.getElementById('scoreTagline').textContent = data.tagline;

  // Animate score
  const circumference = 314;
  const offset = circumference - (data.score / 100) * circumference;
  fill.style.strokeDashoffset = circumference;
  fill.style.stroke = data.score >= 75 ? '#3bba82' : data.score >= 55 ? '#fbbf24' : '#f87171';
  requestAnimationFrame(() => {
    fill.style.strokeDashoffset = offset;
    let n = 0;
    const numEl = document.getElementById('scoreNum');
    const t = setInterval(() => {
      n = Math.min(n + 2, data.score);
      numEl.textContent = n;
      if (n >= data.score) clearInterval(t);
    }, 22);
  });

  // Breakdown
  const brkEl = document.getElementById('srBreakdown');
  const bars  = document.getElementById('srbBars');
  bars.innerHTML = data.breakdown.map(([label, pct, col]) => `
    <div class="srb-bar-item">
      <div class="srb-bar-label">${label}</div>
      <div class="srb-bar-track"><div class="srb-bar-fill" style="width:0%;background:${col}" data-pct="${pct}"></div></div>
      <div class="srb-bar-pct">${pct}%</div>
    </div>`).join('');
  brkEl.style.display = 'block';
  setTimeout(() => {
    bars.querySelectorAll('.srb-bar-fill').forEach(b => b.style.width = b.dataset.pct + '%');
  }, 100);

  // Gaps
  const gapsEl = document.getElementById('srGaps');
  const grid   = document.getElementById('srgGrid');
  grid.innerHTML =
    data.present.map(s => `<span class="srg-tag srg-present">✓ ${s}</span>`).join('') +
    data.missing.map(s => `<span class="srg-tag srg-missing">✗ ${s}</span>`).join('');
  gapsEl.style.display = 'block';

  // Tips
  const tipsEl = document.getElementById('srTips');
  const list   = document.getElementById('srtList');
  list.innerHTML = data.tips.map(t => `
    <div class="srt-item">
      <div class="srt-icon">💡</div>
      <div class="srt-text">${t}</div>
    </div>`).join('');
  tipsEl.style.display = 'block';

  toast('Analysis complete!');
}

// ── BUILDER ───────────────────────────────────────────────────
let currentStep = 0;
const TOTAL_STEPS = 4;
let expCount = 0, eduCount = 0;
let selectedTemplate = 'classic';

const bstepNext = document.getElementById('bstepNext');
const bstepPrev = document.getElementById('bstepPrev');
const bstepDots = document.getElementById('bstepDots').querySelectorAll('.bsd');

function gotoStep(n) {
  document.getElementById('bstep-' + currentStep).classList.remove('active');
  document.querySelectorAll('.btab')[currentStep].classList.remove('active');
  currentStep = Math.max(0, Math.min(n, TOTAL_STEPS - 1));
  document.getElementById('bstep-' + currentStep).classList.add('active');
  document.querySelectorAll('.btab')[currentStep].classList.add('active');
  bstepDots.forEach((d,i) => d.classList.toggle('active', i === currentStep));
  bstepPrev.disabled = currentStep === 0;
  bstepNext.textContent = currentStep === TOTAL_STEPS - 1 ? 'Done ✓' : 'Next →';
  syncPreview();
}

bstepNext.addEventListener('click', () => { if (currentStep < TOTAL_STEPS - 1) gotoStep(currentStep + 1); });
bstepPrev.addEventListener('click', () => gotoStep(currentStep - 1));
document.querySelectorAll('.btab').forEach((tab, i) => tab.addEventListener('click', () => gotoStep(i)));

// Add Experience
document.getElementById('addExpBtn').addEventListener('click', () => {
  const id = 'exp-' + (++expCount);
  const div = document.createElement('div');
  div.className = 'exp-item'; div.id = id;
  div.innerHTML = `
    <button class="ei-remove" onclick="removeItem('${id}')">✕</button>
    <div class="ei-row">
      <div class="ei-field"><label>Company</label><input type="text" placeholder="Google" oninput="syncPreview()"/></div>
      <div class="ei-field"><label>Role</label><input type="text" placeholder="Frontend Developer" oninput="syncPreview()"/></div>
    </div>
    <div class="ei-row">
      <div class="ei-field"><label>Start</label><input type="text" placeholder="Jan 2022" oninput="syncPreview()"/></div>
      <div class="ei-field"><label>End</label><input type="text" placeholder="Present" oninput="syncPreview()"/></div>
    </div>
    <div class="ei-field"><label>Description</label><textarea rows="3" placeholder="• Built and shipped features used by 1M+ users&#10;• Reduced bundle size by 35% with code splitting" oninput="syncPreview()"></textarea></div>`;
  document.getElementById('expList').appendChild(div);
  syncPreview();
});

// Add Education
document.getElementById('addEduBtn').addEventListener('click', () => {
  const id = 'edu-' + (++eduCount);
  const div = document.createElement('div');
  div.className = 'edu-item'; div.id = id;
  div.innerHTML = `
    <button class="ei-remove" onclick="removeItem('${id}')">✕</button>
    <div class="ei-row">
      <div class="ei-field"><label>Institution</label><input type="text" placeholder="IIT Delhi" oninput="syncPreview()"/></div>
      <div class="ei-field"><label>Degree</label><input type="text" placeholder="B.Tech Computer Science" oninput="syncPreview()"/></div>
    </div>
    <div class="ei-row">
      <div class="ei-field"><label>Year</label><input type="text" placeholder="2020 – 2024" oninput="syncPreview()"/></div>
      <div class="ei-field"><label>GPA / Grade</label><input type="text" placeholder="8.9 / 10" oninput="syncPreview()"/></div>
    </div>`;
  document.getElementById('eduList').appendChild(div);
  syncPreview();
});

function removeItem(id) {
  const el = document.getElementById(id);
  if (el) { el.remove(); syncPreview(); }
}
window.removeItem = removeItem;

// Template picker
document.querySelectorAll('.tpl-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.tpl-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    selectedTemplate = card.dataset.tpl;
    document.getElementById('bpTemplateName').textContent =
      ({classic:'Classic',modern:'Modern',minimal:'Minimal',creative:'Creative'})[selectedTemplate] + ' Template';
    syncPreview();
  });
});

// ── LIVE PREVIEW SYNC ─────────────────────────────────────────
window.syncPreview = function() {
  const fname    = document.getElementById('bf-fname')?.value || '';
  const lname    = document.getElementById('bf-lname')?.value || '';
  const title    = document.getElementById('bf-title')?.value || '';
  const email    = document.getElementById('bf-email')?.value || '';
  const phone    = document.getElementById('bf-phone')?.value || '';
  const location = document.getElementById('bf-location')?.value || '';
  const url      = document.getElementById('bf-url')?.value || '';
  const summary  = document.getElementById('bf-summary')?.value || '';
  const skills   = document.getElementById('bf-skills')?.value || '';
  const certs    = document.getElementById('bf-certs')?.value || '';
  const name     = ((fname + ' ' + lname).trim()) || 'Your Name';

  // Collect experience
  const expItems = [];
  document.querySelectorAll('.exp-item').forEach(item => {
    const inputs = item.querySelectorAll('input,textarea');
    expItems.push({ company: inputs[0]?.value, role: inputs[1]?.value, start: inputs[2]?.value, end: inputs[3]?.value, desc: inputs[4]?.value });
  });

  // Collect education
  const eduItems = [];
  document.querySelectorAll('.edu-item').forEach(item => {
    const inputs = item.querySelectorAll('input');
    eduItems.push({ school: inputs[0]?.value, degree: inputs[1]?.value, year: inputs[2]?.value, gpa: inputs[3]?.value });
  });

  const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);
  const certList  = certs.split(',').map(s => s.trim()).filter(Boolean);

  const page = document.getElementById('bpPage');
  page.innerHTML = buildTemplate(selectedTemplate, { name, title, email, phone, location, url, summary, expItems, eduItems, skillList, certList });

  // Fix scaled height: after scale(0.565) the visual height = real height × 0.565
  // Set the wrapper-inner height so the scroll container knows how tall the content is
  requestAnimationFrame(() => {
    const scaler = document.querySelector('.bp-page-scaler');
    const inner  = document.querySelector('.bp-page-wrap-inner');
    if (scaler && inner) {
      const realH = scaler.scrollHeight;
      inner.style.height = (realH * 0.565) + 'px';
    }
  });
};

function buildTemplate(tpl, d) {
  const expHTML = d.expItems.length
    ? d.expItems.map(e => `
        <div class="rc-exp-item">
          <div class="rc-exp-company">${e.company || '—'}</div>
          <div class="rc-exp-role">${e.role || '—'}</div>
          <div class="rc-exp-date">${[e.start,e.end].filter(Boolean).join(' – ') || ''}</div>
          <div class="rc-exp-desc">${(e.desc || '').replace(/\n/g,'<br/>')}</div>
        </div>`).join('')
    : '<div class="rc-placeholder">Add experience in step 2 →</div>';

  const eduHTML = d.eduItems.length
    ? d.eduItems.map(e => `
        <div class="rc-edu-item">
          <div class="rc-edu-school">${e.school || '—'}</div>
          <div class="rc-edu-degree">${e.degree || ''}</div>
          <div class="rc-edu-year">${e.year || ''}${e.gpa ? ' · ' + e.gpa : ''}</div>
        </div>`).join('')
    : '<div class="rc-placeholder">Add education in step 3 →</div>';

  const skillsHTML = d.skillList.length
    ? d.skillList.map(s => `<span class="rc-skill-tag">${s}</span>`).join('')
    : '<span class="rc-placeholder">Add skills in step 3 →</span>';

  const contactLine = [d.email, d.phone, d.location, d.url].filter(Boolean).join(' · ');
  const summaryHTML = d.summary || '<span class="rc-placeholder">Add your summary in step 1 →</span>';

  if (tpl === 'classic') return `
    <div class="resume-classic">
      <div class="rc-header">
        <div class="rc-name">${d.name}</div>
        <div class="rc-title">${d.title || 'Job Title'}</div>
        <div class="rc-contacts">${contactLine || 'email · phone · location'}</div>
      </div>
      <div class="rc-body">
        ${d.summary ? `<div class="rc-section"><div class="rc-section-title">Summary</div><div class="rc-section-body">${summaryHTML}</div></div>` : ''}
        <div class="rc-section"><div class="rc-section-title">Experience</div>${expHTML}</div>
        <div class="rc-section"><div class="rc-section-title">Education</div>${eduHTML}</div>
        <div class="rc-section"><div class="rc-section-title">Skills</div><div class="rc-skills">${skillsHTML}</div></div>
      </div>
    </div>`;

  if (tpl === 'modern') return `
    <div class="resume-modern">
      <div class="rm-sidebar">
        <div class="rc-name">${d.name}</div>
        <div class="rc-title">${d.title || 'Job Title'}</div>
        <div class="rm-sb-section">
          <div class="rm-sb-title">Contact</div>
          <div class="rm-sb-body">${[d.email,d.phone,d.location].filter(Boolean).join('<br/>') || '—'}</div>
        </div>
        ${d.skillList.length ? `<div class="rm-sb-section">
          <div class="rm-sb-title">Skills</div>
          ${d.skillList.slice(0,6).map(s=>`<div class="rm-skill-bar"><div class="rm-skill-name">${s}</div><div class="rm-skill-track"><div class="rm-skill-fill" style="width:${60+Math.random()*35|0}%"></div></div></div>`).join('')}
        </div>` : ''}
      </div>
      <div class="rm-main">
        ${d.summary ? `<div class="rm-section"><div class="rm-section-title">Profile</div><div class="rc-section-body">${d.summary}</div></div>` : ''}
        <div class="rm-section"><div class="rm-section-title">Experience</div>${expHTML}</div>
        <div class="rm-section"><div class="rm-section-title">Education</div>${eduHTML}</div>
      </div>
    </div>`;

  if (tpl === 'minimal') return `
    <div class="resume-minimal">
      <div class="rmin-header">
        <div class="rmin-name">${d.name}</div>
        <div class="rmin-title">${d.title || 'Job Title'}</div>
        <div class="rmin-contacts">${[d.email,d.phone,d.location,d.url].filter(Boolean).join(' · ') || '—'}</div>
      </div>
      ${d.summary ? `<div class="rmin-section"><div class="rmin-section-title">About</div><div class="rmin-body">${d.summary}</div></div>` : ''}
      <div class="rmin-section"><div class="rmin-section-title">Experience</div>${expHTML}</div>
      <div class="rmin-section"><div class="rmin-section-title">Education</div>${eduHTML}</div>
      <div class="rmin-section"><div class="rmin-section-title">Skills</div><div class="rc-skills">${skillsHTML}</div></div>
    </div>`;

  if (tpl === 'creative') {
    const initials = d.name.split(' ').map(w=>w[0]||'').join('').toUpperCase().slice(0,2) || '?';
    return `
      <div class="resume-creative">
        <div class="rcr-header">
          <div class="rcr-avatar">${initials}</div>
          <div>
            <div class="rcr-name">${d.name}</div>
            <div class="rcr-title">${d.title || 'Job Title'}</div>
            <div style="font-size:9.5px;color:rgba(255,255,255,.4);margin-top:4px">${[d.email,d.phone,d.location].filter(Boolean).join(' · ') || ''}</div>
          </div>
        </div>
        <div class="rcr-body">
          <div>
            ${d.summary ? `<div class="rcr-section"><div class="rcr-section-title">Profile</div><div class="rcr-text">${d.summary}</div></div>` : ''}
            ${d.skillList.length ? `<div class="rcr-section"><div class="rcr-section-title">Skills</div><div>${d.skillList.map(s=>`<span class="rcr-skill-tag">${s}</span>`).join('')}</div></div>` : ''}
            <div class="rcr-section"><div class="rcr-section-title">Education</div><div class="rcr-text">${d.eduItems.map(e=>`<div style="margin-bottom:8px"><div style="font-weight:600;color:#fff">${e.school||'—'}</div><div>${e.degree||''}</div><div style="color:rgba(59,186,130,.6)">${e.year||''}</div></div>`).join('') || '<span style="opacity:.4">—</span>'}</div></div>
          </div>
          <div>
            <div class="rcr-section"><div class="rcr-section-title">Experience</div><div class="rcr-text">${d.expItems.map(e=>`<div style="margin-bottom:12px"><div style="font-weight:600;color:#fff;font-size:12px">${e.role||'—'}</div><div style="color:rgba(59,186,130,.7);font-size:10px">${e.company||''} ${e.start||''}${e.end?' – '+e.end:''}</div><div style="margin-top:4px">${(e.desc||'').replace(/\n/g,'<br/>')}</div></div>`).join('') || '<span style="opacity:.4">Add experience →</span>'}</div></div>
          </div>
        </div>
      </div>`;
  }
  return '';
}

// ── EXPORT ────────────────────────────────────────────────────
document.getElementById('exportPdfBtn').addEventListener('click', () => {
  toast('PDF export will be available when backend is connected ✦');
});
document.getElementById('exportJsonBtn').addEventListener('click', () => {
  const data = {
    name: (document.getElementById('bf-fname')?.value||'') + ' ' + (document.getElementById('bf-lname')?.value||''),
    title: document.getElementById('bf-title')?.value||'',
    template: selectedTemplate,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem('verdant_resume_draft', JSON.stringify(data));
  toast('Draft saved locally ✓');
});

// ── TOAST ─────────────────────────────────────────────────────
function toast(msg, type='') {
  const t = document.getElementById('rsToast');
  t.textContent = msg;
  t.className = 'rs-toast show' + (type ? ' ' + type : '');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 3200);
}

// ── INIT ──────────────────────────────────────────────────────
syncPreview();