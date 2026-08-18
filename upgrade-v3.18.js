'use strict';

/* GoMo VS Planner v3.18 — historique et projection de la semaine VS.
   Lecture seule : n'altère ni le moteur de calcul, ni les stocks, ni les scores.
*/
(() => {
  const VERSION='3.18.0';
  const UI_KEY='gomo_vs_planner_v316';
  let timer=0;

  const T={
    fr:{title:'Semaine VS',sub:'Historique + projection',recorded:'Total enregistré',weekTarget:'Cible semaine',projection:'Projection',detail:'Détail lundi → samedi',mode:'Mode actuel',economy:'Économie',normal:'Normal',push:'Poussée',perDay:'/ jour',onTrack:'✅ En atteignant la cible chaque jour restant, la semaine est projetée à {value}.',behind:'⚠️ Projection à {value} : il manquerait {missing} pour la cible semaine.',complete:'🏁 Semaine complète : total enregistré {value}.',noScore:'—',future:'À venir',partial:'En cours',minimum:'Minimum atteint',dayNames:['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']},
    en:{title:'VS Week',sub:'History + projection',recorded:'Recorded total',weekTarget:'Weekly target',projection:'Projection',detail:'Monday → Saturday detail',mode:'Current mode',economy:'Economy',normal:'Normal',push:'Push',perDay:'/ day',onTrack:'✅ If you reach the target on each remaining day, the week projects to {value}.',behind:'⚠️ Projection {value}: {missing} would still be missing from the weekly target.',complete:'🏁 Week complete: recorded total {value}.',noScore:'—',future:'Upcoming',partial:'In progress',minimum:'Minimum reached',dayNames:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']},
    de:{title:'VS-Woche',sub:'Verlauf + Prognose',recorded:'Erfasste Summe',weekTarget:'Wochenziel',projection:'Prognose',detail:'Montag → Samstag',mode:'Aktueller Modus',economy:'Sparen',normal:'Normal',push:'Push',perDay:'/ Tag',onTrack:'✅ Mit dem Tagesziel an allen restlichen Tagen liegt die Wochenprognose bei {value}.',behind:'⚠️ Prognose {value}: Zum Wochenziel würden {missing} fehlen.',complete:'🏁 Woche abgeschlossen: {value} erfasst.',noScore:'—',future:'Später',partial:'Läuft',minimum:'Minimum erreicht',dayNames:['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag']},
    ro:{title:'Săptămâna VS',sub:'Istoric + proiecție',recorded:'Total înregistrat',weekTarget:'Țintă săptămânală',projection:'Proiecție',detail:'Luni → Sâmbătă',mode:'Mod curent',economy:'Economie',normal:'Normal',push:'Forțare',perDay:'/ zi',onTrack:'✅ Dacă atingi ținta în fiecare zi rămasă, proiecția săptămânii este {value}.',behind:'⚠️ Proiecție {value}: ar mai lipsi {missing} din ținta săptămânală.',complete:'🏁 Săptămână completă: total {value}.',noScore:'—',future:'Urmează',partial:'În curs',minimum:'Minim atins',dayNames:['Luni','Marți','Miercuri','Joi','Vineri','Sâmbătă']},
    uk:{title:'Тиждень VS',sub:'Історія + прогноз',recorded:'Записано всього',weekTarget:'Ціль тижня',projection:'Прогноз',detail:'Понеділок → Субота',mode:'Поточний режим',economy:'Економія',normal:'Звичайний',push:'Ривок',perDay:'/ день',onTrack:'✅ Якщо досягати цілі кожного дня, прогноз тижня — {value}.',behind:'⚠️ Прогноз {value}: до цілі тижня бракуватиме {missing}.',complete:'🏁 Тиждень завершено: записано {value}.',noScore:'—',future:'Попереду',partial:'У процесі',minimum:'Мінімум досягнуто',dayNames:['Пн','Вт','Ср','Чт','Пт','Сб']},
    ko:{title:'VS 주간',sub:'기록 + 예상',recorded:'기록 합계',weekTarget:'주간 목표',projection:'예상',detail:'월요일 → 토요일',mode:'현재 모드',economy:'절약',normal:'일반',push:'푸시',perDay:'/ 일',onTrack:'✅ 남은 날마다 목표를 달성하면 주간 예상은 {value}입니다.',behind:'⚠️ 예상 {value}: 주간 목표까지 {missing} 부족합니다.',complete:'🏁 주간 완료: 기록 합계 {value}.',noScore:'—',future:'예정',partial:'진행 중',minimum:'최소 달성',dayNames:['월','화','수','목','금','토']},
    hr:{title:'VS tjedan',sub:'Povijest + projekcija',recorded:'Zabilježeno ukupno',weekTarget:'Tjedni cilj',projection:'Projekcija',detail:'Ponedjeljak → Subota',mode:'Trenutni način',economy:'Štednja',normal:'Normalno',push:'Pritisak',perDay:'/ dan',onTrack:'✅ Ako dosegneš cilj svaki preostali dan, projekcija tjedna je {value}.',behind:'⚠️ Projekcija {value}: do tjednog cilja nedostajalo bi {missing}.',complete:'🏁 Tjedan završen: ukupno {value}.',noScore:'—',future:'Slijedi',partial:'U tijeku',minimum:'Minimum ostvaren',dayNames:['Pon','Uto','Sri','Čet','Pet','Sub']},
    pt:{title:'Semana VS',sub:'Histórico + projeção',recorded:'Total registado',weekTarget:'Objetivo semanal',projection:'Projeção',detail:'Segunda → Sábado',mode:'Modo atual',economy:'Economia',normal:'Normal',push:'Impulso',perDay:'/ dia',onTrack:'✅ Atingindo o objetivo em cada dia restante, a projeção semanal é {value}.',behind:'⚠️ Projeção {value}: faltariam {missing} para o objetivo semanal.',complete:'🏁 Semana concluída: total registado {value}.',noScore:'—',future:'Por vir',partial:'Em curso',minimum:'Mínimo atingido',dayNames:['Seg','Ter','Qua','Qui','Sex','Sáb']}
  };

  function lang(){try{return String(state?.language||'fr').split('-')[0];}catch{return'fr';}}
  function tx(){return T[lang()]||T.en;}
  function tr(k,vars={}){let s=tx()[k]??T.en[k]??k;for(const[a,b]of Object.entries(vars))s=String(s).replaceAll(`{${a}}`,String(b));return s;}
  function esc(s){return String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]||c));}
  function number(n){const v=Math.max(0,Number(n)||0);try{return new Intl.NumberFormat((typeof LOCALES==='object'&&LOCALES[lang()])||'fr-FR',{maximumFractionDigits:0}).format(v);}catch{return String(Math.round(v));}}
  function compact(n){const v=Math.max(0,Number(n)||0);if(v>=1e9)return`${(v/1e9).toFixed(2).replace(/\.00$/,'')} B`;if(v>=1e6)return`${(v/1e6).toFixed(2).replace(/\.00$/,'')} M`;if(v>=1e3)return`${(v/1e3).toFixed(1).replace(/\.0$/,'')} k`;return number(v);}

  function modeConfig(){
    let u={mode:'normal',pushTarget:10_000_000};
    try{u={...u,...JSON.parse(localStorage.getItem(UI_KEY)||'{}')};}catch{}
    const mode=['economy','normal','push'].includes(u.mode)?u.mode:'normal';
    const target=mode==='economy'?7_200_000:mode==='push'?Math.max(7_200_000,Number(u.pushTarget)||10_000_000):7_300_000;
    return{mode,target,name:tr(mode)};
  }

  function todayId(){
    try{if(typeof automaticDay==='function')return Math.max(1,Math.min(6,Number(automaticDay())||1));}catch{}
    const d=new Date().getDay();return d===0?1:Math.max(1,Math.min(6,d));
  }

  function scores(){const out={};for(let i=1;i<=6;i++)out[i]=Math.max(0,Number(state?.currentPoints?.[i]||0));return out;}

  function model(){
    const s=scores(),cfg=modeConfig(),today=todayId();
    const total=Object.values(s).reduce((a,b)=>a+b,0),weekTarget=cfg.target*6;
    let projected=0;
    for(let i=1;i<=6;i++){
      const score=s[i];
      if(i<today)projected+=score;
      else if(i===today)projected+=Math.max(score,cfg.target);
      else projected+=cfg.target;
    }
    const weekFinished=today>=6&&s[6]>0;
    return{s,cfg,today,total,weekTarget,projected,weekFinished,missing:Math.max(0,weekTarget-projected)};
  }

  function ensureStyle(){if(document.getElementById('gomo-v318-style'))return;const st=document.createElement('style');st.id='gomo-v318-style';st.textContent=`
    #gomoV318Week{width:min(760px,100%);margin:0 auto 12px;padding:14px;border:1px solid rgba(118,203,255,.34);border-radius:20px;background:linear-gradient(150deg,rgba(8,37,58,.97),rgba(9,28,42,.98));color:#fff}
    #gomoV318Week[hidden]{display:none!important}.v318-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.v318-head h3{margin:0}.v318-head small{display:block;margin-top:4px;color:#9fc9dc}.v318-mode{padding:6px 9px;border-radius:999px;background:rgba(255,211,106,.10);color:#ffd36a;font-size:.72rem;font-weight:900;white-space:nowrap}
    .v318-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:11px}.v318-metric{padding:9px;border-radius:12px;background:rgba(255,255,255,.05)}.v318-metric span{display:block;color:#9fc9dc;font-size:.67rem;font-weight:800}.v318-metric strong{display:block;margin-top:3px;font-size:1rem}
    .v318-status{margin-top:9px;padding:9px 10px;border-radius:12px;background:rgba(55,191,122,.10);color:#a6efc3;font-size:.77rem;font-weight:800;line-height:1.35}.v318-status.warn{background:rgba(255,173,65,.10);color:#ffd08d}
    .v318-details{margin-top:10px;border-top:1px solid rgba(118,203,255,.15);padding-top:9px}.v318-details summary{cursor:pointer;color:#bdeaff;font-weight:900;font-size:.78rem}.v318-days{display:grid;gap:6px;margin-top:8px}.v318-day{display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center;padding:8px 9px;border-radius:11px;background:rgba(255,255,255,.04)}.v318-day span{font-size:.76rem;font-weight:800}.v318-day small{color:#9fc9dc;font-size:.67rem}.v318-day strong{font-size:.8rem}.v318-day.today{outline:1px solid rgba(94,209,255,.38)}
    @media(max-width:580px){.v318-metrics{grid-template-columns:1fr}.v318-head{display:block}.v318-mode{display:inline-block;margin-top:7px}.v318-day{grid-template-columns:1fr auto}.v318-day small{grid-column:1}}
  `;document.head.appendChild(st);}

  function panel(){
    ensureStyle();let p=document.getElementById('gomoV318Week');
    if(!p){p=document.createElement('section');p.id='gomoV318Week';}
    const arms=document.getElementById('gomoV317Arms'),main=document.querySelector('.app-shell main');
    if(arms?.parentNode){if(p.parentNode!==arms.parentNode||p.previousElementSibling!==arms)arms.insertAdjacentElement('afterend',p);}
    else if(main?.parentNode&&!p.parentNode)main.parentNode.insertBefore(p,main);
    return p;
  }

  function render(){
    const p=panel(),guide=document.getElementById('gomoV315Guide'),started=Boolean(guide?.querySelector('.v315-progress'));p.hidden=!started;if(!started)return;
    const m=model(),days=tx().dayNames||T.en.dayNames;
    const rows=[];
    for(let i=1;i<=6;i++){
      const score=m.s[i],future=i>m.today,minimum=score>=7_200_000;
      const note=future&&score===0?tr('future'):score===0?tr('noScore'):minimum?tr('minimum'):tr('partial');
      rows.push(`<div class="v318-day ${i===m.today?'today':''}"><span>${esc(days[i-1])}</span><small>${esc(note)}</small><strong>${score?esc(compact(score)):esc(tr('noScore'))}</strong></div>`);
    }
    const status=m.weekFinished?tr('complete',{value:compact(m.total)}):m.missing>0?tr('behind',{value:compact(m.projected),missing:compact(m.missing)}):tr('onTrack',{value:compact(m.projected)});
    p.innerHTML=`<div class="v318-head"><div><h3>📊 ${esc(tr('title'))}</h3><small>${esc(tr('sub'))}</small></div><div class="v318-mode">${esc(tr('mode'))} · ${esc(m.cfg.name)} · ${esc(compact(m.cfg.target))}${esc(tr('perDay'))}</div></div><div class="v318-metrics"><div class="v318-metric"><span>${esc(tr('recorded'))}</span><strong>${esc(compact(m.total))}</strong></div><div class="v318-metric"><span>${esc(tr('weekTarget'))}</span><strong>${esc(compact(m.weekTarget))}</strong></div><div class="v318-metric"><span>${esc(tr('projection'))}</span><strong>${esc(compact(m.projected))}</strong></div></div><div class="v318-status ${m.missing>0?'warn':''}">${esc(status)}</div><details class="v318-details"><summary>${esc(tr('detail'))}</summary><div class="v318-days">${rows.join('')}</div></details>`;
  }

  function schedule(delay=60){clearTimeout(timer);timer=setTimeout(render,delay);}

  function wrapSave(){
    if(window.__gomoV318SaveWrapped||typeof saveState!=='function')return;
    const base=saveState;
    saveState=function(){const r=base.apply(this,arguments);schedule(80);return r;};
    window.__gomoV318SaveWrapped=true;
  }

  function bind(){
    document.addEventListener('click',e=>{if(e.target.closest?.('#v315Start,#v315DayOk,[data-go],[data-v316-mode],#v316Apply,#v316Finish,#v316SaveActual,#v316Restart'))schedule(100);},true);
    document.addEventListener('change',e=>{if(['v315Day','v315Language','v316PushInput','v317Badges','v317Goal'].includes(e.target?.id))schedule(100);},true);
  }

  function start(){wrapSave();bind();render();document.documentElement.setAttribute('data-gomo-v318-ready','1');console.info('GoMo VS Planner weekly history',VERSION);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else setTimeout(start,0);
})();
