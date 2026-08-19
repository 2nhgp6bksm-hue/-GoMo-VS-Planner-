'use strict';

/* GoMo VS Planner v3.20.6 — sélecteur de captures iPhone.
   Ouvre le sélecteur iOS directement pendant le toucher utilisateur,
   puis transmet les fichiers au moteur OCR existant.
   Aucun calcul VS, stock, traduction ou valeur de points n'est modifié. */
(() => {
  const VERSION='3.20.6-ios1';

  function start(){
    if(document.documentElement.hasAttribute('data-gomo-v3206-ios-picker'))return;
    document.documentElement.setAttribute('data-gomo-v3206-ios-picker',VERSION);

    document.addEventListener('click',event=>{
      const button=event.target?.closest?.('#v315CaptureChoice');
      if(!button)return;

      if(button.dataset.gomoNativeBypass==='1'){
        delete button.dataset.gomoNativeBypass;
        return;
      }

      /* Empêche l'ancien clic de changer d'écran avant l'ouverture iOS. */
      event.preventDefault();
      event.stopImmediatePropagation();

      const picker=document.createElement('input');
      picker.type='file';
      picker.accept='image/*';
      picker.multiple=true;
      picker.setAttribute('aria-hidden','true');
      Object.assign(picker.style,{
        position:'fixed',
        left:'0',
        top:'0',
        width:'1px',
        height:'1px',
        opacity:'0',
        pointerEvents:'none'
      });
      document.body.appendChild(picker);

      picker.addEventListener('change',()=>{
        const files=picker.files;
        if(!files||!files.length){picker.remove();return;}

        /* Passe ensuite l'interface en écran Capture avec son gestionnaire natif. */
        button.dataset.gomoNativeBypass='1';
        button.click();

        setTimeout(()=>{
          try{
            if(typeof window.setOcrFiles==='function')window.setOcrFiles(files);
            if(typeof window.startOcrScan==='function')void window.startOcrScan();
          }catch(err){console.error('GoMo iOS picker',err);}
          picker.remove();
        },0);
      },{once:true});

      /* IMPORTANT : appel synchrone pendant le toucher, exigé par iOS/Safari. */
      try{picker.click();}catch(err){
        console.error('GoMo iOS picker open',err);
        picker.remove();
      }
    },true);

    console.info('GoMo VS Planner iOS picker patch',VERSION);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
