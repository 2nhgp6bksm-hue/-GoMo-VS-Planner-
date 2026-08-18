'use strict';

/* GoMo VS Planner v3.16.1 — nettoyage de compatibilité.
   Le récapitulatif v2.41 utilisait encore la cible historique (7,3 M),
   ce qui pouvait afficher un total différent du mode Économie v3.16.
   Cette couche le masque pendant le guide intelligent et harmonise l'affichage de version.
*/
(() => {
  const VERSION='3.16.1';

  function ensureStyle(){
    if(document.getElementById('gomo-v3161-style'))return;
    const s=document.createElement('style');
    s.id='gomo-v3161-style';
    s.textContent=`
      body.gomo-v315-simple #gomoV241Recap{display:none!important}
    `;
    document.head.appendChild(s);
  }

  function clean(){
    ensureStyle();
    const legacy=document.getElementById('gomoV241Recap');
    if(legacy && document.body.classList.contains('gomo-v315-simple')){
      legacy.setAttribute('aria-hidden','true');
    }
    const oldVersion=document.getElementById('gomoV240Version');
    if(oldVersion)oldVersion.textContent=`Version ${VERSION}`;
    document.querySelectorAll('.v315-version').forEach(node=>{
      node.textContent=`Guide automatique · v${VERSION}`;
    });
    document.documentElement.setAttribute('data-gomo-v3161-ready','1');
  }

  function start(){
    clean();
    const observer=new MutationObserver(()=>queueMicrotask(clean));
    observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    console.info('GoMo VS Planner compatibility cleanup',VERSION);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
