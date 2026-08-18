'use strict';
(() => {
  const VERSION='3.17.2',KEY='gomo_vs_arms_race_v317';
  const PHASES={
    none:{stock:[],labels:[]},city:{stock:['constructionSpeed','universalSpeed'],labels:['buildingPower']},
    unit:{stock:['trainingSpeed','universalSpeed'],labels:['trainedTroops']},tech:{stock:['researchSpeed','universalSpeed'],labels:['techPower']},
    drone:{stock:['droneData'],labels:['staminaUsed']},hero:{stock:['heroExp','eliteTickets'],labels:['eliteTickets']}
  };
  const FR={title:'Course aux armements',intro:'Combine le VS avec la bonne phase sans gaspiller tes ressources.',current:'Phase actuelle',next:'Phase suivante',badges:'Badges aujourd’hui',goal:'Objectif Course',g18:'18 · coffre Or',g36:'36 · maximum',choose:'— À choisir —',city:'Construction',unit:'Progression des unités',tech:'Recherche scientifique',drone:'Boost drone',hero:'Progression des héros',hint:'Choisis les phases affichées dans le jeu. Tu peux les modifier si une permutation de phase est utilisée.',rule:'Chaque phase peut donner 6 badges (1 + 2 + 3).',now:'✅ À faire maintenant : {items}. Ces actions comptent aussi pour le VS.',nextBest:'⏳ La phase suivante se combine mieux avec le VS : {items}. Garde-les si possible jusque-là.',need:'🎯 Il te manque {n} badge(s) pour ton objectif de {goal}.',gold:'🏆 18 badges atteints : coffre Or quotidien sécurisé.',max:'🏆 36 badges atteints : maximum quotidien.',noOverlap:'Aucune combinaison directe détectée avec le VS aujourd’hui : fais seulement les coffres utiles et protège tes ressources VS.',optimized:'⚔️ Le plan intelligent privilégie la phase actuelle tant que ton objectif de badges n’est pas atteint.',pureVs:'🛡️ Objectif badges atteint : le calcul revient en priorité à l’économie VS.'};
  const EN={title:'Arms Race',intro:'Combine VS with the right phase without wasting resources.',current:'Current phase',next:'Next phase',badges:'Badges today',goal:'Arms Race target',g18:'18 · Gold chest',g36:'36 · maximum',choose:'— Choose —',city:'City Building',unit:'Unit Progression',tech:'Tech Research',drone:'Drone Boost',hero:'Hero Advancement',hint:'Choose the phases shown in game. You can change them if a phase swap is used.',rule:'Each phase can give 6 badges (1 + 2 + 3).',now:'✅ Do now: {items}. These actions also count for VS.',nextBest:'⏳ The next phase combines better with VS: {items}. Save them if possible.',need:'🎯 You need {n} more badge(s) for your {goal} target.',gold:'🏆 18 badges reached: daily Gold chest secured.',max:'🏆 36 badges reached: daily maximum.',noOverlap:'No direct overlap detected with today’s VS: take only useful chests and protect VS resources.',optimized:'⚔️ The smart plan prioritises the current phase while your badge target is missing.',pureVs:'🛡️ Badge target reached: the plan returns to VS-saving priority.'};
  let cfg=load(),runtimeOptimized=false,renderTimer=0;
  function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return{current:PHASES[x.current]?x.current:'none',next:PHASES[x.next]?x.next:'none',badges:Math.max(0,Math.min(36,Number(x.badges)||0)),goal:Number(x.goal)===36?36:18};}catch{return{current:'none',next:'none',badges:0,goal:18};}}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(cfg));}catch{}}
  function tx(){try{return state?.language==='fr'?FR:EN;}catch{return FR;}}
  function tr(k,v={}){let s=tx()[k]||FR[k]||k;for(const[a,b]of Object.entries(v))s=String(s).replaceAll(`{${a}}`,String(b));return s;}
  function esc(s){return String(s??'').replace(/[&<>\'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]||c));}
  function currentDay(){try{return day();}catch{return null;}}
  function itemName(i){try{return itemLabel(i);}catch{return i?.labelKey||i?.stockKey||'';}}
  function match(i,p){const x=PHASES[p];return Boolean(x&&p!=='none'&&(x.stock.includes(String(i?.stockKey||''))||x.labels.includes(String(i?.labelKey||''))));}
  function overlap(p){const d=currentDay();if(!d||p==='none')return[];const seen=new Set();return(d.items||[]).filter(i=>match(i,p)&&!seen.has(i.stockKey)&&(seen.add(i.stockKey)||true));}
  function overlapText(p){return overlap(p).map(itemName).slice(0,4).join(', ');}
  function options(sel){return['none','city','unit','tech','drone','hero'].map(id=>`<option value="${id}" ${id===sel?'selected':''}>${esc(id==='none'?tr('choose'):tr(id))}</option>`).join('');}
  function advice(){
    const a=[];
    if(cfg.badges>=cfg.goal){
      a.push(`<div class="v317-ok">${esc(cfg.badges>=36?tr('max'):tr('gold'))}</div>`);
      a.push(`<div>${esc(tr('pureVs'))}</div>`);
      return a.join('');
    }
    const cur=overlapText(cfg.current),nxt=overlapText(cfg.next),miss=Math.max(0,cfg.goal-cfg.badges);
    a.push(`<div>${esc(tr('need',{n:miss,goal:cfg.goal}))}</div>`);
    if(cur)a.push(`<div class="v317-now">${esc(tr('now',{items:cur}))}</div>`);
    else if(nxt)a.push(`<div class="v317-wait">${esc(tr('nextBest',{items:nxt}))}</div>`);
    else if(cfg.current!=='none'||cfg.next!=='none')a.push(`<div>${esc(tr('noOverlap'))}</div>`);
    if(runtimeOptimized)a.push(`<div>${esc(tr('optimized'))}</div>`);
    return a.join('');
  }
  function style(){if(document.getElementById('gomo-v317-style'))return;const s=document.createElement('style');s.id='gomo-v317-style';s.textContent='#gomoV317Arms{width:min(760px,100%);margin:0 auto 12px;padding:14px;border:1px solid rgba(255,190,72,.42);border-radius:20px;background:linear-gradient(150deg,rgba(49,34,12,.96),rgba(13,31,45,.98));color:#fff}#gomoV317Arms[hidden]{display:none!important}.v317-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:10px}.v317-field{display:grid;gap:5px}.v317-field span{font-size:.72rem;color:#bdd8e5;font-weight:900}.v317-field select,.v317-field input{min-height:44px;border:1px solid rgba(255,203,99,.28);border-radius:12px;background:#071f31;color:#fff;padding:9px}.v317-advice{display:grid;gap:7px;margin-top:9px}.v317-advice>div{padding:8px 9px;border-radius:11px;background:rgba(255,255,255,.05);font-size:.78rem;font-weight:800}.v317-now{color:#a5f0c6}.v317-wait{color:#bdeaff}.v317-ok{color:#ffd777}@media(max-width:580px){.v317-grid{grid-template-columns:1fr}}';document.head.appendChild(s);}
  function panel(){style();let p=document.getElementById('gomoV317Arms');if(!p){p=document.createElement('section');p.id='gomoV317Arms';const main=document.querySelector('.app-shell main');main?.parentNode?.insertBefore(p,main);}return p;}
  function render(){const p=panel(),guide=document.getElementById('gomoV315Guide'),started=Boolean(guide?.querySelector('.v315-progress'));p.hidden=!started;if(!started)return;p.innerHTML=`<h3>⚔️ ${esc(tr('title'))}</h3><p>${esc(tr('intro'))}</p><div class="v317-grid"><label class="v317-field"><span>${esc(tr('current'))}</span><select id="v317Current">${options(cfg.current)}</select></label><label class="v317-field"><span>${esc(tr('next'))}</span><select id="v317Next">${options(cfg.next)}</select></label><label class="v317-field"><span>${esc(tr('badges'))}</span><input id="v317Badges" type="number" min="0" max="36" value="${cfg.badges}"></label><label class="v317-field"><span>${esc(tr('goal'))}</span><select id="v317Goal"><option value="18" ${cfg.goal===18?'selected':''}>${esc(tr('g18'))}</option><option value="36" ${cfg.goal===36?'selected':''}>${esc(tr('g36'))}</option></select></label></div><small>${esc(tr('hint'))}<br>${esc(tr('rule'))}</small><div class="v317-advice">${advice()}</div>`;bind(p);}
  function scheduleRender(delay=0){clearTimeout(renderTimer);renderTimer=setTimeout(render,delay);}
  function refreshPlan(){if(!document.querySelector('.v316-smart-plan'))return;document.querySelector('[data-v316-mode].active')?.click();}
  function bind(p){
    const cur=p.querySelector('#v317Current');if(cur)cur.onchange=e=>{cfg.current=e.target.value;runtimeOptimized=false;save();render();refreshPlan();};
    const nxt=p.querySelector('#v317Next');if(nxt)nxt.onchange=e=>{cfg.next=e.target.value;save();render();};
    const badges=p.querySelector('#v317Badges');if(badges)badges.onchange=e=>{cfg.badges=Math.max(0,Math.min(36,Number(e.target.value)||0));runtimeOptimized=false;save();render();refreshPlan();};
    const goal=p.querySelector('#v317Goal');if(goal)goal.onchange=e=>{cfg.goal=Number(e.target.value)===36?36:18;runtimeOptimized=false;save();render();refreshPlan();};
  }
  function wrapPlan(){if(window.__gomoV317PlanWrapped||typeof calculatePlan!=='function')return;const base=calculatePlan;calculatePlan=function(){const args=arguments,normal=()=>base.apply(this,args);runtimeOptimized=false;try{if(!document.body?.classList.contains('gomo-v315-simple')||cfg.current==='none'||cfg.badges>=cfg.goal)return normal();const d=currentDay();if(!d||!overlap(cfg.current).length)return normal();const k=String(state.selectedDay),old=state.planAdjustments?.[k];if(old&&(Object.keys(old.fixed||{}).length||Object.keys(old.excluded||{}).length))return normal();if(!state.planAdjustments)state.planAdjustments={};const excluded={};for(const i of d.items||[])if(!match(i,cfg.current))excluded[i.id]=true;state.planAdjustments[k]={fixed:{},excluded};let r;try{r=base.apply(this,args);}finally{if(old===undefined)delete state.planAdjustments[k];else state.planAdjustments[k]=old;}if(r?.reached){runtimeOptimized=true;scheduleRender(20);return r;}return normal();}catch{return normal();}};window.__gomoV317PlanWrapped=true;}
  function bindGuideEvents(){document.addEventListener('click',e=>{const b=e.target.closest?.('#v315Start,#v315DayOk,#v315ChangeDay,[data-go],[data-v316-mode]');if(b)scheduleRender(80);},true);document.addEventListener('change',e=>{if(e.target?.id==='v315Day'||e.target?.id==='v315Language')scheduleRender(80);},true);}
  window.GoMoArmsRace={version:VERSION,getConfig:()=>({...cfg}),matchesItem:match};
  function start(){wrapPlan();bindGuideEvents();render();document.documentElement.setAttribute('data-gomo-v317-ready','1');console.info('GoMo VS Planner Arms Race stable selectors',VERSION);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else setTimeout(start,0);
})();
