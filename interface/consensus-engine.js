/* GEI Research V1.0.17 — Consensus & Disagreement Intelligence Engine */
(async function(){
  const root=document.getElementById('decisionsView'); if(!root) return;
  try{
    const r=await fetch('../data/consensus/CON-GEI-V1017-001.json');
    if(!r.ok) throw new Error('Consensus record unavailable');
    const c=await r.json();
    const section=document.createElement('section'); section.className='panel'; section.style.marginTop='18px';
    const dims=(c.consensus_dimensions||[]).map(d=>`<div class="consensus-card"><strong>${d.dimension.replaceAll('_',' ')}</strong><span class="chip">${d.status.replaceAll('_',' ')}</span><p>${d.basis}</p></div>`).join('');
    const dis=(c.disagreements||[]).length?c.disagreements.map(d=>`<div class="consensus-card"><strong>${d.category}</strong><span class="chip">${d.status}</span><p>${d.description}</p></div>`).join(''):'<p class="muted">No disagreements have been recorded yet. This means no independent comparisons are available—not that researchers agree.</p>';
    section.innerHTML=`<div class="section-heading"><div><span class="eyebrow">V1.0.17 · CONSENSUS & DISAGREEMENT</span><h2>Consensus Map</h2></div><span class="chip">${c.consensus_status.replaceAll('_',' ')}</span></div><div class="decision-banner"><strong>REPLICATION → OPERATOR RESULTS → BLIND COMPARISON → AGREEMENT / DISAGREEMENT → CONSENSUS MAP</strong><p>${c.epistemic_firewall}</p></div><h3>Agreement Dimensions</h3><div class="decision-grid">${dims}</div><h3 style="margin-top:20px">Disagreement Register</h3><div class="decision-grid">${dis}</div><div class="panel" style="margin-top:18px"><span class="eyebrow">CONSENSUS STATUS</span><p>${c.consensus_summary}</p></div>`;
    root.appendChild(section);
  }catch(e){console.warn('V1.0.17 consensus engine:',e.message)}
})();
