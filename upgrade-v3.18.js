'use strict';

/* GoMo VS Planner v3.18.1 — historique et projection de la semaine VS.
   - ne traite plus un ancien jour non renseigné comme un vrai score de 0
   - permet de compléter manuellement les jours passés sans toucher au moteur VS
   - la projection reste en lecture seule pour les stocks et les calculs
*/
(() => {
  const VERSION='3.18.1';
  const UI_KEY='gomo_vs_planner_v316';
  const HIST_KEY='gomo_vs_planner_week_history_v3181';
  let timer=0;

  const T={
    fr:{title:'Semaine VS',sub:'Historique + projection',recorded:'Total enregistré',weekTarget:'Cible semaine',projection:'Projection',detail:'Détail lundi → samedi',mode:'Mode actuel',economy:'Économie',normal:'Normal',push:'Poussée',perDay:'/ jour',onTrack:'✅ En atteignant la cible chaque jour restant, la semaine est projetée à {value}.',behind:'⚠️ Projection à {value} : il manquerait {missing} pour la cible semaine.',complete:'🏁 Semaine complète : total enregistré {value}.',noScore:'—',future:'À venir',partial:'En cours',minimum:'Minimum atteint',unknown:'Non renseigné',historyIncomplete:'ℹ️ Historique incomplet : {count} jour(s) passé(s) ne sont pas renseigné(s). La projection de {value} couvre seulement les scores connus + les jours restants.',fillPast:'Compléter les jours manquants',savePast:'Enregistrer l’historique',savedPast:'Historique enregistré.',scoreFor:'Score {day}',dayNames:['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']},
    en:{title:'VS Week',sub:'History + projection',recorded:'Recorded total',weekTarget:'Weekly target',projection:'Projection',detail:'Monday → Saturday detail',mode:'Current mode',economy:'Economy',normal:'Normal',push:'Push',perDay:'/ day',onTrack:'✅ If you reach the target on each remaining day, the week projects to {value}.',behind:'⚠️ Projection {value}: {missing} would still be missing from the weekly target.',complete:'🏁 Week complete: recorded total {value}.',noScore:'—',future:'Upcoming',partial:'In progress',minimum:'Minimum reached',unknown:'Not entered',historyIncomplete:'ℹ️ History incomplete: {count} past day(s) are missing. The {value} projection only covers known scores + remaining days.',fillPast:'Fill missing past days',savePast:'Save history',savedPast:'History saved.',scoreFor:'{day} score',dayNames:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']},
    de:{title:'VS-Woche',sub:'Verlauf + Prognose',recorded:'Erfasste Summe',weekTarget:'Wochenziel',projection:'Prognose',detail:'Montag → Samstag',mode:'Aktueller Modus',economy:'Sparen',normal:'Normal',push:'Push',perDay:'/ Tag',onTrack:'✅ Mit dem Tagesziel an allen restlichen Tagen liegt die Wochenprognose bei {value}.',behind:'⚠️ Prognose {value}: Zum Wochenziel würden {missing} fehlen.',complete:'🏁 Woche abgeschlossen: {value} erfasst.',noScore:'—',future:'Später',partial:'Läuft',minimum:'Minimum erreicht',unknown:'Nicht eingetragen',historyIncomplete:'ℹ️ Verlauf unvollständig: {count} vergangene(r) Tag(e) fehlen. Die Prognose {value} enthält nur bekannte Punkte + verbleibende Tage.',fillPast:'Fehlende Tage ergänzen',savePast:'Verlauf speichern',savedPast:'Verlauf gespeichert.',scoreFor:'Punkte {day}',dayNames:['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag']},
    ro:{title:'Săptămâna VS',sub:'Istoric + proiecție',recorded:'Total înregistrat',weekTarget:'Țintă săptămânală',projection:'Proiecție',detail:'Luni → Sâmbătă',mode:'Mod curent',economy:'Economie',normal:'Normal',push:'Forțare',perDay:'/ zi',onTrack:'✅ Dacă atingi ținta în fiecare zi rămasă, proiecția săptămânii este {value}.',behind:'⚠️ Proiecție {value}: ar mai lipsi {missing} din ținta săptămânală.',complete:'🏁 Săptămână completă: total {value}.',noScore:'—',future:'Urmează',partial:'În curs',minimum:'Minim atins',unknown:'Necompletat',historyIncomplete:'ℹ️ Istoric incomplet: lipsesc {count} zi(le) trecute. Proiecția {value} include doar scorurile cunoscute + zilele rămase.',fillPast:'Completează zilele lipsă',savePast:'Salvează istoricul',savedPast:'Istoric salvat.',scoreFor:'Scor {day}',dayNames:['Luni','Marți','Miercuri','Joi','Vineri','Sâmbătă']},
    uk:{title:'Тиждень VS',sub:'Історія + прогноз',recorded:'Записано всього',weekTarget:'Ціль тижня',projection:'Прогноз',detail:'Понеділок → Субота',mode:'Поточний режим',economy:'Економія',normal:'Звичайний',push:'Ривок',perDay:'/ день',onTrack:'✅ Якщо досягати цілі кожного дня, прогноз тижня — {value}.',behind:'⚠️ Прогноз {value}: до цілі тижня бракуватиме {missing}.',complete:'🏁 Тиждень завершено: записано {value}.',noScore:'—',future:'Попереду',partial:'У процесі',minimum:'Мінімум досягнуто',unknown:'Не введено',historyIncomplete:'ℹ️ Історія неповна: відсутні {count} минулі дні. Прогноз {value} враховує лише відомі очки + решту днів.',fillPast:'Додати відсутні дні',savePast:'Зберегти історію',savedPast:'Історію збережено.',scoreFor:'Очки {day}',dayNames:['Пн','Вт','Ср','Чт','Пт','Сб']},
    ko:{title:'VS 주간',sub:'기록 + 예상',recorded:'기록 합계',weekTarget:'주간 목표',projection:'예상',detail:'월요일 → 토요일',mode:'현재 모드',economy:'절약',normal:'일반',push:'푸시',perDay:'/ 일',onTrack:'✅ 남은 날마다 목표를 달성하면 주간 예상은 {value}입니다.',behind:'⚠️ 예상 {value}: 주간 목표까지 {missing} 부족합니다.',complete:'🏁 주간 완료: 기록 합계 {value}.',noScore:'—',future:'예정',partial:'진행 중',minimum:'최소 달성',unknown:'미입력',historyIncomplete:'ℹ️ 기록이 불완전합니다: 지난 {count}일이 비어 있습니다. {value} 예상은 알려진 점수 + 남은 날만 포함합니다.',fillPast:'누락된 지난 날 입력',savePast:'기록 저장',savedPast:'기록을 저장했습니다.',scoreFor:'{day} 점수',dayNames:['월','화','수','목','금','토']},
    hr:{title:'VS tjedan',sub:'Povijest + projekcija',recorded:'Zabilježeno ukupno',weekTarget:'Tjedni cilj',projection:'Projekcija',detail:'Ponedjeljak → Subota',mode:'Trenutni način',economy:'Štednja',normal:'Normalno',push:'Pritisak',perDay:'/ dan',onTrack:'✅ Ako dosegneš cilj svaki preostali dan, projekcija tjedna je {value}.',behind:'⚠️ Projekcija {value}: do tjednog cilja nedostajalo bi {missing}.',complete:'🏁 Tjedan završen: ukupno {value}.',noScore:'—',future:'Slijedi',partial:'U tijeku',minimum:'Minimum ostvaren',unknown:'Nije uneseno',historyIncomplete:'ℹ️ Povijest nije potpuna: nedostaje {count} prošlih dana. Projekcija {value} sadrži samo poznate bodove + preostale dane.',fillPast:'Dopuni prošle dane',savePast:'Spremi povijest',savedPast:'Povijest spremljena.',scoreFor:'Bodovi {day}',dayNames:['Pon','Uto','Sri','Čet','Pet','Sub']},
    pt:{title:'Semana VS',sub:'Histórico + projeção',recorded:'Total registado',weekTarget:'Objetivo semanal',projection:'Projeção',detail:'Segunda → Sábado',mode:'Modo atual',economy:'Economia',normal:'Normal',push:'Impulso',perDay:'/ dia',onTrack:'✅ Atingindo o objetivo em cada dia restante, a projeção semanal é {value}.',behind:'⚠️ Projeção {value}: faltariam {missing} para o objetivo semanal.',complete:'🏁 Semana concluída: total registado {value}.',noScore:'—',future:'Por vir',partial:'Em curso',minimum:'Mínimo atingido',unknown:'Não registado',historyIncomplete:'ℹ️ Histórico incompleto: faltam {count} dia(s) anteriores. A projeção {value} inclui apenas pontuações conhecidas + dias restantes.',fillPast:'Completar dias em falta',savePast:'Guardar histórico',savedPast:'Histórico guardado.',scoreFor:'Pontuação {day}',dayNames:['Seg','Ter','Qua','Qui','Sex','Sáb']}
  };

  function lang(){try{return String(state?.language||'fr').split('-')[0];}catch{return'fr';}}
  function tx(){return T[lang()]||T.en;}
  function tr(k,vars={}){let s=tx()[k]??T.en[k]??k;for(const[a,b]of Object.entries(vars))s=String(s).replaceAll(`{${a}}`,String(b));return s;}
  function esc(s){return String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]||c));}
  function number(n){const v=Math.max(0,Number(n)||0);try{return new Intl.NumberFormat((typeof LOCALES==='object'&&LOCALES[lang()])||'fr-FR',{maximumFractionDigits:0}).format(v);}catch{return String(Math.round(v));}}
  function compact(n){const v=Math.max(0,Number(n)||0);if(v>=1e9)return`${(v/1e9).toFixed(2).replace(/\.00$/,'')} B`;if(v>=1e6)return`${(v/1e6).toFixed(2).replace(/\.00$/,'')} M`;if(v>=1e3)return`${(v/1e3).toFixed(1).replace(/\.0$/,'')} k`;return number(v);}

  function modeConfig(){let u={mode:'normal',pushTarget:10_000_000};try{u={...u,...JSON.parse(localStorage.getItem(UI_KEY)||'{}')};}catch{}const mode=['economy','normal','push'].includes(u.mode)?u.mode:'normal';const target=mode==='economy'?7_200_000:mode==='push'?Math.max(7_200_000,Number(u.pushTarget)||10_000_000):7_300_000;return{mode,target,name:tr(mode)};}
  function todayId(){try{if(typeof automaticDay==='function')return Math.max(1,Math.min(6,Number(automaticDay())||1));}catch{}const d=new Date().getDay();return d===0?1:Math.max(1,Math.min(6,d));}
  function weekKey(){const d=new Date(),day=d.getDay()||7;d.setHours(12,0,0,0);d.setDate(d.getDate()-day+1);return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
  function loadHistory(){try{const x=JSON.parse(localStorage.getItem(HIST_KEY)||'{}');return x.week===weekKey()?{week:x.week,days:x.days||{}}:{week:weekKey(),days:{}};}catch{return{week:weekKey(),days:{}};}}
  function saveHistory(h){try{localStorage.setItem(HIST_KEY,JSON.stringify(h));}catch{}}
  function scores(){const h=loadHistory(),out={},known={};for(let i=1;i<=6;i++){const live=Math.max(0,Number(state?.currentPoints?.[i]||0));if(live>0){out[i]=live;known[i]=true;}else if(Object.prototype.hasOwnProperty.call(h.days,String(i))){out[i]=Math.max(0,Number(h.days[i])||0);known[i]=true;}else{out[i]=0;known[i]=false;}}return{out,known,h};}

  function model(){
    const pack=scores(),s=pack.out,known=pack.known,cfg=modeConfig(),today=todayId();
    const total=Object.keys(s).reduce((sum,k)=>sum+(known[k]?s[k]:0),0),weekTarget=cfg.target*6;
    const unknownPast=[];let projected=0;
    for(let i=1;i<=6;i++){
      if(i<today){if(known[i])projected+=s[i];else unknownPast.push(i);}
      else if(i===today)projected+=Math.max(s[i],cfg.target);
      else projected+=cfg.target;
    }
    const weekFinished=today>=6&&known[6]&&s[6]>=0&&unknownPast.length===0;
    return{s,known,h:pack.h,cfg,today,total,weekTarget,projected,weekFinished,unknownPast,missing:Math.max(0,weekTarget-projected)};
  }

  function ensureStyle(){if(document.getElementById('gomo-v318-style'))return;const st=document.createElement('style');st.id='gomo-v318-style';st.textContent=`
    #gomoV318Week{width:min(760px,100%);margin:0 auto 12px;padding:14px;border:1px solid rgba(118,203,255,.34);border-radius:20px;background:linear-gradient(150deg,rgba(8,37,58,.97),rgba(9,28,42,.98));color:#fff}
    #gomoV318Week[hidden]{display:none!important}.v318-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.v318-head h3{margin:0}.v318-head small{display:block;margin-top:4px;color:#9fc9dc}.v318-mode{padding:6px 9px;border-radius:999px;background:rgba(255,211,106,.10);color:#ffd36a;font-size:.72rem;font-weight:900;white-space:nowrap}
    .v318-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:11px}.v318-metric{padding:9px;border-radius:12px;background:rgba(255,255,255,.05)}.v318-metric span{display:block;color:#9fc9dc;font-size:.67rem;font-weight:800}.v318-metric strong{display:block;margin-top:3px;font-size:1rem}
    .v318-status{margin-top:9px;padding:9px 10px;border-radius:12px;background:rgba(55,191,122,.10);color:#a6efc3;font-size:.77rem;font-weight:800;line-height:1.35}.v318-status.warn{background:rgba(255,173,65,.10);color:#ffd08d}.v318-status.info{background:rgba(70,165,230,.10);color:#bdeaff}
    .v318-details{margin-top:10px;border-top:1px solid rgba(118,203,255,.15);padding-top:9px}.v318-details summary{cursor:pointer;color:#bdeaff;font-weight:900;font-size:.78rem}.v318-days{display:grid;gap:6px;margin-top:8px}.v318-day{display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center;padding:8px 9px;border-radius:11px;background:rgba(255,255,255,.04)}.v318-day span{font-size:.76rem;font-weight:800}.v318-day small{color:#9fc9dc;font-size:.67rem}.v318-day strong{font-size:.8rem}.v318-day.today{outline:1px solid rgba(94,209,255,.38)}
    .v318-backfill{margin-top:10px;padding:10px;border-radius:12px;background:rgba(255,255,255,.04)}.v318-backfill h4{margin:0 0 7px}.v318-backfill-grid{display:grid;gap:7px}.v318-backfill label{display:grid;grid-template-columns:1fr 145px;gap:8px;align-items:center;font-size:.76rem;font-weight:800}.v318-backfill input{min-height:42px;border:1px solid rgba(118,203,255,.25);border-radius:10px;background:#071f31;color:#fff;padding:8px}.v318-save{width:100%;margin-top:8px;min-height:44px;border:0;border-radius:11px;background:#26a7df;color:#fff;font-weight:900}
    @media(max-width:580px){.v318-metrics{grid-template-columns:1fr}.v318-head{display:block}.v318-mode{display:inline-block;margin-top:7px}.v318-day{grid-template-columns:1fr auto}.v318-day small{grid-column:1}.v318-backfill label{grid-template-columns:1fr}}
  `;document.head.appendChild(st);}

  function panel(){ensureStyle();let p=document.getElementById('gomoV318Week');if(!p)p=document.createElement('section'),p.id='gomoV318Week';const arms=document.getElementById('gomoV317Arms'),main=document.querySelector('.app-shell main');if(arms?.parentNode){if(p.parentNode!==arms.parentNode||p.previousElementSibling!==arms)arms.insertAdjacentElement('afterend',p);}else if(main?.parentNode&&!p.parentNode)main.parentNode.insertBefore(p,main);return p;}

  function render(){
    const p=panel(),guide=document.getElementById('gomoV315Guide'),started=Boolean(guide?.querySelector('.v315-progress'));p.hidden=!started;if(!started)return;
    const m=model(),days=tx().dayNames||T.en.dayNames,rows=[];
    for(let i=1;i<=6;i++){
      const score=m.s[i],future=i>m.today,minimum=score>=7_200_000;
      const note=future&&!m.known[i]?tr('future'):i<m.today&&!m.known[i]?tr('unknown'):!m.known[i]?tr('noScore'):minimum?tr('minimum'):tr('partial');
      rows.push(`<div class="v318-day ${i===m.today?'today':''}"><span>${esc(days[i-1])}</span><small>${esc(note)}</small><strong>${m.known[i]?esc(compact(score)):esc(tr('noScore'))}</strong></div>`);
    }
    let status,statusClass='';
    if(m.unknownPast.length){status=tr('historyIncomplete',{count:m.unknownPast.length,value:compact(m.projected)});statusClass='info';}
    else if(m.weekFinished)status=tr('complete',{value:compact(m.total)});
    else if(m.missing>0){status=tr('behind',{value:compact(m.projected),missing:compact(m.missing)});statusClass='warn';}
    else status=tr('onTrack',{value:compact(m.projected)});

    const backfill=m.unknownPast.length?`<div class="v318-backfill"><h4>${esc(tr('fillPast'))}</h4><div class="v318-backfill-grid">${m.unknownPast.map(i=>`<label><span>${esc(tr('scoreFor',{day:days[i-1]}))}</span><input class="v318-history-input" data-day="${i}" type="number" min="0" inputmode="numeric" placeholder="0"></label>`).join('')}</div><button class="v318-save" id="v318SaveHistory" type="button">${esc(tr('savePast'))}</button></div>`:'';

    p.innerHTML=`<div class="v318-head"><div><h3>📊 ${esc(tr('title'))}</h3><small>${esc(tr('sub'))}</small></div><div class="v318-mode">${esc(tr('mode'))} · ${esc(m.cfg.name)} · ${esc(compact(m.cfg.target))}${esc(tr('perDay'))}</div></div><div class="v318-metrics"><div class="v318-metric"><span>${esc(tr('recorded'))}</span><strong>${esc(compact(m.total))}</strong></div><div class="v318-metric"><span>${esc(tr('weekTarget'))}</span><strong>${esc(compact(m.weekTarget))}</strong></div><div class="v318-metric"><span>${esc(tr('projection'))}</span><strong>${esc(compact(m.projected))}</strong></div></div><div class="v318-status ${statusClass}">${esc(status)}</div><details class="v318-details" ${m.unknownPast.length?'open':''}><summary>${esc(tr('detail'))}</summary><div class="v318-days">${rows.join('')}</div>${backfill}</details>`;

    const saveBtn=p.querySelector('#v318SaveHistory');if(saveBtn)saveBtn.onclick=()=>{const h=loadHistory();p.querySelectorAll('.v318-history-input').forEach(input=>{if(String(input.value).trim()!=='')h.days[String(input.dataset.day)]=Math.max(0,Number(input.value)||0);});saveHistory(h);try{showToast?.(tr('savedPast'));}catch{}render();};
  }

  function schedule(delay=60){clearTimeout(timer);timer=setTimeout(render,delay);}
  function wrapSave(){if(window.__gomoV318SaveWrapped||typeof saveState!=='function')return;const base=saveState;saveState=function(){const r=base.apply(this,arguments);schedule(80);return r;};window.__gomoV318SaveWrapped=true;}
  function bind(){document.addEventListener('click',e=>{if(e.target.closest?.('#v315Start,#v315DayOk,[data-go],[data-v316-mode],#v316Apply,#v316Finish,#v316SaveActual,#v316Restart'))schedule(100);},true);document.addEventListener('change',e=>{if(['v315Day','v315Language','v316PushInput','v317Badges','v317Goal'].includes(e.target?.id))schedule(100);},true);}
  function start(){wrapSave();bind();render();document.documentElement.setAttribute('data-gomo-v318-ready','1');console.info('GoMo VS Planner weekly history',VERSION);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else setTimeout(start,0);
})();
