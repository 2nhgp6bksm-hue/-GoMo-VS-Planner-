'use strict';

/* GoMo VS Planner v3.20.4 — mascotte fixe en haut à droite. */
(() => {
  const VERSION='3.20.4';
  let timer=0;

  function setVersion(){
    const v=document.getElementById('gomoV240Version');
    if(v)v.textContent=`Version ${VERSION}`;
    document.querySelectorAll('.v315-version').forEach(n=>n.textContent=`Guide automatique · v${VERSION}`);
  }

  function styleMascot(el){
    Object.assign(el.style,{
      position:'fixed',
      top:'calc(env(safe-area-inset-top, 0px) + 58px)',
      right:'8px',
      width:'56px',
      height:'80px',
      zIndex:'50',
      pointerEvents:'none',
      userSelect:'none',
      backgroundPosition:'center',
      backgroundRepeat:'no-repeat',
      backgroundSize:'contain',
      filter:'sepia(.22) saturate(.85) brightness(1.03) drop-shadow(0 7px 12px rgba(154,107,22,.24))',
      opacity:'.96'
    });
  }

  async function ensureMascot(){
    let el=document.getElementById('gomoFixedMascot');
    if(!el){
      el=document.createElement('div');
      el.id='gomoFixedMascot';
      el.setAttribute('aria-hidden','true');
      styleMascot(el);
      document.body.appendChild(el);
    }
    el.hidden=!document.body.classList.contains('gomo-v315-simple');
    if(el.dataset.ready==='1')return;
    try{
      const res=await fetch('./theme-mascot-gold.css?v=3.20.4',{cache:'no-store'});
      const txt=await res.text();
      const m=txt.match(/url\(["']?(data:image\/webp;base64,[^"')]+)["']?\)/i);
      if(m){el.style.backgroundImage=`url("${m[1]}")`;el.dataset.ready='1';}
    }catch{}
  }

  function goldFix(){
    if(document.getElementById('gomo-v3204-goldfix'))return;
    const s=document.createElement('style');
    s.id='gomo-v3204-goldfix';
    s.textContent=`
      .v315-advanced summary,.v316-target span,.v316-gain,.v315-gain,.v315-help,.v315-field>span,.v315-field span,.v318-details summary{color:#9a6b16!important}
      .v316-step:before,.v315-planline:before{background:linear-gradient(135deg,#e4c36f,#c8942d)!important;color:#fffdf6!important}
      @media(max-width:390px){#gomoFixedMascot{width:52px!important;height:74px!important;right:6px!important;top:calc(env(safe-area-inset-top,0px) + 60px)!important}}
    `;
    document.head.appendChild(s);
  }

  function refresh(){clearTimeout(timer);timer=setTimeout(()=>{goldFix();setVersion();ensureMascot();},40);}
  function start(){refresh();const o=new MutationObserver(refresh);o.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});document.documentElement.setAttribute('data-gomo-v3204-ready','1');}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
