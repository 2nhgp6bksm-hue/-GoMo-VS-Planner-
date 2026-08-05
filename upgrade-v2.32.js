'use strict';

/* GoMo VS Planner v2.32 — launch safety add-on
   Requires app.js + upgrade-v2.30.js + upgrade-v2.31.js.
   Goals:
   - clear READY / MISSING / DONE / REVIEW status
   - no misleading "use the list" message when the target is already reached
   - block final confirmation when OCR values used by the plan are uncertain
   - one-action "I am lost" guidance
   - gentle wrong-day warning
   - browser-language detection only for brand-new installs
*/
(() => {
  const LANG_TX = {
    fr:{ready:'✅ PRÊT',missing:'⚠️ INFORMATIONS MANQUANTES',done:'🏁 OBJECTIF ATTEINT',review:'🔎 À VÉRIFIER',
      readyTitle:'Ton plan est prêt',missingTitle:'Ajoute encore une capture',doneTitle:'Terminé pour aujourd’hui',reviewTitle:'Une valeur importante est incertaine',
      readyBody:'Le site a assez d’informations. Utilise uniquement la liste proposée, puis confirme après l’avoir réellement utilisée dans Last War.',
      missingBody:'Le site n’a pas encore assez de stock reconnu pour atteindre l’objectif. Ajoute les captures des ressources proposées ci-dessous.',
      doneBody:'Tu as déjà atteint l’objectif. Ne dépense plus de ressources pour le VS aujourd’hui, sauf consigne contraire de l’alliance.',
      reviewBody:'Une valeur lue sur une capture influence le plan mais sa lecture n’est pas assez fiable. Reprends une capture plus nette avant de valider.',
      wrongDayTitle:'Vérifie le jour VS',wrongDayBody:'Des ressources ont été reconnues, mais aucune ne rapporte de points pour le jour sélectionné. Vérifie le jour avant d’ajouter d’autres captures.',
      doneHelp:'Objectif atteint : garde tes ressources. Aucune validation supplémentaire n’est nécessaire.',
      lost:'🧭 Je suis perdu',lostTitle:'Voici exactement quoi faire',lostDone:'Tu as terminé pour aujourd’hui. Garde tes ressources.',lostReview:'Refais une capture nette de la ressource signalée comme incertaine.',lostPhoto:'Ajoute une capture nette de ton inventaire avec les quantités visibles.',lostDay:'Vérifie d’abord que le bon jour VS est sélectionné.',lostMore:'Ajoute les captures des ressources du jour indiquées par le site.',lostPlan:'Suis la liste du plan dans Last War, puis reviens confirmer.',
      actionDone:'Compris',actionPhoto:'Ajouter des captures',actionDay:'Vérifier le jour',actionPlan:'Voir le plan',
      blocked:'Validation bloquée : le plan dépend encore d’une lecture incertaine. Ajoute une capture plus nette.'},
    en:{ready:'✅ READY',missing:'⚠️ INFORMATION MISSING',done:'🏁 TARGET REACHED',review:'🔎 CHECK NEEDED',
      readyTitle:'Your plan is ready',missingTitle:'Add one more screenshot',doneTitle:'Finished for today',reviewTitle:'An important value is uncertain',
      readyBody:'The site has enough information. Use only the proposed list, then confirm after you actually used it in Last War.',missingBody:'The recognised stock is not enough to reach the target yet. Add screenshots of the resources suggested below.',doneBody:'You already reached the target. Do not spend more VS resources today unless the alliance says otherwise.',reviewBody:'A screenshot value affects the plan but its reading is not reliable enough. Take a clearer screenshot before confirming.',wrongDayTitle:'Check the VS day',wrongDayBody:'Resources were recognised, but none score on the selected day. Check the day before adding more screenshots.',doneHelp:'Target reached: save your resources. No further confirmation is needed.',lost:'🧭 I am lost',lostTitle:'Here is exactly what to do',lostDone:'You are finished for today. Save your resources.',lostReview:'Retake a clear screenshot of the resource marked as uncertain.',lostPhoto:'Add a clear inventory screenshot with visible quantities.',lostDay:'First check that the correct VS day is selected.',lostMore:'Add screenshots of the day resources suggested by the site.',lostPlan:'Follow the plan in Last War, then come back and confirm.',actionDone:'Got it',actionPhoto:'Add screenshots',actionDay:'Check the day',actionPlan:'View plan',blocked:'Confirmation blocked: the plan still depends on an uncertain reading. Add a clearer screenshot.'},
    de:{ready:'✅ BEREIT',missing:'⚠️ ANGABEN FEHLEN',done:'🏁 ZIEL ERREICHT',review:'🔎 PRÜFEN',readyTitle:'Dein Plan ist bereit',missingTitle:'Füge noch einen Screenshot hinzu',doneTitle:'Für heute fertig',reviewTitle:'Ein wichtiger Wert ist unsicher',readyBody:'Die Seite hat genug Informationen. Nutze nur die vorgeschlagene Liste und bestätige erst danach in Last War.',missingBody:'Der erkannte Bestand reicht noch nicht für das Ziel. Füge Screenshots der unten vorgeschlagenen Ressourcen hinzu.',doneBody:'Das Ziel ist erreicht. Gib heute keine weiteren VS-Ressourcen aus, sofern die Allianz nichts anderes vorgibt.',reviewBody:'Ein gelesener Wert beeinflusst den Plan, ist aber nicht zuverlässig genug. Mache vor der Bestätigung einen klareren Screenshot.',wrongDayTitle:'VS-Tag prüfen',wrongDayBody:'Ressourcen wurden erkannt, aber keine bringt am gewählten Tag Punkte. Prüfe zuerst den Tag.',doneHelp:'Ziel erreicht: Ressourcen sparen. Keine weitere Bestätigung nötig.',lost:'🧭 Ich bin verloren',lostTitle:'Das musst du jetzt tun',lostDone:'Für heute bist du fertig. Ressourcen sparen.',lostReview:'Mache einen klaren Screenshot der als unsicher markierten Ressource.',lostPhoto:'Füge einen klaren Inventar-Screenshot mit sichtbaren Mengen hinzu.',lostDay:'Prüfe zuerst den richtigen VS-Tag.',lostMore:'Füge Screenshots der von der Seite genannten Tagesressourcen hinzu.',lostPlan:'Folge dem Plan in Last War und bestätige danach.',actionDone:'Verstanden',actionPhoto:'Screenshots hinzufügen',actionDay:'Tag prüfen',actionPlan:'Plan ansehen',blocked:'Bestätigung gesperrt: Der Plan hängt noch von einer unsicheren Erkennung ab.'},
    ro:{ready:'✅ GATA',missing:'⚠️ INFORMAȚII LIPSĂ',done:'🏁 OBIECTIV ATINS',review:'🔎 DE VERIFICAT',readyTitle:'Planul este gata',missingTitle:'Mai adaugă o captură',doneTitle:'Ai terminat pentru azi',reviewTitle:'O valoare importantă este nesigură',readyBody:'Site-ul are suficiente informații. Folosește doar lista propusă, apoi confirmă după ce ai folosit-o în Last War.',missingBody:'Stocul recunoscut nu ajunge încă la obiectiv. Adaugă capturi cu resursele sugerate mai jos.',doneBody:'Obiectivul este deja atins. Nu mai cheltui resurse VS astăzi dacă alianța nu cere altceva.',reviewBody:'O valoare citită influențează planul, dar nu este suficient de sigură. Fă o captură mai clară înainte de confirmare.',wrongDayTitle:'Verifică ziua VS',wrongDayBody:'Au fost recunoscute resurse, dar niciuna nu oferă puncte în ziua selectată. Verifică ziua.',doneHelp:'Obiectiv atins: păstrează resursele. Nu mai este necesară confirmarea.',lost:'🧭 Sunt pierdut',lostTitle:'Iată exact ce trebuie să faci',lostDone:'Ai terminat pentru azi. Păstrează resursele.',lostReview:'Refă o captură clară a resursei marcate ca nesigură.',lostPhoto:'Adaugă o captură clară a inventarului cu cantitățile vizibile.',lostDay:'Verifică mai întâi ziua VS selectată.',lostMore:'Adaugă capturile resurselor zilei indicate de site.',lostPlan:'Urmează planul în Last War, apoi revino și confirmă.',actionDone:'Am înțeles',actionPhoto:'Adaugă capturi',actionDay:'Verifică ziua',actionPlan:'Vezi planul',blocked:'Confirmare blocată: planul depinde încă de o citire nesigură.'},
    uk:{ready:'✅ ГОТОВО',missing:'⚠️ БРАКУЄ ДАНИХ',done:'🏁 ЦІЛЬ ДОСЯГНУТО',review:'🔎 ПОТРІБНА ПЕРЕВІРКА',readyTitle:'План готовий',missingTitle:'Додайте ще один знімок',doneTitle:'На сьогодні завершено',reviewTitle:'Важливе значення прочитано невпевнено',readyBody:'Сайт має достатньо даних. Використайте лише запропонований список і підтвердьте після використання в Last War.',missingBody:'Розпізнаного запасу ще недостатньо. Додайте знімки ресурсів, які сайт радить нижче.',doneBody:'Денну ціль уже досягнуто. Не витрачайте більше VS-ресурсів без іншої вказівки альянсу.',reviewBody:'Значення із знімка впливає на план, але розпізнане недостатньо надійно. Зробіть чіткіший знімок.',wrongDayTitle:'Перевірте день VS',wrongDayBody:'Ресурси розпізнано, але жоден не дає очок у вибраний день. Спочатку перевірте день.',doneHelp:'Ціль досягнуто: збережіть ресурси. Додаткове підтвердження не потрібне.',lost:'🧭 Я заплутався',lostTitle:'Ось що потрібно зробити',lostDone:'На сьогодні все. Збережіть ресурси.',lostReview:'Зробіть чіткіший знімок ресурсу з позначкою невпевненого читання.',lostPhoto:'Додайте чіткий знімок інвентарю з видимими кількостями.',lostDay:'Спочатку перевірте правильний день VS.',lostMore:'Додайте знімки ресурсів дня, які радить сайт.',lostPlan:'Виконайте план у Last War, потім поверніться та підтвердьте.',actionDone:'Зрозуміло',actionPhoto:'Додати знімки',actionDay:'Перевірити день',actionPlan:'Переглянути план',blocked:'Підтвердження заблоковано: план залежить від ненадійно прочитаного значення.'},
    ko:{ready:'✅ 준비 완료',missing:'⚠️ 정보 부족',done:'🏁 목표 달성',review:'🔎 확인 필요',readyTitle:'계획이 준비되었습니다',missingTitle:'스크린샷을 하나 더 추가하세요',doneTitle:'오늘은 완료되었습니다',reviewTitle:'중요한 값이 불확실합니다',readyBody:'정보가 충분합니다. 제안된 목록만 사용하고 Last War에서 실제로 사용한 뒤 확인하세요.',missingBody:'인식된 보유량만으로는 목표에 아직 도달하지 못합니다. 아래에 제안된 자원 스크린샷을 추가하세요.',doneBody:'오늘 목표를 이미 달성했습니다. 동맹 지시가 없다면 VS 자원을 더 사용하지 마세요.',reviewBody:'계획에 영향을 주는 값의 인식 신뢰도가 낮습니다. 확인 전에 더 선명한 스크린샷을 추가하세요.',wrongDayTitle:'VS 요일 확인',wrongDayBody:'자원은 인식되었지만 선택한 요일에 점수를 주는 자원이 없습니다. 요일을 먼저 확인하세요.',doneHelp:'목표 달성: 자원을 보관하세요. 추가 확인은 필요하지 않습니다.',lost:'🧭 무엇을 해야 할지 모르겠어요',lostTitle:'지금 해야 할 일',lostDone:'오늘은 끝났습니다. 자원을 보관하세요.',lostReview:'불확실하다고 표시된 자원을 더 선명하게 촬영하세요.',lostPhoto:'수량이 보이는 선명한 인벤토리 스크린샷을 추가하세요.',lostDay:'먼저 올바른 VS 요일인지 확인하세요.',lostMore:'사이트가 안내하는 오늘의 자원 스크린샷을 추가하세요.',lostPlan:'Last War에서 계획대로 사용한 뒤 돌아와 확인하세요.',actionDone:'확인',actionPhoto:'스크린샷 추가',actionDay:'요일 확인',actionPlan:'계획 보기',blocked:'확인 차단: 계획이 아직 불확실한 인식값에 의존합니다.'},
    hr:{ready:'✅ SPREMNO',missing:'⚠️ NEDOSTAJU PODACI',done:'🏁 CILJ OSTVAREN',review:'🔎 POTREBNA PROVJERA',readyTitle:'Plan je spreman',missingTitle:'Dodaj još jednu snimku',doneTitle:'Za danas je gotovo',reviewTitle:'Važna vrijednost nije sigurno očitana',readyBody:'Stranica ima dovoljno podataka. Upotrijebi samo predloženi popis, zatim potvrdi nakon uporabe u Last Waru.',missingBody:'Prepoznate zalihe još nisu dovoljne. Dodaj snimke resursa koje stranica predlaže ispod.',doneBody:'Dnevni cilj je već ostvaren. Ne troši dodatne VS resurse osim ako savez ne kaže drukčije.',reviewBody:'Očitana vrijednost utječe na plan, ali nije dovoljno pouzdana. Prije potvrde dodaj jasniju snimku.',wrongDayTitle:'Provjeri VS dan',wrongDayBody:'Resursi su prepoznati, ali nijedan ne donosi bodove odabranog dana. Prvo provjeri dan.',doneHelp:'Cilj ostvaren: sačuvaj resurse. Dodatna potvrda nije potrebna.',lost:'🧭 Ne znam što dalje',lostTitle:'Evo točno što trebaš učiniti',lostDone:'Za danas si završio. Sačuvaj resurse.',lostReview:'Ponovno snimi resurs označen kao nesigurno očitan.',lostPhoto:'Dodaj jasnu snimku inventara s vidljivim količinama.',lostDay:'Prvo provjeri je li odabran pravi VS dan.',lostMore:'Dodaj snimke dnevnih resursa koje stranica predlaže.',lostPlan:'Slijedi plan u Last Waru, zatim se vrati i potvrdi.',actionDone:'Razumijem',actionPhoto:'Dodaj snimke',actionDay:'Provjeri dan',actionPlan:'Pogledaj plan',blocked:'Potvrda blokirana: plan još ovisi o nesigurnom očitanju.'},
    pt:{ready:'✅ PRONTO',missing:'⚠️ FALTAM INFORMAÇÕES',done:'🏁 OBJETIVO ATINGIDO',review:'🔎 A VERIFICAR',readyTitle:'O teu plano está pronto',missingTitle:'Adiciona mais uma captura',doneTitle:'Terminaste por hoje',reviewTitle:'Um valor importante está incerto',readyBody:'O site já tem informação suficiente. Usa apenas a lista proposta e confirma depois de a utilizares realmente no Last War.',missingBody:'O stock reconhecido ainda não chega ao objetivo. Adiciona capturas dos recursos sugeridos abaixo.',doneBody:'Já atingiste o objetivo. Não gastes mais recursos de VS hoje, salvo indicação contrária da aliança.',reviewBody:'Um valor lido numa captura influencia o plano, mas a leitura não é suficientemente fiável. Faz uma captura mais nítida antes de confirmar.',wrongDayTitle:'Verifica o dia de VS',wrongDayBody:'Foram reconhecidos recursos, mas nenhum dá pontos no dia selecionado. Verifica primeiro o dia.',doneHelp:'Objetivo atingido: guarda os teus recursos. Não é necessária mais nenhuma confirmação.',lost:'🧭 Estou perdido',lostTitle:'Aqui está exatamente o que fazer',lostDone:'Terminaste por hoje. Guarda os teus recursos.',lostReview:'Repete uma captura nítida do recurso assinalado como incerto.',lostPhoto:'Adiciona uma captura nítida do inventário com as quantidades visíveis.',lostDay:'Verifica primeiro se o dia de VS selecionado está correto.',lostMore:'Adiciona capturas dos recursos do dia indicados pelo site.',lostPlan:'Segue a lista no Last War e depois volta para confirmar.',actionDone:'Percebi',actionPhoto:'Adicionar capturas',actionDay:'Verificar o dia',actionPlan:'Ver o plano',blocked:'Confirmação bloqueada: o plano ainda depende de uma leitura incerta. Adiciona uma captura mais nítida.'}
  };

  const tx=()=>LANG_TX[state.language]||LANG_TX.fr;
  const lowConfidenceThreshold=65;

  // Browser language only for a truly new device/site state.
  try{
    if(!localStorage.getItem(STORAGE_KEY)){
      const raw=(navigator.language||'').toLowerCase();
      const mapped=raw.startsWith('pt')?'pt':raw.startsWith('de')?'de':raw.startsWith('ro')?'ro':raw.startsWith('uk')?'uk':raw.startsWith('ko')?'ko':raw.startsWith('hr')?'hr':raw.startsWith('en')?'en':'fr';
      if(LANGS[mapped]) state.language=mapped;
    }
  }catch{}

  function planRisk(plan){
    const steps=new Set((plan?.steps||[]).map(s=>s.stockKey));
    const rows=Array.isArray(ocrRows)?ocrRows:[];
    const risky=rows.filter(r=>r&&r.enabled&&r.target&&steps.has(r.target)&&Number(r.confidence||0)<lowConfidenceThreshold);
    return {count:risky.length,rows:risky};
  }

  function anyUsefulStock(){
    try{return Number(inventoryPotential(state.selectedDay,true)||0)>0;}catch{return false;}
  }

  function wrongDayDetected(){
    return Boolean(lastAutoScanSummary&&Number(lastAutoScanSummary.count)>0&&Number(lastAutoScanSummary.relevantCount)===0);
  }

  function statusFor(plan){
    const risk=planRisk(plan);
    if(Number(plan.current)>=Number(plan.goal)) return {kind:'done',risk};
    if(wrongDayDetected()) return {kind:'wrongDay',risk};
    if(risk.count>0) return {kind:'review',risk};
    if(plan.reached) return {kind:'ready',risk};
    return {kind:'missing',risk};
  }

  function ensureLaunchStatus(){
    let box=document.getElementById('gomo-v232-status');
    if(box)return box;
    const anchor=document.getElementById('simpleDayStep')||document.getElementById('simplePhotoStep');
    if(!anchor||!anchor.parentNode)return null;
    box=document.createElement('section');
    box.id='gomo-v232-status';
    box.className='panel';
    box.style.cssText='border:2px solid rgba(95,211,255,.7);padding:16px;margin-bottom:18px';
    box.innerHTML='<div style="display:flex;gap:12px;align-items:flex-start;justify-content:space-between"><div><p id="gomo-v232-badge" style="font-weight:900;letter-spacing:.04em;margin:0 0 7px"></p><h2 id="gomo-v232-title" style="margin:0 0 8px"></h2><p id="gomo-v232-body" style="margin:0;line-height:1.45"></p></div></div>';
    anchor.parentNode.insertBefore(box,anchor);
    return box;
  }

  function restoreUsedHelp(){
    const node=document.querySelector('.ultra-plan-footer [data-ultra-i18n="usedHelp"]');
    if(node)node.textContent=ut('usedHelp');
  }

  function setValidationVisible(visible){
    const wrap=document.querySelector('#simplePointsPanel .plan-validation-buttons');
    if(wrap)wrap.style.display=visible?'':'none';
  }

  function refreshLaunchSafety(){
    let plan;
    try{plan=calculatePlan();}catch{return;}
    const s=statusFor(plan),d=tx(),box=ensureLaunchStatus();
    if(box){
      const badge=document.getElementById('gomo-v232-badge'),title=document.getElementById('gomo-v232-title'),body=document.getElementById('gomo-v232-body');
      if(s.kind==='done'){badge.textContent=d.done;title.textContent=d.doneTitle;body.textContent=d.doneBody;box.style.borderColor='rgba(116,224,167,.72)';}
      else if(s.kind==='wrongDay'){badge.textContent=d.review;title.textContent=d.wrongDayTitle;body.textContent=d.wrongDayBody;box.style.borderColor='rgba(255,184,77,.72)';}
      else if(s.kind==='review'){badge.textContent=d.review;title.textContent=d.reviewTitle;body.textContent=d.reviewBody;box.style.borderColor='rgba(255,184,77,.72)';}
      else if(s.kind==='ready'){badge.textContent=d.ready;title.textContent=d.readyTitle;body.textContent=d.readyBody;box.style.borderColor='rgba(116,224,167,.72)';}
      else {badge.textContent=d.missing;title.textContent=d.missingTitle;body.textContent=d.missingBody;box.style.borderColor='rgba(255,184,77,.72)';}
    }

    const apply=document.getElementById('simpleApplyBtn');
    if(s.kind==='done'){
      setValidationVisible(false);
      const help=document.querySelector('.ultra-plan-footer [data-ultra-i18n="usedHelp"]');
      if(help)help.textContent=d.doneHelp;
    }else{
      setValidationVisible(true);restoreUsedHelp();
      if(apply)apply.disabled=!plan.reached||s.kind==='review'||s.kind==='wrongDay';
    }

    const helpBtn=document.getElementById('smartHelpBtn');
    if(helpBtn)helpBtn.textContent=d.lost;
  }

  // Replace the old help click with one deterministic next action.
  document.addEventListener('click',e=>{
    const btn=e.target.closest('#smartHelpBtn');
    if(!btn)return;
    e.preventDefault();e.stopImmediatePropagation();
    const d=tx(),plan=calculatePlan(),s=statusFor(plan);
    let message=d.lostPhoto,action=d.actionPhoto,target='simplePhotoStep';
    if(s.kind==='done'){message=d.lostDone;action=d.actionDone;target='simplePointsPanel';}
    else if(s.kind==='review'){message=d.lostReview;action=d.actionPhoto;target='simplePhotoStep';}
    else if(s.kind==='wrongDay'){message=d.lostDay;action=d.actionDay;target='simpleDayStep';}
    else if(!anyUsefulStock()){message=d.lostPhoto;action=d.actionPhoto;target='simplePhotoStep';}
    else if(!plan.reached){message=d.lostMore;action=d.actionPhoto;target='simplePhotoStep';}
    else {message=d.lostPlan;action=d.actionPlan;target='simplePointsPanel';}
    const modal=document.getElementById('smartHelpModal');
    if(!modal)return;
    document.getElementById('smartHelpTitle').textContent=d.lostTitle;
    document.getElementById('smartHelpMessage').textContent=message;
    const actionBtn=document.getElementById('smartHelpAction');
    actionBtn.textContent=action;
    actionBtn.dataset.v232Target=target;
    document.getElementById('smartHelpClose').textContent=(SMART_HELP_TEXT[state.language]||SMART_HELP_TEXT.fr).close;
    modal.classList.remove('hidden');
  },true);

  document.addEventListener('click',e=>{
    const b=e.target.closest('#smartHelpAction[data-v232-target]');
    if(!b)return;
    e.preventDefault();e.stopImmediatePropagation();
    document.getElementById('smartHelpModal')?.classList.add('hidden');
    const target=document.getElementById(b.dataset.v232Target);
    target?.scrollIntoView({behavior:'smooth',block:'start'});
    delete b.dataset.v232Target;
  },true);

  // Last gate: even if another handler tries to confirm, do not allow risky OCR.
  document.addEventListener('click',e=>{
    const b=e.target.closest('#simpleApplyBtn');
    if(!b)return;
    const plan=calculatePlan(),s=statusFor(plan);
    if(s.kind==='review'||s.kind==='wrongDay'||!plan.reached){
      e.preventDefault();e.stopImmediatePropagation();
      showToast(s.kind==='review'?tx().blocked:(s.kind==='wrongDay'?tx().wrongDayBody:(LANG_TX[state.language]||LANG_TX.fr).missingBody));
      refreshLaunchSafety();
    }
  },true);

  const previousRenderAll=renderAll;
  renderAll=function(){previousRenderAll();setTimeout(refreshLaunchSafety,0);};

  if(typeof renderUltraPlanList==='function'){
    const previous=renderUltraPlanList;
    renderUltraPlanList=function(plan){previous(plan);setTimeout(refreshLaunchSafety,0);};
  }
  if(typeof renderAutoScanStatus==='function'){
    const previous=renderAutoScanStatus;
    renderAutoScanStatus=function(){previous();setTimeout(refreshLaunchSafety,0);};
  }
  if(typeof renderQuickPlan==='function'){
    const previous=renderQuickPlan;
    renderQuickPlan=function(plan,scroll=false){previous(plan,scroll);setTimeout(refreshLaunchSafety,0);};
  }

  // Recheck after OCR, plan edits and language changes without needing a reload.
  document.addEventListener('change',()=>setTimeout(refreshLaunchSafety,40));
  document.addEventListener('input',()=>setTimeout(refreshLaunchSafety,80));
  setTimeout(()=>{try{applyTranslations();}catch{} refreshLaunchSafety();},120);
})();
