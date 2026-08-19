'use strict';

/* Final i18n cleanup for v3.20.5.
   Translation-only: no VS calculation, stock, history or planning logic is modified. */
(() => {
  const VERSION='3.20.5';
  const GUIDE={fr:'Guide automatique',en:'Automatic guide',de:'Automatischer Guide',ro:'Ghid automat',uk:'Автоматичний гід',ko:'자동 가이드',hr:'Automatski vodič',pt:'Guia automático'};
  const VER={fr:'Version',en:'Version',de:'Version',ro:'Versiunea',uk:'Версія',ko:'버전',hr:'Verzija',pt:'Versão'};

  const E315={
    reset:{fr:'Recommencer',en:'Restart',de:'Neu starten',ro:'Reîncepe',uk:'Почати знову',ko:'다시 시작',hr:'Pokreni ponovno',pt:'Recomeçar'},
    reading:{fr:'Lecture en cours…',en:'Reading…',de:'Wird gelesen…',ro:'Se citește…',uk:'Зчитування…',ko:'읽는 중…',hr:'Čitanje…',pt:'A ler…'},
    noRead:{fr:'Aucune valeur exploitable reconnue. Essaie une capture plus nette ou utilise la saisie manuelle.',en:'No usable value recognised. Try a clearer screenshot or manual entry.',de:'Kein brauchbarer Wert erkannt. Nimm einen klareren Screenshot oder nutze die manuelle Eingabe.',ro:'Nu a fost recunoscută nicio valoare utilizabilă. Încearcă o captură mai clară sau introducerea manuală.',uk:'Не розпізнано жодного придатного значення. Спробуй чіткіший знімок або ручне введення.',ko:'사용 가능한 값이 인식되지 않았습니다. 더 선명한 스크린샷을 사용하거나 직접 입력하세요.',hr:'Nije prepoznata nijedna upotrebljiva vrijednost. Pokušaj s jasnijom snimkom ili ručnim unosom.',pt:'Nenhum valor útil reconhecido. Usa uma captura mais nítida ou a entrada manual.'},
    confidence:{fr:'fiabilité',en:'confidence',de:'Sicherheit',ro:'fiabilitate',uk:'надійність',ko:'신뢰도',hr:'pouzdanost',pt:'confiança'},
    validate:{fr:'Tout est correct → Continuer',en:'Everything is correct → Continue',de:'Alles stimmt → Weiter',ro:'Totul este corect → Continuă',uk:'Усе правильно → Продовжити',ko:'모두 정확함 → 계속',hr:'Sve je točno → Nastavi',pt:'Está tudo correto → Continuar'},
    manualTitle:{fr:'Entre uniquement ce que tu possèdes',en:'Enter only what you own',de:'Trage nur deinen Bestand ein',ro:'Introdu doar ceea ce deții',uk:'Введи лише те, що маєш',ko:'보유한 자원만 입력하세요',hr:'Unesi samo ono što posjeduješ',pt:'Introduz apenas o que tens'},
    manualHelp:{fr:'Laisse 0 pour les ressources que tu n’as pas. Appuie ensuite sur Enregistrer et continuer.',en:'Leave 0 for resources you do not have. Values save automatically.',de:'0 stehen lassen, wenn du die Ressource nicht hast.',ro:'Lasă 0 pentru resursele pe care nu le ai. Apoi salvează și continuă.',uk:'Залиш 0 для ресурсів, яких у тебе немає. Потім збережи й продовж.',ko:'보유하지 않은 자원은 0으로 두세요. 그런 다음 저장하고 계속하세요.',hr:'Ostavi 0 za resurse koje nemaš. Zatim spremi i nastavi.',pt:'Deixa 0 para os recursos que não tens. Depois guarda e continua.'},
    saveContinue:{fr:'Enregistrer et continuer',en:'Save and continue',de:'Speichern und weiter',ro:'Salvează și continuă',uk:'Зберегти й продовжити',ko:'저장하고 계속',hr:'Spremi i nastavi',pt:'Guardar e continuar'},
    insufficient:{fr:'Ton stock enregistré ne suffit pas encore pour atteindre 7,2 M.',en:'Your saved stock is not enough yet to reach 7.2M.',de:'Der gespeicherte Bestand reicht noch nicht für 7,2 Mio.',ro:'Stocul salvat nu este încă suficient pentru a ajunge la 7,2 M.',uk:'Збережених запасів поки недостатньо, щоб досягти 7,2 M.',ko:'저장된 자원만으로는 아직 7.2M에 도달할 수 없습니다.',hr:'Spremljene zalihe još nisu dovoljne za 7,2 M.',pt:'O stock guardado ainda não chega para atingir 7,2 M.'},
    copied:{fr:'Plan copié.',en:'Plan copied.',de:'Plan kopiert.',ro:'Plan copiat.',uk:'План скопійовано.',ko:'계획이 복사되었습니다.',hr:'Plan je kopiran.',pt:'Plano copiado.'},
    saved:{fr:'Score enregistré.',en:'Score saved.',de:'Punkte gespeichert.',ro:'Scor salvat.',uk:'Рахунок збережено.',ko:'점수가 저장되었습니다.',hr:'Rezultat je spremljen.',pt:'Pontuação guardada.'},
    advancedText:{fr:'Uniquement si tu dois corriger des valeurs ou utiliser les anciens outils.',en:'Only if you need to correct values or use the old tools.',de:'Nur für Korrekturen oder die alten Werkzeuge.',ro:'Doar dacă trebuie să corectezi valori sau să folosești instrumentele vechi.',uk:'Лише якщо потрібно виправити значення або скористатися старими інструментами.',ko:'값을 수정하거나 이전 도구를 사용해야 할 때만 이용하세요.',hr:'Samo ako trebaš ispraviti vrijednosti ili koristiti stare alate.',pt:'Apenas para corrigir valores ou usar as ferramentas antigas.'},
    showOld:{fr:'Afficher les anciens outils',en:'Show old tools',de:'Alte Werkzeuge anzeigen',ro:'Arată instrumentele vechi',uk:'Показати старі інструменти',ko:'이전 도구 표시',hr:'Prikaži stare alate',pt:'Mostrar ferramentas antigas'},
    hideOld:{fr:'Masquer les anciens outils',en:'Hide old tools',de:'Alte Werkzeuge ausblenden',ro:'Ascunde instrumentele vechi',uk:'Сховати старі інструменти',ko:'이전 도구 숨기기',hr:'Sakrij stare alate',pt:'Ocultar ferramentas antigas'},
    inventorySaved:{fr:'Ressources enregistrées.',en:'Resources saved.',de:'Ressourcen gespeichert.',ro:'Resurse salvate.',uk:'Ресурси збережено.',ko:'자원이 저장되었습니다.',hr:'Resursi su spremljeni.',pt:'Recursos guardados.'},
    imageRequired:{fr:'Ajoute au moins une capture.',en:'Add at least one screenshot.',de:'Mindestens einen Screenshot hinzufügen.',ro:'Adaugă cel puțin o captură.',uk:'Додай хоча б один знімок.',ko:'스크린샷을 하나 이상 추가하세요.',hr:'Dodaj barem jednu snimku.',pt:'Adiciona pelo menos uma captura.'},
    scoreRequired:{fr:'Entre ton score actuel.',en:'Enter your current score.',de:'Aktuelle Punkte eingeben.',ro:'Introdu scorul actual.',uk:'Введи поточний рахунок.',ko:'현재 점수를 입력하세요.',hr:'Unesi trenutačni rezultat.',pt:'Introduz a pontuação atual.'},
    quantity:{fr:'Quantité',en:'Quantity',de:'Menge',ro:'Cantitate',uk:'Кількість',ko:'수량',hr:'Količina',pt:'Quantidade'},
    plannedGain:{fr:'Points prévus',en:'Planned points',de:'Geplante Punkte',ro:'Puncte estimate',uk:'Очікувані бали',ko:'예상 점수',hr:'Predviđeni bodovi',pt:'Pontos previstos'},
    restartQuestion:{fr:'Recommencer le guide pour aujourd’hui ? Les ressources enregistrées ne seront pas effacées.',en:'Restart today’s guide? Saved resources will not be erased.',de:'Guide für heute neu starten? Gespeicherte Ressourcen bleiben erhalten.',ro:'Repornești ghidul pentru astăzi? Resursele salvate nu vor fi șterse.',uk:'Перезапустити сьогоднішній гід? Збережені ресурси не буде видалено.',ko:'오늘 가이드를 다시 시작할까요? 저장된 자원은 삭제되지 않습니다.',hr:'Ponovno pokrenuti današnji vodič? Spremljeni resursi neće biti izbrisani.',pt:'Recomeçar o guia de hoje? Os recursos guardados não serão apagados.'},
    ignoredActions:{fr:'Actions / combats détectés : ignorés automatiquement. Ils sont déjà compris dans ton score VS à l’étape suivante.',en:'Detected actions/combat values were ignored automatically. They are already included in your VS score at the next step.',de:'Erkannte Aktionen/Kampfwerte wurden automatisch ignoriert. Sie sind im VS-Punktestand des nächsten Schritts enthalten.',ro:'Acțiunile/valorile de luptă detectate au fost ignorate automat. Sunt deja incluse în scorul VS de la pasul următor.',uk:'Виявлені дії/бойові значення автоматично проігноровано. Вони вже враховані в рахунку VS на наступному кроці.',ko:'감지된 행동/전투 값은 자동으로 제외되었습니다. 다음 단계의 VS 점수에 이미 포함되어 있습니다.',hr:'Otkrivene akcije/borbene vrijednosti automatski su zanemarene. Već su uključene u VS rezultat u sljedećem koraku.',pt:'Ações/combates detetados foram ignorados automaticamente. Já estão incluídos na pontuação VS do passo seguinte.'},
    ignoredLow:{fr:'Lecture(s) sous 70 % ignorée(s). Reprends une capture plus nette ou utilise la saisie manuelle.',en:'Reading(s) below 70% were ignored. Use a clearer screenshot or manual entry.',de:'Messung(en) unter 70 % wurden ignoriert. Nutze einen klareren Screenshot oder die manuelle Eingabe.',ro:'Citirile sub 70 % au fost ignorate. Folosește o captură mai clară sau introducerea manuală.',uk:'Значення з надійністю нижче 70 % проігноровано. Використай чіткіший знімок або ручне введення.',ko:'70% 미만의 인식 결과는 제외되었습니다. 더 선명한 스크린샷을 사용하거나 직접 입력하세요.',hr:'Očitavanja ispod 70 % zanemarena su. Upotrijebi jasniju snimku ili ručni unos.',pt:'Leitura(s) abaixo de 70% foram ignoradas. Usa uma captura mais nítida ou a entrada manual.'},
    ignoredImplausible:{fr:'Valeur(s) manifestement anormale(s) ignorée(s) pour éviter un mauvais calcul.',en:'Obviously abnormal value(s) were ignored to prevent a wrong calculation.',de:'Offensichtlich unplausible Werte wurden ignoriert, um falsche Berechnungen zu vermeiden.',ro:'Valorile evident anormale au fost ignorate pentru a evita un calcul greșit.',uk:'Очевидно аномальні значення проігноровано, щоб уникнути неправильного розрахунку.',ko:'명백히 비정상적인 값은 잘못된 계산을 방지하기 위해 제외되었습니다.',hr:'Očito neuobičajene vrijednosti zanemarene su kako bi se izbjegao pogrešan izračun.',pt:'Valores claramente anormais foram ignorados para evitar um cálculo errado.'},
    noSafeValues:{fr:'Aucune ressource d’inventaire suffisamment sûre n’a été reconnue. Ajoute une capture plus nette ou passe en saisie manuelle.',en:'No sufficiently reliable inventory resource was recognised. Add a clearer screenshot or use manual entry.',de:'Keine ausreichend sichere Inventarressource erkannt. Nutze einen klareren Screenshot oder die manuelle Eingabe.',ro:'Nu a fost recunoscută nicio resursă de inventar suficient de sigură. Adaugă o captură mai clară sau folosește introducerea manuală.',uk:'Не розпізнано жодного достатньо надійного ресурсу інвентарю. Додай чіткіший знімок або скористайся ручним введенням.',ko:'충분히 신뢰할 수 있는 인벤토리 자원이 인식되지 않았습니다. 더 선명한 스크린샷을 추가하거나 직접 입력하세요.',hr:'Nije prepoznat nijedan dovoljno pouzdan resurs inventara. Dodaj jasniju snimku ili koristi ručni unos.',pt:'Nenhum recurso de inventário suficientemente seguro foi reconhecido. Adiciona uma captura mais nítida ou usa a entrada manual.'}
  };

  const E316={
    pushTarget:{fr:'Objectif Poussée',en:'Push target',de:'Push-Ziel',ro:'Țintă forțare',uk:'Ціль ривка',ko:'푸시 목표',hr:'Cilj pritiska',pt:'Objetivo de Impulso'},
    insufficient:{fr:'Stock insuffisant pour atteindre la cible.',en:'Not enough stock to reach the target.',de:'Bestand reicht nicht für das Ziel.',ro:'Stoc insuficient pentru a atinge ținta.',uk:'Недостатньо запасів, щоб досягти цілі.',ko:'목표에 도달하기 위한 자원이 부족합니다.',hr:'Nema dovoljno zaliha za dosezanje cilja.',pt:'Stock insuficiente para atingir o objetivo.'},
    copied:{fr:'Plan copié.',en:'Plan copied.',de:'Plan kopiert.',ro:'Plan copiat.',uk:'План скопійовано.',ko:'계획이 복사되었습니다.',hr:'Plan je kopiran.',pt:'Plano copiado.'},
    confirm:{fr:'Confirmer ? Les quantités indiquées seront retirées du stock.',en:'Confirm? Listed quantities will be removed from stock.',de:'Bestätigen? Die Mengen werden vom Bestand abgezogen.',ro:'Confirmi? Cantitățile indicate vor fi scăzute din stoc.',uk:'Підтвердити? Вказану кількість буде віднято від запасів.',ko:'확인할까요? 표시된 수량이 보유량에서 차감됩니다.',hr:'Potvrditi? Navedene količine bit će oduzete od zaliha.',pt:'Confirmar? As quantidades indicadas serão retiradas do stock.'},
    applied:{fr:'Plan appliqué. Stock et score mis à jour.',en:'Plan applied. Stock and score updated.',de:'Plan angewendet. Bestand und Punkte aktualisiert.',ro:'Plan aplicat. Stocul și scorul au fost actualizate.',uk:'План застосовано. Запаси та рахунок оновлено.',ko:'계획이 적용되었습니다. 보유량과 점수가 업데이트되었습니다.',hr:'Plan je primijenjen. Zalihe i rezultat su ažurirani.',pt:'Plano aplicado. Stock e pontuação atualizados.'},
    saved:{fr:'Score enregistré.',en:'Score saved.',de:'Gespeichert.',ro:'Scor salvat.',uk:'Рахунок збережено.',ko:'점수가 저장되었습니다.',hr:'Rezultat je spremljen.',pt:'Pontuação guardada.'},
    stockAfter:{fr:'reste',en:'left',de:'übrig',ro:'rămas',uk:'залишилось',ko:'남음',hr:'preostalo',pt:'restante'}
  };

  let timer=0,busy=false;
  function lang(){
    let v='fr';
    try{v=String(window.state?.language||document.querySelector('#languageSelect')?.value||document.querySelector('#v315Language')?.value||'fr').toLowerCase().split('-')[0];}catch{}
    if(v==='ua')v='uk';
    return Object.prototype.hasOwnProperty.call(GUIDE,v)?v:'en';
  }
  function entries(pack){return Object.entries(pack);}
  function find(pack,text){
    for(const [k,d] of entries(pack)) for(const v of Object.values(d)) if(v===text) return k;
    return '';
  }
  function translateNode(n,pack,L){
    const raw=n.nodeValue||''; if(!raw.trim())return;
    const lead=(raw.match(/^\s*/)||[''])[0],tail=(raw.match(/\s*$/)||[''])[0],core=raw.trim();
    const m=core.match(/^([⚔️🎯✅🏆⏳🛡️⚙️📷✍️📋🚀←↩︎↩️]+\s*)?(.*)$/u);
    const prefix=m?.[1]||'',body=m?.[2]||core;
    const key=find(pack,body)||find(pack,core);
    if(key){const t=pack[key][L]||pack[key].en; n.nodeValue=lead+prefix+t+tail; return;}
    const cm=body.match(/^(\d+(?:[.,]\d+)?%\s+)(confidence|fiabilité|Sicherheit|confiança|fiabilitate|надійність|신뢰도|pouzdanost)$/iu);
    if(cm)n.nodeValue=lead+prefix+cm[1]+(E315.confidence[L]||E315.confidence.en)+tail;
    const dm=body.match(/^(\d+\s+—\s+)(.*)$/u);
    if(dm){const k=find(E315,dm[2]);if(k)n.nodeValue=lead+prefix+dm[1]+(E315[k][L]||E315[k].en)+tail;}
  }
  function walk(root,pack,L){if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))translateNode(n,pack,L);}
  function setDirect(el,text){
    if(!el)return;let n=[...el.childNodes].find(x=>x.nodeType===Node.TEXT_NODE);
    if(!n){n=document.createTextNode('');el.appendChild(n);}
    if(n.nodeValue!==text)n.nodeValue=text;
  }
  function dedupe(root){
    if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
    while((n=w.nextNode())){
      const s=n.nodeValue||'';
      const next=s.replace(/^(\s*)(?:🏆\s*){2,}/u,'$1🏆 ').replace(/^(\s*)(?:⚔️\s*){2,}/u,'$1⚔️ ').replace(/^(\s*)(?:🛡️\s*){2,}/u,'$1🛡️ ').replace(/^(\s*)(?:🎯\s*){2,}/u,'$1🎯 ').replace(/^(\s*)(?:✅\s*){2,}/u,'$1✅ ').replace(/^(\s*)(?:⏳\s*){2,}/u,'$1⏳ ');
      if(next!==s)n.nodeValue=next;
    }
  }

  const baseConfirm=window.confirm.bind(window);
  if(!window.__gomoI18nConfirmPatched){
    window.confirm=function(message){
      const L=lang(),s=String(message??'');
      let k=find(E315,s); if(k==='restartQuestion')return baseConfirm(E315[k][L]||E315[k].en);
      k=find(E316,s); if(k==='confirm')return baseConfirm(E316[k][L]||E316[k].en);
      return baseConfirm(message);
    };
    window.__gomoI18nConfirmPatched=true;
  }

  function clean(){
    if(busy)return;busy=true;
    try{
      const L=lang();
      const guide=document.getElementById('gomoV315Guide');
      walk(guide,E315,L);
      document.querySelectorAll('.v316-mode-panel,.v316-smart-plan,.v316-done').forEach(r=>walk(r,E316,L));

      const score=document.getElementById('v315Score');
      if(score){
        const ph={fr:'Ex. 2 450 000',en:'e.g. 2,450,000',de:'z. B. 2.450.000',ro:'Ex. 2 450 000',uk:'Напр. 2 450 000',ko:'예: 2,450,000',hr:'Npr. 2 450 000',pt:'Ex. 2 450 000'}[L];
        if(ph&&score.placeholder!==ph)score.placeholder=ph;
      }

      document.querySelectorAll('.v315-version').forEach(el=>setDirect(el,`${GUIDE[L]} · v${VERSION}`));
      const old=document.getElementById('gomoV240Version');if(old)setDirect(old,`${VER[L]} ${VERSION}`);
      dedupe(document.getElementById('gomoV317Arms'));dedupe(guide);
      dedupe(document.querySelector('.v316-smart-plan'));dedupe(document.querySelector('.v316-done'));
      document.documentElement.setAttribute('data-gomo-i18n-final','2');
    }finally{busy=false;}
  }
  function schedule(){clearTimeout(timer);timer=setTimeout(clean,0);}
  function start(){
    clean();
    document.addEventListener('change',e=>{if(e.target?.id==='languageSelect'||e.target?.id==='v315Language')setTimeout(clean,10);},true);
    document.addEventListener('click',e=>{if(e.target?.closest?.('#v315Start,#v315DayOk,#v315ChangeDay,[data-go],[data-v316-mode],#v315MakePlan,#v315Done,#v315Restart,#v315ManualChoice,#v315CaptureChoice,#v315ResourceChoice'))setTimeout(clean,10);},true);
    new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,characterData:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
