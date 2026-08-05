'use strict';

/* GoMo VS Planner v2.31 autonomous assistant add-on
   Requires app.js + upgrade-v2.30.js.
   - Completes hard-coded UI translation for all 8 languages
   - Adds an autonomous guidance/status panel
   - Expands Portuguese OCR aliases for the full current VS resource catalogue
   - Surfaces uncertain OCR readings
   - Prevents confirming a plan that does not actually reach the target
   - Migrates the old untouched 300k default margin to 100k once
*/
(() => {
  const V231_FLAG = 'gomo_vs_planner_v231_margin_migrated';

  const UI = {
    fr:{inventory:'Inventaire',autoCalc:'Calcul automatique',language:'Langue',navigation:'Navigation',vsDay:'Jour VS',close:'Fermer',scoreAria:'Points déjà obtenus',coverAlt:'GoMo VS Planner — objectif 7,2 M et programme VS du lundi au samedi',
      title:'Assistant autonome',readyTitle:'Ton plan est prêt',photosTitle:'Ajoute tes captures',missingTitle:'Il manque encore des points',doneTitle:'Objectif déjà atteint',wrongDayTitle:'Ressources reconnues, mais pas pour ce jour',
      ready:'Le site a assez d’informations. Suis la liste ci-dessous puis valide seulement après avoir utilisé ces ressources dans Last War.',
      photos:'Ajoute des captures nettes de ton inventaire. Le site lit les quantités, choisit les ressources du bon jour et calcule le plan automatiquement.',
      missing:'Le stock reconnu ne suffit pas encore. Si tu possèdes les ressources indiquées plus bas, ajoute aussi leurs captures. Le site recalculera tout seul.',
      done:'Tu as déjà atteint l’objectif du jour. Garde tes ressources pour la suite sauf consigne contraire de l’alliance.',
      wrongDay:'Des ressources ont été reconnues, mais aucune ne rapporte de points pour le jour VS sélectionné. Vérifie le jour ou ajoute les captures des ressources du jour.',
      coverage:'Ressources que le site sait gérer aujourd’hui',missingShots:'Si tu en possèdes, pense aussi à montrer : {list}.',uncertain:'⚠️ {count} valeur(s) ont été lues avec une fiabilité faible. Une capture plus nette peut améliorer le plan.',
      final:'Total prévu',goal:'Objectif',margin:'Marge prévue',deficit:'Encore manquant',stepDay:'Jour',stepPhotos:'Captures',stepStock:'Stock utile',stepPlan:'Plan',
      whyEasy:'Prioritaire car relativement facile à remplacer.',whyUseful:'Utilisé car il apporte des points utiles aujourd’hui.',whyRare:'Ressource importante : le site essaie de la préserver et ne l’utilise que si nécessaire.',whyUniversal:'Ressource polyvalente : conservée autant que possible pour les autres jours.',whyCombat:'Estimation de combat : vérifie toujours le résultat réel dans le jeu.',
      blocked:'Ce plan n’atteint pas encore l’objectif. Ajoute d’autres captures ou augmente une ressource disponible avant de valider.',
      groups:{droneChest:'Coffres de composants drone (niveaux 1–7)',trainedTroops:'Troupes entraînées (niveaux 1–10)',rivalKilled:'Troupes VS rivales éliminées (niveaux 1–10)',otherKilled:'Autres troupes éliminées (niveaux 1–10)',lostTroops:'Troupes perdues (niveaux 1–10)'}},
    en:{inventory:'Inventory',autoCalc:'Automatic calculation',language:'Language',navigation:'Navigation',vsDay:'VS day',close:'Close',scoreAria:'Points already earned',coverAlt:'GoMo VS Planner — 7.2M target and Monday-to-Saturday VS program',
      title:'Autonomous assistant',readyTitle:'Your plan is ready',photosTitle:'Add your screenshots',missingTitle:'More points are still needed',doneTitle:'Target already reached',wrongDayTitle:'Resources recognised, but not for this day',
      ready:'The site has enough information. Follow the list below and confirm only after using those resources in Last War.',photos:'Add clear inventory screenshots. The site reads quantities, chooses resources for the correct day and calculates the plan automatically.',missing:'The recognised stock is not enough yet. If you own the resources listed below, add screenshots showing them and the site will recalculate automatically.',done:'You have already reached today’s target. Save your resources unless the alliance says otherwise.',wrongDay:'Resources were recognised, but none score points on the selected VS day. Check the day or add screenshots of today’s resources.',coverage:'Resources the site can manage today',missingShots:'If you have them, also show: {list}.',uncertain:'⚠️ {count} value(s) were read with low confidence. A clearer screenshot may improve the plan.',final:'Planned total',goal:'Target',margin:'Planned margin',deficit:'Still missing',stepDay:'Day',stepPhotos:'Screenshots',stepStock:'Useful stock',stepPlan:'Plan',whyEasy:'Prioritised because it is relatively easy to replace.',whyUseful:'Used because it provides useful points today.',whyRare:'Important resource: the site tries to preserve it and uses it only when necessary.',whyUniversal:'Flexible resource: preserved as much as possible for other days.',whyCombat:'Combat estimate: always check the real result in game.',blocked:'This plan does not reach the target yet. Add more screenshots or increase an available resource before confirming.',groups:{droneChest:'Drone component chests (levels 1–7)',trainedTroops:'Trained troops (levels 1–10)',rivalKilled:'Rival VS troops eliminated (levels 1–10)',otherKilled:'Other troops eliminated (levels 1–10)',lostTroops:'Troops lost (levels 1–10)'}},
    de:{inventory:'Inventar',autoCalc:'Automatische Berechnung',language:'Sprache',navigation:'Navigation',vsDay:'VS-Tag',close:'Schließen',scoreAria:'Bereits erreichte Punkte',coverAlt:'GoMo VS Planner — Ziel 7,2 Mio. und VS-Plan von Montag bis Samstag',
      title:'Autonomer Assistent',readyTitle:'Dein Plan ist bereit',photosTitle:'Screenshots hinzufügen',missingTitle:'Es fehlen noch Punkte',doneTitle:'Ziel bereits erreicht',wrongDayTitle:'Ressourcen erkannt, aber nicht für diesen Tag',ready:'Die Seite hat genug Informationen. Folge der Liste und bestätige erst, nachdem du diese Ressourcen in Last War verwendet hast.',photos:'Füge klare Inventar-Screenshots hinzu. Die Seite liest Mengen, wählt Ressourcen für den richtigen Tag und berechnet den Plan automatisch.',missing:'Der erkannte Bestand reicht noch nicht. Wenn du die unten genannten Ressourcen besitzt, füge auch davon Screenshots hinzu. Die Seite rechnet automatisch neu.',done:'Das Tagesziel ist bereits erreicht. Spare deine Ressourcen, sofern die Allianz nichts anderes vorgibt.',wrongDay:'Ressourcen wurden erkannt, aber keine bringt am gewählten VS-Tag Punkte. Prüfe den Tag oder füge Screenshots der Tagesressourcen hinzu.',coverage:'Ressourcen, die die Seite heute verwalten kann',missingShots:'Falls vorhanden, zeige auch: {list}.',uncertain:'⚠️ {count} Wert(e) wurden unsicher gelesen. Ein klarerer Screenshot kann den Plan verbessern.',final:'Geplante Summe',goal:'Ziel',margin:'Geplante Reserve',deficit:'Noch fehlend',stepDay:'Tag',stepPhotos:'Screenshots',stepStock:'Nutzbarer Bestand',stepPlan:'Plan',whyEasy:'Bevorzugt, weil relativ leicht ersetzbar.',whyUseful:'Wird genutzt, weil es heute nützliche Punkte bringt.',whyRare:'Wichtige Ressource: wird möglichst geschützt und nur bei Bedarf genutzt.',whyUniversal:'Flexible Ressource: wird möglichst für andere Tage aufgespart.',whyCombat:'Kampfschätzung: prüfe das echte Ergebnis immer im Spiel.',blocked:'Dieser Plan erreicht das Ziel noch nicht. Füge weitere Screenshots hinzu oder erhöhe eine verfügbare Ressource.',groups:{droneChest:'Drohnenkomponenten-Kisten (Stufen 1–7)',trainedTroops:'Trainierte Truppen (Stufen 1–10)',rivalKilled:'Rivale VS-Truppen eliminiert (Stufen 1–10)',otherKilled:'Andere Truppen eliminiert (Stufen 1–10)',lostTroops:'Verlorene Truppen (Stufen 1–10)'}},
    ro:{inventory:'Inventar',autoCalc:'Calcul automat',language:'Limbă',navigation:'Navigare',vsDay:'Zi VS',close:'Închide',scoreAria:'Puncte deja obținute',coverAlt:'GoMo VS Planner — obiectiv 7,2 M și program VS de luni până sâmbătă',
      title:'Asistent autonom',readyTitle:'Planul este gata',photosTitle:'Adaugă capturile',missingTitle:'Mai lipsesc puncte',doneTitle:'Obiectiv deja atins',wrongDayTitle:'Resurse recunoscute, dar nu pentru această zi',ready:'Site-ul are suficiente informații. Urmează lista și confirmă numai după ce ai folosit resursele în Last War.',photos:'Adaugă capturi clare cu inventarul. Site-ul citește cantitățile, alege resursele zilei corecte și calculează automat planul.',missing:'Stocul recunoscut nu este suficient. Dacă ai resursele de mai jos, adaugă și capturi cu ele. Site-ul recalculează automat.',done:'Ai atins deja obiectivul zilei. Păstrează resursele dacă alianța nu spune altfel.',wrongDay:'Au fost recunoscute resurse, dar niciuna nu oferă puncte în ziua VS selectată. Verifică ziua sau adaugă resursele zilei.',coverage:'Resurse pe care site-ul le poate gestiona astăzi',missingShots:'Dacă le ai, arată și: {list}.',uncertain:'⚠️ {count} valoare(i) au fost citite cu încredere scăzută. O captură mai clară poate îmbunătăți planul.',final:'Total planificat',goal:'Obiectiv',margin:'Marjă planificată',deficit:'Încă lipsesc',stepDay:'Zi',stepPhotos:'Capturi',stepStock:'Stoc util',stepPlan:'Plan',whyEasy:'Prioritate deoarece este relativ ușor de înlocuit.',whyUseful:'Folosit deoarece aduce puncte utile astăzi.',whyRare:'Resursă importantă: site-ul încearcă să o protejeze și o folosește doar dacă este necesar.',whyUniversal:'Resursă flexibilă: păstrată pe cât posibil pentru alte zile.',whyCombat:'Estimare de luptă: verifică întotdeauna rezultatul real în joc.',blocked:'Planul nu atinge încă obiectivul. Adaugă alte capturi sau mărește o resursă disponibilă înainte de confirmare.',groups:{droneChest:'Cufere componente dronă (nivelurile 1–7)',trainedTroops:'Trupe antrenate (nivelurile 1–10)',rivalKilled:'Trupe VS rivale eliminate (nivelurile 1–10)',otherKilled:'Alte trupe eliminate (nivelurile 1–10)',lostTroops:'Trupe pierdute (nivelurile 1–10)'}},
    uk:{inventory:'Інвентар',autoCalc:'Автоматичний розрахунок',language:'Мова',navigation:'Навігація',vsDay:'День VS',close:'Закрити',scoreAria:'Уже отримані очки',coverAlt:'GoMo VS Planner — ціль 7,2 млн і програма VS з понеділка по суботу',
      title:'Автономний помічник',readyTitle:'План готовий',photosTitle:'Додайте знімки',missingTitle:'Ще бракує очок',doneTitle:'Ціль уже досягнута',wrongDayTitle:'Ресурси розпізнано, але не для цього дня',ready:'Сайт має достатньо даних. Виконайте список нижче й підтверджуйте лише після використання цих ресурсів у Last War.',photos:'Додайте чіткі знімки інвентарю. Сайт зчитує кількість, вибирає ресурси потрібного дня й автоматично розраховує план.',missing:'Розпізнаного запасу ще недостатньо. Якщо у вас є ресурси зі списку нижче, додайте їхні знімки — сайт автоматично перерахує план.',done:'Денну ціль уже досягнуто. Збережіть ресурси, якщо альянс не дав іншої вказівки.',wrongDay:'Ресурси розпізнано, але жоден не дає очок у вибраний день VS. Перевірте день або додайте знімки ресурсів цього дня.',coverage:'Ресурси, які сайт уміє обробляти сьогодні',missingShots:'Якщо вони у вас є, покажіть також: {list}.',uncertain:'⚠️ {count} значення прочитано з низькою впевненістю. Чіткіший знімок може покращити план.',final:'Запланований підсумок',goal:'Ціль',margin:'Запланований запас',deficit:'Ще бракує',stepDay:'День',stepPhotos:'Знімки',stepStock:'Корисний запас',stepPlan:'План',whyEasy:'Пріоритет, бо ресурс відносно легко відновити.',whyUseful:'Використовується, бо сьогодні дає корисні очки.',whyRare:'Важливий ресурс: сайт намагається його берегти й використовує лише за потреби.',whyUniversal:'Універсальний ресурс: максимально зберігається для інших днів.',whyCombat:'Оцінка бою: завжди перевіряйте фактичний результат у грі.',blocked:'Цей план ще не досягає цілі. Додайте інші знімки або збільште доступний ресурс перед підтвердженням.',groups:{droneChest:'Скрині компонентів дрона (рівні 1–7)',trainedTroops:'Навчені війська (рівні 1–10)',rivalKilled:'Знищені війська суперника VS (рівні 1–10)',otherKilled:'Інші знищені війська (рівні 1–10)',lostTroops:'Втрачені війська (рівні 1–10)'}},
    ko:{inventory:'인벤토리',autoCalc:'자동 계산',language:'언어',navigation:'탐색',vsDay:'VS 요일',close:'닫기',scoreAria:'이미 획득한 점수',coverAlt:'GoMo VS Planner — 720만 목표 및 월요일부터 토요일까지의 VS 일정',
      title:'자동 안내 도우미',readyTitle:'계획이 준비되었습니다',photosTitle:'스크린샷을 추가하세요',missingTitle:'아직 점수가 부족합니다',doneTitle:'목표를 이미 달성했습니다',wrongDayTitle:'자원을 인식했지만 오늘 점수 자원이 아닙니다',ready:'사이트에 충분한 정보가 있습니다. 아래 목록을 게임에서 사용한 뒤에만 확인하세요.',photos:'인벤토리 수량이 선명한 스크린샷을 추가하세요. 사이트가 수량을 읽고 오늘 자원을 골라 계획을 자동 계산합니다.',missing:'인식된 재고만으로는 부족합니다. 아래 자원을 보유하고 있다면 해당 스크린샷도 추가하세요. 자동으로 다시 계산됩니다.',done:'오늘 목표를 이미 달성했습니다. 동맹 지시가 없다면 자원을 보관하세요.',wrongDay:'자원은 인식했지만 선택한 VS 요일에 점수를 주는 자원이 없습니다. 요일을 확인하거나 오늘 자원 스크린샷을 추가하세요.',coverage:'오늘 사이트가 처리할 수 있는 자원',missingShots:'보유하고 있다면 다음도 보여 주세요: {list}.',uncertain:'⚠️ {count}개 값의 인식 신뢰도가 낮습니다. 더 선명한 스크린샷으로 계획을 개선할 수 있습니다.',final:'예상 최종 점수',goal:'목표',margin:'예상 여유',deficit:'부족 점수',stepDay:'요일',stepPhotos:'스크린샷',stepStock:'유효 재고',stepPlan:'계획',whyEasy:'비교적 쉽게 다시 얻을 수 있어 우선 사용합니다.',whyUseful:'오늘 유효한 점수를 주기 때문에 사용합니다.',whyRare:'중요 자원: 최대한 보호하며 꼭 필요할 때만 사용합니다.',whyUniversal:'범용 자원: 다른 요일을 위해 가능한 한 보관합니다.',whyCombat:'전투 점수는 추정치입니다. 실제 게임 결과를 항상 확인하세요.',blocked:'아직 목표에 도달하지 못했습니다. 다른 스크린샷을 추가하거나 사용 가능한 자원 수량을 늘린 뒤 확인하세요.',groups:{droneChest:'드론 부품 상자 (레벨 1–7)',trainedTroops:'훈련한 병력 (레벨 1–10)',rivalKilled:'VS 상대 병력 처치 (레벨 1–10)',otherKilled:'기타 병력 처치 (레벨 1–10)',lostTroops:'손실 병력 (레벨 1–10)'}},
    hr:{inventory:'Inventar',autoCalc:'Automatski izračun',language:'Jezik',navigation:'Navigacija',vsDay:'VS dan',close:'Zatvori',scoreAria:'Već osvojeni bodovi',coverAlt:'GoMo VS Planner — cilj 7,2 M i VS program od ponedjeljka do subote',
      title:'Samostalni pomoćnik',readyTitle:'Plan je spreman',photosTitle:'Dodaj snimke',missingTitle:'Još nedostaju bodovi',doneTitle:'Cilj je već ostvaren',wrongDayTitle:'Resursi su prepoznati, ali ne za ovaj dan',ready:'Stranica ima dovoljno informacija. Slijedi popis i potvrdi tek nakon što upotrijebiš te resurse u Last Waru.',photos:'Dodaj jasne snimke inventara. Stranica čita količine, bira resurse pravog dana i automatski računa plan.',missing:'Prepoznata zaliha još nije dovoljna. Ako imaš dolje navedene resurse, dodaj i njihove snimke. Stranica će sve sama ponovno izračunati.',done:'Današnji cilj je već ostvaren. Sačuvaj resurse osim ako savez ne kaže drukčije.',wrongDay:'Resursi su prepoznati, ali nijedan ne donosi bodove odabranog VS dana. Provjeri dan ili dodaj snimke današnjih resursa.',coverage:'Resursi koje stranica danas može obraditi',missingShots:'Ako ih imaš, pokaži i: {list}.',uncertain:'⚠️ {count} vrijednost(i) pročitana(e) je s niskom pouzdanošću. Jasnija snimka može poboljšati plan.',final:'Planirani ukupni rezultat',goal:'Cilj',margin:'Planirana margina',deficit:'Još nedostaje',stepDay:'Dan',stepPhotos:'Snimke',stepStock:'Korisna zaliha',stepPlan:'Plan',whyEasy:'Prioritet jer ga je relativno lako nadoknaditi.',whyUseful:'Koristi se jer danas daje korisne bodove.',whyRare:'Važan resurs: stranica ga pokušava sačuvati i koristi samo kad je nužno.',whyUniversal:'Fleksibilan resurs: čuva se koliko god je moguće za druge dane.',whyCombat:'Procjena borbe: uvijek provjeri stvarni rezultat u igri.',blocked:'Ovaj plan još ne doseže cilj. Dodaj druge snimke ili povećaj dostupan resurs prije potvrde.',groups:{droneChest:'Škrinje komponenti drona (razine 1–7)',trainedTroops:'Trenirane trupe (razine 1–10)',rivalKilled:'Eliminirane rivalske VS trupe (razine 1–10)',otherKilled:'Druge eliminirane trupe (razine 1–10)',lostTroops:'Izgubljene trupe (razine 1–10)'}},
    pt:{inventory:'Inventário',autoCalc:'Cálculo automático',language:'Idioma',navigation:'Navegação',vsDay:'Dia VS',close:'Fechar',scoreAria:'Pontos já obtidos',coverAlt:'GoMo VS Planner — objetivo 7,2 M e programa VS de segunda a sábado',
      title:'Assistente autónomo',readyTitle:'O teu plano está pronto',photosTitle:'Adiciona as capturas',missingTitle:'Ainda faltam pontos',doneTitle:'Objetivo já atingido',wrongDayTitle:'Recursos reconhecidos, mas não para este dia',
      ready:'O site já tem informação suficiente. Segue a lista abaixo e confirma apenas depois de utilizares estes recursos no Last War.',
      photos:'Adiciona capturas nítidas do inventário. O site lê as quantidades, escolhe os recursos do dia correto e calcula o plano automaticamente.',
      missing:'O stock reconhecido ainda não chega. Se tiveres os recursos indicados abaixo, adiciona também capturas deles. O site recalcula tudo sozinho.',
      done:'Já atingiste o objetivo do dia. Guarda os recursos para os próximos dias, salvo indicação contrária da aliança.',
      wrongDay:'Foram reconhecidos recursos, mas nenhum dá pontos no dia VS selecionado. Confirma o dia ou adiciona capturas dos recursos que pontuam hoje.',
      coverage:'Recursos que o site sabe gerir hoje',missingShots:'Se os tiveres, mostra também: {list}.',uncertain:'⚠️ {count} valor(es) foram lidos com baixa confiança. Uma captura mais nítida pode melhorar o plano.',
      final:'Total previsto',goal:'Objetivo',margin:'Margem prevista',deficit:'Ainda em falta',stepDay:'Dia',stepPhotos:'Capturas',stepStock:'Stock útil',stepPlan:'Plano',
      whyEasy:'Prioritário porque é relativamente fácil de repor.',whyUseful:'Utilizado porque dá pontos úteis hoje.',whyRare:'Recurso importante: o site tenta preservá-lo e só o utiliza quando é necessário.',whyUniversal:'Recurso versátil: é preservado tanto quanto possível para outros dias.',whyCombat:'Estimativa de combate: confirma sempre o resultado real no jogo.',
      blocked:'Este plano ainda não atinge o objetivo. Adiciona mais capturas ou aumenta um recurso disponível antes de confirmar.',
      groups:{droneChest:'Cofres de componentes do drone (níveis 1–7)',trainedTroops:'Tropas treinadas (níveis 1–10)',rivalKilled:'Tropas VS rivais eliminadas (níveis 1–10)',otherKilled:'Outras tropas eliminadas (níveis 1–10)',lostTroops:'Tropas perdidas (níveis 1–10)'}}
  };

  const tx = () => UI[state.language] || UI.fr;
  const fill = (text, vars={}) => { let out=String(text||''); for(const [k,v] of Object.entries(vars)) out=out.replaceAll(`{${k}}`,String(v)); return out; };

  // Old 300k was the original untouched default. Migrate it once to the new 100k autonomous default.
  try{
    if(!localStorage.getItem(V231_FLAG)){
      if(Number(state.profile?.margin)===300000) state.profile.margin=100000;
      localStorage.setItem(V231_FLAG,'1');
      saveState();
    }
  }catch{}

  // Broaden Portuguese OCR aliases over the whole current resource catalogue.
  if(typeof OCR_EXTRA_ALIASES==='object'){
    const add=(key,...aliases)=>{OCR_EXTRA_ALIASES[key]=[...(OCR_EXTRA_ALIASES[key]||[]),...aliases];};
    add('stamina','energia','vigor','stamina','pontos de energia');
    add('radarTasks','missao de radar','missoes de radar','tarefa de radar','tarefas de radar');
    add('foodLots','alimentos','comida','alimento recolhido','alimentos recolhidos');
    add('ironLots','ferro','ferro recolhido');
    add('coinLots','moedas','moeda','moedas recolhidas');
    add('skillChipPremium','cofre premium de chip','cofres premium de chip','cofre de chip premium','cofres de chip premium');
    add('packDiamondsD1','diamantes','diamantes de pacote','diamantes de pacotes');
    add('packDiamondsD2','diamantes','diamantes de pacote','diamantes de pacotes');
    add('packDiamondsD3','diamantes','diamantes de pacote','diamantes de pacotes');
    add('packDiamondsD4','diamantes','diamantes de pacote','diamantes de pacotes');
    add('packDiamondsD6','diamantes','diamantes de pacote','diamantes de pacotes');
    add('buildingPower','poder de edificio','poder de construcao','potencia de edificio');
    add('techPower','poder tecnologico','poder de tecnologia','potencia tecnologica');
    add('ssrShards','fragmento ssr','fragmentos ssr','fragmento de heroi ssr','fragmentos de heroi ssr');
    add('rareShards','fragmento r','fragmentos r','fragmento raro','fragmentos raros');
    for(let n=1;n<=7;n++) add(`droneChest${n}`,`cofre componente drone nivel ${n}`,`cofre de componente do drone nivel ${n}`,`componentes drone nivel ${n}`);
    for(let n=1;n<=10;n++){
      add(`trainT${n}`,`tropas nivel ${n} treinadas`,`tropas nivel ${n} treinado`,`treino tropas nivel ${n}`);
      add(`rivalKillT${n}`,`tropas rivais nivel ${n} eliminadas`,`tropas vs nivel ${n} eliminadas`,`inimigos nivel ${n} eliminados`);
      add(`otherKillT${n}`,`outras tropas nivel ${n} eliminadas`,`tropas nivel ${n} eliminadas`);
      add(`lostT${n}`,`tropas nivel ${n} perdidas`,`perdas nivel ${n}`);
    }
  }

  // Portuguese server/level noise should not be mistaken for inventory quantities.
  if(typeof shouldIgnoreOcrLine==='function'){
    const oldIgnore=shouldIgnoreOcrLine;
    shouldIgnoreOcrLine=function(line){
      const n=normalizeOcrText(line), nums=numericTokens(line);
      if(/\b(servidor|quartel general|nivel)\b/.test(n) && nums.length===1 && !/tropas|cofre|componente/.test(n)) return true;
      return oldIgnore(line);
    };
  }

  function ensureStyles(){
    if(document.getElementById('gomo-v231-style'))return;
    const style=document.createElement('style');
    style.id='gomo-v231-style';
    style.textContent=`
      .gomo-v231-panel{border:1px solid rgba(91,211,255,.5);background:linear-gradient(180deg,rgba(13,54,75,.94),rgba(7,34,51,.94))}
      .gomo-v231-head{display:flex;gap:12px;align-items:flex-start}.gomo-v231-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:50%;background:rgba(91,211,255,.15);font-size:22px;flex:0 0 auto}
      .gomo-v231-head h2{margin:1px 0 5px;font-size:20px}.gomo-v231-head p{margin:0;line-height:1.45}
      .gomo-v231-checks{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:14px 0 10px}.gomo-v231-check{padding:8px 5px;border-radius:12px;text-align:center;background:rgba(255,255,255,.055);font-size:11px;line-height:1.2}.gomo-v231-check b{display:block;font-size:16px;margin-bottom:3px}.gomo-v231-check.ok b{color:#7ee6b3}.gomo-v231-check.warn b{color:#ffd27a}
      .gomo-v231-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px}.gomo-v231-metrics article{padding:9px;border-radius:12px;background:rgba(255,255,255,.055)}.gomo-v231-metrics span{display:block;font-size:10px;opacity:.78}.gomo-v231-metrics strong{display:block;margin-top:4px;font-size:15px}
      .gomo-v231-details{margin-top:12px}.gomo-v231-details summary{cursor:pointer;font-weight:800}.gomo-v231-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}.gomo-v231-tags span{padding:6px 8px;border-radius:999px;background:rgba(91,211,255,.1);border:1px solid rgba(91,211,255,.22);font-size:11px}
      .gomo-v231-note{margin:10px 0 0;padding:9px 10px;border-radius:11px;background:rgba(255,210,122,.09);border:1px solid rgba(255,210,122,.2);font-size:12px;line-height:1.4}
      .gomo-v231-reason{display:block;margin-top:4px;font-size:11px;line-height:1.3;color:#bfeaff;font-weight:600}
      @media(max-width:520px){.gomo-v231-checks{grid-template-columns:repeat(2,minmax(0,1fr))}.gomo-v231-metrics{grid-template-columns:1fr}.gomo-v231-head h2{font-size:18px}}
    `;
    document.head.appendChild(style);
  }

  function ensurePanel(){
    if(document.getElementById('gomoAutopilotPanel'))return;
    const welcome=document.querySelector('.ultra-welcome');
    if(!welcome)return;
    const panel=document.createElement('section');
    panel.className='panel gomo-v231-panel';panel.id='gomoAutopilotPanel';
    panel.innerHTML=`<div class="gomo-v231-head"><span class="gomo-v231-icon">🧭</span><div><p class="eyebrow" id="gomoV231Label"></p><h2 id="gomoV231Title"></h2><p id="gomoV231Message"></p></div></div><div class="gomo-v231-checks" id="gomoV231Checks"></div><div class="gomo-v231-metrics" id="gomoV231Metrics"></div><details class="gomo-v231-details"><summary id="gomoV231CoverageTitle"></summary><div class="gomo-v231-tags" id="gomoV231Coverage"></div><p class="gomo-v231-note hidden" id="gomoV231Missing"></p><p class="gomo-v231-note hidden" id="gomoV231Uncertain"></p></details>`;
    welcome.insertAdjacentElement('afterend',panel);
  }

  function resourceGroups(){
    const d=day(), groups=new Map();
    for(const item of d.items){
      const key=item.labelKey;
      if(!groups.has(key))groups.set(key,[]);
      groups.get(key).push(item);
    }
    return [...groups.entries()].map(([key,items])=>{
      const special=tx().groups?.[key];
      const label=special||itemLabel(items[0]);
      const owned=items.some(i=>getStock(i)>0);
      return {key,label,items,owned};
    });
  }

  function uncertainCount(){
    try{return (Array.isArray(ocrRows)?ocrRows:[]).filter(r=>r&&r.target&&Number(r.confidence)<55).length;}catch{return 0;}
  }

  function currentStatus(){
    const plan=calculatePlan(), potential=inventoryPotential(state.selectedDay,true), current=Math.max(0,Number(state.currentPoints[state.selectedDay]||0));
    if(current>=plan.goal)return{kind:'done',plan,potential};
    if(lastAutoScanSummary&&lastAutoScanSummary.count>0&&lastAutoScanSummary.relevantCount===0)return{kind:'wrongDay',plan,potential};
    if(potential<=0)return{kind:'photos',plan,potential};
    if(plan.reached)return{kind:'ready',plan,potential};
    return{kind:'missing',plan,potential};
  }

  function updatePanel(){
    ensureStyles();ensurePanel();
    const panel=document.getElementById('gomoAutopilotPanel');if(!panel)return;
    const x=tx(), s=currentStatus(), plan=s.plan;
    document.getElementById('gomoV231Label').textContent=x.title;
    document.getElementById('gomoV231Title').textContent=x[`${s.kind}Title`]||x.title;
    document.getElementById('gomoV231Message').textContent=x[s.kind]||'';
    const hasStock=s.potential>0, hasPlan=Boolean(plan.reached), scanSeen=(()=>{try{return (Array.isArray(ocrFiles)&&ocrFiles.length>0)||Boolean(lastAutoScanSummary);}catch{return Boolean(lastAutoScanSummary);}})();
    const checks=[
      [x.stepDay,true],[x.stepPhotos,scanSeen||hasStock],[x.stepStock,hasStock],[x.stepPlan,hasPlan||Number(plan.current)>=Number(plan.goal)]
    ];
    document.getElementById('gomoV231Checks').innerHTML=checks.map(([label,ok])=>`<div class="gomo-v231-check ${ok?'ok':'warn'}"><b>${ok?'✓':'!'}</b>${escapeHtml(label)}</div>`).join('');
    const delta=Number(plan.finalPoints)-Number(plan.goal);
    document.getElementById('gomoV231Metrics').innerHTML=`<article><span>${escapeHtml(x.goal)}</span><strong>${fmt(Math.floor(plan.goal))}</strong></article><article><span>${escapeHtml(x.final)}</span><strong>${fmt(Math.floor(plan.finalPoints))}</strong></article><article><span>${escapeHtml(delta>=0?x.margin:x.deficit)}</span><strong>${fmt(Math.floor(Math.abs(delta)))}</strong></article>`;
    const groups=resourceGroups();
    document.getElementById('gomoV231CoverageTitle').textContent=x.coverage;
    document.getElementById('gomoV231Coverage').innerHTML=groups.map(g=>`<span>${escapeHtml(g.label)}</span>`).join('');
    const missing=groups.filter(g=>!g.owned).slice(0,6);
    const missingNode=document.getElementById('gomoV231Missing');
    if((s.kind==='missing'||s.kind==='photos'||s.kind==='wrongDay')&&missing.length){missingNode.textContent=fill(x.missingShots,{list:missing.map(g=>g.label).join(', ')});missingNode.classList.remove('hidden');}else missingNode.classList.add('hidden');
    const low=uncertainCount(), uncertainNode=document.getElementById('gomoV231Uncertain');
    if(low>0){uncertainNode.textContent=fill(x.uncertain,{count:low});uncertainNode.classList.remove('hidden');}else uncertainNode.classList.add('hidden');
  }

  function applyStaticTranslations(){
    const x=tx(), tags=document.querySelectorAll('.gomo-hero-tags span');
    if(tags[1])tags[1].textContent=x.inventory;
    if(tags[2])tags[2].textContent=x.autoCalc;
    const lang=document.getElementById('languageSelect');if(lang)lang.setAttribute('aria-label',x.language);
    document.querySelector('.main-nav')?.setAttribute('aria-label',x.navigation);
    document.querySelectorAll('#dayStrip,#assistantDayStrip').forEach(n=>n.setAttribute('aria-label',x.vsDay));
    document.getElementById('simpleCurrentPointsInput')?.setAttribute('aria-label',x.scoreAria);
    document.getElementById('simpleRecapClose')?.setAttribute('aria-label',x.close);
    const cover=document.querySelector('.gomo-cover img');if(cover)cover.alt=x.coverAlt;
    // Replace the French kilobyte abbreviation left by the original preview renderer.
    if(state.language!=='fr')document.querySelectorAll('.ocr-preview-card span').forEach(n=>{if(/\sKo$/.test(n.textContent||''))n.textContent=n.textContent.replace(/\sKo$/,' KB');});
  }

  function reasonForItem(item){
    const x=tx();if(!item)return'';
    if(String(item.stockKey||'')==='universalSpeed')return x.whyUniversal;
    if(String(item.stockKey||'').includes('Kill')||String(item.stockKey||'').startsWith('lostT'))return x.whyCombat;
    if(Number(item.scarcity)>=4||Number(item.eco)>=5)return x.whyRare;
    if(Number(item.scarcity)<=2&&Number(item.eco)<=2)return x.whyEasy;
    return x.whyUseful;
  }

  function annotatePlan(){
    document.querySelectorAll('.ultra-plan-action').forEach(card=>{
      if(card.querySelector('.gomo-v231-reason'))return;
      const title=card.querySelector('h3')?.textContent?.trim();if(!title)return;
      const item=day().items.find(i=>itemLabel(i)===title);if(!item)return;
      const note=document.createElement('small');note.className='gomo-v231-reason';note.textContent=reasonForItem(item);card.querySelector('div:nth-of-type(1)')?.appendChild(note);
    });
  }

  // Keep autonomous UI up to date after every normal render/recalculation.
  const oldApplyTranslations=applyTranslations;
  applyTranslations=function(){oldApplyTranslations();applyStaticTranslations();};

  const oldRenderSimplePoints=renderSimplePoints;
  renderSimplePoints=function(){oldRenderSimplePoints();applyStaticTranslations();annotatePlan();updatePanel();};

  const oldRenderUltraPlanList=renderUltraPlanList;
  renderUltraPlanList=function(plan){oldRenderUltraPlanList(plan);setTimeout(annotatePlan,0);};

  const oldRenderOcrPreviews=renderOcrPreviews;
  renderOcrPreviews=function(){oldRenderOcrPreviews();applyStaticTranslations();};

  // Prevent accepting an incomplete plan. The original handler was already bound, so intercept in capture phase.
  const applyBtn=document.getElementById('simpleApplyBtn');
  if(applyBtn&&!applyBtn.dataset.v231Guard){
    applyBtn.dataset.v231Guard='1';
    applyBtn.addEventListener('click',event=>{
      const plan=calculatePlan();if(plan.reached||Number(plan.current)>=Number(plan.goal))return;
      event.preventDefault();event.stopImmediatePropagation();
      updatePanel();showToast(tx().blocked);
      document.getElementById('gomoAutopilotPanel')?.scrollIntoView({behavior:'smooth',block:'start'});
    },true);
  }

  // Refresh autonomous panel after language/day changes and uploads.
  document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(()=>{applyStaticTranslations();updatePanel();annotatePlan();},0));
  document.addEventListener('change',e=>{if(e.target?.matches?.('#ocrInput,#ocrCameraInput,#quickAutoDay,#autoDay'))setTimeout(updatePanel,50);});
  document.addEventListener('click',e=>{if(e.target?.closest?.('[data-day],#quickNextDayBtn,#simpleDayToggle,#economyWeekBtn,[data-simple-choice],[data-plan-delta]'))setTimeout(updatePanel,40);});

  // Initial refresh after v2.30 is fully loaded.
  setTimeout(()=>{applyStaticTranslations();updatePanel();annotatePlan();renderAll();},0);
})();
