/* GEI Research V1.0.15 — Reproducibility & Protocol Engine */
(function(){
  const base=window.GEI_BASE||'';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  async function get(path){const r=await fetch(base+path,{cache:'no-store'});if(!r.ok)throw new Error(path+' '+r.status);return r.json();}
  async function load(){
    const host=document.querySelector('#decisionsView')||document.querySelector('main');
    if(!host||document.querySelector('#reproducibilityPanel'))return;
    const panel=document.createElement('section');panel.id='reproducibilityPanel';panel.className='panel';
    panel.innerHTML='<div class="section-heading"><div><span class="eyebrow">V1.0.15 · REPRODUCIBILITY</span><h2>Protocol & Reproduction Engine</h2></div><span class="chip">BASELINE</span></div><div id="reproBody" class="workspace-notes"><p class="muted">Loading canonical protocol…</p></div>';
    host.appendChild(panel);
    try{
      const [p,r]=await Promise.all([get('data/protocols/PRO-GEI-V1015-001.json'),get('data/reproducibility/REP-GEI-V1015-001.json')]);
      const steps=p.protocol_steps||[];const run=(r.reproduction_runs||[])[0]||{};
      document.querySelector('#reproBody').innerHTML=`<div class="firewall"><div class="flow"><span>PROTOCOL</span><b>→</b><span>INPUTS</span><b>→</b><span>EXECUTION</span><b>→</b><span>OBSERVATIONS</span><b>→</b><span>REPRODUCTION</span><b>→</b><span>ASSESSMENT</span></div><p>Reproducibility is repeatability of the recorded procedure—not proof of truth or authorial intent.</p></div><div class="workspace-notes"><div><span class="eyebrow">PROTOCOL OBJECTIVE</span><p>${esc(p.objective)}</p><span class="eyebrow">CRITERIA</span><ul>${(p.reproducibility_criteria||[]).map(c=>`<li><strong>${esc(c.name)}</strong> — ${esc(c.rule)}</li>`).join('')}</ul></div><div><span class="eyebrow">PROTOCOL STEPS</span><ol>${steps.map(s=>`<li><strong>${esc(s.action)}</strong><br><span class="muted">Expected: ${esc(s.expected_observation)}</span></li>`).join('')}</ol></div></div><div class="workspace-notes"><div><span class="eyebrow">CURRENT REPRODUCTION RUN</span><p><strong>${esc(run.run_id||'—')}</strong> · ${esc(run.status||'—')}</p><ul>${(run.step_results||[]).map(s=>`<li><strong>${esc(s.status)}</strong> — ${esc(s.observed)}</li>`).join('')}</ul></div><div><span class="eyebrow">ASSESSMENT</span><p>${esc(r.assessment)}</p><p><strong>Status:</strong> ${esc(r.reproducibility_status)} · <strong>Match rate:</strong> ${esc(r.match_rate)}</p><p class="muted">${esc(r.epistemic_firewall)}</p></div></div>`;
    }catch(e){document.querySelector('#reproBody').innerHTML='<p class="muted">Reproducibility data could not be loaded.</p>';console.error(e)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load);else load();
})();
