'use strict';

/* GoMo VS Planner v3.20.5 i18n safety patch.
   Translation-only layer: no VS calculation, stock, history or plan logic is changed. */
(() => {
  const VERSION='3.20.5-i18n1';
  const LANGS=['fr','en','de','ro','uk','ko','hr','pt'];
  let busy=false,timer=0,observer=null;

  const P315={
    promise:{fr:'Atteins au moins 7,2 M sans gaspiller tes ressources.',en:'Reach at least 7.2M without wasting your resources.',de:'Erreiche mindestens 7,2 Mio. ohne Ressourcen zu verschwenden.',ro:'Atinge cel puțin 7,2 M fără să risipești resursele.',uk:'Набери щонайменше 7,2 M без зайвих витрат ресурсів.',ko:'자원을 낭비하지 않고 최소 720만 VS 점수를 달성하세요.',hr:'Dosegni najmanje 7,2 M bez rasipanja resursa.',pt:'Atinge pelo menos 7,2 M sem desperdiçar recursos.'},
    homeHelp:{fr:'4 étapes simples. Le Planner te dit quoi utiliser et quand t’arrêter.',en:'4 simple steps. The Planner tells you what to use and when to stop.',de:'4 einfache Schritte. Der Planner sagt dir, was du nutzen sollst und wann du stoppen musst.',ro:'4 pași simpli. Planner-ul îți spune ce să folosești și când să te oprești.',uk:'4 прості кроки. Planner підкаже, що використати й коли зупинитися.',ko:'4단계로 간단하게 진행합니다. Planner가 무엇을 사용하고 언제 멈출지 알려줍니다.',hr:'4 jednostavna koraka. Planner ti kaže što koristiti i kada stati.',pt:'4 etapas simples. O Planner diz-te o que usar e quando parar.'},
    start:{fr:'Commencer mon VS',en:'Start my VS',de:'Mein VS starten',ro:'Începe VS-ul meu',uk:'Почати мій VS',ko:'VS 시작',hr:'Pokreni moj VS',pt:'Começar o meu VS'},
    resume:{fr:'Continuer mon VS',en:'Continue my VS',de:'Mein VS fortsetzen',ro:'Continuă VS-ul meu',uk:'Продовжити мій VS',ko:'VS 계속하기',hr:'Nastavi moj VS',pt:'Continuar o meu VS'},
    advanced:{fr:'Réglages avancés',en:'Advanced settings',de:'Erweiterte Einstellungen',ro:'Setări avansate',uk:'Розширені налаштування',ko:'고급 설정',hr:'Napredne postavke',pt:'Definições avançadas'},
    version:{fr:'Guide automatique',en:'Automatic guide',de:'Automatischer Guide',ro:'Ghid automat',uk:'Автоматичний гід',ko:'자동 가이드',hr:'Automatski vodič',pt:'Guia automático'},
    back:{fr:'Retour',en:'Back',de:'Zurück',ro:'Înapoi',uk:'Назад',ko:'뒤로',hr:'Natrag',pt:'Voltar'},
    continue:{fr:'Continuer',en:'Continue',de:'Weiter',ro:'Continuă',uk:'Продовжити',ko:'계속',hr:'Nastavi',pt:'Continuar'},
    change:{fr:'Modifier',en:'Change',de:'Ändern',ro:'Modifică',uk:'Змінити',ko:'변경',hr:'Promijeni',pt:'Alterar'},
    dayTitle:{fr:'Aujourd’hui, ton VS est :',en:'Today, your VS is:',de:'Heute ist dein VS:',ro:'Astăzi, VS-ul tău este:',uk:'Сьогодні твій VS:',ko:'오늘의 VS는:',hr:'Danas je tvoj VS:',pt:'Hoje, o teu VS é:'},
    dayHelp:{fr:'Le Planner utilise automatiquement les ressources qui rapportent des points aujourd’hui.',en:'The Planner automatically uses the resources that score today.',de:'Der Planner nutzt automatisch nur Ressourcen, die heute Punkte bringen.',ro:'Planner-ul folosește automat resursele care dau puncte astăzi.',uk:'Planner автоматично використовує ресурси, що дають бали сьогодні.',ko:'Planner는 오늘 점수를 주는 자원을 자동으로 사용합니다.',hr:'Planner automatski koristi resurse koji danas donose bodove.',pt:'O Planner usa automaticamente os recursos que dão pontos hoje.'},
    yesContinue:{fr:'Oui, continuer',en:'Yes, continue',de:'Ja, weiter',ro:'Da, continuă',uk:'Так, продовжити',ko:'예, 계속',hr:'Da, nastavi',pt:'Sim, continuar'},
    chooseDay:{fr:'Choisir un autre jour',en:'Choose another day',de:'Anderen Tag wählen',ro:'Alege altă zi',uk:'Вибрати інший день',ko:'다른 요일 선택',hr:'Odaberi drugi dan',pt:'Escolher outro dia'},
    resourcesTitle:{fr:'Donne-moi tes ressources',en:'Give me your resources',de:'Zeig mir deine Ressourcen',ro:'Arată-mi resursele tale',uk:'Покажи свої ресурси',ko:'보유 자원을 알려주세요',hr:'Pokaži mi svoje resurse',pt:'Mostra-me os teus recursos'},
    resourcesHelp:{fr:'Le plus simple : ajoute tes captures. Tu peux aussi entrer les quantités toi-même.',en:'Easiest: add screenshots. You can also enter quantities yourself.',de:'Am einfachsten: Screenshots hinzufügen. Mengen können auch manuell eingetragen werden.',ro:'Cel mai simplu: adaugă capturi. Poți introduce și cantitățile manual.',uk:'Найпростіше — додай знімки. Кількість також можна ввести вручну.',ko:'가장 간단한 방법은 스크린샷을 추가하는 것입니다. 수량을 직접 입력할 수도 있습니다.',hr:'Najjednostavnije je dodati snimke. Količine možeš unijeti i ručno.',pt:'Mais simples: adiciona capturas. Também podes introduzir as quantidades.'},
    addCaptures:{fr:'Ajouter mes captures',en:'Add my screenshots',de:'Screenshots hinzufügen',ro:'Adaugă capturile',uk:'Додати знімки',ko:'스크린샷 추가',hr:'Dodaj snimke',pt:'Adicionar capturas'},
    manual:{fr:'Entrer mes quantités',en:'Enter my quantities',de:'Mengen eingeben',ro:'Introdu cantitățile',uk:'Ввести кількість',ko:'수량 직접 입력',hr:'Unesi količine',pt:'Introduzir quantidades'},
    captureHint:{fr:'Choisis des captures nettes où les quantités sont entièrement visibles.',en:'Use clear screenshots with fully visible quantities.',de:'Nutze klare Screenshots mit vollständig sichtbaren Mengen.',ro:'Folosește capturi clare, cu cantitățile complet vizibile.',uk:'Використовуй чіткі знімки, де кількість повністю видно.',ko:'수량이 완전히 보이는 선명한 스크린샷을 사용하세요.',hr:'Koristi jasne snimke na kojima su količine potpuno vidljive.',pt:'Usa capturas nítidas com as quantidades totalmente visíveis.'},
    recognized:{fr:'Vérifie seulement ce qui a été reconnu',en:'Only check what was recognised',de:'Prüfe nur die erkannten Werte',ro:'Verifică doar valorile recunoscute',uk:'Перевір лише розпізнані значення',ko:'인식된 값만 확인하세요',hr:'Provjeri samo prepoznate vrijednosti',pt:'Verifica apenas o que foi reconhecido'},
    recognizedHelp:{fr:'Corrige une valeur si nécessaire. Ensuite valide : le Planner enregistre le reste.',en:'Correct a value if needed, then confirm.',de:'Falls nötig einen Wert korrigieren, dann bestätigen.',ro:'Corectează o valoare dacă este nevoie, apoi confirmă.',uk:'За потреби виправ значення, потім підтвердь.',ko:'필요하면 값을 수정한 뒤 확인하세요.',hr:'Po potrebi ispravi vrijednost, zatim potvrdi.',pt:'Corrige um valor se necessário e confirma.'},
    captureSafety:{fr:'Les captures servent uniquement à lire ton inventaire. Les actions, combats et ton score VS seront traités séparément.',en:'Screenshots are used only to read inventory. Actions, combat and your VS score are handled separately.',de:'Screenshots lesen nur dein Inventar. Aktionen, Kämpfe und dein VS-Punktestand werden getrennt behandelt.',ro:'Capturile sunt folosite doar pentru citirea inventarului. Acțiunile, luptele și scorul VS sunt tratate separat.',uk:'Знімки використовуються лише для читання інвентарю. Дії, бої та рахунок VS обробляються окремо.',ko:'스크린샷은 인벤토리 수량을 읽는 데만 사용됩니다. 행동, 전투, VS 점수는 별도로 처리됩니다.',hr:'Snimke služe samo za čitanje inventara. Akcije, borbe i VS rezultat obrađuju se odvojeno.',pt:'As capturas servem apenas para ler o inventário. Ações, combate e a pontuação VS são tratados separadamente.'},
    safeContinue:{fr:'Continuer avec les valeurs sûres →',en:'Continue with safe values →',de:'Mit sicheren Werten fortfahren →',ro:'Continuă cu valorile sigure →',uk:'Продовжити з надійними значеннями →',ko:'신뢰할 수 있는 값으로 계속 →',hr:'Nastavi sa sigurnim vrijednostima →',pt:'Continuar com os valores seguros →'},
    scoreTitle:{fr:'Combien de points VS as-tu déjà ?',en:'How many VS points do you already have?',de:'Wie viele VS-Punkte hast du schon?',ro:'Câte puncte VS ai deja?',uk:'Скільки VS-балів у тебе вже є?',ko:'현재 VS 점수는 얼마인가요?',hr:'Koliko VS bodova već imaš?',pt:'Quantos pontos VS já tens?'},
    scoreHelp:{fr:'Entre ton score actuel. Le Planner calcule exactement ce qu’il te manque.',en:'Enter your current score. The Planner calculates exactly what is missing.',de:'Aktuellen Punktestand eingeben. Der Planner berechnet den Rest.',ro:'Introdu scorul actual. Planner-ul calculează exact cât mai lipsește.',uk:'Введи поточний рахунок. Planner точно розрахує, скільки ще бракує.',ko:'현재 점수를 입력하세요. Planner가 정확히 얼마나 더 필요한지 계산합니다.',hr:'Unesi trenutačni rezultat. Planner točno izračunava koliko još nedostaje.',pt:'Introduz a pontuação atual. O Planner calcula exatamente o que falta.'},
    currentScore:{fr:'Score VS actuel',en:'Current VS score',de:'Aktuelle VS-Punkte',ro:'Scor VS actual',uk:'Поточний рахунок VS',ko:'현재 VS 점수',hr:'Trenutačni VS rezultat',pt:'Pontuação VS atual'},
    makePlan:{fr:'Calculer mon plan',en:'Calculate my plan',de:'Meinen Plan berechnen',ro:'Calculează planul meu',uk:'Розрахувати мій план',ko:'내 계획 계산',hr:'Izračunaj moj plan',pt:'Calcular o meu plano'},
    planTitle:{fr:'Ton plan est prêt',en:'Your plan is ready',de:'Dein Plan ist fertig',ro:'Planul tău este gata',uk:'Твій план готовий',ko:'계획이 준비되었습니다',hr:'Tvoj plan je spreman',pt:'O teu plano está pronto'},
    already:{fr:'Tu as déjà',en:'You already have',de:'Du hast bereits',ro:'Ai deja',uk:'У тебе вже є',ko:'이미 보유',hr:'Već imaš',pt:'Já tens'},
    missing:{fr:'Il te manque',en:'You still need',de:'Es fehlen noch',ro:'Îți mai lipsesc',uk:'Ще потрібно',ko:'추가로 필요',hr:'Još ti nedostaje',pt:'Ainda faltam'},
    exact:{fr:'Utilise exactement ceci, dans cet ordre :',en:'Use exactly this, in this order:',de:'Nutze genau dies, in dieser Reihenfolge:',ro:'Folosește exact acestea, în această ordine:',uk:'Використай саме це, у такому порядку:',ko:'아래 순서대로 정확히 사용하세요:',hr:'Upotrijebi točno ovo, ovim redoslijedom:',pt:'Usa exatamente isto, por esta ordem:'},
    noSpend:{fr:'Tu as déjà atteint l’objectif. Ne dépense plus rien.',en:'Target already reached. Do not spend anything else.',de:'Ziel bereits erreicht. Nichts mehr ausgeben.',ro:'Obiectivul este deja atins. Nu mai cheltui nimic.',uk:'Ціль уже досягнуто. Більше нічого не витрачай.',ko:'목표를 이미 달성했습니다. 더 이상 사용하지 마세요.',hr:'Cilj je već postignut. Ne troši više ništa.',pt:'Objetivo já atingido. Não gastes mais nada.'},
    estimated:{fr:'Total prévu',en:'Estimated total',de:'Geplante Summe',ro:'Total estimat',uk:'Очікуваний підсумок',ko:'예상 합계',hr:'Procijenjeni ukupni rezultat',pt:'Total previsto'},
    minimum:{fr:'Minimum',en:'Minimum',de:'Minimum',ro:'Minim',uk:'Мінімум',ko:'최소',hr:'Minimum',pt:'Mínimo'},
    recommended:{fr:'Cible conseillée',en:'Recommended target',de:'Empfohlenes Ziel',ro:'Țintă recomandată',uk:'Рекомендована ціль',ko:'권장 목표',hr:'Preporučeni cilj',pt:'Objetivo recomendado'},
    stop:{fr:'Arrête-toi ici et garde le reste pour la prochaine semaine.',en:'Stop here and save the rest for next week.',de:'Hier stoppen und den Rest für nächste Woche behalten.',ro:'Oprește-te aici și păstrează restul pentru săptămâna viitoare.',uk:'Зупинись тут і збережи решту на наступний тиждень.',ko:'여기서 멈추고 나머지는 다음 주를 위해 보관하세요.',hr:'Stani ovdje i sačuvaj ostatak za sljedeći tjedan.',pt:'Para aqui e guarda o resto para a próxima semana.'},
    copy:{fr:'Copier mon plan',en:'Copy my plan',de:'Plan kopieren',ro:'Copiază planul',uk:'Копіювати план',ko:'계획 복사',hr:'Kopiraj plan',pt:'Copiar o plano'},
    done:{fr:'J’ai terminé',en:'I am finished',de:'Ich bin fertig',ro:'Am terminat',uk:'Готово',ko:'완료',hr:'Završio sam',pt:'Terminei'},
    finishedTitle:{fr:'C’est terminé',en:'Done',de:'Fertig',ro:'Gata',uk:'Готово',ko:'완료',hr:'Gotovo',pt:'Terminado'},
    finishedText:{fr:'Ton plan est enregistré. Garde le reste de tes ressources pour la prochaine semaine.',en:'Your plan is saved. Keep the rest of your resources for next week.',de:'Dein Plan ist gespeichert. Behalte den Rest für nächste Woche.',ro:'Planul este salvat. Păstrează restul resurselor pentru săptămâna viitoare.',uk:'План збережено. Залиш решту ресурсів на наступний тиждень.',ko:'계획이 저장되었습니다. 나머지 자원은 다음 주를 위해 보관하세요.',hr:'Plan je spremljen. Sačuvaj ostatak resursa za sljedeći tjedan.',pt:'O plano está guardado. Guarda o resto para a próxima semana.'},
    actualScore:{fr:'Score VS réel après le plan',en:'Real VS score after the plan',de:'Echte VS-Punkte nach dem Plan',ro:'Scor VS real după plan',uk:'Реальний рахунок VS після плану',ko:'계획 후 실제 VS 점수',hr:'Stvarni VS rezultat nakon plana',pt:'Pontuação VS real depois do plano'},
    saveActual:{fr:'Enregistrer mon score',en:'Save my score',de:'Punkte speichern',ro:'Salvează scorul',uk:'Зберегти рахунок',ko:'점수 저장',hr:'Spremi rezultat',pt:'Guardar pontuação'},
    editResources:{fr:'Modifier mes ressources',en:'Edit my resources',de:'Ressourcen ändern',ro:'Modifică resursele',uk:'Змінити ресурси',ko:'자원 수정',hr:'Uredi resurse',pt:'Alterar recursos'},
    editScore:{fr:'Modifier mon score',en:'Edit my score',de:'Punkte ändern',ro:'Modifică scorul',uk:'Змінити рахунок',ko:'점수 수정',hr:'Uredi rezultat',pt:'Alterar pontuação'}
  };

  const P316={
    mode:{fr:'Mode du jour',en:'Daily mode',de:'Tagesmodus',ro:'Modul zilei',uk:'Режим дня',ko:'오늘 모드',hr:'Dnevni način',pt:'Modo do dia'},
    economy:{fr:'Économie',en:'Economy',de:'Sparen',ro:'Economie',uk:'Економія',ko:'절약',hr:'Štednja',pt:'Economia'},
    normal:{fr:'Normal',en:'Normal',de:'Normal',ro:'Normal',uk:'Звичайний',ko:'일반',hr:'Normalno',pt:'Normal'},
    push:{fr:'Poussée',en:'Push',de:'Push',ro:'Forțare',uk:'Ривок',ko:'푸시',hr:'Pritisak',pt:'Impulso'},
    eDesc:{fr:'7,2 M · économiser au maximum',en:'7.2M · save as much as possible',de:'7,2 Mio. · maximal sparen',ro:'7,2 M · economisește cât mai mult',uk:'7,2 M · максимально економити',ko:'7.2M · 최대한 절약',hr:'7,2 M · maksimalno štedi',pt:'7,2 M · poupar o máximo possível'},
    nDesc:{fr:'7,3 M · petite marge de sécurité',en:'7.3M · small safety margin',de:'7,3 Mio. · kleine Sicherheitsmarge',ro:'7,3 M · marjă mică de siguranță',uk:'7,3 M · невеликий запас безпеки',ko:'7.3M · 작은 안전 여유',hr:'7,3 M · mala sigurnosna rezerva',pt:'7,3 M · pequena margem de segurança'},
    pDesc:{fr:'Objectif élevé · gros gains prioritaires',en:'Higher target · prioritise large gains',de:'Höheres Ziel · große Gewinne zuerst',ro:'Țintă mai mare · prioritizează câștigurile mari',uk:'Вища ціль · пріоритет великим приростам',ko:'더 높은 목표 · 큰 점수 우선',hr:'Viši cilj · prednost velikim dobicima',pt:'Objetivo elevado · priorizar grandes ganhos'},
    target:{fr:'Objectif du jour',en:'Daily target',de:'Tagesziel',ro:'Ținta zilei',uk:'Ціль дня',ko:'오늘 목표',hr:'Dnevni cilj',pt:'Objetivo do dia'},
    plan:{fr:'Nouveau plan intelligent',en:'New smart plan',de:'Neuer intelligenter Plan',ro:'Plan inteligent nou',uk:'Новий розумний план',ko:'새 스마트 계획',hr:'Novi pametni plan',pt:'Novo plano inteligente'},
    already:{fr:'Déjà obtenu',en:'Already earned',de:'Bereits erreicht',ro:'Deja obținut',uk:'Уже отримано',ko:'이미 획득',hr:'Već osvojeno',pt:'Já obtido'},
    potential:{fr:'Potentiel disponible',en:'Available potential',de:'Verfügbares Potenzial',ro:'Potențial disponibil',uk:'Доступний потенціал',ko:'사용 가능한 잠재 점수',hr:'Dostupan potencijal',pt:'Potencial disponível'},
    exact:{fr:'Utilise ceci, dans cet ordre :',en:'Use this, in this order:',de:'Nutze dies in dieser Reihenfolge:',ro:'Folosește acestea, în această ordine:',uk:'Використай це в такому порядку:',ko:'이 순서대로 사용하세요:',hr:'Upotrijebi ovo ovim redoslijedom:',pt:'Usa isto por esta ordem:'},
    keep:{fr:'À garder',en:'Keep',de:'Aufheben',ro:'Păstrează',uk:'Зберегти',ko:'보관',hr:'Sačuvaj',pt:'Guardar'},
    keepHelp:{fr:'Le reste reste protégé pour plus tard.',en:'The rest stays protected for later.',de:'Der Rest bleibt für später geschützt.',ro:'Restul rămâne protejat pentru mai târziu.',uk:'Решта залишається захищеною на потім.',ko:'나머지는 나중을 위해 보호됩니다.',hr:'Ostatak ostaje zaštićen za kasnije.',pt:'O restante fica protegido para mais tarde.'},
    estimated:{fr:'Total prévu',en:'Estimated total',de:'Geplante Summe',ro:'Total estimat',uk:'Очікуваний підсумок',ko:'예상 합계',hr:'Procijenjeni ukupni rezultat',pt:'Total previsto'},
    reached:{fr:'Objectif atteint : arrête-toi ici et garde le reste.',en:'Target reached: stop here and keep the rest.',de:'Ziel erreicht: hier stoppen und den Rest behalten.',ro:'Obiectiv atins: oprește-te aici și păstrează restul.',uk:'Ціль досягнуто: зупинись тут і збережи решту.',ko:'목표 달성: 여기서 멈추고 나머지는 보관하세요.',hr:'Cilj postignut: stani ovdje i sačuvaj ostatak.',pt:'Objetivo atingido: para aqui e guarda o resto.'},
    noSpend:{fr:'Objectif déjà atteint. Ne dépense plus rien.',en:'Target already reached. Spend nothing else.',de:'Ziel bereits erreicht. Nichts mehr ausgeben.',ro:'Obiectivul este deja atins. Nu mai cheltui nimic.',uk:'Ціль уже досягнуто. Більше нічого не витрачай.',ko:'목표를 이미 달성했습니다. 더 이상 사용하지 마세요.',hr:'Cilj je već postignut. Ne troši više ništa.',pt:'Objetivo já atingido. Não gastes mais nada.'},
    copy:{fr:'Copier le plan',en:'Copy plan',de:'Plan kopieren',ro:'Copiază planul',uk:'Копіювати план',ko:'계획 복사',hr:'Kopiraj plan',pt:'Copiar plano'},
    apply:{fr:'J’ai utilisé ce plan',en:'I used this plan',de:'Plan verwendet',ro:'Am folosit acest plan',uk:'Я використав цей план',ko:'이 계획을 사용했습니다',hr:'Iskoristio sam ovaj plan',pt:'Usei este plano'},
    editResources:{fr:'Modifier les ressources',en:'Edit resources',de:'Ressourcen ändern',ro:'Modifică resursele',uk:'Змінити ресурси',ko:'자원 수정',hr:'Uredi resurse',pt:'Alterar recursos'},
    editScore:{fr:'Modifier le score',en:'Edit score',de:'Punkte ändern',ro:'Modifică scorul',uk:'Змінити рахунок',ko:'점수 수정',hr:'Uredi rezultat',pt:'Alterar pontuação'},
    done:{fr:'J’ai terminé',en:'I am finished',de:'Fertig',ro:'Am terminat',uk:'Готово',ko:'완료',hr:'Završio sam',pt:'Terminei'},
    finished:{fr:'C’est terminé',en:'Done',de:'Fertig',ro:'Gata',uk:'Готово',ko:'완료',hr:'Gotovo',pt:'Terminado'},
    finishedHelp:{fr:'Le stock restant est conservé.',en:'Remaining stock is kept.',de:'Der Restbestand bleibt erhalten.',ro:'Stocul rămas este păstrat.',uk:'Залишок запасів зберігається.',ko:'남은 재고는 유지됩니다.',hr:'Preostali zalihe ostaju sačuvane.',pt:'O stock restante é conservado.'},
    actual:{fr:'Score VS réel',en:'Real VS score',de:'Echte VS-Punkte',ro:'Scor VS real',uk:'Реальний рахунок VS',ko:'실제 VS 점수',hr:'Stvarni VS rezultat',pt:'Pontuação VS real'},
    save:{fr:'Enregistrer le score',en:'Save score',de:'Punkte speichern',ro:'Salvează scorul',uk:'Зберегти рахунок',ko:'점수 저장',hr:'Spremi rezultat',pt:'Guardar pontuação'},
    restart:{fr:'Recommencer le guide',en:'Restart guide',de:'Guide neu starten',ro:'Repornește ghidul',uk:'Перезапустити гід',ko:'가이드 다시 시작',hr:'Ponovno pokreni vodič',pt:'Recomeçar o guia'}
  };

  const P317={
    title:{fr:'Course aux armements',en:'Arms Race',de:'Wettrüsten',ro:'Cursa înarmărilor',uk:'Гонка озброєнь',ko:'군비 경쟁',hr:'Utrka u naoružanju',pt:'Corrida Armamentista'},
    intro:{fr:'Combine le VS avec la bonne phase sans gaspiller tes ressources.',en:'Combine VS with the right phase without wasting resources.',de:'Kombiniere den VS mit der richtigen Phase, ohne Ressourcen zu verschwenden.',ro:'Combină VS-ul cu faza potrivită fără să risipești resurse.',uk:'Поєднуй VS з правильною фазою, не витрачаючи ресурси даремно.',ko:'자원을 낭비하지 않고 VS와 알맞은 단계를 함께 진행하세요.',hr:'Kombiniraj VS s pravom fazom bez rasipanja resursa.',pt:'Combina o VS com a fase certa sem desperdiçar recursos.'},
    current:{fr:'Phase actuelle',en:'Current phase',de:'Aktuelle Phase',ro:'Faza actuală',uk:'Поточна фаза',ko:'현재 단계',hr:'Trenutačna faza',pt:'Fase atual'},
    next:{fr:'Phase suivante',en:'Next phase',de:'Nächste Phase',ro:'Faza următoare',uk:'Наступна фаза',ko:'다음 단계',hr:'Sljedeća faza',pt:'Próxima fase'},
    badges:{fr:'Badges aujourd’hui',en:'Badges today',de:'Abzeichen heute',ro:'Insigne astăzi',uk:'Значки сьогодні',ko:'오늘 배지',hr:'Značke danas',pt:'Insígnias hoje'},
    goal:{fr:'Objectif Course',en:'Arms Race target',de:'Ziel Wettrüsten',ro:'Ținta cursei',uk:'Ціль гонки',ko:'군비 경쟁 목표',hr:'Cilj utrke',pt:'Objetivo da Corrida'},
    g18:{fr:'18 · coffre Or',en:'18 · Gold chest',de:'18 · Goldtruhe',ro:'18 · Cufăr de aur',uk:'18 · Золота скриня',ko:'18 · 골드 상자',hr:'18 · Zlatna škrinja',pt:'18 · Baú de Ouro'},
    g36:{fr:'36 · maximum',en:'36 · maximum',de:'36 · Maximum',ro:'36 · maxim',uk:'36 · максимум',ko:'36 · 최대',hr:'36 · maksimum',pt:'36 · máximo'},
    choose:{fr:'— À choisir —',en:'— Choose —',de:'— Auswählen —',ro:'— Alege —',uk:'— Обрати —',ko:'— 선택 —',hr:'— Odaberi —',pt:'— Escolher —'},
    city:{fr:'Construction',en:'City Building',de:'Stadtbau',ro:'Construcția orașului',uk:'Будівництво міста',ko:'도시 건설',hr:'Izgradnja grada',pt:'Construção da cidade'},
    unit:{fr:'Progression des unités',en:'Unit Progression',de:'Einheitenfortschritt',ro:'Progresul unităților',uk:'Розвиток підрозділів',ko:'유닛 성장',hr:'Napredak jedinica',pt:'Progressão das unidades'},
    tech:{fr:'Recherche scientifique',en:'Tech Research',de:'Technologieforschung',ro:'Cercetare tehnologică',uk:'Технологічні дослідження',ko:'기술 연구',hr:'Tehnološko istraživanje',pt:'Pesquisa tecnológica'},
    drone:{fr:'Boost drone',en:'Drone Boost',de:'Drohnen-Boost',ro:'Boost dronă',uk:'Посилення дрона',ko:'드론 강화',hr:'Pojačanje drona',pt:'Impulso do drone'},
    hero:{fr:'Progression des héros',en:'Hero Advancement',de:'Heldenfortschritt',ro:'Progresul eroilor',uk:'Розвиток героїв',ko:'영웅 성장',hr:'Napredak heroja',pt:'Progressão dos heróis'},
    hint:{fr:'Choisis les phases affichées dans le jeu. Tu peux les modifier si une permutation de phase est utilisée.',en:'Choose the phases shown in game. You can change them if a phase swap is used.',de:'Wähle die im Spiel angezeigten Phasen. Bei einem Phasenwechsel kannst du sie anpassen.',ro:'Alege fazele afișate în joc. Le poți schimba dacă se folosește o permutare de fază.',uk:'Обери фази, показані в грі. Їх можна змінити, якщо використано перестановку фаз.',ko:'게임에 표시된 단계를 선택하세요. 단계 교체가 사용되면 변경할 수 있습니다.',hr:'Odaberi faze prikazane u igri. Možeš ih promijeniti ako se koristi zamjena faza.',pt:'Escolhe as fases mostradas no jogo. Podes alterá-las se for usada uma troca de fase.'},
    rule:{fr:'Chaque phase peut donner 6 badges (1 + 2 + 3).',en:'Each phase can give 6 badges (1 + 2 + 3).',de:'Jede Phase kann 6 Abzeichen geben (1 + 2 + 3).',ro:'Fiecare fază poate oferi 6 insigne (1 + 2 + 3).',uk:'Кожна фаза може дати 6 значків (1 + 2 + 3).',ko:'각 단계에서 배지 6개를 얻을 수 있습니다 (1 + 2 + 3).',hr:'Svaka faza može dati 6 znački (1 + 2 + 3).',pt:'Cada fase pode dar 6 insígnias (1 + 2 + 3).'},
    gold:{fr:'🏆 18 badges atteints : coffre Or quotidien sécurisé.',en:'🏆 18 badges reached: daily Gold chest secured.',de:'🏆 18 Abzeichen erreicht: tägliche Goldtruhe gesichert.',ro:'🏆 18 insigne atinse: cufărul zilnic de aur este asigurat.',uk:'🏆 18 значків: щоденну золоту скриню гарантовано.',ko:'🏆 배지 18개 달성: 일일 골드 상자를 확보했습니다.',hr:'🏆 18 znački dosegnuto: dnevna zlatna škrinja je osigurana.',pt:'🏆 18 insígnias atingidas: Baú de Ouro diário garantido.'},
    max:{fr:'🏆 36 badges atteints : maximum quotidien.',en:'🏆 36 badges reached: daily maximum.',de:'🏆 36 Abzeichen erreicht: Tagesmaximum.',ro:'🏆 36 insigne atinse: maximul zilnic.',uk:'🏆 36 значків: щоденний максимум.',ko:'🏆 배지 36개 달성: 일일 최대치입니다.',hr:'🏆 36 znački dosegnuto: dnevni maksimum.',pt:'🏆 36 insígnias atingidas: máximo diário.'},
    noOverlap:{fr:'Aucune combinaison directe détectée avec le VS aujourd’hui : fais seulement les coffres utiles et protège tes ressources VS.',en:'No direct overlap detected with today’s VS: take only useful chests and protect VS resources.',de:'Keine direkte Überschneidung mit dem heutigen VS: Nimm nur nützliche Truhen und schütze deine VS-Ressourcen.',ro:'Nu s-a detectat o combinație directă cu VS-ul de azi: ia doar cuferele utile și protejează resursele VS.',uk:'Прямого збігу з сьогоднішнім VS не виявлено: бери лише корисні скрині та бережи ресурси VS.',ko:'오늘 VS와 직접 겹치는 항목이 없습니다. 필요한 상자만 받고 VS 자원을 아끼세요.',hr:'Nema izravnog preklapanja s današnjim VS-om: uzmi samo korisne škrinje i čuvaj VS resurse.',pt:'Não foi detetada combinação direta com a VS de hoje: recolhe apenas os baús úteis e protege os recursos VS.'},
    optimized:{fr:'⚔️ Le plan intelligent privilégie la phase actuelle tant que ton objectif de badges n’est pas atteint.',en:'⚔️ The smart plan prioritises the current phase while your badge target is missing.',de:'⚔️ Der intelligente Plan priorisiert die aktuelle Phase, bis dein Abzeichenziel erreicht ist.',ro:'⚔️ Planul inteligent prioritizează faza actuală până când atingi ținta de insigne.',uk:'⚔️ Розумний план віддає пріоритет поточній фазі, доки не досягнуто цілі значків.',ko:'⚔️ 스마트 계획은 배지 목표를 달성할 때까지 현재 단계를 우선합니다.',hr:'⚔️ Pametni plan daje prednost trenutačnoj fazi dok ne dosegneš cilj znački.',pt:'⚔️ O plano inteligente dá prioridade à fase atual até atingires o objetivo de insígnias.'},
    pureVs:{fr:'🛡️ Objectif badges atteint : le calcul revient en priorité à l’économie VS.',en:'🛡️ Badge target reached: the plan returns to VS-saving priority.',de:'🛡️ Abzeichenziel erreicht: Der Plan priorisiert wieder das Sparen für VS.',ro:'🛡️ Ținta de insigne a fost atinsă: planul revine la economisirea resurselor VS.',uk:'🛡️ Ціль значків досягнуто: план знову віддає пріоритет економії ресурсів VS.',ko:'🛡️ 배지 목표 달성: 계획이 다시 VS 자원 절약을 우선합니다.',hr:'🛡️ Cilj znački je ostvaren: plan ponovno daje prednost štednji VS resursa.',pt:'🛡️ Objetivo de insígnias atingido: o plano volta a dar prioridade à poupança de recursos VS.'},
    need:{fr:'🎯 Il te manque {n} badge(s) pour ton objectif de {goal}.',en:'🎯 You need {n} more badge(s) for your {goal} target.',de:'🎯 Dir fehlen noch {n} Abzeichen für dein Ziel von {goal}.',ro:'🎯 Îți mai lipsesc {n} insigne pentru obiectivul de {goal}.',uk:'🎯 Тобі бракує ще {n} значків до цілі {goal}.',ko:'🎯 목표 {goal}개까지 배지 {n}개가 더 필요합니다.',hr:'🎯 Nedostaje ti još {n} znački do cilja od {goal}.',pt:'🎯 Faltam-te {n} insígnias para o objetivo de {goal}.'},
    now:{fr:'✅ À faire maintenant : {items}. Ces actions comptent aussi pour le VS.',en:'✅ Do now: {items}. These actions also count for VS.',de:'✅ Jetzt erledigen: {items}. Diese Aktionen zählen auch für VS.',ro:'✅ Fă acum: {items}. Aceste acțiuni contează și pentru VS.',uk:'✅ Зроби зараз: {items}. Ці дії також зараховуються у VS.',ko:'✅ 지금 실행: {items}. 이 행동은 VS에도 반영됩니다.',hr:'✅ Napravi sada: {items}. Ove radnje računaju se i za VS.',pt:'✅ Faz agora: {items}. Estas ações também contam para a VS.'},
    nextBest:{fr:'⏳ La phase suivante se combine mieux avec le VS : {items}. Garde-les si possible jusque-là.',en:'⏳ The next phase combines better with VS: {items}. Save them if possible.',de:'⏳ Die nächste Phase passt besser zum VS: {items}. Hebe sie wenn möglich bis dahin auf.',ro:'⏳ Următoarea fază se combină mai bine cu VS: {items}. Păstrează-le dacă poți până atunci.',uk:'⏳ Наступна фаза краще поєднується з VS: {items}. Якщо можливо, збережи їх до того часу.',ko:'⏳ 다음 단계가 VS와 더 잘 맞습니다: {items}. 가능하면 그때까지 보관하세요.',hr:'⏳ Sljedeća faza bolje se kombinira s VS-om: {items}. Ako možeš, sačuvaj ih do tada.',pt:'⏳ A próxima fase combina melhor com a VS: {items}. Se possível, guarda-os até lá.'}
  };

  const WEDNESDAY={fr:'Mercredi · Âge de la science',en:'Wednesday · Age of Science',de:'Mittwoch · Zeitalter der Wissenschaft',ro:'Miercuri · Epoca științei',uk:'Середа · Епоха науки',ko:'수요일 · 과학의 시대',hr:'Srijeda · Doba znanosti',pt:'Quarta-feira · Era da Ciência'};

  function normLang(v){v=String(v||'fr').toLowerCase().split('-')[0];if(v==='ua')v='uk';return LANGS.includes(v)?v:'en';}
  function lang(){try{return normLang(window.state?.language||document.querySelector('#languageSelect')?.value||document.querySelector('#v315Language')?.value||'fr');}catch{return'fr';}}
  function escTpl(s,v){let out=String(s);for(const[k,val]of Object.entries(v||{}))out=out.replaceAll(`{${k}}`,String(val));return out;}
  function values(pack,key){return Object.values(pack[key]||{}).filter(Boolean);}
  function findKey(pack,text){for(const[key,dict]of Object.entries(pack))if(values(pack,key).includes(text))return key;return'';}
  function leadingPrefix(text){const m=String(text).match(/^([\s⚔️🎯✅🏆⏳🛡️⚙️📷✍️📋🚀←↩︎↩️]+)(.*)$/u);return m?[m[1],m[2]]:['',String(text)];}
  function translateNode(node,pack,L){
    const raw=node.nodeValue;if(!raw||!raw.trim())return;
    const lead=(raw.match(/^\s*/)||[''])[0],tail=(raw.match(/\s*$/)||[''])[0],core=raw.trim();
    const [prefix,body]=leadingPrefix(core);
    const key=findKey(pack,body)||findKey(pack,core);
    if(!key)return;
    const target=pack[key]?.[L]||pack[key]?.en||body;
    const next=lead+(key&&body!==core?prefix+target:target)+tail;
    if(next!==raw)node.nodeValue=next;
  }
  function walk(root,pack,L){if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))translateNode(n,pack,L);}
  function setTextNode(el,text){if(!el)return;let n=[...el.childNodes].find(x=>x.nodeType===Node.TEXT_NODE&&x.nodeValue.trim());if(!n){n=document.createTextNode('');el.insertBefore(n,el.firstChild);}if(n.nodeValue.trim()!==text)n.nodeValue=text+' ';}
  function syncSelectors(L){document.querySelectorAll('#languageSelect,#v315Language').forEach(s=>{if([...s.options].some(o=>o.value===L)&&s.value!==L)s.value=L;});document.documentElement.lang=L;}

  function translate315(L){
    const root=document.getElementById('gomoV315Guide');walk(root,P315,L);
    if(!root)return;
    root.querySelectorAll('.v315-progress small').forEach(n=>{
      const m=n.textContent.trim().match(/^(?:Étape|Step|Schritt|Etapa|Pasul|Крок|단계|Korak|Passo)\s*(\d+)$/iu);
      if(m){const p={fr:'Étape',en:'Step',de:'Schritt',ro:'Pasul',uk:'Крок',ko:'단계',hr:'Korak',pt:'Etapa'}[L];n.textContent=L==='ko'?`${m[1]}${p}`:`${p} ${m[1]}`;}
    });
    const day=root.querySelector('.v315-day strong');if(day){const k=Object.entries(WEDNESDAY).find(([,v])=>v===day.textContent.trim());if(k)day.textContent=WEDNESDAY[L]||WEDNESDAY.en;}
  }

  function translate316(L){
    document.querySelectorAll('.v316-mode-panel,.v316-smart-plan,.v316-done').forEach(r=>walk(r,P316,L));
    const panel=document.querySelector('.v316-mode-panel');
    if(panel){
      const h=panel.querySelector('h4');if(h)setTextNode(h,`⚙️ ${P316.mode[L]||P316.mode.en}`);
      panel.querySelectorAll('[data-v316-mode]').forEach(b=>{const id=b.dataset.v316Mode;const key=id==='economy'?'economy':id==='push'?'push':'normal';const desc=id==='economy'?'eDesc':id==='push'?'pDesc':'nDesc';const icon=id==='economy'?'🛡️':id==='push'?'🚀':'⚖️';setTextNode(b,`${icon} ${P316[key][L]||P316[key].en}`);const small=b.querySelector('small');if(small)small.textContent=P316[desc][L]||P316[desc].en;});
      const target=panel.querySelector('.v316-target span');if(target){const active=panel.querySelector('[data-v316-mode].active')?.dataset.v316Mode||'normal';const mk=active==='economy'?'economy':active==='push'?'push':'normal';target.textContent=`${P316.target[L]||P316.target.en} · ${P316[mk][L]||P316[mk].en}`;}
    }
  }

  function translate317Advice(L){
    document.querySelectorAll('#gomoV317Arms .v317-advice>div').forEach(d=>{
      let key=d.dataset.gomoI18nKey||'',vars={};
      if(key){try{vars=JSON.parse(d.dataset.gomoI18nVars||'{}');}catch{}d.textContent=escTpl(P317[key]?.[L]||P317[key]?.en||d.textContent,vars);return;}
      const t=d.textContent.trim();let m;
      if((m=t.match(/^🎯 Il te manque (\d+) badge\(s\) pour ton objectif de (\d+)\.$/))||(m=t.match(/^🎯 You need (\d+) more badge\(s\) for your (\d+) target\.$/))){key='need';vars={n:m[1],goal:m[2]};}
      else if((m=t.match(/^✅ À faire maintenant : (.+)\. Ces actions comptent aussi pour le VS\.$/))||(m=t.match(/^✅ Do now: (.+)\. These actions also count for VS\.$/))){key='now';vars={items:m[1]};}
      else if((m=t.match(/^⏳ La phase suivante se combine mieux avec le VS : (.+)\. Garde-les si possible jusque-là\.$/))||(m=t.match(/^⏳ The next phase combines better with VS: (.+)\. Save them if possible\.$/))){key='nextBest';vars={items:m[1]};}
      if(key){d.dataset.gomoI18nKey=key;d.dataset.gomoI18nVars=JSON.stringify(vars);d.textContent=escTpl(P317[key][L]||P317[key].en,vars);}
    });
  }
  function translate317(L){const root=document.getElementById('gomoV317Arms');walk(root,P317,L);translate317Advice(L);}

  function apply(){if(busy)return;busy=true;try{const L=lang();syncSelectors(L);translate315(L);translate316(L);translate317(L);document.documentElement.setAttribute('data-gomo-i18n-fix',VERSION);}finally{busy=false;}}
  function schedule(){clearTimeout(timer);timer=setTimeout(apply,0);}
  function start(){
    apply();
    document.addEventListener('change',e=>{if(e.target?.id==='languageSelect'||e.target?.id==='v315Language')setTimeout(()=>{const L=normLang(e.target.value||window.state?.language);syncSelectors(L);apply();},0);},true);
    document.addEventListener('click',e=>{if(e.target?.closest?.('#v315Start,#v315DayOk,#v315ChangeDay,[data-go],[data-v316-mode],#v315MakePlan,#v315Done,#v315Restart'))schedule();},true);
    observer=new MutationObserver(schedule);observer.observe(document.body,{childList:true,subtree:true});
    console.info('GoMo VS Planner translation safety patch',VERSION);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
