'use strict';

/*
  GoMo VS Planner v2.41
  - nouvelle bannière principale GoMo dorée avec mascotte
  - libellé portugais du total final clarifié en « Resultado final »
  - récapitulatif des ressources/actions prévues par le plan
  - bouton de copie du récapitulatif
  Requires app.js + upgrade-v2.30.js + upgrade-v2.31.js + upgrade-v2.32.js + upgrade-v2.40.js.
*/

(() => {
  const VERSION = '2.41.0';
  const HERO_SRC = './gomo-vs-planner.png?v=2.41.0';

  const TX = {
    fr:{title:'Récapitulatif du plan',sub:'Ressources et actions utilisées',empty:'Aucune ressource à utiliser pour le moment.',copy:'📋 Copier le récapitulatif',copied:'Récapitulatif copié.',copyFail:'Impossible de copier automatiquement.',qty:'Quantité',points:'Points prévus',total:'Total final',day:'Jour VS',version:'Version'},
    en:{title:'Plan summary',sub:'Resources and actions used',empty:'No resource to use for now.',copy:'📋 Copy summary',copied:'Summary copied.',copyFail:'Could not copy automatically.',qty:'Quantity',points:'Planned points',total:'Final total',day:'VS day',version:'Version'},
    de:{title:'Planübersicht',sub:'Verwendete Ressourcen und Aktionen',empty:'Derzeit werden keine Ressourcen benötigt.',copy:'📋 Übersicht kopieren',copied:'Übersicht kopiert.',copyFail:'Automatisches Kopieren nicht möglich.',qty:'Menge',points:'Geplante Punkte',total:'Endsumme',day:'VS-Tag',version:'Version'},
    ro:{title:'Rezumatul planului',sub:'Resurse și acțiuni folosite',empty:'Momentan nu este necesară nicio resursă.',copy:'📋 Copiază rezumatul',copied:'Rezumat copiat.',copyFail:'Copierea automată nu a reușit.',qty:'Cantitate',points:'Puncte planificate',total:'Total final',day:'Zi VS',version:'Versiunea'},
    uk:{title:'Підсумок плану',sub:'Використані ресурси та дії',empty:'Наразі ресурси не потрібні.',copy:'📋 Копіювати підсумок',copied:'Підсумок скопійовано.',copyFail:'Не вдалося скопіювати автоматично.',qty:'Кількість',points:'Заплановані очки',total:'Підсумковий результат',day:'День VS',version:'Версія'},
    ko:{title:'계획 요약',sub:'사용할 자원 및 행동',empty:'현재 사용할 자원이 없습니다.',copy:'📋 요약 복사',copied:'요약을 복사했습니다.',copyFail:'자동 복사에 실패했습니다.',qty:'수량',points:'예상 점수',total:'최종 합계',day:'VS 요일',version:'버전'},
    hr:{title:'Sažetak plana',sub:'Korišteni resursi i radnje',empty:'Trenutno nije potreban nijedan resurs.',copy:'📋 Kopiraj sažetak',copied:'Sažetak kopiran.',copyFail:'Automatsko kopiranje nije uspjelo.',qty:'Količina',points:'Planirani bodovi',total:'Konačni zbroj',day:'VS dan',version:'Verzija'},
    pt:{title:'Resumo do plano',sub:'Recursos e ações utilizados',empty:'Não é necessário utilizar nenhum recurso neste momento.',copy:'📋 Copiar resumo',copied:'Resumo copiado.',copyFail:'Não foi possível copiar automaticamente.',qty:'Quantidade',points:'Pontos previstos',total:'Resultado final',day:'Dia VS',version:'Versão'}
  };

  const language = () => {
    try{return String(state?.language || 'fr');}catch{return 'fr';}
  };
  const tx = () => TX[language()] || TX.fr;
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const number = value => {
    const n=Math.max(0,Number(value||0));
    try{return new Intl.NumberFormat(language()==='uk'?'uk-UA':language()==='pt'?'pt-PT':language()).format(Math.floor(n));}
    catch{return Math.floor(n).toLocaleString('fr-FR');}
  };

  function ensureStyles(){
    if(document.getElementById('gomo-v241-style'))return;
    const style=document.createElement('style');
    style.id='gomo-v241-style';
    style.textContent=`
      #gomoV241Recap{margin:16px 0;padding:16px;border:1px solid rgba(224,168,52,.38);border-radius:18px;background:linear-gradient(145deg,rgba(8,29,43,.96),rgba(7,20,32,.96));box-shadow:0 10px 28px rgba(0,0,0,.18)}
      .gomo-v241-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
      .gomo-v241-title{margin:0;color:#fff;font-size:1.05rem;font-weight:950;letter-spacing:.01em}
      .gomo-v241-sub{display:block;margin-top:3px;color:#f3c65a;font-size:.76rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
      .gomo-v241-list{display:grid;gap:8px}
      .gomo-v241-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 11px;border:1px solid rgba(255,255,255,.08);border-radius:13px;background:rgba(255,255,255,.025)}
      .gomo-v241-row strong{display:block;color:#f6fbff;font-size:.9rem;line-height:1.25}
      .gomo-v241-row small{display:block;margin-top:2px;color:#9fc2d7;font-size:.72rem;line-height:1.25}
      .gomo-v241-qty{color:#ffd668;font-size:.92rem;font-weight:950;text-align:right;white-space:nowrap}
      .gomo-v241-total{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px;padding:12px 13px;border-radius:13px;border:1px solid rgba(224,168,52,.38);background:rgba(224,168,52,.08)}
      .gomo-v241-total span{color:#c9d8e4;font-weight:800}.gomo-v241-total strong{color:#ffd668;font-size:1.05rem}
      #gomoV241Copy{width:100%;margin-top:11px;min-height:44px;border:1px solid rgba(224,168,52,.48);border-radius:13px;background:rgba(224,168,52,.10);color:#ffe29a;font-weight:900;cursor:pointer}
      #gomoV241Copy:active{transform:scale(.985)}
      .gomo-v241-empty{padding:11px 2px;color:#9fc2d7;line-height:1.45;font-size:.85rem}
      @media(max-width:520px){#gomoV241Recap{padding:14px}.gomo-v241-row{grid-template-columns:minmax(0,1fr) auto}.gomo-v241-head{display:block}.gomo-v241-sub{margin-top:5px}}
    `;
    document.head.appendChild(style);
  }

  function updateHero(){
    document.querySelectorAll('img[src*="gomo-vs-planner.png"]').forEach(img=>{
      const current=img.getAttribute('src')||'';
      if(!current.includes('v=2.41.0'))img.setAttribute('src',HERO_SRC);
      img.alt='GoMo VS Planner';
    });
  }

  function itemForStep(step){
    try{
      const items=day()?.items||[];
      return items.find(i=>String(i.stockKey)===String(step.stockKey))
        || items.find(i=>String(i.id||'')===String(step.itemId||step.id||''))
        || null;
    }catch{return null;}
  }

  function stepLabel(step,item){
    if(item){try{return itemLabel(item);}catch{}}
    return step.label || step.name || step.itemLabel || step.stockKey || 'Ressource';
  }

  function stepUnit(step,item){
    if(item){try{return itemUnit(item)||'';}catch{}}
    return step.unit || '';
  }

  function stepPoints(step,item){
    const direct=['points','pointGain','pointsGain','score','gain','totalPoints'];
    for(const k of direct){const v=Number(step?.[k]);if(Number.isFinite(v)&&v>0)return Math.floor(v);}
    const qty=Math.max(0,Number(step?.qty||0));
    if(item&&qty){
      for(const k of ['points','pointsPerUnit','pointValue','value']){
        const v=Number(item?.[k]);if(Number.isFinite(v)&&v>0)return Math.floor(v*qty);
      }
    }
    return 0;
  }

  function currentPlan(){
    try{return calculatePlan();}catch{return {steps:[],finalPoints:0};}
  }

  function rowsForPlan(plan){
    return (plan?.steps||[]).filter(s=>Number(s?.qty||0)>0).map(step=>{
      const item=itemForStep(step);
      return {label:stepLabel(step,item),unit:stepUnit(step,item),qty:Math.max(0,Number(step.qty||0)),points:stepPoints(step,item)};
    });
  }

  function dayName(){
    try{return day()?.name || day()?.label || String(state?.selectedDay ?? '');}catch{return '';}
  }

  function ensurePanel(){
    ensureStyles();
    let panel=document.getElementById('gomoV241Recap');
    if(panel)return panel;
    panel=document.createElement('section');
    panel.id='gomoV241Recap';
    panel.innerHTML=`<div class="gomo-v241-head"><div><h3 class="gomo-v241-title" id="gomoV241Title"></h3><span class="gomo-v241-sub" id="gomoV241Sub"></span></div></div><div id="gomoV241List" class="gomo-v241-list"></div><div id="gomoV241Total" class="gomo-v241-total"></div><button id="gomoV241Copy" type="button"></button>`;
    const anchor=document.getElementById('simplePlanList') || document.getElementById('simplePointsPanel');
    if(anchor?.parentNode)anchor.parentNode.insertBefore(panel,anchor.nextSibling);
    else document.querySelector('main')?.appendChild(panel);
    return panel;
  }

  function fixPortugueseFinalTotal(){
    if(language()!=='pt')return;
    const replacements=new Set(['total final','total previsto','total planeado','total planejado']);
    document.querySelectorAll('span,label,p,small,strong,b,h1,h2,h3,h4').forEach(el=>{
      if(el.children.length)return;
      const normalized=(el.textContent||'').trim().toLocaleLowerCase('pt-PT');
      if(replacements.has(normalized))el.textContent=TX.pt.total;
    });
    const metric=document.querySelector('#gomoV231Metrics article:nth-child(3) span');
    if(metric && /total/i.test(metric.textContent||''))metric.textContent=TX.pt.total;
  }

  function renderRecap(){
    const panel=ensurePanel();if(!panel)return;
    const t=tx(),plan=currentPlan(),rows=rowsForPlan(plan);
    const title=document.getElementById('gomoV241Title'),sub=document.getElementById('gomoV241Sub'),list=document.getElementById('gomoV241List'),total=document.getElementById('gomoV241Total'),copy=document.getElementById('gomoV241Copy');
    if(title)title.textContent=t.title;
    if(sub)sub.textContent=t.sub;
    if(list){
      list.innerHTML=rows.length?rows.map(r=>`<article class="gomo-v241-row"><div><strong>${esc(r.label)}</strong><small>${r.points?`${esc(t.points)} : ${esc(number(r.points))}`:''}</small></div><div class="gomo-v241-qty">${esc(number(r.qty))}${r.unit?` <small>${esc(r.unit)}</small>`:''}</div></article>`).join(''):`<div class="gomo-v241-empty">${esc(t.empty)}</div>`;
    }
    if(total)total.innerHTML=`<span>${esc(t.total)}</span><strong>${esc(number(plan?.finalPoints||0))}</strong>`;
    if(copy){copy.textContent=t.copy;copy.disabled=!rows.length;copy.style.opacity=rows.length?'1':'.55';}
    panel.dataset.copyText=buildCopyText(plan,rows);
  }

  function buildCopyText(plan,rows){
    const t=tx(),lines=[`GoMo VS Planner — ${t.title}`];
    const dn=dayName();if(dn)lines.push(`${t.day} : ${dn}`);
    lines.push('');
    if(rows.length){
      rows.forEach(r=>{
        let line=`• ${r.label} : ${number(r.qty)}${r.unit?` ${r.unit}`:''}`;
        if(r.points)line+=` — ${number(r.points)} ${t.points.toLocaleLowerCase()}`;
        lines.push(line);
      });
    }else lines.push(t.empty);
    lines.push('',`${t.total} : ${number(plan?.finalPoints||0)}`);
    return lines.join('\n');
  }

  async function copyText(text){
    try{
      if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);return true;}
    }catch{}
    try{
      const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();return ok;
    }catch{return false;}
  }

  function updateVersion(){
    const old=document.getElementById('gomoV240Version');
    if(old)old.textContent=`${tx().version} ${VERSION}`;
  }

  function refreshV241(){
    try{updateHero();renderRecap();fixPortugueseFinalTotal();updateVersion();}catch(err){console.error('GoMo v2.41 refresh',err);}
  }

  let timer=0;
  function schedule(delay=80){clearTimeout(timer);timer=setTimeout(refreshV241,delay);}

  document.addEventListener('click',async e=>{
    const b=e.target.closest?.('#gomoV241Copy');if(!b)return;
    e.preventDefault();
    const ok=await copyText(document.getElementById('gomoV241Recap')?.dataset.copyText||'');
    try{showToast(ok?tx().copied:tx().copyFail);}catch{}
    if(!ok)alert(tx().copyFail);
  });

  // Re-run after every main render so translations, totals and recap stay synchronized.
  if(typeof renderAll==='function'){
    const previousRenderAll=renderAll;
    renderAll=function(){const result=previousRenderAll.apply(this,arguments);schedule(35);return result;};
  }
  if(typeof renderSimplePoints==='function'){
    const previousRenderSimplePoints=renderSimplePoints;
    renderSimplePoints=function(){const result=previousRenderSimplePoints.apply(this,arguments);schedule(35);return result;};
  }
  if(typeof renderUltraPlanList==='function'){
    const previousRenderUltraPlanList=renderUltraPlanList;
    renderUltraPlanList=function(){const result=previousRenderUltraPlanList.apply(this,arguments);schedule(35);return result;};
  }

  document.addEventListener('change',()=>schedule(90));
  document.addEventListener('input',()=>schedule(130));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(60);});
  window.addEventListener('focus',()=>schedule(60));

  const start=()=>schedule(120);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
