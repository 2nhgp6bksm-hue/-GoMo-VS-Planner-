'use strict';

/*
  GoMo VS Planner v3.14 — Stable sans boucle d’observation
  Objectif UX : un membre doit pouvoir obtenir son plan sans aide extérieure.
  Cette couche NE remplace PAS le moteur de calcul existant :
  elle simplifie uniquement le parcours et réutilise les données/valeurs du VS Planner.
*/

(() => {
  const VERSION = '3.14.0';
  const TARGET = 7_300_000; // 7,2 M minimum + 100 000 de marge
  const MINIMUM = 7_200_000;
  const KEY = 'gomo_vs_planner_v314';
  const OCR_SAFE = 70;

  const T = {
    fr: {
      title:'GoMo VS Planner',
      promise:'Atteins au moins 7,2 M sans gaspiller tes ressources.',
      start:'Commencer mon VS',
      resume:'Continuer mon VS',
      reset:'Recommencer',
      language:'Langue',
      step:'Étape',
      of:'sur',
      back:'Retour',
      continue:'Continuer',
      change:'Modifier',
      dayTitle:'Aujourd’hui, ton VS est :',
      dayHelp:'Le Planner utilise automatiquement les ressources qui rapportent des points aujourd’hui.',
      dayQuestion:'Ce jour est-il correct ?',
      yesContinue:'Oui, continuer',
      chooseDay:'Choisir un autre jour',
      resourcesTitle:'Donne-moi tes ressources',
      resourcesHelp:'Le plus simple : ajoute tes captures. Tu peux aussi entrer les quantités toi-même.',
      addCaptures:'Ajouter mes captures',
      manual:'Entrer mes quantités',
      captureHint:'Choisis des captures nettes où les quantités sont entièrement visibles.',
      reading:'Lecture en cours…',
      recognized:'Vérifie seulement ce qui a été reconnu',
      recognizedHelp:'Corrige une valeur si nécessaire. Ensuite valide : le Planner enregistre le reste.',
      noRead:'Aucune valeur exploitable reconnue. Essaie une capture plus nette ou utilise la saisie manuelle.',
      confidence:'fiabilité',
      validate:'Tout est correct → Continuer',
      manualTitle:'Entre uniquement ce que tu possèdes',
      manualHelp:'Laisse 0 pour les ressources que tu n’as pas. Appuie ensuite sur Enregistrer et continuer.',
      saveContinue:'Enregistrer et continuer',
      scoreTitle:'Combien de points VS as-tu déjà ?',
      scoreHelp:'Entre ton score actuel. Le Planner calcule exactement ce qu’il te manque.',
      currentScore:'Score VS actuel',
      scorePlaceholder:'Ex. 2 450 000',
      makePlan:'Calculer mon plan',
      planTitle:'Ton plan est prêt',
      already:'Tu as déjà',
      missing:'Il te manque',
      exact:'Utilise exactement ceci, dans cet ordre :',
      noSpend:'Tu as déjà atteint l’objectif. Ne dépense plus rien.',
      insufficient:'Ton stock enregistré ne suffit pas encore pour atteindre 7,2 M.',
      estimated:'Total prévu',
      minimum:'Minimum',
      target:'Cible conseillée',
      stop:'Arrête-toi ici et garde le reste pour la prochaine semaine.',
      copy:'Copier mon plan',
      copied:'Plan copié.',
      done:'J’ai terminé',
      finishedTitle:'C’est terminé',
      finishedText:'Ton plan est enregistré. Garde le reste de tes ressources pour la prochaine semaine.',
      actualScore:'Score VS réel après le plan',
      saveActual:'Enregistrer mon score',
      saved:'Score enregistré.',
      editResources:'Modifier mes ressources',
      editScore:'Modifier mon score',
      advanced:'Réglages avancés',
      advancedText:'Uniquement si tu dois corriger des valeurs ou utiliser les anciens outils.',
      showOld:'Afficher les anciens outils',
      hideOld:'Masquer les anciens outils',
      version:'Guide automatique',
      points:'pts',
      minute:'min',
      inventorySaved:'Ressources enregistrées.',
      imageRequired:'Ajoute au moins une capture.',
      scoreRequired:'Entre ton score actuel.',
      resource:'Ressource',
      quantity:'Quantité',
      plannedGain:'Points prévus',
      today:'Aujourd’hui',
      choose:'Choisir',
      restartQuestion:'Recommencer le guide pour aujourd’hui ? Les ressources enregistrées ne seront pas effacées.',
      homeHelp:'4 étapes simples. Le Planner te dit quoi utiliser et quand t’arrêter.'
    },
    en: {
      title:'GoMo VS Planner',promise:'Reach at least 7.2M without wasting your resources.',start:'Start my VS',resume:'Continue my VS',reset:'Restart',language:'Language',step:'Step',of:'of',back:'Back',continue:'Continue',change:'Change',
      dayTitle:'Today, your VS is:',dayHelp:'The Planner automatically uses the resources that score today.',dayQuestion:'Is this day correct?',yesContinue:'Yes, continue',chooseDay:'Choose another day',
      resourcesTitle:'Give me your resources',resourcesHelp:'Easiest: add screenshots. You can also enter quantities yourself.',addCaptures:'Add my screenshots',manual:'Enter my quantities',captureHint:'Use clear screenshots with fully visible quantities.',reading:'Reading…',recognized:'Only check what was recognised',recognizedHelp:'Correct a value if needed, then confirm.',noRead:'No usable value recognised. Try a clearer screenshot or manual entry.',confidence:'confidence',validate:'Everything is correct → Continue',
      manualTitle:'Enter only what you own',manualHelp:'Leave 0 for resources you do not have. Values save automatically.',saveContinue:'Save and continue',
      scoreTitle:'How many VS points do you already have?',scoreHelp:'Enter your current score. The Planner calculates exactly what is missing.',currentScore:'Current VS score',scorePlaceholder:'e.g. 2,450,000',makePlan:'Calculate my plan',
      planTitle:'Your plan is ready',already:'You already have',missing:'You still need',exact:'Use exactly this, in this order:',noSpend:'Target already reached. Do not spend anything else.',insufficient:'Your saved stock is not enough yet to reach 7.2M.',estimated:'Estimated total',minimum:'Minimum',target:'Recommended target',stop:'Stop here and save the rest for next week.',copy:'Copy my plan',copied:'Plan copied.',done:'I am finished',
      finishedTitle:'Done',finishedText:'Your plan is saved. Keep the rest of your resources for next week.',actualScore:'Real VS score after the plan',saveActual:'Save my score',saved:'Score saved.',editResources:'Edit my resources',editScore:'Edit my score',
      advanced:'Advanced settings',advancedText:'Only if you need to correct values or use the old tools.',showOld:'Show old tools',hideOld:'Hide old tools',version:'Automatic guide',points:'pts',minute:'min',inventorySaved:'Resources saved.',imageRequired:'Add at least one screenshot.',scoreRequired:'Enter your current score.',resource:'Resource',quantity:'Quantity',plannedGain:'Planned points',today:'Today',choose:'Choose',restartQuestion:'Restart today’s guide? Saved resources will not be erased.',homeHelp:'4 simple steps. The Planner tells you what to use and when to stop.'
    },
    de: {
      title:'GoMo VS Planner',promise:'Erreiche mindestens 7,2 Mio. ohne Ressourcen zu verschwenden.',start:'Mein VS starten',resume:'Mein VS fortsetzen',reset:'Neu starten',language:'Sprache',step:'Schritt',of:'von',back:'Zurück',continue:'Weiter',change:'Ändern',
      dayTitle:'Heute ist dein VS:',dayHelp:'Der Planner nutzt automatisch nur Ressourcen, die heute Punkte bringen.',dayQuestion:'Ist dieser Tag richtig?',yesContinue:'Ja, weiter',chooseDay:'Anderen Tag wählen',
      resourcesTitle:'Zeig mir deine Ressourcen',resourcesHelp:'Am einfachsten: Screenshots hinzufügen. Mengen können auch manuell eingetragen werden.',addCaptures:'Screenshots hinzufügen',manual:'Mengen eingeben',captureHint:'Nutze klare Screenshots mit vollständig sichtbaren Mengen.',reading:'Wird gelesen…',recognized:'Prüfe nur die erkannten Werte',recognizedHelp:'Falls nötig einen Wert korrigieren, dann bestätigen.',noRead:'Kein brauchbarer Wert erkannt. Nimm einen klareren Screenshot oder nutze die manuelle Eingabe.',confidence:'Sicherheit',validate:'Alles stimmt → Weiter',
      manualTitle:'Trage nur deinen Bestand ein',manualHelp:'0 stehen lassen, wenn du die Ressource nicht hast.',saveContinue:'Speichern und weiter',
      scoreTitle:'Wie viele VS-Punkte hast du schon?',scoreHelp:'Aktuellen Punktestand eingeben. Der Planner berechnet den Rest.',currentScore:'Aktuelle VS-Punkte',scorePlaceholder:'z. B. 2.450.000',makePlan:'Meinen Plan berechnen',
      planTitle:'Dein Plan ist fertig',already:'Du hast bereits',missing:'Es fehlen noch',exact:'Nutze genau dies, in dieser Reihenfolge:',noSpend:'Ziel bereits erreicht. Nichts mehr ausgeben.',insufficient:'Der gespeicherte Bestand reicht noch nicht für 7,2 Mio.',estimated:'Geplante Summe',minimum:'Minimum',target:'Empfohlenes Ziel',stop:'Hier stoppen und den Rest für nächste Woche behalten.',copy:'Plan kopieren',copied:'Plan kopiert.',done:'Ich bin fertig',
      finishedTitle:'Fertig',finishedText:'Dein Plan ist gespeichert. Behalte den Rest für nächste Woche.',actualScore:'Echte VS-Punkte nach dem Plan',saveActual:'Punkte speichern',saved:'Punkte gespeichert.',editResources:'Ressourcen ändern',editScore:'Punkte ändern',
      advanced:'Erweiterte Einstellungen',advancedText:'Nur für Korrekturen oder die alten Werkzeuge.',showOld:'Alte Werkzeuge anzeigen',hideOld:'Alte Werkzeuge ausblenden',version:'Automatischer Guide',points:'Pkt.',minute:'Min.',inventorySaved:'Ressourcen gespeichert.',imageRequired:'Mindestens einen Screenshot hinzufügen.',scoreRequired:'Aktuelle Punkte eingeben.',resource:'Ressource',quantity:'Menge',plannedGain:'Geplante Punkte',today:'Heute',choose:'Auswählen',restartQuestion:'Guide für heute neu starten? Gespeicherte Ressourcen bleiben erhalten.',homeHelp:'4 einfache Schritte. Der Planner sagt dir, was du nutzen sollst und wann du stoppen musst.'
    },
    pt: {
      title:'GoMo VS Planner',promise:'Atinge pelo menos 7,2 M sem desperdiçar recursos.',start:'Começar o meu VS',resume:'Continuar o meu VS',reset:'Recomeçar',language:'Idioma',step:'Etapa',of:'de',back:'Voltar',continue:'Continuar',change:'Alterar',
      dayTitle:'Hoje, o teu VS é:',dayHelp:'O Planner usa automaticamente os recursos que dão pontos hoje.',dayQuestion:'Este dia está correto?',yesContinue:'Sim, continuar',chooseDay:'Escolher outro dia',
      resourcesTitle:'Mostra-me os teus recursos',resourcesHelp:'Mais simples: adiciona capturas. Também podes introduzir as quantidades.',addCaptures:'Adicionar capturas',manual:'Introduzir quantidades',captureHint:'Usa capturas nítidas com as quantidades totalmente visíveis.',reading:'A ler…',recognized:'Verifica apenas o que foi reconhecido',recognizedHelp:'Corrige um valor se necessário e confirma.',noRead:'Nenhum valor útil reconhecido. Usa uma captura mais nítida ou a entrada manual.',confidence:'confiança',validate:'Está tudo correto → Continuar',
      manualTitle:'Introduz apenas o que tens',manualHelp:'Deixa 0 para os recursos que não tens.',saveContinue:'Guardar e continuar',
      scoreTitle:'Quantos pontos VS já tens?',scoreHelp:'Introduz a pontuação atual. O Planner calcula exatamente o que falta.',currentScore:'Pontuação VS atual',scorePlaceholder:'Ex. 2 450 000',makePlan:'Calcular o meu plano',
      planTitle:'O teu plano está pronto',already:'Já tens',missing:'Ainda faltam',exact:'Usa exatamente isto, por esta ordem:',noSpend:'Objetivo já atingido. Não gastes mais nada.',insufficient:'O stock guardado ainda não chega para atingir 7,2 M.',estimated:'Total previsto',minimum:'Mínimo',target:'Objetivo recomendado',stop:'Para aqui e guarda o resto para a próxima semana.',copy:'Copiar o plano',copied:'Plano copiado.',done:'Terminei',
      finishedTitle:'Terminado',finishedText:'O plano está guardado. Guarda o resto para a próxima semana.',actualScore:'Pontuação VS real depois do plano',saveActual:'Guardar pontuação',saved:'Pontuação guardada.',editResources:'Alterar recursos',editScore:'Alterar pontuação',
      advanced:'Definições avançadas',advancedText:'Apenas para corrigir valores ou usar as ferramentas antigas.',showOld:'Mostrar ferramentas antigas',hideOld:'Ocultar ferramentas antigas',version:'Guia automático',points:'pts',minute:'min',inventorySaved:'Recursos guardados.',imageRequired:'Adiciona pelo menos uma captura.',scoreRequired:'Introduz a pontuação atual.',resource:'Recurso',quantity:'Quantidade',plannedGain:'Pontos previstos',today:'Hoje',choose:'Escolher',restartQuestion:'Recomeçar o guia de hoje? Os recursos guardados não serão apagados.',homeHelp:'4 etapas simples. O Planner diz o que usar e quando parar.'
    }
  };

  T.ro={...T.en,promise:'Atinge cel puțin 7,2 M fără să risipești resurse.',start:'Începe VS-ul meu',resume:'Continuă VS-ul meu',dayTitle:'Astăzi, VS-ul tău este:',resourcesTitle:'Dă-mi resursele tale',addCaptures:'Adaugă capturile',manual:'Introdu cantitățile',scoreTitle:'Câte puncte VS ai deja?',makePlan:'Calculează planul meu',planTitle:'Planul tău este gata',missing:'Îți mai lipsesc',exact:'Folosește exact acestea, în această ordine:',stop:'Oprește-te aici și păstrează restul pentru săptămâna viitoare.',done:'Am terminat',advanced:'Setări avansate'};
  T.uk={...T.en,promise:'Набери щонайменше 7,2 M без зайвих витрат ресурсів.',start:'Почати мій VS',resume:'Продовжити мій VS',dayTitle:'Сьогодні твій VS:',resourcesTitle:'Додай свої ресурси',addCaptures:'Додати знімки',manual:'Ввести кількість',scoreTitle:'Скільки VS-балів у тебе вже є?',makePlan:'Розрахувати мій план',planTitle:'Твій план готовий',missing:'Ще потрібно',exact:'Використай саме це, у такому порядку:',stop:'Зупинись тут і збережи решту на наступний тиждень.',done:'Готово',advanced:'Розширені налаштування'};
  T.ko={...T.en,promise:'자원을 낭비하지 않고 최소 720만 VS 점수를 달성하세요.',start:'VS 시작',resume:'VS 계속하기',dayTitle:'오늘 VS 요일:',resourcesTitle:'보유 자원을 알려주세요',addCaptures:'스크린샷 추가',manual:'수량 직접 입력',scoreTitle:'현재 VS 점수는 얼마인가요?',makePlan:'내 계획 계산',planTitle:'계획이 준비되었습니다',missing:'추가로 필요한 점수',exact:'아래 순서대로 정확히 사용하세요:',stop:'여기서 멈추고 나머지는 다음 주를 위해 보관하세요.',done:'완료',advanced:'고급 설정'};
  T.hr={...T.en,promise:'Dosegni najmanje 7,2 M bez rasipanja resursa.',start:'Pokreni moj VS',resume:'Nastavi moj VS',dayTitle:'Danas je tvoj VS:',resourcesTitle:'Dodaj svoje resurse',addCaptures:'Dodaj snimke',manual:'Unesi količine',scoreTitle:'Koliko VS bodova već imaš?',makePlan:'Izračunaj moj plan',planTitle:'Tvoj plan je spreman',missing:'Još ti nedostaje',exact:'Upotrijebi točno ovo, ovim redoslijedom:',stop:'Stani ovdje i sačuvaj ostatak za sljedeći tjedan.',done:'Završio sam',advanced:'Napredne postavke'};

  const ICON = {
    constructionSpeed:'⏱️',researchSpeed:'⏱️',trainingSpeed:'⏱️',healingSpeed:'⏱️',universalSpeed:'⏱️',
    droneChest:'📦',droneData:'🔷',droneParts:'⚙️',heroExp:'⭐',valorBadges:'🏅',eliteTickets:'🎟️',
    urShards:'🟨',ssrShards:'🟪',rareShards:'🟦',skillMedals:'🏵️',weaponShards:'🔶',skillChipPoints:'💠'
  };

  const ACTION_LABELS = new Set([
    'radarTasks','urTrucks','legendTasks','buildingPower','techPower','survivorRecruit',
    'trainedTroops','rivalKilled','otherKilled','lostTroops','staminaUsed',
    'foodHarvest','ironHarvest','coinHarvest','packDiamonds'
  ]);

  let ui = loadUi();
  let busy = false;
  let planCache = null;

  function defaultUi(){return {step:0,inputMode:'choice',advanced:false,finished:false,review:[]};}
  function loadUi(){try{return Object.assign(defaultUi(),JSON.parse(localStorage.getItem(KEY)||'{}'));}catch{return defaultUi();}}
  function saveUi(){try{localStorage.setItem(KEY,JSON.stringify(ui));}catch{}}
  function lang(){return (typeof state!=='undefined'&&state.language)||'fr';}
  function tr(k){return (T[lang()]||T.en)[k]??T.fr[k]??T.en[k]??k;}
  function esc(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function num(n){try{return new Intl.NumberFormat((typeof LOCALES==='object'&&LOCALES[lang()])||'fr-FR',{maximumFractionDigits:0}).format(Number(n)||0);}catch{return String(Math.round(Number(n)||0));}}
  function compact(n){const v=Number(n)||0;if(Math.abs(v)>=1e9)return `${(v/1e9).toFixed(2).replace(/\.00$/,'')} B`;if(Math.abs(v)>=1e6)return `${(v/1e6).toFixed(2).replace(/\.00$/,'')} M`;if(Math.abs(v)>=1e3)return `${(v/1e3).toFixed(1).replace(/\.0$/,'')} k`;return num(v);}
  function allDays(){return (typeof DAYS!=='undefined'&&Array.isArray(DAYS))?DAYS:[];}
  function currentDay(){try{return day();}catch{return allDays().find(d=>Number(d.id)===Number(state?.selectedDay))||allDays()[0]||{id:1,items:[]};}}
  function dayName(id){try{return dayText(id)?.title||`${tr('today')} ${id}`;}catch{return `${tr('today')} ${id}`;}}
  function label(i){try{return itemLabel(i);}catch{return i?.labelKey||i?.stockKey||'';}}
  function unit(i){try{return itemUnit(i);}catch{return i?.unitKey||'';}}
  function icon(i){return ICON[i?.labelKey]||ICON[String(i?.stockKey||'').replace(/D[1-6]$/,'')]||'◆';}
  function isAction(i){return ACTION_LABELS.has(i?.labelKey)||/^packDiamondsD/.test(String(i?.stockKey||''));}
  function stock(i){try{return Math.max(0,Number(getStock(i)||0));}catch{return Math.max(0,Number(state?.inventory?.[i?.stockKey]||0));}}
  function reserve(i){try{return Math.max(0,Number(getReserve(i)||0));}catch{return 0;}}
  function ppu(dayId,i){try{return Math.max(0,Number(effectivePoints(dayId,i)||0));}catch{return Math.max(0,Number(i?.points)||0);}}
  function usable(i){return Math.max(0,stock(i)-reserve(i));}
  function formatQty(q,i){
    if(i?.speedup){
      const min=Math.round(Number(q)||0),d=Math.floor(min/1440),h=Math.floor((min%1440)/60),m=min%60,parts=[];
      if(d)parts.push(`${d}j`);if(h)parts.push(`${h}h`);if(m)parts.push(`${m}min`);
      return parts.join(' ')||'0min';
    }
    return `${num(q)} ${unit(i)}`.trim();
  }
  function todayResources(){
    const map=new Map();
    for(const i of currentDay().items||[]){
      if(isAction(i))continue;
      if(!map.has(i.stockKey))map.set(i.stockKey,i);
    }
    return [...map.values()];
  }
  function findItem(key){
    for(const d of allDays())for(const i of d.items||[])if(i.stockKey===key)return i;
    return null;
  }
  function targetLabel(key){
    if(key==='__currentPoints')return tr('currentScore');
    const i=findItem(key);return i?label(i):key;
  }

  function persistBase(){
    try{
      if(state.profile){
        if(Number(state.profile.target)<MINIMUM)state.profile.target=MINIMUM;
        state.profile.margin=100_000;
      }
      if(typeof invalidatePlan==='function')invalidatePlan();
      if(typeof saveState==='function')saveState();
      if(typeof renderResources==='function')renderResources();
      if(typeof renderSummary==='function')renderSummary();
    }catch(e){console.warn('v3.10 save',e);}
    planCache=null;
  }

  function css(){
    if(document.getElementById('gomo-v314-style'))return;
    const s=document.createElement('style');s.id='gomo-v314-style';
    s.textContent=`
      #plannerView.gomo-v314-simple > :not(#gomoV314Guide){display:none!important}
      #gomoV300Assistant,#gomoV310Guide,#gomoV311Guide,#gomoV312Guide,#gomoV313Guide{display:none!important}
      #gomoV314Guide{display:block!important;position:relative!important;z-index:2147483000!important;pointer-events:auto!important}
      #gomoV314Guide *{pointer-events:auto}
      body.gomo-v314-simple .main-nav{display:none!important}
      body.gomo-v314-simple .nav-btn{display:none!important}
      .v314 button,.v314 select,.v314 input,.v314 summary{touch-action:manipulation;-webkit-tap-highlight-color:rgba(255,255,255,.08)}
      /* Compatibilité v3.00 : sa règle !important masquait le nouveau guide. */
      #plannerView.gomo-v300-simple.gomo-v314-simple > #gomoV314Guide{display:block!important}
      #plannerView.gomo-v300-simple.gomo-v314-simple > #gomoV300Assistant{display:none!important}
      .v314{max-width:760px;margin:0 auto;padding:8px 0 30px;color:#f7fbff}
      .v314-card{border:2px solid rgba(66,194,244,.58);border-radius:28px;background:linear-gradient(150deg,rgba(15,50,75,.98),rgba(5,26,43,.99));padding:20px;box-shadow:0 18px 50px rgba(0,0,0,.22)}
      .v314-center{text-align:center}.v314-brand{font-size:.78rem;font-weight:900;letter-spacing:.18em;color:#80dbff;margin:0 0 8px}.v314 h2{font-size:clamp(2rem,8vw,3rem);line-height:1.02;margin:0 0 12px}.v314 h3{font-size:1.45rem;line-height:1.15;margin:0 0 8px}.v314 p{line-height:1.52;margin:0;color:#cbe5f2}
      .v314-promise{font-size:1.12rem;max-width:520px;margin:0 auto!important}.v314-help{font-size:.9rem;margin-top:9px!important;color:#a9cad9!important}
      .v314-primary,.v314-secondary,.v314-ghost{width:100%;border:0;border-radius:20px;min-height:62px;padding:14px 18px;font:inherit;font-size:1.08rem;font-weight:900;cursor:pointer}
      .v314-primary{background:#26a7df;color:#fff;box-shadow:0 10px 24px rgba(38,167,223,.20)}.v314-secondary{background:#0c2b40;color:#d8f3ff;border:1px solid rgba(93,201,244,.38)}.v314-ghost{min-height:46px;background:transparent;color:#9dddf8;border:1px solid rgba(93,201,244,.22);font-size:.9rem}
      .v314-btns{display:grid;gap:10px;margin-top:18px}.v314-split{display:grid;grid-template-columns:1fr 1fr;gap:10px}.v314-split>.v314-secondary,.v314-split>.v314-primary{min-height:54px;font-size:.95rem}
      .v314-progress{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;margin-bottom:14px}.v314-progress small{font-weight:900;color:#9dddf8}.v314-track{height:8px;border-radius:999px;background:#082337;overflow:hidden}.v314-fill{height:100%;background:#29a9df;border-radius:999px;transition:width .2s}
      .v314-day{display:grid;place-items:center;min-height:140px;border-radius:23px;margin-top:16px;background:rgba(37,168,224,.10);border:1px solid rgba(85,208,255,.28)}.v314-day strong{font-size:1.8rem;text-align:center;padding:10px}
      .v314-field{display:grid;gap:7px;margin-top:16px;text-align:left}.v314-field span{font-size:.86rem;font-weight:900;color:#c6e7f6}.v314-field input,.v314-field select,.v314-number{width:100%;box-sizing:border-box;border:2px solid rgba(104,198,235,.46);border-radius:18px;background:#071f31;color:#fff;padding:15px 16px;font:inherit;font-size:1.08rem;font-weight:900;min-height:56px}
      .v314-choices{display:grid;gap:12px;margin-top:18px}.v314-choice{display:grid;grid-template-columns:48px 1fr;gap:12px;align-items:center;border:2px solid rgba(77,192,235,.42);border-radius:22px;background:#092a40;color:#fff;padding:15px;text-align:left;font:inherit;font-weight:900;font-size:1.06rem}.v314-choice b{font-size:1.55rem}.v314-choice small{display:block;color:#a9cad9;font-size:.78rem;font-weight:700;margin-top:3px}
      .v314-upload{display:grid;place-items:center;min-height:92px;border:2px dashed rgba(83,208,255,.6);border-radius:22px;background:rgba(38,167,223,.08);color:#dcf7ff;font-size:1.08rem;font-weight:900;margin-top:16px;cursor:pointer}.v314-upload input{display:none}
      .v314-review{display:grid;gap:9px;margin-top:15px}.v314-row{display:grid;grid-template-columns:1fr 128px;gap:10px;align-items:center;border:1px solid rgba(108,190,225,.20);border-radius:17px;background:#09263a;padding:11px 12px}.v314-row strong{display:block;font-size:.9rem}.v314-row small{color:#85bed8}.v314-row input{width:100%;box-sizing:border-box;border:1px solid rgba(97,198,237,.35);border-radius:12px;background:#061c2c;color:#fff;padding:10px;font:inherit;font-weight:900}
      .v314-manual{display:grid;gap:8px;margin-top:15px}.v314-manual-row{display:grid;grid-template-columns:36px 1fr 118px;gap:9px;align-items:center;border-bottom:1px solid rgba(114,192,224,.14);padding:9px 0}.v314-manual-row .ico{font-size:1.25rem}.v314-manual-row strong{font-size:.9rem}.v314-manual-row small{display:block;color:#88b6ca;font-size:.72rem}.v314-manual-row input{width:100%;box-sizing:border-box;border:1px solid rgba(97,198,237,.35);border-radius:12px;background:#061c2c;color:#fff;padding:10px;font:inherit;font-weight:900}
      .v314-score{font-size:1.55rem!important;text-align:center;letter-spacing:.02em}
      .v314-stat{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:end;border-radius:20px;background:#08253a;border:1px solid rgba(95,191,229,.22);padding:14px;margin-top:10px}.v314-stat span{color:#9bc8da;font-size:.8rem;font-weight:800}.v314-stat strong{font-size:1.32rem}.v314-stat.gold strong{color:#ffd36a}
      .v314-alert{border-radius:20px;padding:15px;margin-top:14px;font-weight:900;line-height:1.45}.v314-ok{background:rgba(55,191,122,.13);border:1px solid rgba(92,222,153,.35);color:#9bf0bf}.v314-warn{background:rgba(255,173,65,.10);border:1px solid rgba(255,193,99,.34);color:#ffd08d}
      .v314-steps{counter-reset:plan;display:grid;gap:10px;margin-top:14px}.v314-planline{counter-increment:plan;display:grid;grid-template-columns:42px 1fr auto;gap:10px;align-items:center;border-radius:18px;background:#08253a;border:1px solid rgba(94,190,227,.20);padding:12px}.v314-planline:before{content:counter(plan);display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#27a7df;color:#fff;font-weight:900}.v314-planline strong{display:block}.v314-planline small{display:block;color:#91bed1;margin-top:3px}.v314-gain{font-weight:900;color:#83ddff;white-space:nowrap}
      .v314-stop{font-size:1.08rem;text-align:center;margin-top:16px!important;color:#a6efc3!important;font-weight:900}
      .v314-done-icon{font-size:3rem;margin-bottom:8px}.v314-version{text-align:center;color:#6f9aae;font-size:.72rem;margin-top:12px}
      .v314-advanced{margin-top:14px;border-top:1px solid rgba(109,189,222,.17);padding-top:12px}.v314-advanced summary{cursor:pointer;color:#7fcce9;font-weight:800;font-size:.82rem}.v314-advanced p{font-size:.78rem;margin-top:8px!important}
      .v314-lang{margin:16px auto 0;max-width:240px}.v314-lang select{width:100%;border:1px solid rgba(96,198,237,.30);border-radius:14px;background:#071f31;color:#dff7ff;padding:10px 12px;font:inherit;font-weight:800}
      @media(max-width:520px){.v314-card{padding:18px 14px;border-radius:24px}.v314-split{grid-template-columns:1fr}.v314-row{grid-template-columns:1fr 110px}.v314-manual-row{grid-template-columns:32px 1fr 105px}.v314-planline{grid-template-columns:38px 1fr}.v314-gain{grid-column:2;text-align:left}}
    `;
    document.head.appendChild(s);
  }

  function ensure(){
    css();
    const pv=document.getElementById('plannerView');if(!pv)return null;
    ['gomoV300Assistant','gomoV310Guide','gomoV311Guide','gomoV312Guide','gomoV313Guide'].forEach(id=>{
      const old=document.getElementById(id);
      if(old) old.remove();
    });
    pv.classList.remove('gomo-v300-simple','gomo-v310-simple','gomo-v311-simple','gomo-v312-simple','gomo-v313-simple');
    let root=document.getElementById('gomoV314Guide');
    if(!root){root=document.createElement('section');root.id='gomoV314Guide';pv.insertBefore(root,pv.firstChild);}
    pv.classList.toggle('gomo-v314-simple',!ui.advanced);
    document.body?.classList.toggle('gomo-v314-simple',!ui.advanced);
    if(!ui.advanced) pv.classList.remove('gomo-v300-simple','gomo-v310-simple','gomo-v311-simple','gomo-v312-simple','gomo-v313-simple');
    return root;
  }

  function languageOptions(){
    const names={fr:'Français',de:'Deutsch',en:'English',pt:'Português',ro:'Română',uk:'Українська',ko:'한국어',hr:'Hrvatski'};
    const available=['fr','de','en','pt','ro','uk','ko','hr'];
    return available.map(k=>`<option value="${k}" ${lang()===k?'selected':''}>${names[k]}</option>`).join('');
  }

  function progress(step){
    const pct=Math.max(0,Math.min(100,(step/4)*100));
    return `<div class="v314-progress"><small>${esc(tr('step'))} ${Math.max(1,step)}</small><div class="v314-track"><div class="v314-fill" style="width:${pct}%"></div></div><small>4</small></div>`;
  }

  function backButton(to){
    return `<button class="v314-ghost" type="button" data-go="${to}">← ${esc(tr('back'))}</button>`;
  }

  function advancedBlock(){
    return `<details class="v314-advanced"><summary>⚙️ ${esc(tr('advanced'))}</summary><p>${esc(tr('advancedText'))}</p><div class="v314-btns"><button class="v314-ghost" id="v314AdvancedToggle" type="button">${esc(ui.advanced?tr('hideOld'):tr('showOld'))}</button></div></details>`;
  }

  function render(){
    const root=ensure();if(!root)return;
    root.innerHTML=`<div class="v314">${screen()}</div>`;
    bind(root);
  }

  function screen(){
    if(ui.finished)return screenFinished();
    if(ui.step===0)return screenHome();
    if(ui.step===1)return screenDay();
    if(ui.step===2)return screenResources();
    if(ui.step===3)return screenScore();
    return screenPlan();
  }

  function screenHome(){
    const hasProgress=ui.step>0;
    return `<div class="v314-card v314-center">
      <p class="v314-brand">GoMo Forever · LAST WAR</p>
      <h2>${esc(tr('title'))}</h2>
      <p class="v314-promise">${esc(tr('promise'))}</p>
      <p class="v314-help">${esc(tr('homeHelp'))}</p>
      <div class="v314-btns"><button class="v314-primary" id="v314Start" type="button">${esc(hasProgress?tr('resume'):tr('start'))}</button></div>
      <label class="v314-lang"><select id="v314Language" aria-label="${esc(tr('language'))}">${languageOptions()}</select></label>
      ${advancedBlock()}
      <div class="v314-version">${esc(tr('version'))} · v${VERSION}</div>
    </div>`;
  }

  function dayOptions(){return allDays().map(d=>`<option value="${d.id}" ${Number(state.selectedDay)===Number(d.id)?'selected':''}>${esc(dayName(d.id))}</option>`).join('');}

  function screenDay(){
    return `<div class="v314-card">
      ${progress(1)}
      <h3>${esc(tr('dayTitle'))}</h3><p>${esc(tr('dayHelp'))}</p>
      <div class="v314-day"><strong>${esc(dayName(state.selectedDay))}</strong></div>
      ${ui.changeDay?`<label class="v314-field"><span>${esc(tr('chooseDay'))}</span><select id="v314Day">${dayOptions()}</select></label>`:''}
      <div class="v314-btns">
        <button class="v314-primary" id="v314DayOk" type="button">${esc(tr('yesContinue'))}</button>
        <button class="v314-secondary" id="v314ChangeDay" type="button">${esc(ui.changeDay?tr('continue'):tr('chooseDay'))}</button>
        ${backButton(0)}
      </div>
    </div>`;
  }

  function screenResources(){
    let body='';
    if(ui.inputMode==='choice'){
      body=`<div class="v314-choices">
        <button class="v314-choice" id="v314CaptureChoice" type="button"><b>📷</b><span>${esc(tr('addCaptures'))}<small>${esc(tr('captureHint'))}</small></span></button>
        <button class="v314-choice" id="v314ManualChoice" type="button"><b>✍️</b><span>${esc(tr('manual'))}<small>${esc(tr('manualHelp'))}</small></span></button>
      </div>`;
    } else if(ui.inputMode==='capture'){
      body=captureMarkup();
    } else {
      body=manualMarkup();
    }
    return `<div class="v314-card">
      ${progress(2)}
      <h3>${esc(tr('resourcesTitle'))}</h3><p>${esc(tr('resourcesHelp'))}</p>
      ${body}
      <div class="v314-btns">${ui.inputMode!=='choice'?`<button class="v314-secondary" id="v314ResourceChoice" type="button">${esc(tr('change'))}</button>`:''}${backButton(1)}</div>
    </div>`;
  }

  function meaningfulOcr(){
    const rows=(typeof ocrRows!=='undefined'&&Array.isArray(ocrRows))?ocrRows:[];
    return rows.map((r,index)=>({r,index})).filter(x=>x.r&&x.r.target&&Number(x.r.value)>0);
  }

  function captureMarkup(){
    const rows=meaningfulOcr();
    if(busy)return `<label class="v314-upload">${esc(tr('reading'))}</label>`;
    if(!rows.length)return `<label class="v314-upload">📷 ${esc(tr('addCaptures'))}<input id="v314Files" type="file" accept="image/*" multiple></label><p class="v314-help">${esc(tr('captureHint'))}</p>`;
    return `<h3 style="margin-top:18px">${esc(tr('recognized'))}</h3><p class="v314-help">${esc(tr('recognizedHelp'))}</p>
      <div class="v314-review">${rows.map(({r,index})=>`<label class="v314-row"><span><strong>${esc(targetLabel(r.target))}</strong><small>${num(r.confidence||0)}% ${esc(tr('confidence'))}</small></span><input type="number" inputmode="decimal" min="0" data-ocr="${index}" value="${Number(r.value)||0}"></label>`).join('')}</div>
      <div class="v314-btns"><button class="v314-primary" id="v314ApplyOcr" type="button">${esc(tr('validate'))}</button><label class="v314-secondary" style="display:grid;place-items:center;cursor:pointer">📷 ${esc(tr('addCaptures'))}<input id="v314Files" type="file" accept="image/*" multiple style="display:none"></label></div>`;
  }

  function manualMarkup(){
    const rows=todayResources();
    return `<h3 style="margin-top:18px">${esc(tr('manualTitle'))}</h3><p class="v314-help">${esc(tr('manualHelp'))}</p>
      <div class="v314-manual">${rows.map(i=>`<label class="v314-manual-row"><span class="ico">${icon(i)}</span><span><strong>${esc(label(i))}</strong><small>${esc(unit(i)||tr('quantity'))}</small></span><input type="number" inputmode="decimal" min="0" data-stock="${esc(i.stockKey)}" value="${stock(i)}"></label>`).join('')}</div>
      <div class="v314-btns"><button class="v314-primary" id="v314ManualSave" type="button">${esc(tr('saveContinue'))}</button></div>`;
  }

  function screenScore(){
    const cur=Math.max(0,Number(state.currentPoints?.[state.selectedDay]||0));
    return `<div class="v314-card">
      ${progress(3)}
      <h3>${esc(tr('scoreTitle'))}</h3><p>${esc(tr('scoreHelp'))}</p>
      <label class="v314-field"><span>${esc(tr('currentScore'))}</span><input class="v314-score" id="v314Score" type="number" inputmode="numeric" min="0" value="${cur||''}" placeholder="${esc(tr('scorePlaceholder'))}"></label>
      <div class="v314-btns"><button class="v314-primary" id="v314MakePlan" type="button">${esc(tr('makePlan'))}</button>${backButton(2)}</div>
    </div>`;
  }

  function autoPlan(){
    const d=currentDay();
    const current=Math.max(0,Number(state.currentPoints?.[d.id]||0));
    const speedLimit=Math.max(0,Number(state.profile?.speedupLimitDays||10)*1440);
    let speedUsed=0;
    const candidates=(d.items||[])
      .filter(i=>!isAction(i))
      .map(i=>({item:i,available:Math.floor(usable(i)),ppu:ppu(d.id,i)}))
      .filter(c=>c.available>0&&c.ppu>0);

    try{
      if(typeof strategyComparator==='function')candidates.sort(strategyComparator(state.profile?.strategy||'economy'));
      else candidates.sort((a,b)=>b.ppu-a.ppu);
    }catch{candidates.sort((a,b)=>b.ppu-a.ppu);}

    const usage=new Map();
    // 7.3M is a safety target only while the player is still below the 7.2M minimum.
    // Once 7.2M is already reached, the safest plan is to spend nothing else.
    let remaining=current>=MINIMUM?0:Math.max(0,TARGET-current);

    for(const c of candidates){
      let max=c.available;
      if(c.item.speedup)max=Math.min(max,Math.max(0,Math.floor(speedLimit-speedUsed)));
      if(max<=0)continue;
      const qty=Math.min(max,Math.floor(remaining/c.ppu));
      if(qty>0){
        usage.set(c.item.id,qty);
        remaining-=qty*c.ppu;
        if(c.item.speedup)speedUsed+=qty;
      }
      if(remaining<=.0001)break;
    }

    if(remaining>.0001){
      let best=null;
      for(const c of candidates){
        const used=usage.get(c.item.id)||0;
        let left=c.available-used;
        if(c.item.speedup)left=Math.min(left,Math.max(0,Math.floor(speedLimit-speedUsed)));
        if(left<=0)continue;
        const qty=Math.min(left,Math.ceil(remaining/c.ppu));
        if(qty<=0)continue;
        const gained=qty*c.ppu;
        let rank=Math.max(0,gained-remaining);
        try{if(typeof strategyCost==='function')rank+=strategyCost(c,state.profile?.strategy||'economy',qty);}catch{}
        if(!best||rank<best.rank)best={c,qty,gained,rank};
      }
      if(best){
        usage.set(best.c.item.id,(usage.get(best.c.item.id)||0)+best.qty);
        remaining-=best.gained;
        if(best.c.item.speedup)speedUsed+=best.qty;
      }
    }

    if(remaining>.0001){
      for(const c of candidates){
        const used=usage.get(c.item.id)||0;
        let left=c.available-used;
        if(c.item.speedup)left=Math.min(left,Math.max(0,Math.floor(speedLimit-speedUsed)));
        if(left<=0)continue;
        usage.set(c.item.id,used+left);
        remaining-=left*c.ppu;
        if(c.item.speedup)speedUsed+=left;
        if(remaining<=.0001)break;
      }
    }

    const resources=candidates.map(c=>{
      const qty=usage.get(c.item.id)||0;
      return qty?{item:c.item,qty,ppu:c.ppu,points:qty*c.ppu}:null;
    }).filter(Boolean);

    const resourcePoints=resources.reduce((s,r)=>s+r.points,0);
    const finalPoints=current+resourcePoints;
    return {
      dayId:d.id,current,resources,resourcePoints,finalPoints,
      reached:finalPoints>=MINIMUM,
      targetReached:finalPoints>=TARGET,
      missingMinimum:Math.max(0,MINIMUM-finalPoints),
      missingTarget:Math.max(0,TARGET-finalPoints)
    };
  }

  function screenPlan(){
    const p=planCache||autoPlan();planCache=p;
    const need=Math.max(0,TARGET-p.current);
    const lines=p.resources.map(r=>`<div class="v314-planline"><span><strong>${esc(label(r.item))}</strong><small>${esc(formatQty(r.qty,r.item))}</small></span><span class="v314-gain">+${compact(r.points)}</span></div>`).join('');
    const status=p.current>=MINIMUM
      ? `<div class="v314-alert v314-ok">${esc(tr('noSpend'))}</div>`
      : p.reached
        ? `<div class="v314-alert v314-ok">${esc(tr('stop'))}</div>`
        : `<div class="v314-alert v314-warn">${esc(tr('insufficient'))}<br>${esc(tr('missing'))} ${compact(p.missingMinimum)}.</div>`;

    return `<div class="v314-card">
      ${progress(4)}
      <h3>${esc(tr('planTitle'))}</h3>
      <div class="v314-stat"><span>${esc(tr('already'))}</span><strong>${compact(p.current)}</strong></div>
      ${p.current<MINIMUM?`<div class="v314-stat gold"><span>${esc(tr('missing'))}</span><strong>${compact(need)}</strong></div>`:''}
      ${p.resources.length?`<h3 style="margin-top:20px">${esc(tr('exact'))}</h3><div class="v314-steps">${lines}</div>`:''}
      <div class="v314-stat gold"><span>${esc(tr('estimated'))}</span><strong>${compact(p.finalPoints)}</strong></div>
      <div class="v314-split" style="margin-top:10px"><div class="v314-stat"><span>${esc(tr('minimum'))}</span><strong>7,2 M</strong></div><div class="v314-stat"><span>${esc(tr('target'))}</span><strong>7,3 M</strong></div></div>
      ${status}
      <div class="v314-btns">
        ${p.resources.length?`<button class="v314-secondary" id="v314Copy" type="button">📋 ${esc(tr('copy'))}</button>`:''}
        <button class="v314-primary" id="v314Done" type="button">${esc(tr('done'))}</button>
        <div class="v314-split"><button class="v314-ghost" type="button" data-go="2">${esc(tr('editResources'))}</button><button class="v314-ghost" type="button" data-go="3">${esc(tr('editScore'))}</button></div>
      </div>
      ${advancedBlock()}
      <div class="v314-version">${esc(tr('version'))} · v${VERSION}</div>
    </div>`;
  }

  function screenFinished(){
    const actual=Math.max(0,Number(state.currentPoints?.[state.selectedDay]||0));
    return `<div class="v314-card v314-center">
      <div class="v314-done-icon">✅</div><h2>${esc(tr('finishedTitle'))}</h2><p class="v314-promise">${esc(tr('finishedText'))}</p>
      <label class="v314-field"><span>${esc(tr('actualScore'))}</span><input class="v314-score" id="v314ActualScore" type="number" inputmode="numeric" min="0" value="${actual||''}"></label>
      <div class="v314-btns"><button class="v314-primary" id="v314SaveActual" type="button">${esc(tr('saveActual'))}</button><button class="v314-secondary" id="v314Restart" type="button">${esc(tr('reset'))}</button></div>
      ${advancedBlock()}
      <div class="v314-version">${esc(tr('version'))} · v${VERSION}</div>
    </div>`;
  }

  function planText(){
    const p=planCache||autoPlan();
    const lines=[`GoMo VS Planner · ${dayName(p.dayId)}`,`${tr('currentScore')}: ${num(p.current)}`,`${tr('target')}: 7 300 000 ${tr('points')}`,''];
    if(p.resources.length){
      lines.push(tr('exact'));
      p.resources.forEach((r,i)=>lines.push(`${i+1}. ${label(r.item)} — ${formatQty(r.qty,r.item)} (+${num(Math.round(r.points))} ${tr('points')})`));
      lines.push('');
    }
    lines.push(`${tr('estimated')}: ${num(Math.round(p.finalPoints))} ${tr('points')}`);
    lines.push(p.reached?tr('stop'):`${tr('missing')} ${num(Math.ceil(p.missingMinimum))} ${tr('points')}`);
    return lines.join('\n');
  }

  async function copyPlan(){
    try{await navigator.clipboard.writeText(planText());toast(tr('copied'));}catch{toast(tr('copied'));}
  }
  function toast(msg){try{if(typeof showToast==='function')showToast(msg);else console.info(msg);}catch{}}

  async function handleFiles(files){
    if(!files?.length){toast(tr('imageRequired'));return;}
    busy=true;render();
    try{
      if(typeof setOcrFiles==='function')setOcrFiles(files);
      if(typeof startOcrScan==='function')await startOcrScan();
    }catch(e){console.error('v3.10 OCR',e);}
    busy=false;render();
  }

  function applyOcr(root){
    const rows=(typeof ocrRows!=='undefined'&&Array.isArray(ocrRows))?ocrRows:[];
    const inputs=[...root.querySelectorAll('[data-ocr]')];
    if(!inputs.length){toast(tr('noRead'));return;}
    const grouped=new Map();
    for(const inp of inputs){
      const r=rows[Number(inp.dataset.ocr)];
      if(!r?.target)continue;
      const v=Math.max(0,Number(inp.value)||0);
      if(v<=0)continue;
      grouped.set(r.target,Math.max(grouped.get(r.target)||0,v));
    }
    for(const [key,val] of grouped){
      if(key==='__currentPoints')state.currentPoints[state.selectedDay]=val;
      else state.inventory[key]=val;
    }
    persistBase();
    ui.step=3;ui.inputMode='choice';saveUi();toast(tr('inventorySaved'));render();
  }

  function saveManual(root){
    for(const inp of root.querySelectorAll('[data-stock]'))state.inventory[inp.dataset.stock]=Math.max(0,Number(inp.value)||0);
    persistBase();ui.step=3;ui.inputMode='choice';saveUi();toast(tr('inventorySaved'));render();
  }

  function saveScore(root){
    const input=root.querySelector('#v314Score');const n=Math.max(0,Number(input?.value)||0);
    if(!input||String(input.value).trim()===''){toast(tr('scoreRequired'));input?.focus();return;}
    state.currentPoints[state.selectedDay]=n;persistBase();planCache=autoPlan();ui.step=4;saveUi();render();
  }

  function saveActual(root){
    const n=Math.max(0,Number(root.querySelector('#v314ActualScore')?.value)||0);
    state.currentPoints[state.selectedDay]=n;persistBase();toast(tr('saved'));
  }

  function markDone(){
    const p=planCache||autoPlan();
    for(const r of p.resources){
      state.inventory[r.item.stockKey]=Math.max(0,Number(state.inventory[r.item.stockKey]||0)-Number(r.qty||0));
    }
    persistBase();
    ui.finished=true;
    saveUi();
    planCache=null;
    render();
  }

  function restart(){
    if(!confirm(tr('restartQuestion')))return;
    ui=defaultUi();saveUi();planCache=null;render();
  }

  function setLanguage(v){
    if(!v)return;
    state.language=v;
    try{if(typeof saveState==='function')saveState();if(typeof applyTranslations==='function')applyTranslations();}catch{}
    render();
  }

  function bind(root){
    const on=(selector,event,handler)=>{
      const node=root.querySelector(selector);
      if(node) node[event]=handler;
    };
    const goTo=(step)=>{
      ui.step=Number(step)||0;
      ui.finished=false;
      saveUi();
      render();
    };

    root.querySelectorAll('[data-go]').forEach(node=>{
      node.onclick=()=>goTo(node.dataset.go);
    });

    on('#v314Start','onclick',()=>goTo(1));

    on('#v314DayOk','onclick',()=>{
      ui.step=2;ui.inputMode='choice';ui.changeDay=false;saveUi();render();
    });

    on('#v314ChangeDay','onclick',()=>{
      if(ui.changeDay){ui.step=2;ui.inputMode='choice';ui.changeDay=false;}
      else ui.changeDay=true;
      saveUi();render();
    });

    on('#v314CaptureChoice','onclick',()=>{ui.inputMode='capture';saveUi();render();});
    on('#v314ManualChoice','onclick',()=>{ui.inputMode='manual';saveUi();render();});
    on('#v314ResourceChoice','onclick',()=>{ui.inputMode='choice';saveUi();render();});
    on('#v314ApplyOcr','onclick',()=>applyOcr(root));
    on('#v314ManualSave','onclick',()=>saveManual(root));
    on('#v314MakePlan','onclick',()=>saveScore(root));
    on('#v314Copy','onclick',()=>void copyPlan());
    on('#v314Done','onclick',()=>markDone());
    on('#v314SaveActual','onclick',()=>saveActual(root));
    on('#v314Restart','onclick',()=>restart());

    on('#v314AdvancedToggle','onclick',()=>{
      ui.advanced=!ui.advanced;
      saveUi();
      render();
    });

    on('#v314Language','onchange',e=>setLanguage(e.target.value));

    on('#v314Day','onchange',e=>{
      state.selectedDay=Number(e.target.value);
      state.autoDay=false;
      planCache=null;
      persistBase();
      render();
    });

    on('#v314Files','onchange',e=>void handleFiles(e.target.files));
  }

  function refresh(){
    try{
      if(state?.profile){if(Number(state.profile.target)<MINIMUM)state.profile.target=MINIMUM;state.profile.margin=100_000;}
    }catch{}
    render();
  }

  // v3.14 : démarrage unique, sans observateur de classes et sans monkey-patch.
  // Le guide est rendu après les correctifs existants et garde ses propres gestionnaires de boutons.
  function start(){
    refresh();
    document.documentElement.setAttribute('data-gomo-v314-ready','1');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  console.info('GoMo VS Planner guide stable',VERSION);
})();
