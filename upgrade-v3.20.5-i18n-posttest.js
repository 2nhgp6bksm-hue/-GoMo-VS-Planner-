'use strict';

/* GoMo VS Planner v3.20.5 — final language QA patch.
   Translation/display only. No VS calculations, inventory, history or planning logic. */
(() => {
  const VERSION='3.20.5-i18n3';
  let busy=false,timer=0;

  const LANGS=['fr','en','de','ro','uk','ko','hr','pt'];
  const TOAST={
    planCopied:{fr:'Plan copié.',en:'Plan copied.',de:'Plan kopiert.',ro:'Plan copiat.',uk:'План скопійовано.',ko:'계획이 복사되었습니다.',hr:'Plan je kopiran.',pt:'Plano copiado.'},
    resourcesSaved:{fr:'Ressources enregistrées.',en:'Resources saved.',de:'Ressourcen gespeichert.',ro:'Resurse salvate.',uk:'Ресурси збережено.',ko:'자원이 저장되었습니다.',hr:'Resursi su spremljeni.',pt:'Recursos guardados.'},
    scoreSaved:{fr:'Score enregistré.',en:'Score saved.',de:'Punkte gespeichert.',ro:'Scor salvat.',uk:'Рахунок збережено.',ko:'점수가 저장되었습니다.',hr:'Rezultat je spremljen.',pt:'Pontuação guardada.'},
    planApplied:{fr:'Plan appliqué. Stock et score mis à jour.',en:'Plan applied. Stock and score updated.',de:'Plan angewendet. Bestand und Punkte aktualisiert.',ro:'Plan aplicat. Stocul și scorul au fost actualizate.',uk:'План застосовано. Запаси та рахунок оновлено.',ko:'계획이 적용되었습니다. 보유량과 점수가 업데이트되었습니다.',hr:'Plan je primijenjen. Zalihe i rezultat su ažurirani.',pt:'Plano aplicado. Stock e pontuação atualizados.'},
    imageRequired:{fr:'Ajoute au moins une capture.',en:'Add at least one screenshot.',de:'Mindestens einen Screenshot hinzufügen.',ro:'Adaugă cel puțin o captură.',uk:'Додай хоча б один знімок.',ko:'스크린샷을 하나 이상 추가하세요.',hr:'Dodaj barem jednu snimku.',pt:'Adiciona pelo menos uma captura.'},
    scoreRequired:{fr:'Entre ton score actuel.',en:'Enter your current score.',de:'Aktuelle Punkte eingeben.',ro:'Introdu scorul actual.',uk:'Введи поточний рахунок.',ko:'현재 점수를 입력하세요.',hr:'Unesi trenutačni rezultat.',pt:'Introduz a pontuação atual.'},
    noRead:{fr:'Aucune valeur exploitable reconnue. Essaie une capture plus nette ou utilise la saisie manuelle.',en:'No usable value recognised. Try a clearer screenshot or manual entry.',de:'Kein brauchbarer Wert erkannt. Nimm einen klareren Screenshot oder nutze die manuelle Eingabe.',ro:'Nu a fost recunoscută nicio valoare utilizabilă. Încearcă o captură mai clară sau introducerea manuală.',uk:'Не розпізнано жодного придатного значення. Спробуй чіткіший знімок або ручне введення.',ko:'사용 가능한 값이 인식되지 않았습니다. 더 선명한 스크린샷을 사용하거나 직접 입력하세요.',hr:'Nije prepoznata nijedna upotrebljiva vrijednost. Pokušaj s jasnijom snimkom ili ručnim unosom.',pt:'Nenhum valor útil reconhecido. Usa uma captura mais nítida ou a entrada manual.'},
    noSafe:{fr:'Aucune ressource d’inventaire suffisamment sûre n’a été reconnue. Ajoute une capture plus nette ou passe en saisie manuelle.',en:'No sufficiently reliable inventory resource was recognised. Add a clearer screenshot or use manual entry.',de:'Keine ausreichend sichere Inventarressource erkannt. Nutze einen klareren Screenshot oder die manuelle Eingabe.',ro:'Nu a fost recunoscută nicio resursă de inventar suficient de sigură. Adaugă o captură mai clară sau folosește introducerea manuală.',uk:'Не розпізнано жодного достатньо надійного ресурсу інвентарю. Додай чіткіший знімок або скористайся ручним введенням.',ko:'충분히 신뢰할 수 있는 인벤토리 자원이 인식되지 않았습니다. 더 선명한 스크린샷을 추가하거나 직접 입력하세요.',hr:'Nije prepoznat nijedan dovoljno pouzdan resurs inventara. Dodaj jasniju snimku ili koristi ručni unos.',pt:'Nenhum recurso de inventário suficientemente seguro foi reconhecido. Adiciona uma captura mais nítida ou usa a entrada manual.'}
  };

  const PT_DAYS={
    'Lundi · Entraînement radar':'Segunda-feira · Treino de radar',
    'Mardi · Expansion de la base':'Terça-feira · Expansão da base',
    'Mercredi · Âge de la science':'Quarta-feira · Era da Ciência',
    'Jeudi · Entraîner les héros':'Quinta-feira · Treino de heróis',
    'Vendredi · Mobilisation totale':'Sexta-feira · Mobilização total',
    'Samedi · Destruction ennemie':'Sábado · Destruição do inimigo'
  };

  const PT_LABELS={
    'Endurance utilisée':'Resistência utilizada',
    'Missions radar terminées':'Missões de radar concluídas',
    'EXP de héros utilisée':'EXP de herói utilizada',
    'Données de combat drone':'Dados de combate do drone',
    'Pièces de drone':'Peças de drone',
    'Nourriture récoltée':'Comida recolhida',
    'Fer récolté':'Ferro recolhido',
    'Pièces récoltées':'Moedas recolhidas',
    'Points de puce drone gagnés':'Pontos de chip do drone obtidos',
    'Coffres de puce premium ouverts':'Baús de chip premium abertos',
    'Diamants obtenus lors de packs':'Diamantes obtidos em pacotes',
    'Accélérateurs de construction':'Aceleradores de construção',
    'Accélérateurs universels':'Aceleradores universais',
    'Puissance bâtiment prévue':'Poder de construção previsto',
    'Camions commerciaux UR':'Camiões comerciais UR',
    'Missions secrètes UR':'Missões secretas UR',
    'Tickets de recrutement survivant':'Bilhetes de recrutamento de sobreviventes',
    'Accélérateurs de recherche':'Aceleradores de pesquisa',
    'Puissance technologie prévue':'Poder tecnológico previsto',
    'Badges de bravoure':'Insígnias de bravura',
    'Tickets de recrutement héros':'Bilhetes de recrutamento de heróis',
    'Fragments de héros UR':'Fragmentos de herói UR',
    'Fragments de héros SSR':'Fragmentos de herói SSR',
    'Fragments de héros R':'Fragmentos de herói R',
    'Médailles de compétence':'Medalhas de habilidade',
    'Fragments d’arme exclusive':'Fragmentos de arma exclusiva',
    'Accélérateurs d’entraînement':'Aceleradores de treino',
    'Accélérateurs de soins':'Aceleradores de cura'
  };

  const PT_UNITS={
    'point(s) d’endurance':'ponto(s) de resistência',
    'mission(s)':'missão(ões)',
    'donnée(s)':'dado(s)',
    'pièce(s)':'peça(s)',
    'lot(s) de 100':'lote(s) de 100',
    'lot(s) de 60':'lote(s) de 60',
    'point(s) de puce':'ponto(s) de chip',
    'minute(s)':'minuto(s)',
    'point(s) de puissance':'ponto(s) de poder',
    'camion(s)':'camião(ões)',
    'recrutement(s)':'recrutamento(s)',
    'badge(s)':'insígnia(s)',
    'coffre(s)':'baú(s)',
    'fragment(s)':'fragmento(s)',
    'médaille(s)':'medalha(s)',
    'troupe(s)':'tropa(s)',
    'diamant(s)':'diamante(s)'
  };

  function lang(){
    let v='fr';
    try{v=String(window.state?.language||document.querySelector('#v315Language')?.value||document.querySelector('#languageSelect')?.value||'fr').toLowerCase().split('-')[0];}catch{}
    if(v==='ua')v='uk';
    return LANGS.includes(v)?v:'en';
  }

  function translateToast(message,L){
    const s=String(message??'');
    for(const dict of Object.values(TOAST)){
      if(Object.values(dict).includes(s))return dict[L]||dict.en||s;
    }
    return s;
  }

  function patchToast(){
    if(window.__gomoI18nToastPatched||typeof window.showToast!=='function')return;
    const base=window.showToast;
    window.showToast=function(message){return base.call(this,translateToast(message,lang()));};
    window.__gomoI18nToastPatched=true;
  }

  function ensurePortugueseOption(){
    document.querySelectorAll('#languageSelect,#v315Language').forEach(select=>{
      if(![...select.options].some(o=>o.value==='pt')){
        const o=document.createElement('option');o.value='pt';o.textContent='Português';select.appendChild(o);
      }
    });
  }

  function replacePtText(text){
    let out=String(text);
    for(const [a,b] of Object.entries(PT_DAYS))out=out.replaceAll(a,b);
    for(const [a,b] of Object.entries(PT_LABELS))out=out.replaceAll(a,b);
    for(const [a,b] of Object.entries(PT_UNITS))out=out.replaceAll(a,b);
    out=out.replace(/Coffres composant drone niveau\s+(\d+)/g,'Baús de componentes do drone nível $1');
    out=out.replace(/Troupes niveau\s+(\d+) entraînées/g,'Tropas de nível $1 treinadas');
    out=out.replace(/Troupes adversaires VS niveau\s+(\d+) éliminées/g,'Tropas adversárias VS de nível $1 eliminadas');
    out=out.replace(/Autres troupes niveau\s+(\d+) éliminées/g,'Outras tropas de nível $1 eliminadas');
    out=out.replace(/Tes troupes niveau\s+(\d+) perdues/g,'As tuas tropas de nível $1 perdidas');
    return out;
  }

  function translatePortugueseDom(){
    if(lang()!=='pt')return;
    const roots=[document.getElementById('gomoV315Guide'),document.getElementById('gomoV317Arms'),document.querySelector('.v316-mode-panel'),document.querySelector('.v316-smart-plan'),document.querySelector('.v316-done')].filter(Boolean);
    for(const root of roots){
      const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
      while((n=w.nextNode())){
        const s=n.nodeValue||'',next=replacePtText(s);
        if(next!==s)n.nodeValue=next;
      }
    }
  }

  function apply(){
    if(busy)return;busy=true;
    try{patchToast();ensurePortugueseOption();translatePortugueseDom();document.documentElement.setAttribute('data-gomo-i18n-posttest',VERSION);}
    finally{busy=false;}
  }
  function schedule(){clearTimeout(timer);timer=setTimeout(apply,0);}
  function start(){
    apply();
    document.addEventListener('change',e=>{if(e.target?.id==='languageSelect'||e.target?.id==='v315Language')setTimeout(apply,10);},true);
    document.addEventListener('click',e=>{if(e.target?.closest?.('#v315Start,#v315DayOk,#v315ChangeDay,[data-go],[data-v316-mode],#v315MakePlan,#v315Done,#v315Restart,#v315ManualChoice,#v315CaptureChoice,#v315ResourceChoice'))setTimeout(apply,10);},true);
    new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,characterData:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
