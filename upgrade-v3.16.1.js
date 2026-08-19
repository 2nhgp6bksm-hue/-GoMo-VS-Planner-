'use strict';

/* GoMo VS Planner v3.20.5 — finition finale ivoire/doré, sans mascotte. Moteur v3.19.2 inchangé. */
(() => {
  const VERSION='3.20.5';
  const GUIDE_VERSION=`Guide automatique · v${VERSION}`;
  const LEGACY_VERSION=`Version ${VERSION}`;
  let scheduled=false;
  const SCORE_LABEL={fr:'Score VS réel',en:'Real VS score',de:'Echte VS-Punkte',ro:'Scor VS real',uk:'Реальний рахунок VS',ko:'실제 VS 점수',hr:'Stvarni VS rezultat',pt:'Pontuação VS real'};

  function loadStyle(attr,href){
    const old=document.querySelector(`link[${attr}]`);
    if(old&&old.getAttribute('href')===href)return;
    if(old)old.remove();
    const l=document.createElement('link');
    l.rel='stylesheet';l.href=href;l.setAttribute(attr,'1');
    document.head.appendChild(l);
  }
  function loadThemes(){
    loadStyle('data-gomo-ivory-gold','./theme-ivory-gold.css?v=3.20.5');
    loadStyle('data-gomo-final-gold','./theme-final-gold.css?v=3.20.5');
  }
  function setThemeMeta(){
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.setAttribute('content','#fffaf0');
  }
  function lang(){try{return String(state?.language||document.documentElement.lang||'fr').split('-')[0];}catch{return'fr';}}
  function formatNumber(value){const n=Math.max(0,Number(value)||0),locale={fr:'fr-FR',en:'en-GB',de:'de-DE',ro:'ro-RO',uk:'uk-UA',ko:'ko-KR',hr:'hr-HR',pt:'pt-PT'}[lang()]||'fr-FR';try{return new Intl.NumberFormat(locale,{maximumFractionDigits:0}).format(n);}catch{return String(Math.round(n));}}

  function ensureStyle(){
    if(document.getElementById('gomo-v3161-style'))return;
    const s=document.createElement('style');s.id='gomo-v3161-style';s.textContent=`
      body.gomo-v315-simple #gomoV241Recap{display:none!important}
      body.gomo-v315-simple .hero{min-height:0!important;height:auto!important;padding:8px 0 10px!important;margin:0 0 6px!important;background:none!important;background-image:none!important;border:0!important;box-shadow:none!important}
      body.gomo-v315-simple .hero::before,body.gomo-v315-simple .hero::after{display:none!important;content:none!important}
      body.gomo-v315-simple .hero-main{display:none!important}
      body.gomo-v315-simple .hero-tools{width:100%!important;display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px!important;align-items:end!important;justify-content:stretch!important}
      body.gomo-v315-simple .hero-tools .language-label{min-width:0!important}
      body.gomo-v315-simple .hero-tools select,body.gomo-v315-simple .hero-tools .save-state{min-height:44px!important;margin:0!important}
      body.gomo-v315-simple .hero-tools .save-state{display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important;padding:9px 10px!important;white-space:normal!important}
      .v316-done .v316-score-caption{display:block;margin-top:14px;color:#6c563c;font-size:.82rem;font-weight:900;text-align:left}
      .v316-done .v316-score-readable{margin-top:8px;color:#a96e09;font-size:1.05rem;font-weight:900;text-align:center;letter-spacing:.01em}
      .v316-done #v316Actual{margin-top:6px!important}
      @media(max-width:580px){body.gomo-v315-simple .hero-tools{grid-template-columns:1fr!important}body.gomo-v315-simple .hero{padding-top:6px!important}}
    `;document.head.appendChild(s);
  }

  function enhanceFinalScore(){
    const done=document.querySelector('.v316-done'),input=done?.querySelector('#v316Actual');
    if(!done||!input)return;
    const label=input.closest('label')||input.parentElement;
    if(label&&!label.querySelector('.v316-score-caption')){const caption=document.createElement('span');caption.className='v316-score-caption';caption.textContent=SCORE_LABEL[lang()]||SCORE_LABEL.fr;label.insertBefore(caption,input);}
    let readable=label?.querySelector('.v316-score-readable');
    if(label&&!readable){readable=document.createElement('div');readable.className='v316-score-readable';input.insertAdjacentElement('afterend',readable);}
    const refresh=()=>{if(readable)readable.textContent=`${formatNumber(input.value)} pts`;};
    refresh();
    if(!input.dataset.v3163Bound){input.dataset.v3163Bound='1';input.addEventListener('input',refresh,{passive:true});}
  }

  function loadScript(attr,ready,src){
    if(document.querySelector(`script[${attr}]`)||document.documentElement.hasAttribute(ready))return;
    const s=document.createElement('script');s.setAttribute(attr,'1');s.src=src;s.async=false;document.head.appendChild(s);
  }
  function loadModules(){
    loadScript('data-gomo-v317-loader','data-gomo-v317-ready','./upgrade-v3.17.js?v=3.17.2');
    loadScript('data-gomo-v318-loader','data-gomo-v318-ready','./upgrade-v3.18.js?v=3.18.1');
    loadScript('data-gomo-v3192-loader','data-gomo-v3192-ready','./upgrade-v3.19.2.js?v=3.19.2');
    loadScript('data-gomo-i18nfix-loader','data-gomo-i18n-fix','./upgrade-v3.20.5-i18n.js?v=3.20.5-i18n1');
  }

  function clean(){
    scheduled=false;loadThemes();setThemeMeta();ensureStyle();
    const legacy=document.getElementById('gomoV241Recap');
    if(legacy&&document.body.classList.contains('gomo-v315-simple')&&legacy.getAttribute('aria-hidden')!=='true')legacy.setAttribute('aria-hidden','true');
    const oldVersion=document.getElementById('gomoV240Version');
    if(oldVersion&&oldVersion.textContent!==LEGACY_VERSION)oldVersion.textContent=LEGACY_VERSION;
    document.querySelectorAll('.v315-version').forEach(node=>{if(node.textContent!==GUIDE_VERSION)node.textContent=GUIDE_VERSION;});
    enhanceFinalScore();
    document.documentElement.setAttribute('data-gomo-v3205-final-ready','1');
  }
  function scheduleClean(){if(scheduled)return;scheduled=true;setTimeout(clean,0);}
  function start(){loadThemes();setThemeMeta();loadModules();clean();const observer=new MutationObserver(scheduleClean);observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});console.info('GoMo VS Planner final ivory gold',VERSION);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
