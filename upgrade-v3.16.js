'use strict';

/* GoMo VS Planner v3.16 — moteur objectif du jour, couche sûre au-dessus du guide v3.15. */
(() => {
  const VERSION='3.16.0', KEY='gomo_vs_planner_v316', V315_KEY='gomo_vs_planner_v315';
  const MIN=7_200_000, NORMAL_MARGIN=100_000, DEFAULT_PUSH=10_000_000;
  const TXT={
    fr:{mode:'Mode du jour',economy:'Économie',normal:'Normal',push:'Poussée',eDesc:'7,2 M · économiser au maximum',nDesc:'7,3 M · petite marge de sécurité',pDesc:'Objectif élevé · gros gains prioritaires',pushTarget:'Objectif Poussée',target:'Objectif du jour',plan:'Nouveau plan intelligent',already:'Déjà obtenu',potential:'Potentiel disponible',exact:'Utilise ceci, dans cet ordre :',keep:'À garder',keepHelp:'Le reste reste protégé pour plus tard.',estimated:'Total prévu',reached:'Objectif atteint : arrête-toi ici et garde le reste.',insufficient:'Stock insuffisant pour atteindre la cible.',noSpend:'Objectif déjà atteint. Ne dépense plus rien.',copy:'Copier le plan',copied:'Plan copié.',apply:'J’ai utilisé ce plan',confirm:'Confirmer ? Les quantités indiquées seront retirées du stock.',applied:'Plan appliqué. Stock et score mis à jour.',editResources:'Modifier les ressources',editScore:'Modifier le score',done:'J’ai terminé',finished:'C’est terminé',finishedHelp:'Le stock restant est conservé.',actual:'Score VS réel',save:'Enregistrer le score',saved:'Score enregistré.',restart:'Recommencer le guide',points:'pts',stockAfter:'reste'},
    en:{mode:'Daily mode',economy:'Economy',normal:'Normal',push:'Push',eDesc:'7.2M · save as much as possible',nDesc:'7.3M · small safety margin',pDesc:'Higher target · prioritise large gains',pushTarget:'Push target',target:'Daily target',plan:'New smart plan',already:'Already earned',potential:'Available potential',exact:'Use this, in this order:',keep:'Keep',keepHelp:'The rest stays protected for later.',estimated:'Estimated total',reached:'Target reached: stop here and keep the rest.',insufficient:'Not enough stock to reach the target.',noSpend:'Target already reached. Spend nothing else.',copy:'Copy plan',copied:'Plan copied.',apply:'I used this plan',confirm:'Confirm? Listed quantities will be removed from stock.',applied:'Plan applied. Stock and score updated.',editResources:'Edit resources',editScore:'Edit score',done:'I am finished',finished:'Done',finishedHelp:'Remaining stock is kept.',actual:'Real VS score',save:'Save score',saved:'Score saved.',restart:'Restart guide',points:'pts',stockAfter:'left'},
    de:{mode:'Tagesmodus',economy:'Sparen',normal:'Normal',push:'Push',eDesc:'7,2 Mio. · maximal sparen',nDesc:'7,3 Mio. · kleine Sicherheitsmarge',pDesc:'Höheres Ziel · große Gewinne zuerst',pushTarget:'Push-Ziel',target:'Tagesziel',plan:'Neuer intelligenter Plan',already:'Bereits erreicht',potential:'Verfügbares Potenzial',exact:'Nutze dies in dieser Reihenfolge:',keep:'Aufheben',keepHelp:'Der Rest bleibt für später geschützt.',estimated:'Geplante Summe',reached:'Ziel erreicht: hier stoppen und den Rest behalten.',insufficient:'Bestand reicht nicht für das Ziel.',noSpend:'Ziel bereits erreicht. Nichts mehr ausgeben.',copy:'Plan kopieren',copied:'Plan kopiert.',apply:'Plan verwendet',confirm:'Bestätigen? Die Mengen werden vom Bestand abgezogen.',applied:'Plan angewendet. Bestand und Punkte aktualisiert.',editResources:'Ressourcen ändern',editScore:'Punkte ändern',done:'Fertig',finished:'Fertig',finishedHelp:'Der Restbestand bleibt erhalten.',actual:'Echte VS-Punkte',save:'Punkte speichern',saved:'Gespeichert.',restart:'Guide neu starten',points:'Pkt.',stockAfter:'übrig'}
  };
  TXT.ro={...TXT.en,mode:'Modul zilei',economy:'Economie',push:'Forțare',plan:'Plan inteligent',keep:'Păstrează',apply:'Am folosit planul'};
  TXT.uk={...TXT.en,mode:'Режим дня',economy:'Економія',normal:'Звичайний',push:'Ривок',plan:'Розумний план',keep:'Зберегти',apply:'Я використав план'};
  TXT.ko={...TXT.en,mode:'오늘 모드',economy:'절약',normal:'일반',push:'푸시',plan:'스마트 계획',keep:'보관',apply:'계획 사용 완료'};
  TXT.hr={...TXT.en,mode:'Dnevni način',economy:'Štednja',normal:'Normalno',push:'Pritisak',plan:'Pametni plan',keep:'Sačuvaj',apply:'Iskoristio sam plan'};
  TXT.pt={...TXT.en,mode:'Modo do dia',economy:'Economia',normal:'Normal',push:'Impulso',plan:'Plano inteligente',keep:'Guardar',apply:'Usei este plano'};

  let ui=load();
  let observer=null;

  function load(){try{return Object.assign({mode:'normal',pushTarget:DEFAULT_PUSH,finished:false},JSON.parse(localStorage.getItem(KEY)||'{}'));}catch{return{mode:'normal',pushTarget:DEFAULT_PUSH,finished:false};}}
  function saveUi(){try{localStorage.setItem(KEY,JSON.stringify(ui));}catch{}}
  function lang(){return (typeof state!=='undefined'&&state.language)||'fr';}
  function tr(k){return (TXT[lang()]||TXT.en)[k]??TXT.fr[k]??k;}
  function esc(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function num(n){try{return new Intl.NumberFormat((typeof LOCALES==='object'&&LOCALES[lang()])||'fr-FR',{maximumFractionDigits:0}).format(Number(n)||0);}catch{return String(Math.round(Number(n)||0));}}
  function compact(n){const v=Number(n)||0;if(Math.abs(v)>=1e9)return`${(v/1e9).toFixed(2).replace(/\.00$/,'')} B`;if(Math.abs(v)>=1e6)return`${(v/1e6).toFixed(2).replace(/\.00$/,'')} M`;if(Math.abs(v)>=1e3)return`${(v/1e3).toFixed(1).replace(/\.0$/,'')} k`;return num(v);}
  function currentDay(){try{return day();}catch{return DAYS.find(d=>Number(d.id)===Number(state.selectedDay))||DAYS[0];}}
  function label(i){try{return itemLabel(i);}catch{return i?.labelKey||i?.stockKey||'';}}
  function unit(i){try{return itemUnit(i);}catch{return i?.unitKey||'';}}
  function stock(i){try{return Math.max(0,Number(getStock(i)||0));}catch{return Math.max(0,Number(state.inventory?.[i.stockKey]||0));}}
  function reserve(i){try{return Math.max(0,Number(getReserve(i)||0));}catch{return 0;}}
  function ppu(i){try{return Math.max(0,Number(effectivePoints(currentDay().id,i)||0));}catch{return Math.max(0,Number(i.points)||0);}}
  function action(i){const a=new Set(['radarTasks','urTrucks','legendTasks','buildingPower','techPower','survivorRecruit','trainedTroops','rivalKilled','otherKilled','lostTroops','staminaUsed','foodHarvest','ironHarvest','coinHarvest','packDiamonds','skillChipPoints']);return a.has(i?.labelKey)||/^packDiamondsD/.test(String(i?.stockKey||''));}
  function available(i){const n=Math.max(0,stock(i)-reserve(i));return i?.dailyMax==null?n:Math.min(n,Number(i.dailyMax)||0);}
  function baseTarget(){return MIN;}
  function target(){if(ui.mode==='economy')return baseTarget();if(ui.mode==='push')return Math.max(baseTarget(),Number(ui.pushTarget)||DEFAULT_PUSH);return baseTarget()+NORMAL_MARGIN;}
  function strategy(){return ui.mode==='economy'?'economy':ui.mode==='push'?'score':'prudent';}
  function modeName(){return tr(ui.mode==='economy'?'economy':ui.mode==='push'?'push':'normal');}
  function formatQty(q,i){if(i?.speedup){const m=Math.round(q),d=Math.floor(m/1440),h=Math.floor((m%1440)/60),r=m%60,a=[];if(d)a.push(`${d}j`);if(h)a.push(`${h}h`);if(r)a.push(`${r}min`);return a.join(' ')||'0min';}if(i?.unitKey==='exp')return`${compact(q)} EXP`;return`${num(q)} ${unit(i)}`.trim();}

  function smartPlan(){
    const p=state.profile||{}, old={target:p.target,margin:p.margin,strategy:p.strategy,economyWeek:p.economyWeek};
    const k=String(state.selectedDay), oldAdj=state.planAdjustments?.[k];
    try{
      p.target=target();p.margin=0;p.strategy=strategy();p.economyWeek=false;
      if(!state.planAdjustments)state.planAdjustments={};state.planAdjustments[k]={fixed:{},excluded:{}};
      const out=calculatePlan();
      out.smartPotential=(currentDay().items||[]).filter(i=>!action(i)).reduce((s,i)=>s+available(i)*ppu(i),0);
      return out;
    } finally {
      p.target=old.target;p.margin=old.margin;p.strategy=old.strategy;p.economyWeek=old.economyWeek;
      if(oldAdj===undefined)delete state.planAdjustments[k];else state.planAdjustments[k]=oldAdj;
    }
  }

  function css(){if(document.getElementById('gomo-v316-layer-style'))return;const s=document.createElement('style');s.id='gomo-v316-layer-style';s.textContent=`
    .v316-mode-panel,.v316-smart-plan,.v316-done{margin:14px 0;padding:14px;border:1px solid rgba(94,209,255,.34);border-radius:20px;background:rgba(8,37,58,.94)}
    .v316-mode-panel h4,.v316-smart-plan h3,.v316-done h3{margin:0 0 8px;color:#fff}.v316-mode-panel p,.v316-smart-plan p,.v316-done p{margin:0;color:#b9dbea;font-size:.86rem}
    .v316-modes{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:10px}.v316-mode{border:1px solid rgba(103,198,236,.32);border-radius:14px;background:#071f31;color:#dff7ff;padding:10px 6px;font:inherit;font-weight:900}.v316-mode.active{border-color:#5ed1ff;background:#0d3550;color:#fff}.v316-mode small{display:block;margin-top:3px;color:#88b9ce;font-size:.65rem;font-weight:700}
    .v316-push{display:grid;grid-template-columns:1fr 135px;gap:8px;align-items:center;margin-top:9px}.v316-push label{font-size:.76rem;font-weight:900;color:#bde6f8}.v316-push input{width:100%;border:1px solid rgba(103,198,236,.35);border-radius:12px;background:#061c2c;color:#fff;padding:9px;font:inherit;font-weight:900}
    .v316-target{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;margin-top:10px;padding:10px;border-radius:13px;background:rgba(255,211,106,.08)}.v316-target span{color:#9bc8da;font-size:.75rem;font-weight:800}.v316-target strong{color:#ffd36a;font-size:1.1rem}
    .v315-card.v316-plan-screen>:not(.v315-progress):not(.v316-mode-panel):not(.v316-smart-plan):not(.v316-done):not(.v315-advanced):not(.v315-version){display:none!important}
    .v316-stat{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:end;margin-top:8px;padding:11px;border-radius:14px;background:#061f31}.v316-stat span{font-size:.74rem;color:#93c4d8;font-weight:800}.v316-stat strong{color:#fff;font-size:1.1rem}.v316-stat.gold strong{color:#ffd36a}
    .v316-steps{display:grid;gap:8px;margin-top:10px;counter-reset:v316}.v316-step{counter-increment:v316;display:grid;grid-template-columns:30px 1fr auto;gap:8px;align-items:center;padding:10px;border-radius:14px;background:#061f31}.v316-step:before{content:counter(v316);display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#27a7df;color:#fff;font-weight:900}.v316-step strong{display:block;color:#fff}.v316-step small{display:block;color:#8ebcd0;margin-top:2px}.v316-gain{color:#83ddff;font-weight:900;white-space:nowrap}
    .v316-keep{margin-top:10px;padding:11px;border-radius:14px;background:rgba(55,191,122,.10);border:1px solid rgba(92,222,153,.22)}.v316-keep ul{margin:7px 0 0;padding-left:18px;color:#b9ebce;font-size:.83rem}.v316-keep li{margin:4px 0}
    .v316-status{margin-top:10px;padding:11px;border-radius:14px;font-weight:900;font-size:.86rem}.v316-ok{background:rgba(55,191,122,.13);color:#9bf0bf}.v316-warn{background:rgba(255,173,65,.11);color:#ffd08d}
    .v316-actions{display:grid;gap:8px;margin-top:12px}.v316-actions.two{grid-template-columns:1fr 1fr}.v316-actions button{border:0;border-radius:14px;min-height:48px;padding:10px;font:inherit;font-weight:900}.v316-primary{background:#26a7df;color:#fff}.v316-secondary{background:#0c2b40;color:#d8f3ff;border:1px solid rgba(93,201,244,.32)!important}.v316-ghost{background:transparent;color:#9dddf8;border:1px solid rgba(93,201,244,.22)!important}
    .v316-done{text-align:center}.v316-done input{width:100%;margin-top:10px;border:1px solid rgba(103,198,236,.35);border-radius:14px;background:#061c2c;color:#fff;padding:12px;font:inherit;font-size:1.2rem;font-weight:900;text-align:center}
    @media(max-width:520px){.v316-modes{grid-template-columns:1fr}.v316-push{grid-template-columns:1fr}.v316-step{grid-template-columns:28px 1fr}.v316-gain{grid-column:2}.v316-actions.two{grid-template-columns:1fr}}
  `;document.head.appendChild(s);}

  function modePanel(){
    const base=baseTarget(), t=target();
    return `<section class="v316-mode-panel"><h4>⚙️ ${esc(tr('mode'))}</h4><div class="v316-modes">
      <button class="v316-mode ${ui.mode==='economy'?'active':''}" data-v316-mode="economy" type="button">🛡️ ${esc(tr('economy'))}<small>${esc(tr('eDesc'))}</small></button>
      <button class="v316-mode ${ui.mode==='normal'?'active':''}" data-v316-mode="normal" type="button">⚖️ ${esc(tr('normal'))}<small>${esc(tr('nDesc'))}</small></button>
      <button class="v316-mode ${ui.mode==='push'?'active':''}" data-v316-mode="push" type="button">🚀 ${esc(tr('push'))}<small>${esc(tr('pDesc'))}</small></button>
    </div>${ui.mode==='push'?`<div class="v316-push"><label>${esc(tr('pushTarget'))}</label><input id="v316PushInput" type="number" inputmode="numeric" min="${base}" step="100000" value="${Math.max(base,Number(ui.pushTarget)||DEFAULT_PUSH)}"></div>`:''}
    <div class="v316-target"><span>${esc(tr('target'))} · ${esc(modeName())}</span><strong>${compact(t)}</strong></div></section>`;
  }

  function stepItem(s){return(currentDay().items||[]).find(i=>i.id===s.itemId)||(DAYS.flatMap(d=>d.items||[]).find(i=>i.stockKey===s.stockKey));}
  function keepItems(plan){const used=new Map();for(const s of plan.steps||[])used.set(s.stockKey,(used.get(s.stockKey)||0)+Number(s.qty||0));const map=new Map();for(const i of currentDay().items||[]){if(action(i)||map.has(i.stockKey))continue;const left=Math.max(0,stock(i)-(used.get(i.stockKey)||0));if(left>0)map.set(i.stockKey,{i,left,importance:(Number(i.scarcity)||0)*10+(Number(i.eco)||0)});}return[...map.values()].sort((a,b)=>b.importance-a.importance).slice(0,5);}

  function planPanel(){
    const p=smartPlan(), steps=(p.steps||[]).map(s=>{const i=stepItem(s);return`<div class="v316-step"><span><strong>${esc(label(i))}</strong><small>${esc(formatQty(s.qty,i))} · ${esc(tr('stockAfter'))}: ${esc(formatQty(Math.max(0,Number(s.remainingStock)||0),i))}</small></span><span class="v316-gain">+${compact(s.points)}</span></div>`;}).join('');
    const keep=keepItems(p), keepHtml=keep.length?`<div class="v316-keep"><strong>🛡️ ${esc(tr('keep'))}</strong><p>${esc(tr('keepHelp'))}</p><ul>${keep.map(x=>`<li>${esc(label(x.i))} — ${esc(formatQty(x.left,x.i))}</li>`).join('')}</ul></div>`:'';
    const status=p.current>=p.goal?`<div class="v316-status v316-ok">${esc(tr('noSpend'))}</div>`:p.reached?`<div class="v316-status v316-ok">${esc(tr('reached'))}</div>`:`<div class="v316-status v316-warn">${esc(tr('insufficient'))} ${compact(p.missing)}</div>`;
    return `<section class="v316-smart-plan"><h3>🎯 ${esc(tr('plan'))}</h3><div class="v316-stat"><span>${esc(tr('already'))}</span><strong>${compact(p.current)}</strong></div><div class="v316-stat gold"><span>${esc(tr('target'))}</span><strong>${compact(p.goal)}</strong></div><div class="v316-stat"><span>${esc(tr('potential'))}</span><strong>${compact(p.smartPotential)}</strong></div>${steps?`<h3 style="margin-top:14px">${esc(tr('exact'))}</h3><div class="v316-steps">${steps}</div>`:''}<div class="v316-stat gold"><span>${esc(tr('estimated'))}</span><strong>${compact(p.finalPoints)}</strong></div>${keepHtml}${status}<div class="v316-actions">${p.steps?.length?`<button class="v316-secondary" id="v316Copy" type="button">📋 ${esc(tr('copy'))}</button>`:''}${p.reached&&p.steps?.length?`<button class="v316-primary" id="v316Apply" type="button">${esc(tr('apply'))}</button>`:p.reached?`<button class="v316-primary" id="v316Finish" type="button">${esc(tr('done'))}</button>`:''}</div><div class="v316-actions two"><button class="v316-ghost" id="v316EditResources" type="button">${esc(tr('editResources'))}</button><button class="v316-ghost" id="v316EditScore" type="button">${esc(tr('editScore'))}</button></div></section>`;
  }

  function donePanel(){const n=Math.max(0,Number(state.currentPoints?.[state.selectedDay]||0));return`<section class="v316-done"><div style="font-size:2.6rem">✅</div><h3>${esc(tr('finished'))}</h3><p>${esc(tr('finishedHelp'))}</p><label><input id="v316Actual" type="number" inputmode="numeric" min="0" value="${n||''}" aria-label="${esc(tr('actual'))}"></label><div class="v316-actions"><button class="v316-primary" id="v316SaveActual" type="button">${esc(tr('save'))}</button><button class="v316-secondary" id="v316Restart" type="button">${esc(tr('restart'))}</button></div></section>`;}

  function persist(){try{invalidatePlan();saveState();renderResources?.();renderSummary?.();}catch(e){console.warn('v3.16',e);}}
  function planText(){const p=smartPlan(), a=[`GoMo VS Planner · ${dayText(p.dayId)?.title||p.dayId}`,`${tr('mode')}: ${modeName()}`,`${tr('target')}: ${num(p.goal)} ${tr('points')}`,''];for(const [i,s] of (p.steps||[]).entries()){const it=stepItem(s);a.push(`${i+1}. ${label(it)} — ${formatQty(s.qty,it)} (+${num(s.points)} ${tr('points')})`);}a.push('',`${tr('estimated')}: ${num(p.finalPoints)} ${tr('points')}`);return a.join('\n');}

  function bind(root,card){
    root.querySelectorAll('[data-v316-mode]').forEach(b=>b.onclick=()=>{ui.mode=b.dataset.v316Mode;saveUi();enhance();});
    const push=root.querySelector('#v316PushInput');if(push)push.onchange=()=>{ui.pushTarget=Math.max(baseTarget(),Number(push.value)||DEFAULT_PUSH);saveUi();enhance();};
    const copy=root.querySelector('#v316Copy');if(copy)copy.onclick=async()=>{try{await navigator.clipboard.writeText(planText());}catch{}try{showToast(tr('copied'));}catch{}};
    const apply=root.querySelector('#v316Apply');if(apply)apply.onclick=()=>{const p=smartPlan();if(!confirm(tr('confirm')))return;for(const s of p.steps)state.inventory[s.stockKey]=Math.max(0,Number(state.inventory[s.stockKey]||0)-Number(s.qty||0));state.currentPoints[p.dayId]=Math.floor(p.finalPoints);try{syncSnapshotAfterPlan?.(p);}catch{}persist();ui.finished=true;saveUi();try{showToast(tr('applied'));}catch{}enhance();};
    const finish=root.querySelector('#v316Finish');if(finish)finish.onclick=()=>{ui.finished=true;saveUi();enhance();};
    const er=root.querySelector('#v316EditResources');if(er)er.onclick=()=>card.querySelector('[data-go="2"]')?.click();
    const es=root.querySelector('#v316EditScore');if(es)es.onclick=()=>card.querySelector('[data-go="3"]')?.click();
    const sa=root.querySelector('#v316SaveActual');if(sa)sa.onclick=()=>{const n=Math.max(0,Number(root.querySelector('#v316Actual')?.value)||0);state.currentPoints[state.selectedDay]=n;persist();try{showToast(tr('saved'));}catch{}};
    const rs=root.querySelector('#v316Restart');if(rs)rs.onclick=()=>{ui.finished=false;saveUi();localStorage.removeItem(V315_KEY);location.reload();};
  }

  function enhance(){
    css();const root=document.getElementById('gomoV315Guide');if(!root)return;
    if(observer)observer.disconnect();
    const card=root.querySelector('.v315-card');if(!card){if(observer)observer.observe(root,{childList:true,subtree:true});return;}
    root.querySelectorAll('.v316-mode-panel,.v316-smart-plan,.v316-done').forEach(n=>n.remove());card.classList.remove('v316-plan-screen');
    const progress=card.querySelector(':scope > .v315-progress');
    if(progress){progress.insertAdjacentHTML('afterend',modePanel());}
    const planScreen=!!card.querySelector('#v315Done')&&!card.querySelector('#v315ActualScore');
    if(planScreen){card.classList.add('v316-plan-screen');const mode=card.querySelector('.v316-mode-panel');mode?.insertAdjacentHTML('afterend',ui.finished?donePanel():planPanel());}
    bind(root,card);
    if(observer)observer.observe(root,{childList:true,subtree:true});
  }

  function start(){css();enhance();const root=document.getElementById('gomoV315Guide');if(root){observer=new MutationObserver(()=>queueMicrotask(enhance));observer.observe(root,{childList:true,subtree:true});}document.documentElement.setAttribute('data-gomo-v316-ready','1');console.info('GoMo VS Planner smart layer',VERSION);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else setTimeout(start,0);
})();
