const OWNER = 'jawa-dam';
const REPO = 'GEI-Research';
const BRANCH = 'main';
const API = `https://api.github.com/repos/${OWNER}/${REPO}/contents/data`;
const CATEGORIES = ['chronology','civilizations','regions','texts','passages','cosmology','water','technology','linguistics','sources','evidence','comparisons','interpretations','hypotheses'];

const state = { records: [], filtered: [], activeView: 'explorer' };
const $ = (id) => document.getElementById(id);

function esc(value='') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function titleCase(s='') { return s.replace(/[-_]/g,' ').replace(/\b\w/g, c => c.toUpperCase()); }
function typeLabel(type='') { return titleCase(type); }
function confidenceOf(r) { return r.confidence || r.confidence_level || r.confidence_code || ''; }
function evidenceOf(r) { return r.evidence_level || r.evidence || ''; }
function descriptionOf(r) { return r.description || r.summary || r.notes || 'No description recorded.'; }

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function loadDataset() {
  $('status').textContent = 'Loading canonical records…';
  const records = [];
  for (const category of CATEGORIES) {
    try {
      const listing = await fetchJson(`${API}/${category}?ref=${BRANCH}`);
      const files = listing.filter(item => item.type === 'file' && item.name.endsWith('.json'));
      const loaded = await Promise.all(files.map(async file => {
        try {
          const record = await fetchJson(file.download_url);
          return { ...record, _category: category, _path: file.path, _url: file.html_url };
        } catch (e) {
          console.warn('Skipped', file.path, e);
          return null;
        }
      }));
      records.push(...loaded.filter(Boolean));
    } catch (e) { console.warn(`Could not load ${category}`, e); }
  }
  state.records = records.sort((a,b) => String(a.id).localeCompare(String(b.id)));
  populateFilters();
  applyFilters();
  $('status').textContent = `Canonical dataset connected · ${state.records.length} records`;
}

function populateFilters() {
  const types = [...new Set(state.records.map(r => r.type).filter(Boolean))].sort();
  $('typeFilter').innerHTML = '<option value="all">All types</option>' + types.map(t => `<option value="${esc(t)}">${esc(typeLabel(t))}</option>`).join('');
  $('recordCount').textContent = state.records.length;
  $('typeCount').textContent = types.length;
  $('confidenceCount').textContent = state.records.filter(r => confidenceOf(r)).length;
}

function applyFilters() {
  const q = $('search').value.trim().toLowerCase();
  const type = $('typeFilter').value;
  const status = $('statusFilter').value;
  const conf = $('confidenceFilter').value;
  state.filtered = state.records.filter(r => {
    const haystack = JSON.stringify(r).toLowerCase();
    return (!q || haystack.includes(q)) && (type === 'all' || r.type === type) && (status === 'all' || r.status === status) && (conf === 'all' || confidenceOf(r) === conf);
  });
  $('resultCount').textContent = `${state.filtered.length} result${state.filtered.length === 1 ? '' : 's'}`;
  renderExplorer(); renderTimeline(); renderComparisons(); renderEpistemic();
}

function chips(r) {
  const out = [`<span class="chip type">${esc(typeLabel(r.type))}</span>`];
  if (r.status) out.push(`<span class="chip">${esc(r.status)}</span>`);
  if (confidenceOf(r)) out.push(`<span class="chip ${confidenceOf(r)==='C1'?'hyp':''}">${esc(confidenceOf(r))}</span>`);
  if (evidenceOf(r)) out.push(`<span class="chip">${esc(evidenceOf(r))}</span>`);
  return out.join('');
}

function renderExplorer() {
  const grid = $('recordGrid');
  if (!state.filtered.length) { grid.innerHTML = '<div class="record-card"><h3>No records found</h3><p>Try clearing a filter or using a broader search.</p></div>'; return; }
  grid.innerHTML = state.filtered.map(r => `<article class="record-card" data-id="${esc(r.id)}"><div class="chips">${chips(r)}</div><h3>${esc(r.title || r.id)}</h3><p>${esc(descriptionOf(r).slice(0,190))}</p><div class="muted" style="margin-top:10px">${esc(r.id)}</div></article>`).join('');
  grid.querySelectorAll('[data-id]').forEach(el => el.addEventListener('click', () => openRecord(el.dataset.id)));
}

function chronologySort(records) {
  return records.slice().sort((a,b) => {
    const av = parseStart(a.start), bv = parseStart(b.start);
    return av - bv;
  });
}
function parseStart(value) {
  if (!value) return 9999999999999;
  const n = Number(String(value).replace(/[^0-9-]/g,''));
  if (!Number.isNaN(n) && n) return n;
  const d = Date.parse(value); return Number.isNaN(d) ? 9999999999999 : d;
}
function renderTimeline() {
  const items = chronologySort(state.records.filter(r => r.type === 'chronology'));
  $('timeline').innerHTML = items.length ? items.map(r => `<div class="timeline-item"><div class="timeline-card" data-id="${esc(r.id)}"><div class="timeline-date">${esc(r.start || 'UNKNOWN')} → ${esc(r.end || 'UNKNOWN')}</div><h3>${esc(r.title)}</h3><p class="muted">${esc(descriptionOf(r).slice(0,220))}</p></div></div>`).join('') : '<div class="record-card"><p>No chronology records loaded.</p></div>';
  $('timeline').querySelectorAll('[data-id]').forEach(el => el.addEventListener('click', () => openRecord(el.dataset.id)));
}

function renderComparisons() {
  const items = state.records.filter(r => r.type === 'comparison');
  $('comparisonCount').textContent = `${items.length} comparison${items.length===1?'':'s'}`;
  $('comparisonGrid').innerHTML = items.length ? items.map(r => `<article class="comparison-card" data-id="${esc(r.id)}"><div class="chips">${chips(r)}</div><h3>${esc(r.title)}</h3><p>${esc(descriptionOf(r).slice(0,260))}</p><div class="muted" style="margin-top:10px">${Array.isArray(r.subject_ids) ? r.subject_ids.length : '—'} linked subjects</div></article>`).join('') : '<div class="record-card"><p>No comparison records loaded.</p></div>';
  $('comparisonGrid').querySelectorAll('[data-id]').forEach(el => el.addEventListener('click', () => openRecord(el.dataset.id)));
}

function renderEpistemic() {
  const types = ['source','evidence','comparison','interpretation','hypothesis'];
  $('epistemicCards').innerHTML = types.map(type => {
    const rs = state.records.filter(r => r.type === type);
    const tone = type === 'hypothesis' ? 'hyp' : type === 'interpretation' ? 'warn' : 'good';
    return `<div class="epistemic-card"><div class="chips"><span class="chip ${tone}">${esc(typeLabel(type))}</span></div><strong>${rs.length}</strong><p>canonical ${type}${rs.length===1?'':'s'} in the current dataset.</p></div>`;
  }).join('');
}

function formatArray(value) {
  if (!Array.isArray(value) || !value.length) return '';
  return `<ul>${value.map(x => `<li>${esc(typeof x === 'object' ? JSON.stringify(x) : x)}</li>`).join('')}</ul>`;
}
function openRecord(id) {
  const r = state.records.find(x => x.id === id); if (!r) return;
  const sections = [];
  if (r.description) sections.push(`<div class="detail-section"><h4>Description</h4><p>${esc(r.description)}</p></div>`);
  for (const key of ['start','end','date_precision','date_system','region_ids','civilization_ids','source_ids','evidence_ids','subject_ids','comparison_type','interpretation','claim','question','method','result','outcome','notes']) {
    if (r[key] !== undefined && r[key] !== null && r[key] !== '' && (!Array.isArray(r[key]) || r[key].length)) {
      const value = Array.isArray(r[key]) ? formatArray(r[key]) : `<p>${esc(r[key])}</p>`;
      sections.push(`<div class="detail-section"><h4>${esc(titleCase(key))}</h4>${value}</div>`);
    }
  }
  $('dialogContent').innerHTML = `<div class="eyebrow">${esc(typeLabel(r.type))}</div><h2 style="margin-top:6px">${esc(r.title || r.id)}</h2><div class="detail-meta">${chips(r)}<span class="chip">${esc(r.version || '')}</span></div>${sections.join('')}<pre class="json-preview">${esc(JSON.stringify(r,null,2))}</pre><p class="muted" style="margin-top:9px"><a style="color:var(--accent)" href="${esc(r._url || '#')}" target="_blank" rel="noopener">Open canonical record on GitHub ↗</a></p>`;
  $('recordDialog').showModal();
}

function switchView(view) {
  state.activeView = view;
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  $(`${view}View`).classList.add('active');
}

document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.view)));
$('search').addEventListener('input', applyFilters);
$('typeFilter').addEventListener('change', applyFilters);
$('statusFilter').addEventListener('change', applyFilters);
$('confidenceFilter').addEventListener('change', applyFilters);
$('closeDialog').addEventListener('click', () => $('recordDialog').close());
$('recordDialog').addEventListener('click', e => { if (e.target === $('recordDialog')) $('recordDialog').close(); });
loadDataset().catch(error => { console.error(error); $('status').textContent = 'Dataset connection failed'; $('recordGrid').innerHTML = `<div class="record-card"><h3>Could not load the canonical dataset</h3><p>${esc(error.message)}. Check network access or GitHub availability.</p></div>`; });
