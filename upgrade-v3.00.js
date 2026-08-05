'use strict';

/*
  GoMo VS Planner v3.00 — Assistant automatique
  Objectif : l'utilisateur envoie ses captures, valide les lectures,
  indique les actions qu'il compte faire, puis GoMo prépare un plan proche de 7,3 M.

  Cette couche conserve le moteur et les données existants. Les valeurs de points
  proviennent du catalogue actif du VS Planner (DAYS + overrides du joueur).
*/

(() => {
  const VERSION = '3.00.0';
  const TARGET = 7_300_000;
  const OCR_SAFE = 70;
  const CUSTOM_KEY = 'gomo_vs_planner_v300';

  const TX = {
    fr:{
      eyebrow:'ASSISTANT AUTOMATIQUE',title:'GoMo prépare tes 7,3 M',subtitle:'Ajoute tes captures, vérifie ce qui a été reconnu et valide. Le Planner fait le reste.',
      player:'Joueur',day:'Jour VS',capture:'1. Captures',inventory:'2. Inventaire',actions:'3. Actions',plan:'4. Plan 7,3 M',
      captureTitle:'Ajoute tes captures',captureHelp:'Inventaire, accélérateurs, coffres et score VS. Tu peux sélectionner plusieurs images en une fois.',choose:'📸 Ajouter mes captures',reading:'Lecture des captures…',nothing:'Aucune capture analysée pour le moment.',
      recognized:'Valeurs reconnues',safe:'Sûr',check:'À vérifier',validateSafe:'✅ Valider les valeurs cochées',ignore:'Ignorer ces lectures',details:'Voir la lecture détaillée',validated:'Inventaire mis à jour.',
      inventoryTitle:'Inventaire complet',inventoryHelp:'Toutes les quantités utiles sont visibles ensemble. Tu peux corriger directement une valeur.',today:'Aujourd’hui',week:'Toute la semaine',potential:'Potentiel affiché',qty:'Quantité',ppu:'Valeur',possible:'Points possibles',use:'Utiliser',keep:'Garder',
      exactValues:'Valeurs de référence',exactHelp:'Les niveaux sont séparés. Exemple : chaque niveau de coffre drone garde sa propre valeur.',copyValues:'Copier les valeurs',
      actionsTitle:'Ce que tu comptes faire',actionsHelp:'Active seulement ce que tu prévois réellement de faire aujourd’hui. Ces points seront comptés avant de dépenser des ressources.',planned:'Prévu',count:'Nombre',notToday:'Pas compté ce jour',unknown:'Valeur à confirmer',sleigh:'Traîneau UR',sleighHelp:'Prévu dans la base, mais non compté tant que sa valeur exacte n’est pas confirmée.',
      planTitle:'Ton plan automatique',planHelp:'GoMo vise environ 7,3 M et garde le reste autant que possible.',prepare:'✨ Préparer mes 7,3 M',already:'Points déjà obtenus',actionPoints:'Actions prévues',resourcePoints:'Ressources à utiliser',final:'Total estimé',missing:'Manque encore',ready:'Plan prêt',insufficient:'Stock insuffisant',
      actionsPart:'Actions prévues',resourcesPart:'Ressources à utiliser',noActions:'Aucune action supplémentaire sélectionnée.',noResources:'Aucune ressource supplémentaire nécessaire.',copyPlan:'📋 Copier mon plan',used:'✅ J’ai utilisé ce plan',
      verifyTitle:'Vérifie seulement le résultat',verifyHelp:'Le Planner a fait son estimation. Confirme le score réel pour améliorer le suivi.',yes:'Oui, 7,3 M atteint',no:'Non, pas encore',actual:'Score VS réel',saveActual:'Enregistrer',saved:'Score enregistré.',
      advanced:'Options avancées',advancedHelp:'Les anciens réglages restent disponibles ici si une valeur doit être corrigée plus tard.',showOld:'Afficher l’ancien calculateur',hideOld:'Masquer l’ancien calculateur',
      copyDone:'Copié.',copyFail:'Copie impossible.',profileDefault:'Valeurs GoMo actives',goal:'Objectif',points:'pts',minute:'min',baseValue:'base',yourValue:'profil',
      noRows:'Aucune valeur exploitable reconnue. Essaie une capture plus nette.',confidence:'fiabilité',currentScore:'Score VS',
      actionRadar:'Tâches radar',actionTruck:'Camions UR',actionMission:'Missions légendaires / UR',actionBuilding:'Puissance bâtiment',actionTech:'Puissance technologie',actionRecruit:'Recrutements survivants',actionPack:'Diamants de packs',actionTrain:'Troupes entraînées',actionRival:'Troupes adverses éliminées',actionOther:'Autres troupes éliminées',actionLost:'Pertes déjà subies',actionStamina:'Endurance utilisée',actionHarvest:'Récolte',
      confirmUsed:'Confirme uniquement après avoir réellement utilisé les ressources du plan.',
      learn:'Le Planner utilise les valeurs enregistrées pour ce joueur. Les valeurs variables pourront être affinées plus tard sans changer l’interface.'
    },
    en:{
      eyebrow:'AUTOMATIC ASSISTANT',title:'GoMo prepares your 7.3M',subtitle:'Add screenshots, check what was recognised and confirm. The Planner does the rest.',player:'Player',day:'VS day',capture:'1. Screenshots',inventory:'2. Inventory',actions:'3. Actions',plan:'4. 7.3M plan',captureTitle:'Add your screenshots',captureHelp:'Inventory, speed-ups, chests and VS score. Select several images at once.',choose:'📸 Add my screenshots',reading:'Reading screenshots…',nothing:'No screenshot analysed yet.',recognized:'Recognised values',safe:'Safe',check:'Check',validateSafe:'✅ Confirm checked values',ignore:'Ignore readings',details:'Open detailed reading',validated:'Inventory updated.',inventoryTitle:'Full inventory',inventoryHelp:'All useful quantities are visible together. Correct any value directly.',today:'Today',week:'Whole week',potential:'Visible potential',qty:'Quantity',ppu:'Value',possible:'Possible points',use:'Use',keep:'Keep',exactValues:'Reference values',exactHelp:'Levels are separate. Each drone chest level keeps its own point value.',copyValues:'Copy values',actionsTitle:'What you plan to do',actionsHelp:'Enable only actions you really plan to do today. These points are counted before spending resources.',planned:'Planned',count:'Count',notToday:'Not counted today',unknown:'Value to confirm',sleigh:'UR sleigh',sleighHelp:'Prepared in the database, but not counted until its exact value is confirmed.',planTitle:'Your automatic plan',planHelp:'GoMo aims for about 7.3M and saves the rest when possible.',prepare:'✨ Prepare my 7.3M',already:'Points already earned',actionPoints:'Planned actions',resourcePoints:'Resources to use',final:'Estimated total',missing:'Still missing',ready:'Plan ready',insufficient:'Insufficient stock',actionsPart:'Planned actions',resourcesPart:'Resources to use',noActions:'No extra action selected.',noResources:'No extra resource needed.',copyPlan:'📋 Copy my plan',used:'✅ I used this plan',verifyTitle:'Only check the result',verifyHelp:'The Planner made its estimate. Confirm the real score to improve tracking.',yes:'Yes, 7.3M reached',no:'No, not yet',actual:'Real VS score',saveActual:'Save',saved:'Score saved.',advanced:'Advanced options',advancedHelp:'The old settings remain here if a value must be corrected later.',showOld:'Show old calculator',hideOld:'Hide old calculator',copyDone:'Copied.',copyFail:'Copy failed.',profileDefault:'GoMo values active',goal:'Target',points:'pts',minute:'min',baseValue:'base',yourValue:'profile',noRows:'No usable value recognised. Try a clearer screenshot.',confidence:'confidence',currentScore:'VS score',actionRadar:'Radar tasks',actionTruck:'UR trucks',actionMission:'Legendary / UR tasks',actionBuilding:'Building power',actionTech:'Tech power',actionRecruit:'Survivor recruits',actionPack:'Pack diamonds',actionTrain:'Troops trained',actionRival:'Rival troops killed',actionOther:'Other troops killed',actionLost:'Losses already suffered',actionStamina:'Stamina used',actionHarvest:'Gathering',confirmUsed:'Confirm only after actually using the resources in the plan.',learn:'The Planner uses the values saved for this player. Variable values can be refined later without changing the interface.'
    },
    de:{eyebrow:'AUTOMATISCHER ASSISTENT',title:'GoMo plant deine 7,3 Mio.',subtitle:'Screenshots hinzufügen, Erkennung prüfen und bestätigen. Den Rest erledigt der Planner.',player:'Spieler',day:'VS-Tag',capture:'1. Screenshots',inventory:'2. Inventar',actions:'3. Aktionen',plan:'4. Plan 7,3 Mio.',captureTitle:'Screenshots hinzufügen',captureHelp:'Inventar, Beschleuniger, Kisten und VS-Punktzahl. Mehrere Bilder gleichzeitig möglich.',choose:'📸 Screenshots hinzufügen',reading:'Screenshots werden gelesen…',nothing:'Noch kein Screenshot analysiert.',recognized:'Erkannte Werte',safe:'Sicher',check:'Prüfen',validateSafe:'✅ Markierte Werte bestätigen',ignore:'Erkennung ignorieren',details:'Detaillierte Erkennung',validated:'Inventar aktualisiert.',inventoryTitle:'Gesamtes Inventar',inventoryHelp:'Alle nützlichen Mengen auf einem Bildschirm.',today:'Heute',week:'Ganze Woche',potential:'Potenzial',qty:'Menge',ppu:'Wert',possible:'Mögliche Punkte',use:'Nutzen',keep:'Sparen',exactValues:'Referenzwerte',exactHelp:'Jede Stufe hat ihren eigenen Punktewert.',copyValues:'Werte kopieren',actionsTitle:'Geplante Aktionen',actionsHelp:'Nur aktivieren, was du heute wirklich machst.',planned:'Geplant',count:'Anzahl',notToday:'Heute nicht gezählt',unknown:'Wert zu bestätigen',sleigh:'UR-Schlitten',sleighHelp:'Vorbereitet, wird aber erst nach Bestätigung des exakten Werts gezählt.',planTitle:'Automatischer Plan',planHelp:'GoMo zielt auf ungefähr 7,3 Mio. und spart den Rest.',prepare:'✨ Meine 7,3 Mio. planen',already:'Bereits erreicht',actionPoints:'Geplante Aktionen',resourcePoints:'Ressourcen',final:'Geschätzte Summe',missing:'Fehlt noch',ready:'Plan bereit',insufficient:'Bestand reicht nicht',actionsPart:'Geplante Aktionen',resourcesPart:'Ressourcen nutzen',noActions:'Keine zusätzliche Aktion ausgewählt.',noResources:'Keine zusätzliche Ressource nötig.',copyPlan:'📋 Plan kopieren',used:'✅ Plan wurde genutzt',verifyTitle:'Nur Ergebnis prüfen',verifyHelp:'Bestätige danach die echte VS-Punktzahl.',yes:'Ja, 7,3 Mio. erreicht',no:'Nein, noch nicht',actual:'Echte VS-Punkte',saveActual:'Speichern',saved:'Punktzahl gespeichert.',advanced:'Erweiterte Optionen',advancedHelp:'Alte Einstellungen bleiben für spätere Korrekturen verfügbar.',showOld:'Alten Rechner anzeigen',hideOld:'Alten Rechner ausblenden',copyDone:'Kopiert.',copyFail:'Kopieren nicht möglich.',profileDefault:'GoMo-Werte aktiv',goal:'Ziel',points:'Pkt.',minute:'Min.',baseValue:'Basis',yourValue:'Profil',noRows:'Keine brauchbaren Werte erkannt.',confidence:'Sicherheit',currentScore:'VS-Punkte',actionRadar:'Radaraufgaben',actionTruck:'UR-LKW',actionMission:'Legendäre / UR-Aufgaben',actionBuilding:'Gebäudestärke',actionTech:'Technologiestärke',actionRecruit:'Überlebende rekrutieren',actionPack:'Diamanten aus Paketen',actionTrain:'Truppen trainiert',actionRival:'Gegnerische Truppen besiegt',actionOther:'Andere Truppen besiegt',actionLost:'Bereits erlittene Verluste',actionStamina:'Ausdauer genutzt',actionHarvest:'Sammeln',confirmUsed:'Nur bestätigen, nachdem die Ressourcen wirklich genutzt wurden.',learn:'Der Planner nutzt die für diesen Spieler gespeicherten Werte.'},
    pt:{eyebrow:'ASSISTENTE AUTOMÁTICO',title:'A GoMo prepara os teus 7,3 M',subtitle:'Adiciona capturas, verifica o que foi reconhecido e confirma. O Planner faz o resto.',player:'Jogador',day:'Dia VS',capture:'1. Capturas',inventory:'2. Inventário',actions:'3. Ações',plan:'4. Plano 7,3 M',captureTitle:'Adiciona as tuas capturas',captureHelp:'Inventário, aceleradores, cofres e pontuação VS. Podes selecionar várias imagens.',choose:'📸 Adicionar capturas',reading:'A ler as capturas…',nothing:'Nenhuma captura analisada.',recognized:'Valores reconhecidos',safe:'Seguro',check:'Verificar',validateSafe:'✅ Validar valores selecionados',ignore:'Ignorar leituras',details:'Ver leitura detalhada',validated:'Inventário atualizado.',inventoryTitle:'Inventário completo',inventoryHelp:'Todas as quantidades úteis aparecem juntas.',today:'Hoje',week:'Semana inteira',potential:'Potencial',qty:'Quantidade',ppu:'Valor',possible:'Pontos possíveis',use:'Usar',keep:'Guardar',exactValues:'Valores de referência',exactHelp:'Cada nível mantém o seu próprio valor de pontos.',copyValues:'Copiar valores',actionsTitle:'O que pretendes fazer',actionsHelp:'Ativa apenas as ações que realmente vais fazer hoje.',planned:'Previsto',count:'Número',notToday:'Não conta hoje',unknown:'Valor a confirmar',sleigh:'Trenó UR',sleighHelp:'Preparado na base, mas não é contado enquanto o valor exato não for confirmado.',planTitle:'Plano automático',planHelp:'A GoMo aponta para cerca de 7,3 M e poupa o resto.',prepare:'✨ Preparar os meus 7,3 M',already:'Pontos já obtidos',actionPoints:'Ações previstas',resourcePoints:'Recursos a usar',final:'Total estimado',missing:'Ainda faltam',ready:'Plano pronto',insufficient:'Stock insuficiente',actionsPart:'Ações previstas',resourcesPart:'Recursos a usar',noActions:'Nenhuma ação extra selecionada.',noResources:'Nenhum recurso extra necessário.',copyPlan:'📋 Copiar o plano',used:'✅ Usei este plano',verifyTitle:'Só falta verificar o resultado',verifyHelp:'Confirma a pontuação VS real.',yes:'Sim, 7,3 M atingidos',no:'Não, ainda não',actual:'Pontuação VS real',saveActual:'Guardar',saved:'Pontuação guardada.',advanced:'Opções avançadas',advancedHelp:'As definições antigas continuam disponíveis para correções.',showOld:'Mostrar calculador antigo',hideOld:'Ocultar calculador antigo',copyDone:'Copiado.',copyFail:'Não foi possível copiar.',profileDefault:'Valores GoMo ativos',goal:'Objetivo',points:'pts',minute:'min',baseValue:'base',yourValue:'perfil',noRows:'Nenhum valor útil reconhecido.',confidence:'confiança',currentScore:'Pontuação VS',actionRadar:'Tarefas radar',actionTruck:'Camiões UR',actionMission:'Missões lendárias / UR',actionBuilding:'Poder de edifício',actionTech:'Poder tecnológico',actionRecruit:'Recrutamentos de sobreviventes',actionPack:'Diamantes de packs',actionTrain:'Tropas treinadas',actionRival:'Tropas rivais eliminadas',actionOther:'Outras tropas eliminadas',actionLost:'Perdas já sofridas',actionStamina:'Energia usada',actionHarvest:'Recolha',confirmUsed:'Confirma apenas depois de usares realmente os recursos.',learn:'O Planner utiliza os valores guardados para este jogador.'}
  };

  // Short fallbacks for the other supported languages. Resource names still come from the main app translations.
  TX.ro={...TX.en,title:'GoMo îți pregătește 7,3 M',subtitle:'Adaugă capturile, verifică valorile și confirmă. Planner-ul face restul.',player:'Jucător',day:'Zi VS',capture:'1. Capturi',inventory:'2. Inventar',actions:'3. Acțiuni',plan:'4. Plan 7,3 M',choose:'📸 Adaugă capturile',prepare:'✨ Pregătește 7,3 M',copyPlan:'📋 Copiază planul',used:'✅ Am folosit planul'};
  TX.uk={...TX.en,title:'GoMo готує твої 7,3 M',subtitle:'Додай знімки, перевір розпізнане та підтвердь. Решту зробить Planner.',player:'Гравець',day:'День VS',capture:'1. Знімки',inventory:'2. Інвентар',actions:'3. Дії',plan:'4. План 7,3 M',choose:'📸 Додати знімки',prepare:'✨ Підготувати 7,3 M',copyPlan:'📋 Копіювати план',used:'✅ Я використав план'};
  TX.ko={...TX.en,title:'GoMo가 730만 점 계획을 준비합니다',subtitle:'스크린샷을 추가하고 인식된 값만 확인하세요. 나머지는 Planner가 계산합니다.',player:'플레이어',day:'VS 요일',capture:'1. 스크린샷',inventory:'2. 인벤토리',actions:'3. 행동',plan:'4. 730만 계획',choose:'📸 스크린샷 추가',prepare:'✨ 730만 계획 만들기',copyPlan:'📋 계획 복사',used:'✅ 계획 사용 완료'};
  TX.hr={...TX.en,title:'GoMo priprema tvojih 7,3 M',subtitle:'Dodaj snimke, provjeri prepoznato i potvrdi. Planner radi ostalo.',player:'Igrač',day:'VS dan',capture:'1. Snimke',inventory:'2. Inventar',actions:'3. Akcije',plan:'4. Plan 7,3 M',choose:'📸 Dodaj snimke',prepare:'✨ Pripremi 7,3 M',copyPlan:'📋 Kopiraj plan',used:'✅ Iskoristio sam plan'};

  const ACTION_LABELS = new Set([
    'radarTasks','urTrucks','legendTasks','buildingPower','techPower','survivorRecruit',
    'trainedTroops','rivalKilled','otherKilled','lostTroops','staminaUsed','foodHarvest','ironHarvest','coinHarvest','packDiamonds'
  ]);

  const ICON = {
    radarTasks:'📡',urTrucks:'🚚',legendTasks:'📜',buildingPower:'🏗️',techPower:'🔬',survivorRecruit:'🧑‍🤝‍🧑',
    trainedTroops:'🪖',rivalKilled:'⚔️',otherKilled:'⚔️',lostTroops:'🛡️',staminaUsed:'⚡',foodHarvest:'🌾',ironHarvest:'⛓️',coinHarvest:'🪙',packDiamonds:'💎',
    constructionSpeed:'⏱️',researchSpeed:'⏱️',trainingSpeed:'⏱️',healingSpeed:'⏱️',universalSpeed:'⏱️',
    droneChest:'📦',droneData:'🔷',droneParts:'⚙️',heroExp:'⭐',valorBadges:'🏅',eliteTickets:'🎟️',urShards:'🟨',ssrShards:'🟪',rareShards:'🟦',skillMedals:'🏵️',weaponShards:'🔶',skillChipPoints:'💠'
  };

  let uiState = loadUi();
  let lastPlan = null;
  let captureBusy = false;

  function loadUi(){
    try{return Object.assign({tab:'capture',weekInventory:false,excluded:{},planned:{},sleighValue:0,advanced:false,pending:null},JSON.parse(localStorage.getItem(CUSTOM_KEY)||'{}'));}
    catch{return{tab:'capture',weekInventory:false,excluded:{},planned:{},sleighValue:0,advanced:false,pending:null};}
  }
  function saveUi(){try{localStorage.setItem(CUSTOM_KEY,JSON.stringify(uiState));}catch{}}
  function lang(){return (typeof state!=='undefined'&&state.language)||'fr';}
  function x(k){return (TX[lang()]||TX.fr)[k]??TX.fr[k]??TX.en[k]??k;}
  function esc(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function number(n){try{return new Intl.NumberFormat((typeof LOCALES==='object'&&LOCALES[lang()])||'fr-FR',{maximumFractionDigits:0}).format(Number(n)||0);}catch{return String(Math.round(Number(n)||0));}}
  function compact(n){const v=Number(n)||0;if(Math.abs(v)>=1e9)return `${(v/1e9).toFixed(v%1e9?2:0)} B`;if(Math.abs(v)>=1e6)return `${(v/1e6).toFixed(v%1e6?2:0)} M`;if(Math.abs(v)>=1e3)return `${(v/1e3).toFixed(v%1e3?1:0)} k`;return number(v);}
  function allDays(){return (typeof DAYS!=='undefined'&&Array.isArray(DAYS))?DAYS:[];}
  function currentDay(){try{return day();}catch{return allDays().find(d=>d.id===Number(state?.selectedDay))||allDays()[0]||{id:1,items:[]};}}
  function dayName(id){try{return dayText(id)?.title||`${x('day')} ${id}`;}catch{return `${x('day')} ${id}`;}}
  function baseFamily(key){return String(key||'').replace(/D[1-6]$/,'');}
  function itemIcon(i){return ICON[i?.labelKey]||ICON[baseFamily(i?.stockKey)]||'◆';}
  function isAction(i){return ACTION_LABELS.has(i?.labelKey)||/^packDiamondsD/.test(String(i?.stockKey||''));}
  function stock(i){try{return Math.max(0,Number(getStock(i)||0));}catch{return Math.max(0,Number(state?.inventory?.[i?.stockKey]||0));}}
  function reserve(i){try{return Math.max(0,Number(getReserve(i)||0));}catch{return 0;}}
  function ppu(dayId,i){try{return Math.max(0,Number(effectivePoints(dayId,i)||0));}catch{return Math.max(0,Number(i?.points)||0);}}
  function basePpu(dayId,i){try{return Math.max(0,Number(getPoints(dayId,i)||0));}catch{return Math.max(0,Number(i?.points)||0);}}
  function label(i){try{return itemLabel(i);}catch{return i?.labelKey||i?.stockKey||'';}}
  function unit(i){try{return itemUnit(i);}catch{return i?.unitKey||'';}}
  function usableQty(i){return Math.max(0,stock(i)-reserve(i));}
  function isExcluded(i){return Boolean(uiState.excluded[i.stockKey]);}
  function formatQty(q,i){
    if(i?.speedup){const min=Math.round(Number(q)||0),d=Math.floor(min/1440),h=Math.floor((min%1440)/60),m=min%60,parts=[];if(d)parts.push(`${d}j`);if(h)parts.push(`${h}h`);if(m)parts.push(`${m}min`);return parts.join(' ')||'0min';}
    return `${number(q)} ${unit(i)}`.trim();
  }
  function ppuText(dayId,i){
    const v=ppu(dayId,i),base=basePpu(dayId,i);
    if(i?.unitKey==='exp'&&v>0){const per=Math.round(1/v);return `${number(per)} EXP = 1 ${x('points')}`;}
    if(i?.speedup)return `${number(v)} ${x('points')}/${x('minute')}`;
    if(Math.abs(v-base)>.001)return `${number(v)} ${x('points')} (${number(base)} ${x('baseValue')})`;
    return `${number(v)} ${x('points')}/${unit(i)}`;
  }
  function uniqueItems(week=false){
    const source=week?allDays():[currentDay()],map=new Map();
    for(const d of source)for(const i of d.items||[]){
      if(isAction(i))continue;
      const key=i.stockKey;
      if(!map.has(key))map.set(key,{i,dayId:d.id});
    }
    return [...map.values()];
  }
  function itemByStock(key){for(const d of allDays())for(const i of d.items||[])if(i.stockKey===key)return{i,dayId:d.id};return null;}
  function targetLabel(key){
    if(key==='__currentPoints')return x('currentScore');
    const f=itemByStock(key);return f?label(f.i):key;
  }
  function plannedStore(dayId=state.selectedDay){const k=String(dayId);if(!uiState.planned[k])uiState.planned[k]={};return uiState.planned[k];}
  function actionTranslation(i){
    const k=i?.labelKey;
    if(k==='radarTasks')return x('actionRadar');if(k==='urTrucks')return x('actionTruck');if(k==='legendTasks')return x('actionMission');
    if(k==='buildingPower')return x('actionBuilding');if(k==='techPower')return x('actionTech');if(k==='survivorRecruit')return x('actionRecruit');
    if(k==='packDiamonds')return x('actionPack');if(k==='trainedTroops')return x('actionTrain');if(k==='rivalKilled')return x('actionRival');
    if(k==='otherKilled')return x('actionOther');if(k==='lostTroops')return x('actionLost');if(k==='staminaUsed')return x('actionStamina');
    if(['foodHarvest','ironHarvest','coinHarvest'].includes(k))return `${x('actionHarvest')} · ${label(i)}`;
    return label(i);
  }

  function css(){
    if(document.getElementById('gomoV300Style'))return;
    const s=document.createElement('style');s.id='gomoV300Style';s.textContent=`
      #plannerView.gomo-v300-simple>:not(#gomoV300Assistant){display:none!important}
      #gomoV300Assistant{display:grid;gap:14px;margin-bottom:18px}
      .v300-shell{border:1px solid rgba(232,191,78,.42);border-radius:24px;padding:16px;background:linear-gradient(155deg,rgba(7,24,43,.98),rgba(4,15,27,.98));box-shadow:0 18px 45px rgba(0,0,0,.26),inset 0 0 35px rgba(232,191,78,.035);color:#f7f4ea}
      .v300-top{display:grid;gap:12px}.v300-eyebrow{margin:0;color:#e9bd4d;font-size:.72rem;font-weight:900;letter-spacing:.16em}.v300-title{margin:0;font-size:clamp(1.55rem,6vw,2.35rem);line-height:1.04;background:linear-gradient(180deg,#fff8d4,#e8bd4d);-webkit-background-clip:text;background-clip:text;color:transparent}.v300-sub{margin:0;color:#b9c9d8;line-height:1.48}
      .v300-profile{display:grid;grid-template-columns:1fr 1fr;gap:9px}.v300-field{display:grid;gap:5px}.v300-field span{font-size:.72rem;color:#9fb1c2;font-weight:800}.v300-field input,.v300-field select,.v300-number{width:100%;box-sizing:border-box;border:1px solid rgba(232,191,78,.28);border-radius:13px;background:#081827;color:#fff;padding:11px 12px;font:inherit;font-weight:800}
      .v300-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:5px;border:1px solid rgba(232,191,78,.18);border-radius:17px;background:#06131f}.v300-tab{border:0;border-radius:12px;background:transparent;color:#93a8b9;padding:9px 4px;font-size:.69rem;font-weight:900}.v300-tab.active{background:linear-gradient(180deg,#d9a934,#946718);color:#07121d;box-shadow:0 5px 15px rgba(217,169,52,.18)}
      .v300-view{display:none}.v300-view.active{display:grid;gap:13px}.v300-card{border:1px solid rgba(155,183,205,.16);border-radius:19px;padding:14px;background:rgba(10,30,47,.72)}.v300-card h3,.v300-card h4{margin:0 0 5px}.v300-card p{margin:0;color:#aebfce;line-height:1.42}.v300-upload{display:flex;justify-content:center;align-items:center;min-height:62px;border:1px dashed rgba(232,191,78,.5);border-radius:17px;background:rgba(232,191,78,.06);color:#f4cb68;font-weight:900;cursor:pointer}.v300-upload input{display:none}
      .v300-status{font-size:.82rem;color:#9fb1c2}.v300-review{display:grid;gap:8px}.v300-review-row{display:grid;grid-template-columns:auto 1fr auto;gap:9px;align-items:center;border:1px solid rgba(155,183,205,.14);border-radius:14px;padding:10px;background:#071724}.v300-review-row input[type=checkbox]{width:20px;height:20px;accent-color:#dcb547}.v300-review-main strong{display:block;font-size:.9rem}.v300-review-main small{color:#8fa5b6}.v300-conf{font-size:.68rem;font-weight:900;padding:4px 7px;border-radius:999px;background:rgba(98,210,145,.12);color:#7ae2a4}.v300-conf.low{background:rgba(255,180,71,.12);color:#ffc16d}
      .v300-btnrow{display:flex;gap:8px;flex-wrap:wrap}.v300-btn{border:1px solid rgba(232,191,78,.34);border-radius:13px;background:#0b2032;color:#f2d37b;padding:10px 12px;font-weight:900}.v300-btn.primary{background:linear-gradient(180deg,#e3ba4b,#a4771e);color:#07121d;border-color:#e8c45d}.v300-btn.danger{color:#ffbd9d;border-color:rgba(255,126,81,.3)}
      .v300-inv-head{display:flex;justify-content:space-between;gap:8px;align-items:center}.v300-switch{display:flex;padding:3px;background:#06131f;border-radius:12px;border:1px solid rgba(155,183,205,.14)}.v300-switch button{border:0;border-radius:9px;padding:7px 8px;background:transparent;color:#91a6b7;font-size:.72rem;font-weight:800}.v300-switch button.active{background:#18354b;color:#fff}
      .v300-total{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;border:1px solid rgba(232,191,78,.28);border-radius:17px;padding:12px 14px;background:linear-gradient(135deg,rgba(232,191,78,.10),rgba(27,62,89,.18))}.v300-total strong{font-size:1.45rem;color:#f0c85c}.v300-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.v300-res{display:grid;gap:8px;border:1px solid rgba(155,183,205,.14);border-radius:17px;padding:11px;background:#071724;min-width:0}.v300-res-top{display:grid;grid-template-columns:30px 1fr;gap:7px;align-items:center}.v300-icon{display:grid;place-items:center;width:30px;height:30px;border-radius:10px;background:rgba(232,191,78,.09);font-size:1.1rem}.v300-res-name{font-size:.8rem;font-weight:900;line-height:1.2}.v300-res input{width:100%;box-sizing:border-box;border:1px solid rgba(155,183,205,.18);border-radius:10px;background:#0a1d2d;color:#fff;padding:8px;font-weight:900}.v300-meta{display:grid;gap:3px;font-size:.67rem;color:#8fa5b6}.v300-meta b{color:#d8e3eb}.v300-use{border:0;border-radius:10px;padding:7px;background:rgba(80,190,126,.12);color:#78e1a5;font-size:.68rem;font-weight:900}.v300-use.keep{background:rgba(255,188,78,.10);color:#ffc771}
      .v300-actions{display:grid;gap:8px}.v300-action{display:grid;grid-template-columns:auto 1fr 84px;gap:9px;align-items:center;border:1px solid rgba(155,183,205,.14);border-radius:16px;padding:11px;background:#071724}.v300-action-toggle{width:22px;height:22px;accent-color:#dcb547}.v300-action strong{display:block;font-size:.86rem}.v300-action small{color:#8fa5b6}.v300-action input[type=number]{width:84px;box-sizing:border-box;border:1px solid rgba(232,191,78,.22);border-radius:10px;background:#0a1d2d;color:#fff;padding:8px;font-weight:900}.v300-action.disabled{opacity:.55}
      .v300-metrics{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.v300-metric{border:1px solid rgba(155,183,205,.14);border-radius:15px;padding:10px;background:#071724}.v300-metric span{display:block;color:#8fa5b6;font-size:.68rem;font-weight:800}.v300-metric strong{display:block;margin-top:3px;font-size:1.08rem}.v300-metric.gold strong{color:#f0c85c}.v300-plan-list{display:grid;gap:8px}.v300-plan-line{display:grid;grid-template-columns:1fr auto;gap:10px;border-left:3px solid #d5aa3b;border-radius:11px;padding:9px 10px;background:#071724}.v300-plan-line strong{display:block}.v300-plan-line small{color:#8fa5b6}.v300-plan-points{font-weight:900;color:#f0ca67;white-space:nowrap}.v300-good{color:#74dfa1;font-weight:900}.v300-warn{color:#ffc06d;font-weight:900}.v300-verify{display:grid;gap:9px;border:1px solid rgba(98,210,145,.24);border-radius:16px;padding:12px;background:rgba(44,119,79,.08)}
      .v300-ref{margin-top:4px}.v300-ref summary{cursor:pointer;color:#d9b957;font-weight:900}.v300-ref-table{display:grid;gap:5px;margin-top:10px}.v300-ref-row{display:grid;grid-template-columns:1fr auto;gap:9px;border-bottom:1px solid rgba(155,183,205,.1);padding:7px 0;font-size:.78rem}.v300-ref-row b{color:#f0c85c}
      .v300-note{font-size:.75rem;color:#91a7b8;line-height:1.42}.v300-version{text-align:center;color:#60778a;font-size:.68rem}
      @media(max-width:430px){.v300-shell{padding:13px;border-radius:20px}.v300-tabs{grid-template-columns:repeat(2,1fr)}.v300-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.v300-res{padding:9px}.v300-res-name{font-size:.74rem}.v300-action{grid-template-columns:auto 1fr 74px}.v300-action input[type=number]{width:74px}.v300-profile{grid-template-columns:1fr}.v300-metrics{grid-template-columns:1fr 1fr}}
    `;document.head.appendChild(s);
  }

  function ensure(){
    css();
    const pv=document.getElementById('plannerView');if(!pv)return null;
    let root=document.getElementById('gomoV300Assistant');
    if(!root){
      root=document.createElement('section');root.id='gomoV300Assistant';
      pv.insertBefore(root,pv.firstChild);
    }
    pv.classList.toggle('gomo-v300-simple',!uiState.advanced);
    return root;
  }

  function dayOptions(){return allDays().map(d=>`<option value="${d.id}" ${Number(state.selectedDay)===d.id?'selected':''}>${esc(dayName(d.id))}</option>`).join('');}

  function shell(){
    const root=ensure();if(!root)return;
    root.innerHTML=`<div class="v300-shell">
      <div class="v300-top">
        <p class="v300-eyebrow">${esc(x('eyebrow'))}</p>
        <h2 class="v300-title">${esc(x('title'))}</h2>
        <p class="v300-sub">${esc(x('subtitle'))}</p>
        <div class="v300-profile">
          <label class="v300-field"><span>${esc(x('player'))}</span><input id="v300Player" value="${esc(state.profile?.playerName||'')}" placeholder="${esc(x('player'))}"></label>
          <label class="v300-field"><span>${esc(x('day'))}</span><select id="v300Day">${dayOptions()}</select></label>
        </div>
        <div class="v300-tabs">
          ${[['capture','capture'],['inventory','inventory'],['actions','actions'],['plan','plan']].map(([id,k])=>`<button type="button" class="v300-tab ${uiState.tab===id?'active':''}" data-v300-tab="${id}">${esc(x(k))}</button>`).join('')}
        </div>
      </div>
      <div id="v300Capture" class="v300-view ${uiState.tab==='capture'?'active':''}"></div>
      <div id="v300Inventory" class="v300-view ${uiState.tab==='inventory'?'active':''}"></div>
      <div id="v300Actions" class="v300-view ${uiState.tab==='actions'?'active':''}"></div>
      <div id="v300Plan" class="v300-view ${uiState.tab==='plan'?'active':''}"></div>
      <details class="v300-card v300-ref" id="v300Advanced"><summary>${esc(x('advanced'))}</summary><p class="v300-note" style="margin-top:8px">${esc(x('advancedHelp'))}</p><div class="v300-btnrow" style="margin-top:10px"><button type="button" class="v300-btn" id="v300ToggleOld">${esc(uiState.advanced?x('hideOld'):x('showOld'))}</button></div></details>
      <div class="v300-version">GoMo VS Planner v${VERSION} · ${esc(x('profileDefault'))}</div>
    </div>`;
    renderCapture();renderInventory();renderActions();renderPlan();bindRoot();
  }

  function renderCapture(){
    const host=document.getElementById('v300Capture');if(!host)return;
    const rows=(typeof ocrRows!=='undefined'&&Array.isArray(ocrRows))?ocrRows:[];
    const meaningful=rows.filter(r=>r&&r.target&&Number(r.value)>0);
    host.innerHTML=`<article class="v300-card"><h3>${esc(x('captureTitle'))}</h3><p>${esc(x('captureHelp'))}</p>
      <label class="v300-upload" style="margin-top:12px">${esc(captureBusy?x('reading'):x('choose'))}<input id="v300Files" type="file" accept="image/*" multiple ${captureBusy?'disabled':''}></label>
      <div class="v300-status" style="margin-top:8px">${captureBusy?esc(x('reading')):(meaningful.length?`${meaningful.length} · ${esc(x('recognized'))}`:esc(x('nothing')))}</div></article>
      ${meaningful.length?`<article class="v300-card"><h3>${esc(x('recognized'))}</h3><div class="v300-review" style="margin-top:10px">${meaningful.map((r,idx)=>{
        const realIndex=rows.indexOf(r),safe=Number(r.confidence||0)>=OCR_SAFE;
        return `<label class="v300-review-row"><input type="checkbox" data-v300-ocr="${realIndex}" ${safe?'checked':''}><span class="v300-review-main"><strong>${esc(targetLabel(r.target))}</strong><small>${number(r.value)}</small></span><span class="v300-conf ${safe?'':'low'}">${number(r.confidence||0)}%</span></label>`;
      }).join('')}</div><div class="v300-btnrow" style="margin-top:11px"><button class="v300-btn primary" id="v300ApplyOcr" type="button">${esc(x('validateSafe'))}</button><button class="v300-btn danger" id="v300IgnoreOcr" type="button">${esc(x('ignore'))}</button><button class="v300-btn" id="v300OpenScanner" type="button">${esc(x('details'))}</button></div></article>`:`<article class="v300-card"><p class="v300-note">${esc(x('noRows'))}</p></article>`}`;
  }

  function inventoryPotential(){return uniqueItems(uiState.weekInventory).reduce((sum,{i,dayId})=>sum+(isExcluded(i)?0:usableQty(i)*ppu(dayId,i)),0);}
  function renderInventory(){
    const host=document.getElementById('v300Inventory');if(!host)return;
    const entries=uniqueItems(uiState.weekInventory);
    host.innerHTML=`<article class="v300-card"><div class="v300-inv-head"><div><h3>${esc(x('inventoryTitle'))}</h3><p>${esc(x('inventoryHelp'))}</p></div><div class="v300-switch"><button type="button" data-v300-week="0" class="${!uiState.weekInventory?'active':''}">${esc(x('today'))}</button><button type="button" data-v300-week="1" class="${uiState.weekInventory?'active':''}">${esc(x('week'))}</button></div></div></article>
      <div class="v300-total"><span>${esc(x('potential'))}</span><strong>${compact(inventoryPotential())}</strong></div>
      <div class="v300-grid">${entries.map(({i,dayId})=>{
        const q=stock(i),points=usableQty(i)*ppu(dayId,i),excluded=isExcluded(i);
        return `<article class="v300-res"><div class="v300-res-top"><span class="v300-icon">${itemIcon(i)}</span><span class="v300-res-name">${esc(label(i))}</span></div><input type="number" inputmode="decimal" min="0" data-v300-stock="${esc(i.stockKey)}" value="${q}"><div class="v300-meta"><span>${esc(x('ppu'))}: <b>${esc(ppuText(dayId,i))}</b></span><span>${esc(x('possible'))}: <b>${number(Math.floor(points))}</b></span></div><button type="button" class="v300-use ${excluded?'keep':''}" data-v300-exclude="${esc(i.stockKey)}">${esc(excluded?x('keep'):x('use'))}</button></article>`;
      }).join('')}</div>
      <details class="v300-card v300-ref"><summary>${esc(x('exactValues'))}</summary><p class="v300-note" style="margin-top:8px">${esc(x('exactHelp'))}</p><div class="v300-ref-table">${referenceRows()}</div><button type="button" class="v300-btn" id="v300CopyValues" style="margin-top:10px">${esc(x('copyValues'))}</button></details>`;
  }

  function referenceItems(){
    const seen=new Set(),rows=[];
    for(const d of allDays())for(const i of d.items||[]){
      if(isAction(i))continue;
      const k=`${i.labelKey}:${i.n??''}:${i.points}`;
      if(seen.has(k))continue;seen.add(k);rows.push({i,dayId:d.id});
    }
    return rows.sort((a,b)=>{
      if(a.i.labelKey==='droneChest'&&b.i.labelKey==='droneChest')return Number(a.i.n)-Number(b.i.n);
      if(a.i.labelKey==='droneChest')return -1;if(b.i.labelKey==='droneChest')return 1;return label(a.i).localeCompare(label(b.i),lang());
    });
  }
  function referenceRows(){return referenceItems().map(({i,dayId})=>`<div class="v300-ref-row"><span>${itemIcon(i)} ${esc(label(i))}</span><b>${esc(ppuText(dayId,i))}</b></div>`).join('');}
  function referenceText(){return referenceItems().map(({i,dayId})=>`${label(i)} : ${ppuText(dayId,i)}`).join('\n');}

  function actionsForDay(){
    const d=currentDay(),items=(d.items||[]).filter(isAction);
    // One line per actual stock key / troop tier.
    return items.map(i=>({type:'catalogue',i,dayId:d.id,key:i.stockKey,label:actionTranslation(i),ppu:ppu(d.id,i)}));
  }
  function renderActions(){
    const host=document.getElementById('v300Actions');if(!host)return;
    const planned=plannedStore(),rows=actionsForDay();
    host.innerHTML=`<article class="v300-card"><h3>${esc(x('actionsTitle'))}</h3><p>${esc(x('actionsHelp'))}</p></article><div class="v300-actions">${rows.map(a=>{
      const rec=planned[a.key]||{},on=Boolean(rec.on),qty=Math.max(0,Number(rec.qty||0));
      return `<article class="v300-action"><input class="v300-action-toggle" type="checkbox" data-v300-action-on="${esc(a.key)}" ${on?'checked':''}><div><strong>${itemIcon(a.i)} ${esc(a.label)}</strong><small>${esc(ppuText(a.dayId,a.i))}</small></div><input type="number" inputmode="decimal" min="0" data-v300-action-qty="${esc(a.key)}" value="${qty}" ${on?'':'disabled'}></article>`;
    }).join('')}
      <article class="v300-action disabled"><input class="v300-action-toggle" type="checkbox" disabled><div><strong>🛷 ${esc(x('sleigh'))}</strong><small>${esc(x('sleighHelp'))}</small></div><input type="number" value="0" disabled></article>
      </div>`;
  }

  function plannedActionSteps(){
    const planned=plannedStore(),rows=actionsForDay(),steps=[];
    for(const a of rows){const rec=planned[a.key];if(!rec?.on)continue;const qty=Math.max(0,Number(rec.qty||0));if(!qty)continue;steps.push({key:a.key,item:a.i,qty,ppu:a.ppu,points:qty*a.ppu,label:a.label});}
    return steps;
  }

  function autoPlan(){
    const d=currentDay(),current=Math.max(0,Number(state.currentPoints?.[d.id]||0)),actions=plannedActionSteps(),actionPoints=actions.reduce((s,a)=>s+a.points,0),start=current+actionPoints;
    const speedLimit=Math.max(0,Number(state.profile?.speedupLimitDays||10)*1440);let speedUsed=0;
    const candidates=(d.items||[]).filter(i=>!isAction(i)&&!isExcluded(i)).map(i=>({item:i,available:Math.floor(usableQty(i)),ppu:ppu(d.id,i)})).filter(c=>c.available>0&&c.ppu>0);
    try{if(typeof strategyComparator==='function')candidates.sort(strategyComparator(state.profile?.strategy||'economy'));else candidates.sort((a,b)=>b.ppu-a.ppu);}catch{candidates.sort((a,b)=>b.ppu-a.ppu);}
    const usage=new Map();let remaining=Math.max(0,TARGET-start);
    for(const c of candidates){let max=c.available;if(c.item.speedup)max=Math.min(max,Math.max(0,Math.floor(speedLimit-speedUsed)));if(max<=0)continue;const qty=Math.min(max,Math.floor(remaining/c.ppu));if(qty>0){usage.set(c.item.id,qty);remaining-=qty*c.ppu;if(c.item.speedup)speedUsed+=qty;}if(remaining<=.0001)break;}
    if(remaining>.0001){let best=null;for(const c of candidates){const used=usage.get(c.item.id)||0;let left=c.available-used;if(c.item.speedup)left=Math.min(left,Math.max(0,Math.floor(speedLimit-speedUsed)));if(left<=0)continue;const qty=Math.min(left,Math.ceil(remaining/c.ppu));if(qty<=0)continue;const gained=qty*c.ppu;let rank=Math.max(0,gained-remaining);try{if(typeof strategyCost==='function')rank+=strategyCost(c,state.profile?.strategy||'economy',qty);}catch{}if(!best||rank<best.rank)best={c,qty,gained,rank};}if(best){usage.set(best.c.item.id,(usage.get(best.c.item.id)||0)+best.qty);remaining-=best.gained;if(best.c.item.speedup)speedUsed+=best.qty;}}
    if(remaining>.0001){for(const c of candidates){const used=usage.get(c.item.id)||0;let left=c.available-used;if(c.item.speedup)left=Math.min(left,Math.max(0,Math.floor(speedLimit-speedUsed)));if(left<=0)continue;usage.set(c.item.id,used+left);remaining-=left*c.ppu;if(c.item.speedup)speedUsed+=left;if(remaining<=.0001)break;}}
    const resources=candidates.map(c=>{const qty=usage.get(c.item.id)||0;if(!qty)return null;return{item:c.item,qty,ppu:c.ppu,points:qty*c.ppu,remainingStock:Math.max(0,stock(c.item)-qty)};}).filter(Boolean);
    const resourcePoints=resources.reduce((s,r)=>s+r.points,0),finalPoints=start+resourcePoints;
    return{dayId:d.id,current,goal:TARGET,actions,actionPoints,resources,resourcePoints,finalPoints,reached:finalPoints>=TARGET,missing:Math.max(0,TARGET-finalPoints),overshoot:Math.max(0,finalPoints-TARGET)};
  }

  function renderPlan(){
    const host=document.getElementById('v300Plan');if(!host)return;
    const p=lastPlan||autoPlan(),pending=uiState.pending&&Number(uiState.pending.dayId)===Number(state.selectedDay)?uiState.pending:null;
    host.innerHTML=`<article class="v300-card"><h3>${esc(x('planTitle'))}</h3><p>${esc(x('planHelp'))}</p><button class="v300-btn primary" id="v300Prepare" type="button" style="width:100%;margin-top:12px">${esc(x('prepare'))}</button></article>
      <div class="v300-metrics"><article class="v300-metric"><span>${esc(x('already'))}</span><strong>${compact(p.current)}</strong></article><article class="v300-metric"><span>${esc(x('actionPoints'))}</span><strong>${compact(p.actionPoints)}</strong></article><article class="v300-metric"><span>${esc(x('resourcePoints'))}</span><strong>${compact(p.resourcePoints)}</strong></article><article class="v300-metric gold"><span>${esc(x('final'))}</span><strong>${compact(p.finalPoints)}</strong></article></div>
      <article class="v300-card"><p class="${p.reached?'v300-good':'v300-warn'}">${esc(p.reached?x('ready'):`${x('insufficient')} · ${x('missing')} ${compact(p.missing)}`)}</p></article>
      <article class="v300-card"><h4>${esc(x('actionsPart'))}</h4><div class="v300-plan-list" style="margin-top:8px">${p.actions.length?p.actions.map(a=>`<div class="v300-plan-line"><span><strong>${esc(a.label)}</strong><small>${esc(formatQty(a.qty,a.item))} × ${number(a.ppu)}</small></span><span class="v300-plan-points">+${compact(a.points)}</span></div>`).join(''):`<p class="v300-note">${esc(x('noActions'))}</p>`}</div></article>
      <article class="v300-card"><h4>${esc(x('resourcesPart'))}</h4><div class="v300-plan-list" style="margin-top:8px">${p.resources.length?p.resources.map(r=>`<div class="v300-plan-line"><span><strong>${esc(label(r.item))}</strong><small>${esc(formatQty(r.qty,r.item))} · ${esc(ppuText(p.dayId,r.item))}</small></span><span class="v300-plan-points">+${compact(r.points)}</span></div>`).join(''):`<p class="v300-note">${esc(x('noResources'))}</p>`}</div><div class="v300-btnrow" style="margin-top:12px"><button class="v300-btn" id="v300CopyPlan" type="button">${esc(x('copyPlan'))}</button><button class="v300-btn primary" id="v300UsedPlan" type="button" ${p.resources.length||p.actions.length?'':'disabled'}>${esc(x('used'))}</button></div><p class="v300-note" style="margin-top:8px">${esc(x('confirmUsed'))}</p></article>
      ${pending?verifyMarkup(pending):''}
      <article class="v300-card"><p class="v300-note">${esc(x('learn'))}</p></article>`;
  }

  function verifyMarkup(p){return `<article class="v300-verify"><h4>${esc(x('verifyTitle'))}</h4><p>${esc(x('verifyHelp'))}</p><div class="v300-btnrow"><button class="v300-btn primary" id="v300Reached" type="button">${esc(x('yes'))}</button><button class="v300-btn" id="v300NotReached" type="button">${esc(x('no'))}</button></div><label class="v300-field"><span>${esc(x('actual'))}</span><input id="v300Actual" type="number" inputmode="numeric" min="0" value="${Number(state.currentPoints?.[p.dayId]||0)}"></label><button class="v300-btn" id="v300SaveActual" type="button">${esc(x('saveActual'))}</button></article>`;}

  function planText(p=lastPlan||autoPlan()){
    const lines=[`GoMo VS Planner · ${dayName(p.dayId)}`,`${x('goal')}: ${number(TARGET)} ${x('points')}`,`${x('already')}: ${number(p.current)}`,''];
    if(p.actions.length){lines.push(`${x('actionsPart')}:`);p.actions.forEach(a=>lines.push(`- ${a.label}: ${formatQty(a.qty,a.item)} = ${number(Math.floor(a.points))} ${x('points')}`));lines.push('');}
    if(p.resources.length){lines.push(`${x('resourcesPart')}:`);p.resources.forEach(r=>lines.push(`- ${label(r.item)}: ${formatQty(r.qty,r.item)} = ${number(Math.floor(r.points))} ${x('points')}`));lines.push('');}
    lines.push(`${x('final')}: ${number(Math.floor(p.finalPoints))} ${x('points')}`);if(!p.reached)lines.push(`${x('missing')}: ${number(Math.ceil(p.missing))} ${x('points')}`);return lines.join('\n');
  }

  async function copy(text){try{await navigator.clipboard.writeText(text);if(typeof showToast==='function')showToast(x('copyDone'));}catch{if(typeof showToast==='function')showToast(x('copyFail'));}}

  function applyCheckedOcr(){
    const rows=(typeof ocrRows!=='undefined'&&Array.isArray(ocrRows))?ocrRows:[],checks=[...document.querySelectorAll('[data-v300-ocr]:checked')];
    if(!checks.length)return;
    const grouped=new Map();for(const c of checks){const r=rows[Number(c.dataset.v300Ocr)];if(!r?.target||Number(r.value)<=0)continue;grouped.set(r.target,Math.max(grouped.get(r.target)||0,Number(r.value)||0));}
    for(const [key,val] of grouped){if(key==='__currentPoints')state.currentPoints[state.selectedDay]=val;else state.inventory[key]=val;}
    try{invalidatePlan();saveState();renderResources();renderSummary();}catch{}
    lastPlan=null;if(typeof showToast==='function')showToast(x('validated'));uiState.tab='inventory';saveUi();shell();
  }

  async function handleFiles(files){
    if(!files?.length)return;captureBusy=true;renderCapture();
    try{
      if(typeof setOcrFiles==='function')setOcrFiles(files);
      if(typeof startOcrScan==='function')await startOcrScan();
    }catch(e){console.error('v3 OCR',e);}finally{captureBusy=false;renderCapture();}
  }

  function updateStock(key,value){state.inventory[key]=Math.max(0,Number(value)||0);try{invalidatePlan();saveState();renderResources();renderSummary();}catch{}lastPlan=null;renderInventory();renderPlan();}

  function markUsed(){
    const p=lastPlan||autoPlan();
    for(const r of p.resources)state.inventory[r.item.stockKey]=Math.max(0,Number(state.inventory[r.item.stockKey]||0)-r.qty);
    uiState.pending={dayId:p.dayId,predicted:Math.floor(p.finalPoints),before:Math.floor(p.current),usedAt:new Date().toISOString()};saveUi();
    try{invalidatePlan();saveState();renderResources();renderSummary();}catch{}
    lastPlan=null;renderInventory();renderPlan();
  }
  function saveActualScore(value){const n=Math.max(0,Number(value)||0);state.currentPoints[state.selectedDay]=n;uiState.pending=null;saveUi();try{invalidatePlan();saveState();renderSummary();}catch{}lastPlan=null;if(typeof showToast==='function')showToast(x('saved'));renderPlan();}

  function bindRoot(){
    const root=document.getElementById('gomoV300Assistant');if(!root||root.dataset.bound==='1')return;root.dataset.bound='1';
    root.addEventListener('click',e=>{
      const tab=e.target.closest('[data-v300-tab]');if(tab){uiState.tab=tab.dataset.v300Tab;saveUi();shell();return;}
      const wk=e.target.closest('[data-v300-week]');if(wk){uiState.weekInventory=wk.dataset.v300Week==='1';saveUi();renderInventory();return;}
      const ex=e.target.closest('[data-v300-exclude]');if(ex){const k=ex.dataset.v300Exclude;uiState.excluded[k]=!uiState.excluded[k];saveUi();lastPlan=null;renderInventory();renderPlan();return;}
      if(e.target.closest('#v300ApplyOcr')){applyCheckedOcr();return;}
      if(e.target.closest('#v300IgnoreOcr')){try{ocrRows=[];ocrRaw=[];}catch{}renderCapture();return;}
      if(e.target.closest('#v300OpenScanner')){state.view='scanner';try{saveState();renderView();}catch{}return;}
      if(e.target.closest('#v300CopyValues')){void copy(referenceText());return;}
      if(e.target.closest('#v300Prepare')){lastPlan=autoPlan();uiState.tab='plan';saveUi();renderPlan();return;}
      if(e.target.closest('#v300CopyPlan')){void copy(planText());return;}
      if(e.target.closest('#v300UsedPlan')){markUsed();return;}
      if(e.target.closest('#v300Reached')){saveActualScore(Math.max(TARGET,Number(uiState.pending?.predicted||TARGET)));return;}
      if(e.target.closest('#v300NotReached')){const inp=document.getElementById('v300Actual');if(inp)inp.focus();return;}
      if(e.target.closest('#v300SaveActual')){saveActualScore(document.getElementById('v300Actual')?.value);return;}
      if(e.target.closest('#v300ToggleOld')){uiState.advanced=!uiState.advanced;saveUi();shell();return;}
    });
    root.addEventListener('change',e=>{
      if(e.target.id==='v300Files'){void handleFiles(e.target.files);return;}
      if(e.target.id==='v300Day'){state.selectedDay=Number(e.target.value);state.autoDay=false;lastPlan=null;uiState.pending=null;try{invalidatePlan();saveState();renderAll();}catch{}saveUi();shell();return;}
      if(e.target.matches('[data-v300-action-on]')){const key=e.target.dataset.v300ActionOn,rec=plannedStore()[key]||{};rec.on=e.target.checked;if(rec.on&&!Number(rec.qty))rec.qty=1;plannedStore()[key]=rec;saveUi();lastPlan=null;renderActions();renderPlan();return;}
    });
    root.addEventListener('input',e=>{
      if(e.target.id==='v300Player'){state.profile.playerName=e.target.value;try{saveState();}catch{}return;}
      if(e.target.matches('[data-v300-stock]')){updateStock(e.target.dataset.v300Stock,e.target.value);return;}
      if(e.target.matches('[data-v300-action-qty]')){const key=e.target.dataset.v300ActionQty,rec=plannedStore()[key]||{};rec.qty=Math.max(0,Number(e.target.value)||0);rec.on=rec.on!==false;plannedStore()[key]=rec;saveUi();lastPlan=null;renderPlan();return;}
    });
  }

  function refresh(){
    // 7.3M = 7.2M minimum + 100k safety margin in the underlying profile as well.
    try{if(Number(state.profile?.target)<7_200_000)state.profile.target=7_200_000;if(Number(state.profile?.margin)!==100_000)state.profile.margin=100_000;}catch{}
    shell();
  }

  // Keep v3 in sync when the old engine rerenders after OCR/language/day changes.
  try{
    if(typeof renderAll==='function'){
      const prev=renderAll;renderAll=function(){const r=prev.apply(this,arguments);setTimeout(refresh,0);return r;};
    }
  }catch{}
  try{
    if(typeof applyTranslations==='function'){
      const prevT=applyTranslations;applyTranslations=function(){const r=prevT.apply(this,arguments);setTimeout(refresh,0);return r;};
    }
  }catch{}

  function start(){refresh();setTimeout(refresh,250);setTimeout(refresh,1000);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  console.info('GoMo VS Planner automatic assistant',VERSION);
})();
