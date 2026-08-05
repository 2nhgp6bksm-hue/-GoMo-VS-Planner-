'use strict';

/*
  GoMo VS Planner v2.42 — correctif image principale
  - force une nouvelle URL de bannière pour contourner les anciens caches iPhone / GitHub Pages
  - ne modifie ni les calculs, ni les ressources, ni les données enregistrées
*/

(() => {
  const VERSION = '2.42.0';
  const HERO = './gomo-vs-planner-v2.42.png?v=2.42.0';

  function applyHero(){
    document.querySelectorAll('img').forEach(img => {
      const raw = img.getAttribute('src') || '';
      if (/gomo-vs-planner(?:-v2\.42)?\.png/i.test(raw) && raw !== HERO) {
        img.setAttribute('src', HERO);
      }
      if (/gomo-vs-planner/i.test(raw)) img.alt = 'GoMo VS Planner';
    });

    document.querySelectorAll('source[srcset]').forEach(source => {
      const raw = source.getAttribute('srcset') || '';
      if (/gomo-vs-planner(?:-v2\.42)?\.png/i.test(raw) && !raw.includes('gomo-vs-planner-v2.42.png')) {
        source.setAttribute('srcset', HERO);
      }
    });
  }

  function start(){
    applyHero();
    const observer = new MutationObserver(() => applyHero());
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src','srcset']
    });
    setTimeout(applyHero, 250);
    setTimeout(applyHero, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();

  console.info('GoMo VS Planner image correctif', VERSION);
})();
