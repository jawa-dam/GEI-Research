const OWNER = 'jawa-dam';
const REPO = 'GEI-Research';
const BRANCH = 'main';
const API = `https://api.github.com/repos/${OWNER}/${REPO}/contents/data`;
const CATEGORIES = ['chronology','civilizations','regions','texts','passages','cosmology','water','technology','linguistics','sources','evidence','comparisons','interpretations','hypotheses'];

const state = { records: [], filtered: [], activeView: 'explorer', edges: [], selectedId: null, graphZoom: 1, graphPanX: 0, graphPanY: 0 };
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
  state.edges = buildRelationships(state.records);
  populateFilters();
  applyFilters();
  $('status').textContent = `Canonical dataset connected · ${state.records.length} records · ${state.edges.length} relationships`;
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
  renderExplorer(); renderTimeline(); renderComparisons(); renderEpistemic(); renderGraph();
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
  return records.slice().sort((a,b) => parseStart(a.start) - parseStart(b.start));
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

// V1.0.7 relationship engine: derive edges only from explicit ID references in canonical records.
const ID_FIELD_PATTERN = /(?:^|_)(ids?)$/i;
const RELATIONSHIP_EXCLUDE = new Set(['id','_path','_url']);
function relationLabel(field) {
  const clean = field.replace(/_ids?$/i,'').replace(/_/g,' ');
  const labels = { source:'source', evidence:'evidence', subject:'subject', region:'region', civilization:'civilization', text:'text', passage:'passage', chronology:'chronology', technology:'technology', water:'water', cosmology:'cosmology', linguistics:'linguistics', comparison:'comparison', interpretation:'interpretation', hypothesis:'hypothesis' };
  return labels[clean] || clean || 'reference';
}
function buildRelationships(records) {
  const byId = new Map(records.map(r => [r.id, r]));
  const edges = new Map();
  const add = (from, to, field) => {
    if (!from || !to || from === to || !byId.has(to)) return;
    const a = from < to ? from : to, b = from < to ? to : from;
    const key = `${a}::${b}`;
    if (!edges.has(key)) edges.set(key, { id:key, a, b, reasons:[] });
    const edge = edges.get(key);
    const reason = `${field}:${relationLabel(field)}`;
    if (!edge.reasons.includes(reason)) edge.reasons.push(reason);
  };
  records.forEach(r => {
    Object.entries(r).forEach(([field, value]) => {
      if (RELATIONSHIP_EXCLUDE.has(field) || !ID_FIELD_PATTERN.test(field)) return;
      const ids = Array.isArray(value) ? value : [value];
      ids.filter(v => typeof v === 'string').forEach(id => add(r.id, id, field));
    });
  });
  // Comparison subject lists are intentionally handled as explicit references even if a schema uses a non-suffixed field.
  records.forEach(r => {
    if (Array.isArray(r.subject_ids)) r.subject_ids.forEach(id => add(r.id, id, 'subject_ids'));
  });
  return [...edges.values()].sort((a,b) => a.a.localeCompare(b.a) || a.b.localeCompare(b.b));
}
function visibleGraphData() {
  const ids = new Set(state.filtered.map(r => r.id));
  const nodes = state.filtered.slice();
  const edges = state.edges.filter(e => ids.has(e.a) && ids.has(e.b));
  return { nodes, edges };
}
function graphDimensions() { const svg = $('researchGraph'); return { w: Math.max(svg.clientWidth || 700, 320), h: Math.max(svg.clientHeight || 520, 420) }; }
function graphLayout(nodes, edges) {
  const {w,h} = graphDimensions();
  const n = nodes.length;
  if (!n) return new Map();
  const degree = new Map(nodes.map(r => [r.id,0]));
  edges.forEach(e => { degree.set(e.a,(degree.get(e.a)||0)+1); degree.set(e.b,(degree.get(e.b)||0)+1); });
  const sorted = nodes.slice().sort((a,b) => (degree.get(b.id)||0)-(degree.get(a.id)||0));
  const cx=w/2, cy=h/2;
  const radius=Math.min(w,h)*0.36;
  const positions=new Map();
  sorted.forEach((r,i) => {
    if (i===0) positions.set(r.id,{x:cx,y:cy});
    else { const angle=(i-1)/Math.max(1,n-1)*Math.PI*2-Math.PI/2; const ring=radius*(0.62+0.38*((i-1)%3)/2); positions.set(r.id,{x:cx+Math.cos(angle)*ring,y:cy+Math.sin(angle)*ring}); }
  });
  return positions;
}
function renderGraph() {
  const svg=$('researchGraph'); if (!svg) return;
  const {nodes,edges}=visibleGraphData();
  $('graphCount').textContent=`${nodes.length} nodes · ${edges.length} relationships`;
  const pos=graphLayout(nodes,edges);
  const {w,h}=graphDimensions();
  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
  const edgeHtml=edges.map(e=>{const a=pos.get(e.a),b=pos.get(e.b); return `<line class="graph-edge" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" data-a="${esc(e.a)}" data-b="${esc(e.b)}"></line>`;}).join('');
  const nodeHtml=nodes.map(r=>{const p=pos.get(r.id); const selected=state.selectedId===r.id?' selected':''; const radius=(state.edges.filter(e=>e.a===r.id||e.b===r.id).length>3)?18:14; return `<g class="graph-node${selected}" data-id="${esc(r.id)}" transform="translate(${p.x} ${p.y})"><circle r="${radius}"></circle><text y="${radius+15}">${esc((r.title||r.id).slice(0,24))}</text><text class="node-type" y="${radius+28}">${esc(typeLabel(r.type))}</text></g>`;}).join('');
  svg.innerHTML=`<g transform="translate(${state.graphPanX} ${state.graphPanY}) scale(${state.graphZoom})"><g>${edgeHtml}</g><g>${nodeHtml}</g></g>`;
  svg.querySelectorAll('.graph-node').forEach(node=>node.addEventListener('click',()=>selectGraphNode(node.dataset.id)));
  updateRelationshipTable(edges);
  if (state.selectedId && nodes.some(n=>n.id===state.selectedId)) renderGraphInspector(state.selectedId); else renderGraphInspector(null);
}
function selectGraphNode(id){ state.selectedId=id; renderGraph(); }
function renderGraphInspector(id){
  if(!id){ $('graphInspectorTitle').textContent='Select a record'; $('graphInspectorText').textContent='Tap a node to see why it is connected to other canonical records.'; $('relationshipList').innerHTML=''; return; }
  const r=state.records.find(x=>x.id===id); if(!r) return;
  const related=state.edges.filter(e=>e.a===id||e.b===id).map(e=>{const other=e.a===id?e.b:e.a; return {record:state.records.find(x=>x.id===other),reasons:e.reasons};}).filter(x=>x.record);
  $('graphInspectorTitle').textContent=r.title||r.id;
  $('graphInspectorText').innerHTML=`<span class="chip type">${esc(typeLabel(r.type))}</span> <span class="muted">${esc(r.id)}</span>`;
  $('relationshipList').innerHTML=related.length?related.map(x=>`<button class="relationship-item" data-id="${esc(x.record.id)}"><strong>${esc(x.record.title||x.record.id)}</strong><span>${esc(x.reasons.join(' · '))}</span></button>`).join(''):'<p class="muted">No explicit references to another loaded record.</p>';
  $('relationshipList').querySelectorAll('[data-id]').forEach(el=>el.addEventListener('click',()=>selectGraphNode(el.dataset.id)));
}
function updateRelationshipTable(edges){
  const rows=edges.slice().sort((a,b)=>a.a.localeCompare(b.a)).map(e=>{const a=state.records.find(r=>r.id===e.a),b=state.records.find(r=>r.id===e.b); return `<tr><td><button data-id="${esc(e.a)}">${esc(a?.title||e.a)}</button><small>${esc(e.a)}</small></td><td>${esc(e.reasons.join(' · '))}</td><td><button data-id="${esc(e.b)}">${esc(b?.title||e.b)}</button><small>${esc(e.b)}</small></td></tr>`;}).join('');
  $('relationshipTable').innerHTML=rows?`<div class="table-scroll"><table><thead><tr><th>Record A</th><th>Explicit path</th><th>Record B</th></tr></thead><tbody>${rows}</tbody></table></div>`:'<div class="record-card"><p>No relationships exist among the currently filtered records.</p></div>';
  $('relationshipTable').querySelectorAll('[data-id]').forEach(el=>el.addEventListener('click',()=>{state.selectedId=el.dataset.id; switchView('graph'); renderGraph();}));
}
function resetGraph(){state.graphZoom=1;state.graphPanX=0;state.graphPanY=0;state.selectedId=null;renderGraph();}
function focusSelected(){if(!state.selectedId)return; const svg=$('researchGraph'); svg.scrollIntoView({behavior:'smooth',block:'center'}); renderGraphInspector(state.selectedId);}

function formatArray(value) { if (!Array.isArray(value) || !value.length) return ''; return `<ul>${value.map(x => `<li>${esc(typeof x === 'object' ? JSON.stringify(x) : x)}</li>`).join('')}</ul>`; }
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

function switchView(view) { state.activeView=view; document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===view)); document.querySelectorAll('.view').forEach(v=>v.classList.remove('active')); $(`${view}View`).classList.add('active'); if(view==='graph') setTimeout(renderGraph,0); }

document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>switchView(btn.dataset.view)));
$('search').addEventListener('input',applyFilters); $('typeFilter').addEventListener('change',applyFilters); $('statusFilter').addEventListener('change',applyFilters); $('confidenceFilter').addEventListener('change',applyFilters);
$('closeDialog').addEventListener('click',()=>$('recordDialog').close()); $('recordDialog').addEventListener('click',e=>{if(e.target===$('recordDialog'))$('recordDialog').close();});
$('graphReset').addEventListener('click',resetGraph); $('graphFocus').addEventListener('click',focusSelected);
window.addEventListener('resize',()=>{if(state.activeView==='graph')renderGraph();});
loadDataset().catch(error=>{console.error(error);$('status').textContent='Dataset connection failed';$('recordGrid').innerHTML=`<div class="record-card"><h3>Could not load the canonical dataset</h3><p>${esc(error.message)}. Check network access or GitHub availability.</p></div>`;});
