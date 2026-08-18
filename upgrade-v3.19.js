'use strict';

/* GoMo VS Planner v3.19 — pilotage adaptatif de la semaine VS.
   Couche de lecture seule au-dessus de v3.18.1 :
   - marge de projection
   - moyenne nécessaire sur les jours restants
   - objectif ajusté après un gros/petit score
   - conseil d'économie ou de rattrapage
*/
(() => {
  const VERSION='3.19.0';
  const UI_KEY='gomo_vs_planner_v316';
  const HIST_KEY='gomo_vs_planner_week_history_v3181';
  let timer=0;

  const T={
    fr:{margin:'Marge prévue',average:'Moyenne à viser',daysLeft:'Jours restants',perDay:'/ jour',ahead:'✅ Tu as de l’avance : tu peux viser environ {avg} par jour sur les {days} jours restants, soit {delta} de moins par jour que le mode {mode}.',behind:'⚠️ Pour rester sur la cible semaine, vise environ {avg} par jour sur les {days} jours restants, soit {delta} de plus par jour que le mode {mode}.',steady:'✅ Le rythme actuel est bon : vise environ {avg} par jour sur les {days} jours restants.',todayNeed:'Aujourd’hui, avec {current} déjà enregistré, il te reste environ {need} à faire pour atteindre la moyenne ajustée.',todayOk:'Aujourd’hui, tu as déjà atteint la moyenne ajustée. Le surplus aide les jours suivants.',incomplete:'ℹ️ Complète d’abord les jours passés manquants pour obtenir une moyenne ajustée fiable.',modeEconomy:'Économie',modeNormal:'Normal',modePush:'Poussée'},
    en:{margin:'Projected margin',average:'Target average',daysLeft:'Days left',perDay:'/ day',ahead:'✅ You are ahead: aim for about {avg} per day over the {days} remaining days, {delta} less per day than {mode} mode.',behind:'⚠️ To stay on the weekly target, aim for about {avg} per day over the {days} remaining days, {delta} more per day than {mode} mode.',steady:'✅ Your pace is good: aim for about {avg} per day over the {days} remaining days.',todayNeed:'Today, with {current} already recorded, about {need} remains to reach the adjusted average.',todayOk:'Today, you already reached the adjusted average. The surplus helps the following days.',incomplete:'ℹ️ Fill the missing past days first to get a reliable adjusted average.',modeEconomy:'Economy',modeNormal:'Normal',modePush:'Push'},
    de:{margin:'Geplante Reserve',average:'Nötiger Durchschnitt',daysLeft:'Verbleibende Tage',perDay:'/ Tag',ahead:'✅ Du liegst vorne: Etwa {avg} pro Tag an den verbleibenden {days} Tagen reichen, also {delta} weniger pro Tag als im Modus {mode}.',behind:'⚠️ Für das Wochenziel brauchst du etwa {avg} pro Tag an den verbleibenden {days} Tagen, also {delta} mehr pro Tag als im Modus {mode}.',steady:'✅ Dein Tempo passt: etwa {avg} pro Tag an den verbleibenden {days} Tagen.',todayNeed:'Heute sind bereits {current} erfasst; noch etwa {need} bis zum angepassten Durchschnitt.',todayOk:'Heute ist der angepasste Durchschnitt bereits erreicht. Der Überschuss hilft an den nächsten Tagen.',incomplete:'ℹ️ Ergänze zuerst die fehlenden vergangenen Tage für eine zuverlässige Berechnung.',modeEconomy:'Sparen',modeNormal:'Normal',modePush:'Push'},
    ro:{margin:'Marjă proiectată',average:'Media de vizat',daysLeft:'Zile rămase',perDay:'/ zi',ahead:'✅ Ești înainte: poți viza aproximativ {avg} pe zi în cele {days} zile rămase, cu {delta} mai puțin pe zi decât modul {mode}.',behind:'⚠️ Pentru ținta săptămânală, vizează aproximativ {avg} pe zi în cele {days} zile rămase, cu {delta} mai mult pe zi decât modul {mode}.',steady:'✅ Ritmul este bun: vizează aproximativ {avg} pe zi în cele {days} zile rămase.',todayNeed:'Astăzi ai deja {current}; mai sunt aproximativ {need} pentru media ajustată.',todayOk:'Astăzi ai atins deja media ajustată. Surplusul ajută zilele următoare.',incomplete:'ℹ️ Completează mai întâi zilele trecute lipsă pentru o medie ajustată fiabilă.',modeEconomy:'Economie',modeNormal:'Normal',modePush:'Forțare'},
    uk:{margin:'Прогнозований запас',average:'Потрібне середнє',daysLeft:'Днів залишилось',perDay:'/ день',ahead:'✅ Є запас: можна цілитись приблизно в {avg} на день протягом {days} днів, на {delta} менше за режим {mode}.',behind:'⚠️ Для тижневої цілі потрібно приблизно {avg} на день протягом {days} днів, на {delta} більше за режим {mode}.',steady:'✅ Темп добрий: приблизно {avg} на день протягом {days} днів.',todayNeed:'Сьогодні вже записано {current}; до скоригованого середнього лишається приблизно {need}.',todayOk:'Сьогодні скориговане середнє вже досягнуто. Надлишок допоможе наступним дням.',incomplete:'ℹ️ Спочатку заповни пропущені минулі дні для надійного розрахунку.',modeEconomy:'Економія',modeNormal:'Звичайний',modePush:'Ривок'},
    ko:{margin:'예상 여유',average:'필요 평균',daysLeft:'남은 일수',perDay:'/ 일',ahead:'✅ 여유가 있습니다: 남은 {days}일 동안 하루 약 {avg}를 목표로 하면 되며 {mode} 모드보다 하루 {delta} 적습니다.',behind:'⚠️ 주간 목표를 위해 남은 {days}일 동안 하루 약 {avg}가 필요하며 {mode} 모드보다 하루 {delta} 많습니다.',steady:'✅ 현재 속도가 좋습니다: 남은 {days}일 동안 하루 약 {avg}를 목표로 하세요.',todayNeed:'오늘 이미 {current}가 기록되어 있으며 조정 평균까지 약 {need} 남았습니다.',todayOk:'오늘은 조정 평균을 이미 달성했습니다. 초과분이 다음 날에 도움이 됩니다.',incomplete:'ℹ️ 정확한 조정 평균을 위해 먼저 누락된 지난 날짜를 입력하세요.',modeEconomy:'절약',modeNormal:'일반',modePush:'푸시'},
    hr:{margin:'Predviđena rezerva',average:'Potreban prosjek',daysLeft:'Preostali dani',perDay:'/ dan',ahead:'✅ Imaš prednost: ciljaj oko {avg} dnevno tijekom preostalih {days} dana, {delta} manje dnevno od načina {mode}.',behind:'⚠️ Za tjedni cilj treba oko {avg} dnevno tijekom preostalih {days} dana, {delta} više dnevno od načina {mode}.',steady:'✅ Tempo je dobar: ciljaj oko {avg} dnevno tijekom preostalih {days} dana.',todayNeed:'Danas je već zabilježeno {current}; preostaje oko {need} do prilagođenog prosjeka.',todayOk:'Danas je prilagođeni prosjek već ostvaren. Višak pomaže sljedećim danima.',incomplete:'ℹ️ Najprije dopuni nedostajuće prošle dane za pouzdan prilagođeni prosjek.',modeEconomy:'Štednja',modeNormal:'Normalno',modePush:'Pritisak'},
    pt:{margin:'Margem prevista',average:'Média a atingir',daysLeft:'Dias restantes',perDay:'/ dia',ahead:'✅ Estás adiantado: podes apontar para cerca de {avg} por dia nos {days} dias restantes, {delta} menos por dia do que o modo {mode}.',behind:'⚠️ Para a meta semanal, aponta para cerca de {avg} por dia nos {days} dias restantes, {delta} mais por dia do que o modo {mode}.',steady:'✅ O ritmo está bom: aponta para cerca de {avg} por dia nos {days} dias restantes.',todayNeed:'Hoje já tens {current} registado; faltam cerca de {need} para a média ajustada.',todayOk:'Hoje já atingiste a média ajustada. O excedente ajuda os dias seguintes.',incomplete:'ℹ️ Completa primeiro os dias anteriores em falta para obter uma média ajustada fiável.',modeEconomy:'Economia',modeNormal:'Normal',modePush:'Impulso'}
  };

  function lang(){try{return String(state?.language||'fr').split('-')[0];}catch{return'fr';}}
  function tx(){return T[lang()]||T.en;}
  function tr(k,vars={}){let s=tx()[k]??T.en[k]??k;for(const[a,b]of Object.entries(vars))s=String(s).replaceAll(`{${a}}`,String(b));return s;}
  function esc(s){return String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]||c));}
  function compact(n){const v=Math.max(0,Number(n)||0);if(v>=1e9)return`${(v/1e9).toFixed(2).replace(/\.00$/,'')} B`;if(v>=1e6)return`${(v/1e6).toFixed(2).replace(/\.00$/,'')} M`;if(v>=1e3)return`${(v/1e3).toFixed(1).replace(/\.0$/,'')} k`;return String(Math.round(v));}
  function signedCompact(n){const v=Number(n)||0;return`${v>=0?'+':'−'}${compact(Math.abs(v))}`;}
  function modeConfig(){let u={mode:'normal',pushTarget:10_000_000};try{u={...u,...JSON.parse(localStorage.getItem(UI_KEY)||'{}')};}catch{}const mode=['economy','normal','push'].includes(u.mode)?u.mode:'normal';const target=mode==='economy'?7_200_000:mode==='push'?Math.max(7_200_000,Number(u.pushTarget)||10_000_000):7_300_000;const name=mode==='economy'?tr('modeEconomy'):mode==='push'?tr('modePush'):tr('modeNormal');return{mode,target,name};}
  function todayId(){try{if(typeof automaticDay==='function')return Math.max(1,Math.min(6,Number(automaticDay())||1));}catch{}const d=new Date().getDay();return d===0?1:Math.max(1,Math.min(6,d));}
  function weekKey(){const d=new Date(),day=d.getDay()||7;d.setHours(12,0,0,0);d.setDate(d.getDate()-day+1);return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
  function history(){try{const h=JSON.parse(localStorage.getItem(HIST_KEY)||'{}');return h.week===weekKey()?h:{week:weekKey(),days:{}};}catch{return{week:weekKey(),days:{}};}}
  function scorePack(){const h=history(),s={},known={};for(let i=1;i<=6;i++){const live=Math.max(0,Number(state?.currentPoints?.[i]||0));if(live>0){s[i]=live;known[i]=true;}else if(Object.prototype.hasOwnProperty.call(h.days||{},String(i))){s[i]=Math.max(0,Number(h.days[i])||0);known[i]=true;}else{s[i]=0;known[i]=false;}}return{s,known};}

  function model(){
    const cfg=modeConfig(),today=todayId(),pack=scorePack(),s=pack.s,known=pack.known;
    const weekTarget=cfg.target*6,unknownPast=[];
    let pastTotal=0,totalKnown=0;
    for(let i=1;i<=6;i++){if(known[i])totalKnown+=s[i];if(i<today){if(known[i])pastTotal+=s[i];else unknownPast.push(i);}}
    const daysLeft=Math.max(1,7-today);
    const requiredLeft=Math.max(0,weekTarget-pastTotal);
    const average=requiredLeft/daysLeft;
    const current=known[today]?s[today]:0;
    const todayNeed=Math.max(0,average-current);
    let projected=0;
    for(let i=1;i<=6;i++){
      if(i<today){if(known[i])projected+=s[i];}
      else if(i===today)projected+=Math.max(current,cfg.target);
      else projected+=cfg.target;
    }
    const margin=projected-weekTarget;
    const delta=cfg.target-average;
    return{cfg,today,s,known,weekTarget,unknownPast,pastTotal,totalKnown,daysLeft,average,current,todayNeed,projected,margin,delta};
  }

  function style(){if(document.getElementById('gomo-v319-style'))return;const s=document.createElement('style');s.id='gomo-v319-style';s.textContent=`
    .v319-pilot{margin-top:9px;padding:10px;border-radius:14px;background:linear-gradient(145deg,rgba(11,47,68,.92),rgba(7,32,48,.96));border:1px solid rgba(118,203,255,.20)}
    .v319-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.v319-metric{padding:9px;border-radius:11px;background:rgba(255,255,255,.05)}.v319-metric span{display:block;color:#9fc9dc;font-size:.66rem;font-weight:800}.v319-metric strong{display:block;margin-top:3px;color:#fff;font-size:.95rem}.v319-metric.good strong{color:#9bf0bf}.v319-metric.warn strong{color:#ffd08d}
    .v319-advice{margin-top:8px;padding:9px 10px;border-radius:11px;background:rgba(55,191,122,.10);color:#a6efc3;font-size:.76rem;font-weight:800;line-height:1.38}.v319-advice.warn{background:rgba(255,173,65,.10);color:#ffd08d}.v319-advice.info{background:rgba(70,165,230,.10);color:#bdeaff}.v319-today{margin-top:7px;color:#bdeaff;font-size:.73rem;font-weight:750;line-height:1.35}
    @media(max-width:580px){.v319-grid{grid-template-columns:1fr}}
  `;document.head.appendChild(s);}

  function html(){
    const m=model();
    if(m.unknownPast.length)return`<div class="v319-pilot"><div class="v319-advice info">${esc(tr('incomplete'))}</div></div>`;
    const deltaAbs=Math.abs(m.delta),near=deltaAbs<50_000;
    let advice,cls='';
    if(near)advice=tr('steady',{avg:compact(m.average),days:m.daysLeft});
    else if(m.delta>0)advice=tr('ahead',{avg:compact(m.average),days:m.daysLeft,delta:compact(deltaAbs),mode:m.cfg.name});
    else{advice=tr('behind',{avg:compact(m.average),days:m.daysLeft,delta:compact(deltaAbs),mode:m.cfg.name});cls='warn';}
    const today=m.todayNeed>0?tr('todayNeed',{current:compact(m.current),need:compact(m.todayNeed)}):tr('todayOk');
    const marginClass=m.margin>=0?'good':'warn';
    return`<div class="v319-pilot"><div class="v319-grid"><div class="v319-metric ${marginClass}"><span>${esc(tr('margin'))}</span><strong>${esc(signedCompact(m.margin))}</strong></div><div class="v319-metric"><span>${esc(tr('average'))}</span><strong>${esc(compact(m.average))}${esc(tr('perDay'))}</strong></div><div class="v319-metric"><span>${esc(tr('daysLeft'))}</span><strong>${m.daysLeft}</strong></div></div><div class="v319-advice ${cls}">${esc(advice)}</div><div class="v319-today">${esc(today)}</div></div>`;
  }

  function render(){
    clearTimeout(timer);style();
    const week=document.getElementById('gomoV318Week');if(!week||week.hidden)return;
    const metrics=week.querySelector('.v318-metrics');if(!metrics)return;
    let pilot=week.querySelector('.v319-pilot');const markup=html();
    const tmp=document.createElement('div');tmp.innerHTML=markup;const fresh=tmp.firstElementChild;
    if(!pilot)metrics.insertAdjacentElement('afterend',fresh);
    else if(pilot.outerHTML!==fresh.outerHTML)pilot.replaceWith(fresh);
    const old=document.getElementById('gomoV240Version');if(old)old.textContent=`Version ${VERSION}`;
    document.querySelectorAll('.v315-version').forEach(n=>n.textContent=`Guide automatique · v${VERSION}`);
    document.documentElement.setAttribute('data-gomo-v319-ready','1');
  }

  function schedule(delay=120){clearTimeout(timer);timer=setTimeout(render,delay);}
  function bind(){
    document.addEventListener('click',e=>{if(e.target.closest?.('#v315Start,#v315DayOk,[data-go],[data-v316-mode],#v316Apply,#v316Finish,#v316SaveActual,#v316Restart,#v318SaveHistory'))schedule();},true);
    document.addEventListener('change',e=>{if(['v315Day','v315Language','v316PushInput','v317Badges','v317Goal'].includes(e.target?.id))schedule();},true);
  }
  function start(){bind();[0,200,700,1500].forEach(d=>setTimeout(render,d));console.info('GoMo VS Planner weekly pilot',VERSION);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
