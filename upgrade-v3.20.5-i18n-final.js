'use strict';

/* Final i18n cleanup for v3.20.5. Translation-only; no game logic is modified. */
(() => {
  const VERSION='3.20.5';
  const GUIDE={fr:'Guide automatique',en:'Automatic guide',de:'Automatischer Guide',ro:'Ghid automat',uk:'Автоматичний гід',ko:'자동 가이드',hr:'Automatski vodič',pt:'Guia automático'};
  const VER={fr:'Version',en:'Version',de:'Version',ro:'Versiunea',uk:'Версія',ko:'버전',hr:'Verzija',pt:'Versão'};
  let timer=0,busy=false;

  function lang(){
    let v='fr';
    try{v=String(window.state?.language||document.querySelector('#languageSelect')?.value||document.querySelector('#v315Language')?.value||'fr').toLowerCase().split('-')[0];}catch{}
    if(v==='ua')v='uk';
    return Object.prototype.hasOwnProperty.call(GUIDE,v)?v:'en';
  }
  function setDirect(el,text){
    if(!el)return;
    let n=[...el.childNodes].find(x=>x.nodeType===Node.TEXT_NODE);
    if(!n){n=document.createTextNode('');el.appendChild(n);}
    if(n.nodeValue!==text)n.nodeValue=text;
  }
  function dedupe(root){
    if(!root)return;
    const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
    while((n=w.nextNode())){
      let s=n.nodeValue||'',next=s;
      next=next.replace(/^(\s*)(?:🏆\s*){2,}/u,'$1🏆 ');
      next=next.replace(/^(\s*)(?:⚔️\s*){2,}/u,'$1⚔️ ');
      next=next.replace(/^(\s*)(?:🛡️\s*){2,}/u,'$1🛡️ ');
      next=next.replace(/^(\s*)(?:🎯\s*){2,}/u,'$1🎯 ');
      next=next.replace(/^(\s*)(?:✅\s*){2,}/u,'$1✅ ');
      next=next.replace(/^(\s*)(?:⏳\s*){2,}/u,'$1⏳ ');
      if(next!==s)n.nodeValue=next;
    }
  }
  function clean(){
    if(busy)return;busy=true;
    try{
      const L=lang();
      document.querySelectorAll('.v315-version').forEach(el=>setDirect(el,`${GUIDE[L]} · v${VERSION}`));
      const old=document.getElementById('gomoV240Version');if(old)setDirect(old,`${VER[L]} ${VERSION}`);
      dedupe(document.getElementById('gomoV317Arms'));
      dedupe(document.getElementById('gomoV315Guide'));
      dedupe(document.querySelector('.v316-smart-plan'));
      dedupe(document.querySelector('.v316-done'));
      document.documentElement.setAttribute('data-gomo-i18n-final','1');
    }finally{busy=false;}
  }
  function schedule(){clearTimeout(timer);timer=setTimeout(clean,0);}
  function start(){
    clean();
    document.addEventListener('change',e=>{if(e.target?.id==='languageSelect'||e.target?.id==='v315Language')setTimeout(clean,10);},true);
    document.addEventListener('click',e=>{if(e.target?.closest?.('#v315Start,#v315DayOk,#v315ChangeDay,[data-go],[data-v316-mode],#v315MakePlan,#v315Done,#v315Restart'))setTimeout(clean,10);},true);
    new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
