'use strict';

/* GoMo VS Planner v3.16.2 — correctif iPhone / RawGitHack.
   Corrige la boucle MutationObserver de la v3.16.1 qui pouvait figer la page
   et afficher un écran noir après plusieurs retours dans Safari.
*/
(() => {
  const VERSION='3.16.2';
  const GUIDE_VERSION=`Guide automatique · v${VERSION}`;
  const LEGACY_VERSION=`Version ${VERSION}`;
  let scheduled=false;

  function ensureStyle(){
    if(document.getElementById('gomo-v3161-style'))return;
    const s=document.createElement('style');
    s.id='gomo-v3161-style';
    s.textContent='body.gomo-v315-simple #gomoV241Recap{display:none!important}';
    document.head.appendChild(s);
  }

  function clean(){
    scheduled=false;
    ensureStyle();

    const legacy=document.getElementById('gomoV241Recap');
    if(legacy && document.body.classList.contains('gomo-v315-simple') && legacy.getAttribute('aria-hidden')!=='true'){
      legacy.setAttribute('aria-hidden','true');
    }

    const oldVersion=document.getElementById('gomoV240Version');
    if(oldVersion && oldVersion.textContent!==LEGACY_VERSION)oldVersion.textContent=LEGACY_VERSION;

    document.querySelectorAll('.v315-version').forEach(node=>{
      if(node.textContent!==GUIDE_VERSION)node.textContent=GUIDE_VERSION;
    });

    document.documentElement.setAttribute('data-gomo-v3162-ready','1');
  }

  function scheduleClean(){
    if(scheduled)return;
    scheduled=true;
    setTimeout(clean,0);
  }

  function start(){
    clean();
    const observer=new MutationObserver(scheduleClean);
    observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    console.info('GoMo VS Planner compatibility cleanup',VERSION);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
