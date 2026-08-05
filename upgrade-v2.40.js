'use strict';

/*
 GoMo VS Planner v2.40 — Release Candidate consolidé
 Requires app.js + upgrade-v2.30.js + upgrade-v2.31.js + upgrade-v2.32.js.

 Final pre-launch corrections:
 - exact current VS task catalogue corrections (Monday shards removed, chip points fixed, Friday pack diamonds added)
 - day-scoped daily actions to prevent one VS day from consuming another day's opportunities
 - Monday-based weekly rollover for scores/references/action estimates
 - minimum 7.2M separated from recommended safety-margin target
 - clear Plan ready vs Target already reached wording
 - first-use point-profile calibration
 - safer OCR: 70% automatic threshold, pack-diamond balance never auto-counted, tiny-image guard
 - manual-entry fallback for every resource of the selected day
 - Saturday troop-loss actions excluded by default
 - post-plan real-score verification before declaring the day complete
 - one autonomous status panel; v2.32 duplicate panel hidden
 - compact GoMo Central button on mobile
*/

(() => {
  const FINAL_VERSION = '2.40.0';
  const WEEK_KEY_FIELD = 'v240WeekKey';
  const MIGRATION_FLAG = 'gomo_vs_planner_v240_migrated';
  const OCR_AUTO_THRESHOLD = 70;
  const HIGH_MARGIN_WARNING = 250000;

  const F = {
    fr:{
      assistant:'Assistant autonome', ready:'✅ PLAN PRÊT', missing:'⚠️ INFORMATIONS MANQUANTES', done:'🏁 OBJECTIF DÉJÀ ATTEINT',
      verify:'🔎 VÉRIFIE TON SCORE', review:'🔎 CAPTURE À VÉRIFIER', calibrate:'⚙️ CALIBRATION NÉCESSAIRE', wrongDay:'⚠️ VÉRIFIE LE JOUR VS',
      readyTitle:'Ton plan est prêt', missingTitle:'Il manque encore des informations', doneTitle:'Terminé pour aujourd’hui',
      verifyTitle:'Confirme le score réel dans Last War', reviewTitle:'Une lecture utilisée par le plan est incertaine',
      calibrateTitle:'Une seule vérification avant de commencer', wrongDayTitle:'Les captures semblent appartenir à un autre jour',
      readyBody:'Utilise uniquement les quantités proposées. Ensuite confirme que tu les as réellement utilisées dans Last War.',
      missingBody:'Le stock reconnu ne suffit pas encore. Ajoute une capture ou utilise la saisie manuelle pour les ressources que tu possèdes.',
      doneBody:'Tu as atteint le minimum du jour. Garde le reste de tes ressources, sauf consigne contraire de l’alliance.',
      verifyBody:'Le site a retiré les ressources utilisées, mais il ne considère pas l’estimation comme certaine. Vérifie maintenant ton total VS réel.',
      reviewBody:'Une valeur OCR qui influence le plan n’est pas assez fiable. Reprends une capture plus nette ou saisis cette ressource manuellement.',
      calibrateBody:'Indique la valeur affichée dans ton Duel d’alliances pour 1 minute d’accélérateur de recherche ou de construction. Le site adaptera tous les calculs.',
      wrongDayBody:'Des ressources ont été reconnues, mais aucune ne rapporte de points pour le jour VS sélectionné. Vérifie le jour avant de continuer.',
      checkDay:'Jour', checkStock:'Stock utile', checkCal:'Calibration', checkPlan:'Plan',
      minGoal:'Minimum', recommended:'Cible conseillée', planned:'Total prévu', current:'Score réel',
      coverage:'Ressources gérées pour ce jour', missingShots:'Si tu en possèdes, montre ou saisis aussi : {list}.',
      lowOcr:'⚠️ {count} valeur(s) n’ont pas été appliquées automatiquement car la lecture est incertaine.',
      highMargin:'La marge du plan est élevée ({points} points). Tu peux réduire une quantité avec − pour économiser.',
      calibrationTitle:'Calibrer mes points VS', calibrationHelp:'Regarde combien rapporte exactement 1 minute d’accélérateur recherche/construction dans le VS.',
      cal50:'50 pts/min · valeurs de base', cal125:'125 pts/min · arbre VS principal', cal150:'150 pts/min · recherche VS avancée',
      calOther:'Autre valeur', calSave:'Enregistrer cette valeur', calibrated:'Calibration enregistrée : {value} pts/min.', changeCal:'Modifier la calibration',
      manualTitle:'Saisie manuelle de secours', manualHelp:'Si une capture ne fonctionne pas, saisis directement les quantités que tu possèdes. Le plan se recalcule automatiquement.',
      manualOpen:'Saisir mes ressources manuellement', manualQty:'Quantité possédée', manualSaved:'Quantité enregistrée.',
      offline:'Le calcul du plan fonctionne hors ligne. La lecture automatique des captures peut nécessiter Internet.',
      tinyImage:'Cette image est trop petite pour une lecture fiable. Utilise une capture plus nette ou la saisie manuelle.',
      packNote:'Compte uniquement les diamants obtenus dans un pack acheté pour cette journée VS. Ton solde de diamants actuel ne compte pas.',
      lostNote:'Ne perds jamais volontairement des troupes pour faire des points. Utilise cette ligne seulement pour compter des pertes déjà subies.',
      chipNote:'Saisis les points de puce de compétence drone réellement gagnés. Ne convertis pas un nombre de coffres sans connaître leur contenu.',
      verifyQuestion:'Après avoir utilisé le plan, vérifie ton score VS réel.', verifyYes:'Oui, mon jeu affiche au moins 7,2 M', verifyEnter:'Ou entre le score exact affiché', verifySave:'Enregistrer le score réel',
      appliedVerify:'Ressources enregistrées. Vérifie maintenant ton score réel dans Last War.',
      actualSaved:'Score réel enregistré.', planBlocked:'Le plan ne peut pas être validé tant que cette étape n’est pas sûre.',
      needCalibration:'Calibre d’abord tes points VS.', needPhoto:'Ajoute une capture nette ou saisis tes ressources manuellement.',
      needMore:'Ajoute les ressources indiquées par le site.', needDay:'Vérifie le jour VS sélectionné.', needReview:'Refais la capture incertaine ou saisis la valeur manuellement.',
      needPlan:'Suis le plan dans Last War puis reviens confirmer.', needVerify:'Vérifie le score réel affiché dans Last War.', allDone:'Tu as terminé pour aujourd’hui. Garde tes ressources.',
      lostButton:'🧭 Je suis perdu', nextTitle:'Voici exactement quoi faire', gotIt:'Compris',
      weekReset:'Nouvelle semaine VS détectée : les scores et actions quotidiennes ont été remis à zéro. Ton vrai inventaire est conservé.',
      version:'Version {version}', planReadyBadge:'Plan prêt', alreadyReachedBadge:'Objectif déjà atteint',
      confirmUseTitle:'As-tu utilisé ces ressources dans Last War ?', confirmUseBody:'Confirme seulement après avoir réellement utilisé toute la liste. Le site retirera ces quantités de ton stock puis te demandera de vérifier le score réel.'
    },
    en:{
      assistant:'Autonomous assistant', ready:'✅ PLAN READY', missing:'⚠️ INFORMATION MISSING', done:'🏁 TARGET ALREADY REACHED',
      verify:'🔎 VERIFY YOUR SCORE', review:'🔎 SCREENSHOT TO CHECK', calibrate:'⚙️ CALIBRATION REQUIRED', wrongDay:'⚠️ CHECK THE VS DAY',
      readyTitle:'Your plan is ready', missingTitle:'More information is needed', doneTitle:'Finished for today',
      verifyTitle:'Confirm the real score in Last War', reviewTitle:'A reading used by the plan is uncertain',
      calibrateTitle:'One quick check before starting', wrongDayTitle:'The screenshots may belong to another day',
      readyBody:'Use only the proposed quantities. Then confirm after you actually used them in Last War.',
      missingBody:'The recognised stock is not enough yet. Add a screenshot or use manual entry for resources you own.',
      doneBody:'You reached today’s minimum. Save the rest of your resources unless the alliance says otherwise.',
      verifyBody:'The site recorded the used resources, but it does not treat the estimate as certain. Check your real VS total now.',
      reviewBody:'An OCR value affecting the plan is not reliable enough. Retake a clearer screenshot or enter that resource manually.',
      calibrateBody:'Enter the value shown in Alliance Duel for 1 minute of research or construction speed-up. The site will adapt its calculations.',
      wrongDayBody:'Resources were recognised, but none score on the selected VS day. Check the day before continuing.',
      checkDay:'Day', checkStock:'Useful stock', checkCal:'Calibration', checkPlan:'Plan',
      minGoal:'Minimum', recommended:'Recommended target', planned:'Planned total', current:'Real score',
      coverage:'Resources handled for this day', missingShots:'If you own them, also show or enter: {list}.',
      lowOcr:'⚠️ {count} value(s) were not applied automatically because the reading was uncertain.',
      highMargin:'The plan margin is high ({points} points). You can lower a quantity with − to save resources.',
      calibrationTitle:'Calibrate my VS points', calibrationHelp:'Check exactly how many points 1 minute of research/construction speed-up gives in VS.',
      cal50:'50 pts/min · base values', cal125:'125 pts/min · main VS tree', cal150:'150 pts/min · advanced VS research',
      calOther:'Other value', calSave:'Save this value', calibrated:'Calibration saved: {value} pts/min.', changeCal:'Change calibration',
      manualTitle:'Manual entry fallback', manualHelp:'If a screenshot fails, enter the quantities you own. The plan recalculates automatically.',
      manualOpen:'Enter resources manually', manualQty:'Owned quantity', manualSaved:'Quantity saved.',
      offline:'Plan calculation works offline. Automatic screenshot reading may require Internet.',
      tinyImage:'This image is too small for reliable reading. Use a clearer screenshot or manual entry.',
      packNote:'Count only diamonds obtained from a purchased pack for this VS day. Your current diamond balance does not count.',
      lostNote:'Never lose troops on purpose for points. Use this line only to count losses that already happened.',
      chipNote:'Enter drone skill-chip points actually gained. Do not convert a chest count unless you know its exact contents.',
      verifyQuestion:'After using the plan, check your real VS score.', verifyYes:'Yes, my game shows at least 7.2M', verifyEnter:'Or enter the exact score shown', verifySave:'Save real score',
      appliedVerify:'Resources recorded. Now verify your real score in Last War.', actualSaved:'Real score saved.', planBlocked:'The plan cannot be confirmed until this step is safe.',
      needCalibration:'Calibrate your VS points first.', needPhoto:'Add a clear screenshot or enter resources manually.', needMore:'Add the resources suggested by the site.', needDay:'Check the selected VS day.', needReview:'Retake the uncertain screenshot or enter the value manually.',
      needPlan:'Follow the plan in Last War, then come back to confirm.', needVerify:'Check the real score shown in Last War.', allDone:'You are finished for today. Save your resources.',
      lostButton:'🧭 I am lost', nextTitle:'Here is exactly what to do', gotIt:'Got it',
      weekReset:'New VS week detected: daily scores and actions were reset. Your real inventory was kept.',
      version:'Version {version}', planReadyBadge:'Plan ready', alreadyReachedBadge:'Target already reached',
      confirmUseTitle:'Did you use these resources in Last War?', confirmUseBody:'Confirm only after actually using the whole list. The site will subtract those quantities and then ask you to verify the real score.'
    },
    de:{
      assistant:'Autonomer Assistent', ready:'✅ PLAN BEREIT', missing:'⚠️ ANGABEN FEHLEN', done:'🏁 ZIEL BEREITS ERREICHT',
      verify:'🔎 PUNKTZAHL PRÜFEN', review:'🔎 SCREENSHOT PRÜFEN', calibrate:'⚙️ KALIBRIERUNG NÖTIG', wrongDay:'⚠️ VS-TAG PRÜFEN',
      readyTitle:'Dein Plan ist bereit', missingTitle:'Es fehlen noch Angaben', doneTitle:'Für heute fertig',
      verifyTitle:'Prüfe die echte Punktzahl in Last War', reviewTitle:'Ein verwendeter Wert ist unsicher', calibrateTitle:'Eine kurze Prüfung vor dem Start', wrongDayTitle:'Die Screenshots könnten zu einem anderen Tag gehören',
      readyBody:'Nutze nur die vorgeschlagenen Mengen und bestätige erst nach der tatsächlichen Verwendung in Last War.',
      missingBody:'Der erkannte Bestand reicht noch nicht. Füge einen Screenshot hinzu oder trage vorhandene Ressourcen manuell ein.',
      doneBody:'Du hast das Tagesminimum erreicht. Spare den Rest, sofern die Allianz nichts anderes vorgibt.',
      verifyBody:'Die Ressourcen wurden erfasst, aber die Schätzung gilt nicht als sicher. Prüfe jetzt deine echte VS-Punktzahl.',
      reviewBody:'Ein OCR-Wert im Plan ist zu unsicher. Nimm einen klareren Screenshot auf oder trage ihn manuell ein.',
      calibrateBody:'Gib den Wert an, den 1 Minute Forschungs- oder Baubeschleunigung im Allianzduell bringt.',
      wrongDayBody:'Ressourcen wurden erkannt, aber keine bringt am ausgewählten Tag Punkte. Prüfe zuerst den VS-Tag.',
      checkDay:'Tag', checkStock:'Nutzbarer Bestand', checkCal:'Kalibrierung', checkPlan:'Plan',
      minGoal:'Minimum', recommended:'Empfohlenes Ziel', planned:'Geplante Summe', current:'Echte Punktzahl',
      coverage:'Verarbeitete Ressourcen für diesen Tag', missingShots:'Falls vorhanden, zeige oder trage auch ein: {list}.',
      lowOcr:'⚠️ {count} Wert(e) wurden wegen unsicherer Erkennung nicht automatisch übernommen.',
      highMargin:'Die Planmarge ist hoch ({points} Punkte). Mit − kannst du eine Menge reduzieren.',
      calibrationTitle:'VS-Punkte kalibrieren', calibrationHelp:'Prüfe, wie viele Punkte 1 Minute Forschungs-/Baubeschleunigung im VS bringt.',
      cal50:'50 Pkt./Min · Grundwerte', cal125:'125 Pkt./Min · Haupt-VS-Baum', cal150:'150 Pkt./Min · erweiterte VS-Forschung',
      calOther:'Anderer Wert', calSave:'Wert speichern', calibrated:'Kalibrierung gespeichert: {value} Pkt./Min.', changeCal:'Kalibrierung ändern',
      manualTitle:'Manuelle Eingabe', manualHelp:'Falls ein Screenshot nicht funktioniert, trage deine Mengen direkt ein. Der Plan wird automatisch neu berechnet.',
      manualOpen:'Ressourcen manuell eingeben', manualQty:'Vorhandene Menge', manualSaved:'Menge gespeichert.',
      offline:'Die Planberechnung funktioniert offline. Die automatische Bilderkennung kann Internet benötigen.',
      tinyImage:'Dieses Bild ist zu klein für eine zuverlässige Erkennung. Nutze einen klareren Screenshot oder die manuelle Eingabe.',
      packNote:'Nur Diamanten aus einem gekauften Paket für diesen VS-Tag zählen. Dein aktueller Diamantbestand zählt nicht.',
      lostNote:'Verliere niemals absichtlich Truppen für Punkte. Nutze diese Zeile nur für bereits entstandene Verluste.',
      chipNote:'Trage tatsächlich erhaltene Drohnen-Skillchip-Punkte ein. Kisten nicht ohne genaue Inhaltswerte umrechnen.',
      verifyQuestion:'Prüfe nach der Nutzung des Plans deine echte VS-Punktzahl.', verifyYes:'Ja, mein Spiel zeigt mindestens 7,2 Mio.', verifyEnter:'Oder exakte Punktzahl eingeben', verifySave:'Echte Punktzahl speichern',
      appliedVerify:'Ressourcen gespeichert. Prüfe jetzt deine echte Punktzahl.', actualSaved:'Echte Punktzahl gespeichert.', planBlocked:'Bestätigung ist noch nicht sicher möglich.',
      needCalibration:'Kalibriere zuerst deine VS-Punkte.', needPhoto:'Füge einen klaren Screenshot hinzu oder trage Ressourcen manuell ein.', needMore:'Füge die genannten Ressourcen hinzu.', needDay:'Prüfe den ausgewählten VS-Tag.', needReview:'Nimm den unsicheren Wert neu auf oder trage ihn manuell ein.',
      needPlan:'Nutze den Plan in Last War und bestätige danach.', needVerify:'Prüfe die echte Punktzahl in Last War.', allDone:'Für heute bist du fertig. Spare deine Ressourcen.',
      lostButton:'🧭 Ich weiß nicht weiter', nextTitle:'Das musst du jetzt tun', gotIt:'Verstanden',
      weekReset:'Neue VS-Woche erkannt: Tagespunkte und Aktionen wurden zurückgesetzt. Dein echtes Inventar bleibt erhalten.',
      version:'Version {version}', planReadyBadge:'Plan bereit', alreadyReachedBadge:'Ziel bereits erreicht',
      confirmUseTitle:'Hast du diese Ressourcen in Last War verwendet?', confirmUseBody:'Bestätige erst nach der tatsächlichen Verwendung. Danach wirst du aufgefordert, die echte Punktzahl zu prüfen.'
    },
    ro:{
      assistant:'Asistent autonom', ready:'✅ PLAN GATA', missing:'⚠️ LIPSESC INFORMAȚII', done:'🏁 OBIECTIV DEJA ATINS',
      verify:'🔎 VERIFICĂ SCORUL', review:'🔎 VERIFICĂ CAPTURA', calibrate:'⚙️ CALIBRARE NECESARĂ', wrongDay:'⚠️ VERIFICĂ ZIUA VS',
      readyTitle:'Planul este gata', missingTitle:'Mai lipsesc informații', doneTitle:'Ai terminat pentru azi',
      verifyTitle:'Confirmă scorul real din Last War', reviewTitle:'O valoare folosită de plan este nesigură', calibrateTitle:'O singură verificare înainte de start', wrongDayTitle:'Capturile pot fi din altă zi',
      readyBody:'Folosește doar cantitățile propuse și confirmă numai după ce le-ai folosit în Last War.',
      missingBody:'Stocul recunoscut nu este suficient. Adaugă o captură sau introdu manual resursele pe care le ai.',
      doneBody:'Ai atins minimul zilei. Păstrează restul resurselor dacă alianța nu spune altfel.',
      verifyBody:'Resursele au fost înregistrate, dar estimarea nu este considerată sigură. Verifică scorul VS real.',
      reviewBody:'O valoare OCR care influențează planul nu este suficient de sigură. Refă captura sau introdu manual resursa.',
      calibrateBody:'Introdu valoarea pentru 1 minut de accelerare cercetare/construcție afișată în Duelul Alianțelor.',
      wrongDayBody:'Au fost recunoscute resurse, dar niciuna nu punctează în ziua selectată. Verifică ziua VS.',
      checkDay:'Zi', checkStock:'Stoc util', checkCal:'Calibrare', checkPlan:'Plan',
      minGoal:'Minim', recommended:'Țintă recomandată', planned:'Total planificat', current:'Scor real',
      coverage:'Resurse gestionate pentru această zi', missingShots:'Dacă le ai, arată sau introdu și: {list}.',
      lowOcr:'⚠️ {count} valoare(i) nu au fost aplicate automat deoarece citirea este nesigură.',
      highMargin:'Marja planului este mare ({points} puncte). Poți reduce o cantitate cu −.',
      calibrationTitle:'Calibrează punctele VS', calibrationHelp:'Verifică câte puncte oferă 1 minut de accelerare cercetare/construcție.',
      cal50:'50 pct/min · valori de bază', cal125:'125 pct/min · arbore VS principal', cal150:'150 pct/min · cercetare VS avansată',
      calOther:'Altă valoare', calSave:'Salvează valoarea', calibrated:'Calibrare salvată: {value} pct/min.', changeCal:'Modifică calibrarea',
      manualTitle:'Introducere manuală', manualHelp:'Dacă o captură nu funcționează, introdu direct cantitățile. Planul se recalculează automat.',
      manualOpen:'Introdu resurse manual', manualQty:'Cantitate deținută', manualSaved:'Cantitate salvată.',
      offline:'Calculul planului funcționează offline. Citirea automată a capturilor poate necesita Internet.',
      tinyImage:'Imaginea este prea mică pentru o citire sigură. Folosește o captură mai clară sau introducerea manuală.',
      packNote:'Contează doar diamantele obținute dintr-un pachet cumpărat pentru această zi VS. Soldul actual de diamante nu contează.',
      lostNote:'Nu pierde intenționat trupe pentru puncte. Folosește această linie doar pentru pierderi deja suferite.',
      chipNote:'Introdu punctele de cip dronă câștigate efectiv. Nu transforma numărul de cufere fără conținutul exact.',
      verifyQuestion:'După folosirea planului, verifică scorul VS real.', verifyYes:'Da, jocul arată cel puțin 7,2 M', verifyEnter:'Sau introdu scorul exact', verifySave:'Salvează scorul real',
      appliedVerify:'Resurse înregistrate. Verifică acum scorul real.', actualSaved:'Scor real salvat.', planBlocked:'Planul nu poate fi confirmat până când pasul nu este sigur.',
      needCalibration:'Calibrează mai întâi punctele VS.', needPhoto:'Adaugă o captură clară sau introdu resurse manual.', needMore:'Adaugă resursele indicate de site.', needDay:'Verifică ziua VS selectată.', needReview:'Refă captura nesigură sau introdu valoarea manual.',
      needPlan:'Urmează planul în Last War și apoi confirmă.', needVerify:'Verifică scorul real din Last War.', allDone:'Ai terminat pentru azi. Păstrează resursele.',
      lostButton:'🧭 Nu știu ce să fac', nextTitle:'Iată exact ce trebuie să faci', gotIt:'Am înțeles',
      weekReset:'Săptămână VS nouă: scorurile și acțiunile zilnice au fost resetate. Inventarul real a fost păstrat.',
      version:'Versiunea {version}', planReadyBadge:'Plan gata', alreadyReachedBadge:'Obiectiv deja atins',
      confirmUseTitle:'Ai folosit aceste resurse în Last War?', confirmUseBody:'Confirmă numai după ce ai folosit toată lista. Apoi verifică scorul real.'
    },
    uk:{
      assistant:'Автономний помічник', ready:'✅ ПЛАН ГОТОВИЙ', missing:'⚠️ БРАКУЄ ДАНИХ', done:'🏁 ЦІЛЬ УЖЕ ДОСЯГНУТА',
      verify:'🔎 ПЕРЕВІРТЕ РАХУНОК', review:'🔎 ПЕРЕВІРТЕ ЗНІМОК', calibrate:'⚙️ ПОТРІБНЕ КАЛІБРУВАННЯ', wrongDay:'⚠️ ПЕРЕВІРТЕ ДЕНЬ VS',
      readyTitle:'План готовий', missingTitle:'Потрібно ще трохи даних', doneTitle:'На сьогодні завершено',
      verifyTitle:'Підтвердьте реальний рахунок у Last War', reviewTitle:'Використане значення прочитано невпевнено', calibrateTitle:'Одна перевірка перед початком', wrongDayTitle:'Знімки можуть бути з іншого дня',
      readyBody:'Використайте лише запропоновані кількості та підтвердьте після фактичного використання у Last War.',
      missingBody:'Розпізнаного запасу ще недостатньо. Додайте знімок або введіть ресурси вручну.',
      doneBody:'Мінімум дня досягнуто. Збережіть решту ресурсів, якщо альянс не наказав інакше.',
      verifyBody:'Ресурси записано, але оцінка не вважається точною. Перевірте реальний VS-рахунок.',
      reviewBody:'OCR-значення, що впливає на план, недостатньо надійне. Зробіть чіткіший знімок або введіть значення вручну.',
      calibrateBody:'Введіть, скільки дає 1 хвилина прискорення дослідження/будівництва в Дуелі альянсів.',
      wrongDayBody:'Ресурси розпізнано, але жоден не дає очок у вибраний день. Перевірте день VS.',
      checkDay:'День', checkStock:'Корисний запас', checkCal:'Калібрування', checkPlan:'План',
      minGoal:'Мінімум', recommended:'Рекомендована ціль', planned:'Заплановано', current:'Реальний рахунок',
      coverage:'Ресурси для цього дня', missingShots:'Якщо маєте, покажіть або введіть також: {list}.',
      lowOcr:'⚠️ {count} значення не застосовано автоматично через низьку надійність.',
      highMargin:'Запас плану великий ({points} очок). Можна зменшити кількість кнопкою −.',
      calibrationTitle:'Калібрувати VS-очки', calibrationHelp:'Перевірте, скільки дає 1 хвилина прискорення дослідження/будівництва.',
      cal50:'50 оч./хв · базові', cal125:'125 оч./хв · основне дерево VS', cal150:'150 оч./хв · розширене VS',
      calOther:'Інше значення', calSave:'Зберегти значення', calibrated:'Калібрування: {value} оч./хв.', changeCal:'Змінити калібрування',
      manualTitle:'Ручне введення', manualHelp:'Якщо знімок не працює, введіть кількості вручну. План перерахується автоматично.',
      manualOpen:'Ввести ресурси вручну', manualQty:'Кількість', manualSaved:'Кількість збережено.',
      offline:'Розрахунок працює офлайн. Автоматичне читання знімків може потребувати Інтернету.',
      tinyImage:'Зображення замале для надійного читання. Використайте чіткіший знімок або ручне введення.',
      packNote:'Враховуйте лише діаманти з купленого пакета для цього дня VS. Поточний баланс діамантів не рахується.',
      lostNote:'Не втрачайте війська навмисно заради очок. Рядок лише для вже понесених втрат.',
      chipNote:'Введіть реально отримані очки чипів дрона. Не перераховуйте скрині без точного вмісту.',
      verifyQuestion:'Після використання плану перевірте реальний VS-рахунок.', verifyYes:'Так, у грі щонайменше 7,2 млн', verifyEnter:'Або введіть точний рахунок', verifySave:'Зберегти реальний рахунок',
      appliedVerify:'Ресурси записано. Перевірте реальний рахунок.', actualSaved:'Реальний рахунок збережено.', planBlocked:'План не можна підтвердити, поки крок не стане надійним.',
      needCalibration:'Спочатку калібруйте VS-очки.', needPhoto:'Додайте чіткий знімок або введіть ресурси вручну.', needMore:'Додайте ресурси, вказані сайтом.', needDay:'Перевірте день VS.', needReview:'Зробіть чіткіший знімок або введіть значення вручну.',
      needPlan:'Виконайте план у Last War, потім підтвердьте.', needVerify:'Перевірте реальний рахунок у Last War.', allDone:'На сьогодні все. Збережіть ресурси.',
      lostButton:'🧭 Я заплутався', nextTitle:'Ось що потрібно зробити', gotIt:'Зрозуміло',
      weekReset:'Нова VS-тиждень: денні очки й дії скинуто. Реальний інвентар збережено.',
      version:'Версія {version}', planReadyBadge:'План готовий', alreadyReachedBadge:'Ціль уже досягнута',
      confirmUseTitle:'Ви використали ці ресурси в Last War?', confirmUseBody:'Підтверджуйте лише після фактичного використання всього списку. Потім перевірте реальний рахунок.'
    },
    ko:{
      assistant:'자동 안내 도우미', ready:'✅ 계획 준비 완료', missing:'⚠️ 정보 부족', done:'🏁 목표 이미 달성',
      verify:'🔎 실제 점수 확인', review:'🔎 스크린샷 확인 필요', calibrate:'⚙️ 보정 필요', wrongDay:'⚠️ VS 요일 확인',
      readyTitle:'계획이 준비되었습니다', missingTitle:'정보가 더 필요합니다', doneTitle:'오늘은 완료되었습니다',
      verifyTitle:'Last War의 실제 점수를 확인하세요', reviewTitle:'계획에 쓰이는 값이 불확실합니다', calibrateTitle:'시작 전 한 번만 확인하세요', wrongDayTitle:'다른 요일의 스크린샷일 수 있습니다',
      readyBody:'제안된 수량만 실제로 사용한 뒤 확인하세요.', missingBody:'인식된 보유량이 부족합니다. 스크린샷을 추가하거나 자원을 직접 입력하세요.',
      doneBody:'오늘 최소 목표를 달성했습니다. 동맹 지시가 없다면 나머지 자원을 보관하세요.',
      verifyBody:'자원 사용은 기록했지만 예상 점수를 확정값으로 보지 않습니다. 실제 VS 점수를 확인하세요.',
      reviewBody:'계획에 영향을 주는 OCR 값의 신뢰도가 낮습니다. 더 선명한 스크린샷이나 수동 입력을 사용하세요.',
      calibrateBody:'동맹 대결에서 연구/건설 가속 1분이 몇 점인지 입력하세요.', wrongDayBody:'자원은 인식했지만 선택한 VS 요일에 점수를 주는 자원이 없습니다.',
      checkDay:'요일', checkStock:'사용 가능', checkCal:'보정', checkPlan:'계획', minGoal:'최소 목표', recommended:'권장 목표', planned:'예상 합계', current:'실제 점수',
      coverage:'오늘 처리 가능한 자원', missingShots:'보유하고 있다면 다음도 보여주거나 입력하세요: {list}.',
      lowOcr:'⚠️ 신뢰도가 낮아 {count}개 값은 자동 적용하지 않았습니다.', highMargin:'계획 여유가 큽니다({points}점). −로 수량을 줄일 수 있습니다.',
      calibrationTitle:'VS 점수 보정', calibrationHelp:'연구/건설 가속 1분의 실제 VS 점수를 확인하세요.',
      cal50:'50점/분 · 기본', cal125:'125점/분 · 메인 VS 트리', cal150:'150점/분 · 고급 VS 연구', calOther:'다른 값', calSave:'값 저장',
      calibrated:'보정 저장: {value}점/분.', changeCal:'보정 변경', manualTitle:'수동 입력', manualHelp:'스크린샷이 실패하면 보유량을 직접 입력하세요. 계획이 자동 재계산됩니다.',
      manualOpen:'자원 직접 입력', manualQty:'보유 수량', manualSaved:'수량 저장됨.', offline:'계획 계산은 오프라인에서도 작동합니다. 자동 이미지 인식은 인터넷이 필요할 수 있습니다.',
      tinyImage:'이미지가 너무 작아 정확한 인식이 어렵습니다. 더 선명한 스크린샷이나 수동 입력을 사용하세요.',
      packNote:'이 VS 요일에 구매한 패키지에서 얻은 다이아만 계산하세요. 현재 다이아 잔액은 포함되지 않습니다.',
      lostNote:'점수를 위해 병력을 일부러 잃지 마세요. 이미 발생한 손실만 기록하세요.', chipNote:'실제로 획득한 드론 스킬 칩 점수를 입력하세요.',
      verifyQuestion:'계획 사용 후 실제 VS 점수를 확인하세요.', verifyYes:'네, 게임에 720만 이상 표시됩니다', verifyEnter:'또는 정확한 점수 입력', verifySave:'실제 점수 저장',
      appliedVerify:'자원 기록 완료. 실제 점수를 확인하세요.', actualSaved:'실제 점수 저장됨.', planBlocked:'안전 확인 전에는 계획을 확정할 수 없습니다.',
      needCalibration:'먼저 VS 점수를 보정하세요.', needPhoto:'선명한 스크린샷을 추가하거나 자원을 직접 입력하세요.', needMore:'사이트가 안내한 자원을 추가하세요.', needDay:'선택한 VS 요일을 확인하세요.',
      needReview:'불확실한 스크린샷을 다시 찍거나 직접 입력하세요.', needPlan:'Last War에서 계획대로 사용한 뒤 확인하세요.', needVerify:'Last War의 실제 점수를 확인하세요.', allDone:'오늘은 끝났습니다. 자원을 보관하세요.',
      lostButton:'🧭 무엇을 해야 할지 모르겠어요', nextTitle:'지금 해야 할 일', gotIt:'확인',
      weekReset:'새 VS 주간을 감지했습니다. 일일 점수와 행동은 초기화했고 실제 인벤토리는 유지했습니다.',
      version:'버전 {version}', planReadyBadge:'계획 준비 완료', alreadyReachedBadge:'목표 이미 달성',
      confirmUseTitle:'Last War에서 이 자원을 사용했나요?', confirmUseBody:'목록 전체를 실제로 사용한 뒤에만 확인하세요. 다음 단계에서 실제 점수를 확인합니다.'
    },
    hr:{
      assistant:'Samostalni pomoćnik', ready:'✅ PLAN SPREMAN', missing:'⚠️ NEDOSTAJU PODACI', done:'🏁 CILJ VEĆ OSTVAREN',
      verify:'🔎 PROVJERI REZULTAT', review:'🔎 PROVJERI SNIMKU', calibrate:'⚙️ POTREBNA KALIBRACIJA', wrongDay:'⚠️ PROVJERI VS DAN',
      readyTitle:'Plan je spreman', missingTitle:'Nedostaje još podataka', doneTitle:'Za danas je gotovo',
      verifyTitle:'Potvrdi stvarni rezultat u Last Waru', reviewTitle:'Vrijednost u planu nije pouzdano očitana', calibrateTitle:'Jedna provjera prije početka', wrongDayTitle:'Snimke možda pripadaju drugom danu',
      readyBody:'Upotrijebi samo predložene količine i potvrdi tek nakon stvarne uporabe u Last Waru.',
      missingBody:'Prepoznata zaliha još nije dovoljna. Dodaj snimku ili ručno unesi resurse koje imaš.',
      doneBody:'Dosegnut je dnevni minimum. Sačuvaj ostatak resursa osim ako savez ne kaže drukčije.',
      verifyBody:'Upotrijebljeni resursi su zapisani, ali procjena nije konačna. Provjeri stvarni VS rezultat.',
      reviewBody:'OCR vrijednost koja utječe na plan nije dovoljno pouzdana. Dodaj jasniju snimku ili ručni unos.',
      calibrateBody:'Unesi koliko vrijedi 1 minuta ubrzanja istraživanja/gradnje u Savezničkom duelu.',
      wrongDayBody:'Resursi su prepoznati, ali nijedan ne donosi bodove odabranog dana. Provjeri VS dan.',
      checkDay:'Dan', checkStock:'Korisna zaliha', checkCal:'Kalibracija', checkPlan:'Plan',
      minGoal:'Minimum', recommended:'Preporučeni cilj', planned:'Planirani zbroj', current:'Stvarni rezultat',
      coverage:'Resursi za ovaj dan', missingShots:'Ako ih imaš, pokaži ili unesi i: {list}.',
      lowOcr:'⚠️ {count} vrijednost(i) nije automatski primijenjena zbog nesigurnog očitanja.',
      highMargin:'Margina plana je velika ({points} bodova). Možeš smanjiti količinu tipkom −.',
      calibrationTitle:'Kalibriraj VS bodove', calibrationHelp:'Provjeri koliko bodova daje 1 minuta ubrzanja istraživanja/gradnje.',
      cal50:'50 bod/min · osnovno', cal125:'125 bod/min · glavno VS stablo', cal150:'150 bod/min · napredno VS istraživanje',
      calOther:'Druga vrijednost', calSave:'Spremi vrijednost', calibrated:'Kalibracija: {value} bod/min.', changeCal:'Promijeni kalibraciju',
      manualTitle:'Ručni unos', manualHelp:'Ako snimka ne radi, unesi količine izravno. Plan se automatski preračunava.',
      manualOpen:'Ručno unesi resurse', manualQty:'Količina', manualSaved:'Količina spremljena.',
      offline:'Izračun plana radi izvan mreže. Automatsko čitanje snimki može zahtijevati Internet.',
      tinyImage:'Slika je premala za pouzdano očitanje. Upotrijebi jasniju snimku ili ručni unos.',
      packNote:'Računaj samo dijamante dobivene iz kupljenog paketa za ovaj VS dan. Trenutačni saldo dijamanata ne vrijedi.',
      lostNote:'Nemoj namjerno gubiti trupe radi bodova. Ovaj red koristi samo za već nastale gubitke.',
      chipNote:'Unesi stvarno dobivene bodove čipa drona. Ne pretvaraj broj škrinja bez točnog sadržaja.',
      verifyQuestion:'Nakon plana provjeri stvarni VS rezultat.', verifyYes:'Da, igra pokazuje najmanje 7,2 M', verifyEnter:'Ili unesi točan rezultat', verifySave:'Spremi stvarni rezultat',
      appliedVerify:'Resursi zapisani. Sada provjeri stvarni rezultat.', actualSaved:'Stvarni rezultat spremljen.', planBlocked:'Plan se ne može potvrditi dok korak nije siguran.',
      needCalibration:'Najprije kalibriraj VS bodove.', needPhoto:'Dodaj jasnu snimku ili ručno unesi resurse.', needMore:'Dodaj resurse koje stranica predlaže.', needDay:'Provjeri odabrani VS dan.', needReview:'Ponovno snimi nesiguran resurs ili ga unesi ručno.',
      needPlan:'Slijedi plan u Last Waru, zatim se vrati i potvrdi.', needVerify:'Provjeri stvarni rezultat u Last Waru.', allDone:'Za danas si završio. Sačuvaj resurse.',
      lostButton:'🧭 Ne znam što učiniti', nextTitle:'Evo točno što treba učiniti', gotIt:'Razumijem',
      weekReset:'Otkriven je novi VS tjedan: dnevni bodovi i radnje su poništeni, stvarni inventar je sačuvan.',
      version:'Verzija {version}', planReadyBadge:'Plan spreman', alreadyReachedBadge:'Cilj već ostvaren',
      confirmUseTitle:'Jesi li upotrijebio ove resurse u Last Waru?', confirmUseBody:'Potvrdi tek nakon stvarne uporabe cijelog popisa. Nakon toga provjeri stvarni rezultat.'
    },
    pt:{
      assistant:'Assistente autónomo', ready:'✅ PLANO PRONTO', missing:'⚠️ FALTAM INFORMAÇÕES', done:'🏁 OBJETIVO JÁ ATINGIDO',
      verify:'🔎 VERIFICA A PONTUAÇÃO', review:'🔎 VERIFICA A CAPTURA', calibrate:'⚙️ CALIBRAÇÃO NECESSÁRIA', wrongDay:'⚠️ VERIFICA O DIA VS',
      readyTitle:'O teu plano está pronto', missingTitle:'Ainda faltam informações', doneTitle:'Terminaste por hoje',
      verifyTitle:'Confirma a pontuação real no Last War', reviewTitle:'Uma leitura usada pelo plano é incerta', calibrateTitle:'Uma única verificação antes de começar', wrongDayTitle:'As capturas podem ser de outro dia',
      readyBody:'Usa apenas as quantidades propostas e confirma depois de as utilizares realmente no Last War.',
      missingBody:'O stock reconhecido ainda não chega. Adiciona uma captura ou usa a introdução manual para os recursos que possuis.',
      doneBody:'Atingiste o mínimo do dia. Guarda o resto dos recursos, salvo indicação contrária da aliança.',
      verifyBody:'Os recursos usados foram registados, mas a estimativa não é tratada como certa. Verifica agora a pontuação VS real.',
      reviewBody:'Um valor OCR que influencia o plano não é suficientemente fiável. Faz uma captura mais nítida ou introduz o recurso manualmente.',
      calibrateBody:'Indica quanto vale 1 minuto de aceleração de investigação ou construção no Duelo de Alianças.',
      wrongDayBody:'Foram reconhecidos recursos, mas nenhum dá pontos no dia VS selecionado. Verifica o dia antes de continuar.',
      checkDay:'Dia', checkStock:'Stock útil', checkCal:'Calibração', checkPlan:'Plano',
      minGoal:'Mínimo', recommended:'Objetivo recomendado', planned:'Total previsto', current:'Pontuação real',
      coverage:'Recursos geridos para este dia', missingShots:'Se os tiveres, mostra ou introduz também: {list}.',
      lowOcr:'⚠️ {count} valor(es) não foram aplicados automaticamente porque a leitura é incerta.',
      highMargin:'A margem do plano é elevada ({points} pontos). Podes reduzir uma quantidade com −.',
      calibrationTitle:'Calibrar os meus pontos VS', calibrationHelp:'Confirma quantos pontos dá 1 minuto de aceleração de investigação/construção.',
      cal50:'50 pts/min · valores base', cal125:'125 pts/min · árvore VS principal', cal150:'150 pts/min · investigação VS avançada',
      calOther:'Outro valor', calSave:'Guardar este valor', calibrated:'Calibração guardada: {value} pts/min.', changeCal:'Alterar calibração',
      manualTitle:'Introdução manual de recurso', manualHelp:'Se uma captura não funcionar, introduz diretamente as quantidades. O plano recalcula automaticamente.',
      manualOpen:'Introduzir recursos manualmente', manualQty:'Quantidade possuída', manualSaved:'Quantidade guardada.',
      offline:'O cálculo do plano funciona offline. A leitura automática das capturas pode precisar de Internet.',
      tinyImage:'A imagem é demasiado pequena para uma leitura fiável. Usa uma captura mais nítida ou a introdução manual.',
      packNote:'Conta apenas os diamantes obtidos num pacote comprado para este dia VS. O teu saldo atual de diamantes não conta.',
      lostNote:'Nunca percas tropas de propósito para fazer pontos. Usa esta linha apenas para perdas que já aconteceram.',
      chipNote:'Introduz os pontos de chip de habilidade do drone realmente ganhos. Não convertas cofres sem saber o conteúdo exato.',
      verifyQuestion:'Depois de usares o plano, verifica a pontuação VS real.', verifyYes:'Sim, o jogo mostra pelo menos 7,2 M', verifyEnter:'Ou introduz a pontuação exata', verifySave:'Guardar pontuação real',
      appliedVerify:'Recursos registados. Verifica agora a pontuação real no Last War.', actualSaved:'Pontuação real guardada.', planBlocked:'O plano não pode ser confirmado enquanto este passo não for seguro.',
      needCalibration:'Calibra primeiro os teus pontos VS.', needPhoto:'Adiciona uma captura nítida ou introduz os recursos manualmente.', needMore:'Adiciona os recursos indicados pelo site.', needDay:'Verifica o dia VS selecionado.', needReview:'Repete a captura incerta ou introduz o valor manualmente.',
      needPlan:'Segue o plano no Last War e depois volta para confirmar.', needVerify:'Verifica a pontuação real no Last War.', allDone:'Terminaste por hoje. Guarda os teus recursos.',
      lostButton:'🧭 Estou perdido', nextTitle:'Aqui está exatamente o que fazer', gotIt:'Percebi',
      weekReset:'Nova semana VS detetada: as pontuações e ações diárias foram repostas. O inventário real foi mantido.',
      version:'Versão {version}', planReadyBadge:'Plano pronto', alreadyReachedBadge:'Objetivo já atingido',
      confirmUseTitle:'Usaste estes recursos no Last War?', confirmUseBody:'Confirma apenas depois de utilizares realmente toda a lista. Depois o site pede-te para verificar a pontuação real.'
    }
  };

  const ft = () => F[state.language] || F.fr;
  const fill = (s, vars={}) => {
    let out=String(s||'');
    for(const [k,v] of Object.entries(vars)) out=out.replaceAll(`{${k}}`,String(v));
    return out;
  };

  function localIsoDate(date){
    const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
  }
  function vsWeekKey(date=new Date()){
    const d=new Date(date.getFullYear(),date.getMonth(),date.getDate(),12,0,0,0);
    const dow=d.getDay();
    d.setDate(d.getDate()+(dow===0?1:1-dow));
    return localIsoDate(d);
  }

  const FAMILY_BY_KEY = key => {
    const s=String(key||'');
    if(/^radarTasksD[135]$/.test(s)||s==='radarTasks')return'radarTasks';
    if(/^buildingPowerD[25]$/.test(s)||s==='buildingPower')return'buildingPower';
    if(/^techPowerD[35]$/.test(s)||s==='techPower')return'techPower';
    if(/^urTrucksD[26]$/.test(s)||s==='urTrucks')return'urTrucks';
    if(/^legendTasksD[26]$/.test(s)||s==='legendTasks')return'legendTasks';
    return s;
  };
  const DAY_KEY = {
    radarTasks:{1:'radarTasksD1',3:'radarTasksD3',5:'radarTasksD5'},
    buildingPower:{2:'buildingPowerD2',5:'buildingPowerD5'},
    techPower:{3:'techPowerD3',5:'techPowerD5'},
    urTrucks:{2:'urTrucksD2',6:'urTrucksD6'},
    legendTasks:{2:'legendTasksD2',6:'legendTasksD6'}
  };
  function mappedKey(key,dayId){
    const family=FAMILY_BY_KEY(key),m=DAY_KEY[family];
    return m&&m[Number(dayId)]?m[Number(dayId)]:key;
  }

  function patchCatalogue(){
    // Monday hero shards do not score on Monday: keep them for Thursday.
    const monday=DAYS.find(d=>d.id===1);
    if(monday)monday.items=monday.items.filter(i=>!['urShards','ssrShards','rareShards','skillChipPremium'].includes(i.stockKey));
    if(monday&&!monday.items.some(i=>i.stockKey==='skillChipPoints')){
      monday.items.push(item('skillChipPoints','skillChipPoints','chip',1000,{scarcity:2,progression:5,eco:2,quick:[100,1000,10000]}));
    }

    const friday=DAYS.find(d=>d.id===5);
    if(friday&&!friday.items.some(i=>i.stockKey==='packDiamondsD5')){
      friday.items.push(item('packDiamondsD5','packDiamonds','diamond',32,{scarcity:5,progression:0,eco:5,quick:[100,1000,10000]}));
    }

    const remaps={
      1:{radarTasks:'radarTasksD1'},
      2:{buildingPower:'buildingPowerD2',urTrucks:'urTrucksD2',legendTasks:'legendTasksD2'},
      3:{researchSpeed:'researchSpeed',techPower:'techPowerD3',radarTasks:'radarTasksD3'},
      5:{radarTasks:'radarTasksD5',buildingPower:'buildingPowerD5',techPower:'techPowerD5'},
      6:{urTrucks:'urTrucksD6',legendTasks:'legendTasksD6'}
    };
    for(const d of DAYS){
      const map=remaps[d.id]||{};
      for(const i of d.items)if(map[i.stockKey])i.stockKey=map[i.stockKey];
    }

    // Preserve existing qualification text for day-scoped UR trucks/tasks.
    for(const lang of Object.keys(QUALIFICATION_TEXT)){
      const q=QUALIFICATION_TEXT[lang]||{};
      if(q.urTrucks){q.urTrucksD2=q.urTrucks;q.urTrucksD6=q.urTrucks;}
      if(q.legendTasks){q.legendTasksD2=q.legendTasks;q.legendTasksD6=q.legendTasks;}
    }

    // Copy OCR aliases to new day-scoped stock keys.
    if(typeof OCR_EXTRA_ALIASES==='object'){
      const copy=(src,...dest)=>{for(const d of dest)OCR_EXTRA_ALIASES[d]=[...(OCR_EXTRA_ALIASES[src]||[])];};
      copy('radarTasks','radarTasksD1','radarTasksD3','radarTasksD5');
      copy('buildingPower','buildingPowerD2','buildingPowerD5');
      copy('techPower','techPowerD3','techPowerD5');
      copy('urTrucks','urTrucksD2','urTrucksD6');
      copy('legendTasks','legendTasksD2','legendTasksD6');
      OCR_EXTRA_ALIASES.skillChipPoints=[
        ...(OCR_EXTRA_ALIASES.skillChipPoints||[]),
        'points de puce drone','points de puce de competence drone','drone skill chip points','drone chip points',
        'drohnen chip punkte','puncte cip drona','очки чипів дрона','드론 스킬 칩 점수','bodovi čipa drona',
        'pontos de chip do drone','pontos de chip de habilidade do drone'
      ];
    }
  }

  function patchGuideText(){
    for(const lang of Object.keys(DAY_TEXT)){
      const days=DAY_TEXT[lang],labels=LABELS[lang]||LABELS.en;
      if(!Array.isArray(days)||days.length<5)continue;
      const chip=labels.skillChipPoints,pack=labels.packDiamonds;
      if(chip&&days[0]&&!String(days[0].use||'').includes(chip))days[0].use=`${days[0].use} ${chip}.`;
      if(pack&&days[4]&&!String(days[4].use||'').includes(pack))days[4].use=`${days[4].use} ${pack}.`;
    }
  }

  function addQualificationNotes(){
    const notes={
      fr:{pack: F.fr.packNote,lost:F.fr.lostNote,chip:F.fr.chipNote},
      en:{pack: F.en.packNote,lost:F.en.lostNote,chip:F.en.chipNote},
      de:{pack: F.de.packNote,lost:F.de.lostNote,chip:F.de.chipNote},
      ro:{pack: F.ro.packNote,lost:F.ro.lostNote,chip:F.ro.chipNote},
      uk:{pack: F.uk.packNote,lost:F.uk.lostNote,chip:F.uk.chipNote},
      ko:{pack: F.ko.packNote,lost:F.ko.lostNote,chip:F.ko.chipNote},
      hr:{pack: F.hr.packNote,lost:F.hr.lostNote,chip:F.hr.chipNote},
      pt:{pack: F.pt.packNote,lost:F.pt.lostNote,chip:F.pt.chipNote}
    };
    for(const [lang,n] of Object.entries(notes)){
      if(!QUALIFICATION_TEXT[lang])QUALIFICATION_TEXT[lang]={};
      const q=QUALIFICATION_TEXT[lang];
      for(let d=1;d<=6;d++)q[`packDiamondsD${d}`]=n.pack;
      for(let tier=1;tier<=10;tier++)q[`lostT${tier}`]=n.lost;
      q.skillChipPoints=n.chip;
    }
  }

  const VOLATILE_KEYS = [
    'radarTasks','buildingPower','techPower','urTrucks','legendTasks','skillChipPremium','skillChipPoints',
    'radarTasksD1','radarTasksD3','radarTasksD5','buildingPowerD2','buildingPowerD5','techPowerD3','techPowerD5',
    'urTrucksD2','urTrucksD6','legendTasksD2','legendTasksD6',
    'foodLots','ironLots','coinLots',
    ...Array.from({length:6},(_,i)=>`packDiamondsD${i+1}`),
    ...Array.from({length:10},(_,i)=>`trainT${i+1}`),
    ...Array.from({length:10},(_,i)=>`rivalKillT${i+1}`),
    ...Array.from({length:10},(_,i)=>`otherKillT${i+1}`),
    ...Array.from({length:10},(_,i)=>`lostT${i+1}`)
  ];

  function clearVolatileInventory(){
    if(!state.inventory||typeof state.inventory!=='object')state.inventory={};
    for(const k of VOLATILE_KEYS)delete state.inventory[k];
  }

  function setSaturdayLossDefaults(){
    if(!state.planAdjustments||typeof state.planAdjustments!=='object')state.planAdjustments={};
    if(!state.planAdjustments['6'])state.planAdjustments['6']={fixed:{},excluded:{}};
    const a=state.planAdjustments['6'];
    if(!a.fixed)a.fixed={};if(!a.excluded)a.excluded={};
    if(!state.v240LossOptIn||typeof state.v240LossOptIn!=='object')state.v240LossOptIn={};
    for(let i=1;i<=10;i++){
      const id=`lostT${i}`;
      if(state.v240LossOptIn[id]===true){delete a.excluded[id];continue;}
      if(!Object.prototype.hasOwnProperty.call(a.fixed,id))a.excluded[id]=true;
    }
  }

  function migrateAndRollWeek(){
    const currentKey=vsWeekKey();
    let didReset=false;
    if(!localStorage.getItem(MIGRATION_FLAG)){
      // Day-scoped actions cannot safely inherit an old shared reference.
      state.inventorySnapshots={};
      state.inventoryHistory=[];
      state.planAdjustments={};
      state.simpleSelections={};
      state.expOnlyAccepted={};
      state.lastPlan=null;
      for(const k of ['radarTasks','buildingPower','techPower','urTrucks','legendTasks','skillChipPremium'])delete state.inventory?.[k];
      state[WEEK_KEY_FIELD]=currentKey;
      localStorage.setItem(MIGRATION_FLAG,'1');
    }else if(state[WEEK_KEY_FIELD]!==currentKey){
      state[WEEK_KEY_FIELD]=currentKey;
      state.currentPoints={};
      state.inventorySnapshots={};
      state.inventoryHistory=[];
      state.planAdjustments={};
      state.simpleSelections={};
      state.expOnlyAccepted={};
      state.lastPlan=null;
      delete state.v240PendingVerification;
      state.v240LossOptIn={};
      clearVolatileInventory();
      didReset=true;
    }
    setSaturdayLossDefaults();
    saveState();
    if(didReset)setTimeout(()=>showToast(ft().weekReset),250);
    return didReset;
  }

  function minimumGoal(){
    return Math.max(7200000,Math.max(0,Number(state.profile?.target||0)));
  }
  function recommendedGoal(){
    return state.profile?.economyWeek?minimumGoal():minimumGoal()+Math.max(0,Number(state.profile?.margin||0));
  }

  patchCatalogue();
  patchGuideText();
  addQualificationNotes();
  migrateAndRollWeek();

  // Make point-profile wording consistent across all 8 languages.
  const profileAdvanced={
    fr:['Recherche VS avancée terminée','Profil avancé. Choisis-le si 1 minute d’accélérateur bonus vaut 150 points dans ton Duel d’alliances.'],
    en:['Advanced VS research completed','Advanced profile. Choose it if 1 bonus speed-up minute is worth 150 points in Alliance Duel.'],
    de:['Erweiterte VS-Forschung abgeschlossen','Erweitertes Profil. Wähle es, wenn 1 Bonus-Beschleunigerminute im Allianzduell 150 Punkte wert ist.'],
    ro:['Cercetare VS avansată finalizată','Profil avansat. Alege-l dacă 1 minut de accelerator bonus valorează 150 de puncte în Duelul Alianțelor.'],
    uk:['Розширені дослідження VS завершено','Розширений профіль. Оберіть, якщо 1 хвилина бонусного прискорення дає 150 очок.'],
    ko:['고급 VS 연구 완료','고급 프로필. 동맹 대결에서 보너스 가속 1분이 150점일 때 선택하세요.'],
    hr:['Napredno VS istraživanje završeno','Napredni profil. Odaberi ako 1 minuta bonus ubrzanja vrijedi 150 bodova.'],
    pt:['Investigação VS avançada concluída','Perfil avançado. Escolhe-o se 1 minuto de aceleração com bónus valer 150 pontos no Duelo de Alianças.']
  };
  for(const [lang,[label,help]] of Object.entries(profileAdvanced)){
    if(PROFILE_TEXT[lang]){PROFILE_TEXT[lang].advanced=label;PROFILE_TEXT[lang].advancedHelp=help;}
  }

  // Do not OCR "diamonds from packs": a normal diamond balance must never be mistaken for this VS action.
  if(typeof itemAliases==='function'){
    const baseItemAliases=itemAliases;
    itemAliases=function(i){
      if(String(i?.stockKey||'').startsWith('packDiamondsD'))return[];
      return baseItemAliases(i);
    };
  }

  // Remap generic daily-action OCR targets to the selected scan day when that action scores that day.
  if(typeof findOcrTarget==='function'){
    const baseFindOcrTarget=findOcrTarget;
    findOcrTarget=function(line){
      const found=baseFindOcrTarget(line);
      if(!found?.target||found.target==='__currentPoints')return found;
      const scanDay=Number(ocrDayId||state.selectedDay);
      const family=FAMILY_BY_KEY(found.target),next=DAY_KEY[family]?.[scanDay];
      return next?{...found,target:next}:found;
    };
  }
  if(typeof selectedLastWarTarget==='function'){
    const baseSelected=selectedLastWarTarget;
    selectedLastWarTarget=function(text){
      const target=baseSelected(text),scanDay=Number(ocrDayId||state.selectedDay);
      const family=FAMILY_BY_KEY(target),next=DAY_KEY[family]?.[scanDay];
      return next||target;
    };
  }
  if(typeof parseLastWarSpecialText==='function'){
    const baseSpecial=parseLastWarSpecialText;
    parseLastWarSpecialText=function(text,source){
      const rows=baseSpecial(text,source)||[],scanDay=Number(ocrDayId||state.selectedDay);
      return rows.map(r=>{
        if(!r?.target||r.target==='__currentPoints')return r;
        const family=FAMILY_BY_KEY(r.target),next=DAY_KEY[family]?.[scanDay];
        return next?{...r,target:next}:r;
      });
    };
  }

  // Raise automatic OCR acceptance threshold.
  groupedAutomaticOcrValues=function(){
    const valid=(Array.isArray(ocrRows)?ocrRows:[]).filter(r=>r&&r.enabled&&r.target&&Number(r.confidence)>=OCR_AUTO_THRESHOLD&&Number(r.value)>=0);
    const grouped=new Map(),summed=new Map();
    for(const row of valid){
      const value=Math.max(0,Number(row.value)||0);
      if(row.combine==='sum'){summed.set(row.target,(summed.get(row.target)||0)+value);continue;}
      grouped.set(row.target,Math.max(grouped.get(row.target)||0,value));
    }
    for(const [target,value] of summed)grouped.set(target,(grouped.get(target)||0)+value);
    return grouped;
  };

  // Clearly tiny screenshots are more likely to create false inventory than help.
  if(typeof startOcrScan==='function'){
    const baseStartOcrScan=startOcrScan;
    startOcrScan=async function(){
      try{
        for(const file of (Array.isArray(ocrFiles)?ocrFiles:[])){
          if(Number(file?.size||0)>0&&Number(file.size)<8000){showToast(ft().tinyImage);return;}
          const img=await loadImageElement(file);
          if(Math.max(Number(img.naturalWidth||0),Number(img.naturalHeight||0))<450){showToast(ft().tinyImage);return;}
        }
      }catch{}
      return baseStartOcrScan();
    };
  }

  // Separate "minimum achieved" from "recommended planning target".
  const baseCalculatePlan=calculatePlan;
  calculatePlan=function(){
    if(Math.max(0,Number(state.profile?.target||0))<7200000)state.profile.target=7200000;
    setSaturdayLossDefaults();
    const current=Math.max(0,Number(state.currentPoints?.[state.selectedDay]||0)),minimum=minimumGoal(),recommended=recommendedGoal();
    if(current>=minimum){
      return{dayId:Number(state.selectedDay),goal:recommended,minimumGoal:minimum,recommendedGoal:recommended,current,totalPoints:0,finalPoints:current,steps:[],reached:true,overshoot:Math.max(0,current-minimum),missing:0,strategy:state.profile.strategy,speedUsed:0,minimumReached:true};
    }
    const plan=baseCalculatePlan();
    plan.minimumGoal=minimum;plan.recommendedGoal=recommended;plan.minimumReached=false;
    return plan;
  };

  function calibrationValue(){
    if(state.v240Calibration?.confirmed&&Number(state.v240Calibration.speedupPoints)>0)return Number(state.v240Calibration.speedupPoints);
    return 0;
  }
  function isCalibrated(){return calibrationValue()>0;}

  function saveCalibration(value){
    const n=Math.max(1,Number(value)||0);
    if(Math.abs(n-50)<.001){state.profile.pointProfile='base';state.profile.bonusPct=0;}
    else if(Math.abs(n-125)<.001){state.profile.pointProfile='standard';state.profile.bonusPct=150;}
    else if(Math.abs(n-150)<.001){state.profile.pointProfile='advanced';state.profile.bonusPct=200;}
    else{state.profile.pointProfile='custom';state.profile.bonusPct=Math.max(0,(n/50-1)*100);}
    state.v240Calibration={confirmed:true,speedupPoints:n,confirmedAt:new Date().toISOString()};
    const panel=document.getElementById('gomoV240Calibration');if(panel)delete panel.dataset.forceOpen;
    invalidatePlan();saveState();renderAll();scheduleFinalRefresh();
  }

  function usefulPotential(){
    try{return Number(inventoryPotential(state.selectedDay,true)||0);}catch{return 0;}
  }
  function scanSeen(){
    try{return Boolean((ocrFiles||[]).length||lastAutoScanSummary);}catch{return Boolean(lastAutoScanSummary);}
  }
  function lowOcrRows(){
    try{return (ocrRows||[]).filter(r=>r&&r.enabled&&r.target&&Number(r.confidence||0)<OCR_AUTO_THRESHOLD);}catch{return[];}
  }
  function riskRowsForPlan(plan){
    const keys=new Set((plan?.steps||[]).map(s=>s.stockKey));
    return lowOcrRows().filter(r=>keys.has(r.target));
  }
  function wrongDay(){
    try{
      if(!lastAutoScanSummary||Number(lastAutoScanSummary.count)<=0||Number(lastAutoScanSummary.relevantCount)!==0)return false;
      const scanDay=Number(ocrDayId||state.selectedDay);
      return scanDay===Number(state.selectedDay);
    }catch{return false;}
  }

  function finalStatus(plan=calculatePlan()){
    if(state.v240PendingVerification&&Number(state.v240PendingVerification.dayId)===Number(state.selectedDay))return{kind:'verify',plan};
    const current=Math.max(0,Number(state.currentPoints?.[state.selectedDay]||0));
    if(current>=minimumGoal())return{kind:'done',plan};
    if(!isCalibrated())return{kind:'calibrate',plan};
    if(wrongDay())return{kind:'wrongDay',plan};
    if(riskRowsForPlan(plan).length)return{kind:'review',plan};
    if(plan.reached)return{kind:'ready',plan};
    return{kind:'missing',plan};
  }

  function ensureStyles(){
    if(document.getElementById('gomo-v240-style'))return;
    const style=document.createElement('style');
    style.id='gomo-v240-style';
    style.textContent=`
      #gomo-v232-status{display:none!important}
      .gomo-v240-version{display:inline-flex;align-items:center;padding:6px 9px;border-radius:999px;border:1px solid rgba(91,211,255,.25);font-size:11px;color:#bfeaff;margin-left:8px}
      #gomoV240Calibration,#gomoV240Verify{border:1px solid rgba(91,211,255,.42)}
      .gomo-v240-cal-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:12px 0}
      .gomo-v240-cal-grid button{min-height:52px}
      .gomo-v240-custom{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end}
      .gomo-v240-custom label{display:grid;gap:6px;color:var(--muted);font-size:.8rem;font-weight:700}
      .gomo-v240-current{margin-top:10px;font-weight:800;color:var(--accent)}
      #gomoV240Manual{margin-bottom:16px}
      #gomoV240Manual>summary{cursor:pointer;padding:16px 18px;border:1px solid var(--line);border-radius:18px;background:rgba(13,54,75,.45);font-weight:900}
      .gomo-v240-manual-body{padding:12px 2px 0}
      .gomo-v240-manual-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(120px,.55fr);gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.07)}
      .gomo-v240-manual-row h4{margin:0 0 3px}.gomo-v240-manual-row small{color:var(--muted);line-height:1.3}
      .gomo-v240-manual-row label{display:grid;gap:5px;color:var(--muted);font-size:11px;font-weight:700}
      .gomo-v240-tier-group{border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:0 10px;margin:9px 0}
      .gomo-v240-tier-group summary{cursor:pointer;padding:11px 2px;font-weight:800}
      .gomo-v240-offline{font-size:12px;color:var(--muted);margin:10px 0 0}
      .gomo-v240-warning{margin-top:10px;padding:10px 12px;border-radius:12px;background:rgba(255,184,77,.11);border:1px solid rgba(255,184,77,.28);font-size:12px;line-height:1.4}
      .gomo-v240-verify-actions{display:grid;gap:10px;margin-top:12px}
      .gomo-v240-verify-score{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end}
      .gomo-v240-verify-score label{display:grid;gap:6px;color:var(--muted);font-size:.8rem;font-weight:700}
      .gomo-v240-safety-note{display:block;margin-top:5px;color:#ffd79a;font-size:11px;line-height:1.3}
      @media(max-width:580px){
        .gomo-v240-cal-grid{grid-template-columns:1fr}
        .gomo-v240-custom,.gomo-v240-verify-score,.gomo-v240-manual-row{grid-template-columns:1fr}
        .gomo-central-back{z-index:8!important;width:42px!important;min-width:42px!important;height:42px!important;min-height:42px!important;padding:0!important;border-radius:50%!important}
        .gomo-central-back .gomo-central-back-text{display:none!important}
      }
    `;
    document.head.appendChild(style);
  }

  function ensureVersion(){
    if(document.getElementById('gomoV240Version'))return;
    const save=document.getElementById('saveState');
    if(!save)return;
    const chip=document.createElement('span');chip.id='gomoV240Version';chip.className='gomo-v240-version';
    save.insertAdjacentElement('afterend',chip);
  }

  function ensureCalibrationPanel(){
    let panel=document.getElementById('gomoV240Calibration');
    if(panel)return panel;
    const anchor=document.getElementById('gomoAutopilotPanel')||document.querySelector('.ultra-welcome');
    if(!anchor)return null;
    panel=document.createElement('section');panel.id='gomoV240Calibration';panel.className='panel';
    panel.innerHTML=`<p class="eyebrow" id="gomoV240CalEyebrow"></p><h2 id="gomoV240CalTitle"></h2><p id="gomoV240CalHelp"></p>
      <div class="gomo-v240-cal-grid">
        <button class="secondary-btn" type="button" data-v240-cal="50"></button>
        <button class="secondary-btn" type="button" data-v240-cal="125"></button>
        <button class="secondary-btn" type="button" data-v240-cal="150"></button>
      </div>
      <div class="gomo-v240-custom"><label><span id="gomoV240CalOtherLabel"></span><input id="gomoV240CalOther" type="number" inputmode="decimal" min="1" step="1"></label><button class="primary-btn" id="gomoV240CalSave" type="button"></button></div>
      <p class="gomo-v240-current" id="gomoV240CalCurrent"></p>`;
    anchor.insertAdjacentElement('afterend',panel);
    return panel;
  }

  function ensureCalibrationSettingsButton(){
    let b=document.getElementById('gomoV240ChangeCal');
    if(b)return b;
    const settings=document.getElementById('settingsView');
    if(!settings)return null;
    b=document.createElement('button');b.id='gomoV240ChangeCal';b.className='secondary-btn';b.type='button';
    const first=settings.querySelector('.panel');if(first)first.appendChild(b);else settings.prepend(b);
    return b;
  }

  function ensureManualPanel(){
    let details=document.getElementById('gomoV240Manual');
    if(details)return details;
    const anchor=document.getElementById('simplePhotoStep');
    if(!anchor)return null;
    details=document.createElement('details');details.id='gomoV240Manual';
    details.innerHTML=`<summary id="gomoV240ManualSummary"></summary><div class="gomo-v240-manual-body"><p id="gomoV240ManualHelp"></p><div id="gomoV240ManualRows"></div><p class="gomo-v240-offline" id="gomoV240Offline"></p></div>`;
    anchor.insertAdjacentElement('afterend',details);
    return details;
  }

  function ensureVerifyPanel(){
    let panel=document.getElementById('gomoV240Verify');
    if(panel)return panel;
    const anchor=document.getElementById('gomoAutopilotPanel')||document.getElementById('simplePointsPanel');
    if(!anchor)return null;
    panel=document.createElement('section');panel.id='gomoV240Verify';panel.className='panel hidden';
    panel.innerHTML=`<p class="eyebrow" id="gomoV240VerifyLabel"></p><h2 id="gomoV240VerifyTitle"></h2><p id="gomoV240VerifyHelp"></p>
      <div class="gomo-v240-verify-actions">
        <button class="primary-btn" id="gomoV240VerifyYes" type="button"></button>
        <div class="gomo-v240-verify-score"><label><span id="gomoV240VerifyEnter"></span><input id="gomoV240ActualScore" type="number" inputmode="numeric" min="0" step="10000"></label><button class="secondary-btn" id="gomoV240ActualSave" type="button"></button></div>
      </div>`;
    anchor.insertAdjacentElement('afterend',panel);
    return panel;
  }

  const GROUP_LABELS={
    fr:{droneChest:'Coffres de composants drone',trainedTroops:'Troupes entraînées',rivalKilled:'Troupes VS adverses éliminées',otherKilled:'Autres troupes éliminées',lostTroops:'Pertes de troupes'},
    en:{droneChest:'Drone component chests',trainedTroops:'Trained troops',rivalKilled:'Rival VS troops eliminated',otherKilled:'Other troops eliminated',lostTroops:'Troop losses'},
    de:{droneChest:'Drohnenkomponenten-Kisten',trainedTroops:'Trainierte Truppen',rivalKilled:'Rivale VS-Truppen besiegt',otherKilled:'Andere Truppen besiegt',lostTroops:'Truppenverluste'},
    ro:{droneChest:'Cufere componente dronă',trainedTroops:'Trupe antrenate',rivalKilled:'Trupe VS rivale eliminate',otherKilled:'Alte trupe eliminate',lostTroops:'Pierderi de trupe'},
    uk:{droneChest:'Скрині компонентів дрона',trainedTroops:'Навчені війська',rivalKilled:'Знищені війська суперника VS',otherKilled:'Інші знищені війська',lostTroops:'Втрати військ'},
    ko:{droneChest:'드론 부품 상자',trainedTroops:'훈련 병력',rivalKilled:'VS 상대 병력 처치',otherKilled:'기타 병력 처치',lostTroops:'병력 손실'},
    hr:{droneChest:'Škrinje komponenti drona',trainedTroops:'Trenirane trupe',rivalKilled:'Eliminirane rivalske VS trupe',otherKilled:'Druge eliminirane trupe',lostTroops:'Gubici trupa'},
    pt:{droneChest:'Cofres de componentes do drone',trainedTroops:'Tropas treinadas',rivalKilled:'Tropas VS rivais eliminadas',otherKilled:'Outras tropas eliminadas',lostTroops:'Perdas de tropas'}
  };
  function groupLabel(key,fallback){return GROUP_LABELS[state.language]?.[key]||fallback;}

  function groupDayItems(){
    const groups=new Map();
    for(const i of day().items){
      const k=i.labelKey;
      if(!groups.has(k))groups.set(k,[]);
      groups.get(k).push(i);
    }
    return [...groups.values()];
  }
  function manualRow(i){
    const note=qualificationNote(i);
    return `<div class="gomo-v240-manual-row"><div><h4>${escapeHtml(itemLabel(i))}</h4><small>${escapeHtml(itemUnit(i))}${note?`<span class="gomo-v240-safety-note">⚠️ ${escapeHtml(note)}</span>`:''}</small></div><label><span>${escapeHtml(ft().manualQty)}</span><input class="gomo-v240-manual-input" data-v240-stock="${escapeHtml(i.stockKey)}" type="number" inputmode="decimal" min="0" value="${getStock(i)}"></label></div>`;
  }
  function renderManual(){
    ensureManualPanel();const txx=ft();
    if(document.activeElement?.classList?.contains('gomo-v240-manual-input'))return;
    const summary=document.getElementById('gomoV240ManualSummary'),help=document.getElementById('gomoV240ManualHelp'),offline=document.getElementById('gomoV240Offline'),rows=document.getElementById('gomoV240ManualRows');
    if(!summary||!rows)return;
    summary.textContent=`✍️ ${txx.manualOpen}`;help.textContent=txx.manualHelp;offline.textContent=txx.offline;
    rows.innerHTML=groupDayItems().map(items=>{
      if(items.length===1)return manualRow(items[0]);
      const label=groupLabel(items[0].labelKey,String(itemLabel(items[0])).replace(/[0-9]+/g,'').trim());
      return `<details class="gomo-v240-tier-group"><summary>${escapeHtml(label)}</summary>${items.map(manualRow).join('')}</details>`;
    }).join('');
  }

  function ensureExtraNote(){
    let n=document.getElementById('gomoV240ExtraNote');
    if(n)return n;
    const parent=document.querySelector('#gomoAutopilotPanel .gomo-v231-details')||document.getElementById('gomoAutopilotPanel');
    if(!parent)return null;
    n=document.createElement('p');n.id='gomoV240ExtraNote';n.className='gomo-v240-warning hidden';parent.appendChild(n);return n;
  }

  function resourceGroupsFinal(){
    const map=new Map();
    for(const i of day().items){
      if(!map.has(i.labelKey))map.set(i.labelKey,[]);
      map.get(i.labelKey).push(i);
    }
    return [...map.values()].map(items=>({items,label:items.length>1?groupLabel(items[0].labelKey,itemLabel(items[0])):itemLabel(items[0]),owned:items.some(i=>getStock(i)>0)}));
  }

  function refreshAutopilot(){
    ensureStyles();ensureVersion();ensureCalibrationPanel();ensureCalibrationSettingsButton();ensureManualPanel();ensureVerifyPanel();ensureExtraNote();
    const txx=ft(),s=finalStatus(),plan=s.plan,current=Math.max(0,Number(state.currentPoints?.[state.selectedDay]||0)),minimum=minimumGoal(),recommended=recommendedGoal();
    const panel=document.getElementById('gomoAutopilotPanel');
    if(panel){
      const label=document.getElementById('gomoV231Label'),title=document.getElementById('gomoV231Title'),message=document.getElementById('gomoV231Message');
      const map={
        ready:[txx.ready,txx.readyTitle,txx.readyBody],missing:[txx.missing,txx.missingTitle,txx.missingBody],done:[txx.done,txx.doneTitle,txx.doneBody],
        verify:[txx.verify,txx.verifyTitle,txx.verifyBody],review:[txx.review,txx.reviewTitle,txx.reviewBody],calibrate:[txx.calibrate,txx.calibrateTitle,txx.calibrateBody],
        wrongDay:[txx.wrongDay,txx.wrongDayTitle,txx.wrongDayBody]
      };
      const m=map[s.kind]||map.missing;if(label)label.textContent=m[0];if(title)title.textContent=m[1];if(message)message.textContent=m[2];
      const checks=document.getElementById('gomoV231Checks');
      if(checks){
        const vals=[[txx.checkDay,true],[txx.checkStock,usefulPotential()>0],[txx.checkCal,isCalibrated()],[txx.checkPlan,s.kind==='ready'||s.kind==='done'||s.kind==='verify']];
        checks.innerHTML=vals.map(([name,ok])=>`<div class="gomo-v231-check ${ok?'ok':'warn'}"><b>${ok?'✓':'!'}</b>${escapeHtml(name)}</div>`).join('');
      }
      const metrics=document.getElementById('gomoV231Metrics');
      if(metrics){
        const thirdLabel=s.kind==='done'||s.kind==='verify'?txx.current:txx.planned,third=s.kind==='done'?current:(s.kind==='verify'?Number(state.v240PendingVerification?.estimated||current):plan.finalPoints);
        metrics.innerHTML=`<article><span>${escapeHtml(txx.minGoal)}</span><strong>${fmt(minimum)}</strong></article><article><span>${escapeHtml(txx.recommended)}</span><strong>${fmt(recommended)}</strong></article><article><span>${escapeHtml(thirdLabel)}</span><strong>${fmt(Math.floor(third||0))}</strong></article>`;
      }
      const covTitle=document.getElementById('gomoV231CoverageTitle'),cov=document.getElementById('gomoV231Coverage'),miss=document.getElementById('gomoV231Missing'),unc=document.getElementById('gomoV231Uncertain');
      const groups=resourceGroupsFinal();if(covTitle)covTitle.textContent=txx.coverage;if(cov)cov.innerHTML=groups.map(g=>`<span>${escapeHtml(g.label)}</span>`).join('');
      const missing=groups.filter(g=>!g.owned).slice(0,6);
      if(miss){if((s.kind==='missing'||s.kind==='wrongDay')&&missing.length){miss.textContent=fill(txx.missingShots,{list:missing.map(g=>g.label).join(', ')});miss.classList.remove('hidden');}else miss.classList.add('hidden');}
      const low=lowOcrRows().length;if(unc){if(low){unc.textContent=fill(txx.lowOcr,{count:low});unc.classList.remove('hidden');}else unc.classList.add('hidden');}
    }

    const version=document.getElementById('gomoV240Version');if(version)version.textContent=fill(txx.version,{version:FINAL_VERSION});

    const cal=document.getElementById('gomoV240Calibration');
    if(cal){
      const force=cal.dataset.forceOpen==='1';
      cal.classList.toggle('hidden',isCalibrated()&&!force);
      document.getElementById('gomoV240CalEyebrow').textContent=txx.calibrate;
      document.getElementById('gomoV240CalTitle').textContent=txx.calibrationTitle;
      document.getElementById('gomoV240CalHelp').textContent=txx.calibrationHelp;
      const bs=cal.querySelectorAll('[data-v240-cal]');if(bs[0])bs[0].textContent=txx.cal50;if(bs[1])bs[1].textContent=txx.cal125;if(bs[2])bs[2].textContent=txx.cal150;
      document.getElementById('gomoV240CalOtherLabel').textContent=txx.calOther;document.getElementById('gomoV240CalSave').textContent=txx.calSave;
      const cur=document.getElementById('gomoV240CalCurrent');if(cur)cur.textContent=isCalibrated()?fill(txx.calibrated,{value:calibrationValue()}):'';
    }
    const changeCal=document.getElementById('gomoV240ChangeCal');if(changeCal)changeCal.textContent=txx.changeCal;

    const verify=document.getElementById('gomoV240Verify');
    if(verify){
      const pending=state.v240PendingVerification&&Number(state.v240PendingVerification.dayId)===Number(state.selectedDay);
      verify.classList.toggle('hidden',!pending);
      document.getElementById('gomoV240VerifyLabel').textContent=txx.verify;document.getElementById('gomoV240VerifyTitle').textContent=txx.verifyTitle;
      document.getElementById('gomoV240VerifyHelp').textContent=txx.verifyQuestion;document.getElementById('gomoV240VerifyYes').textContent=txx.verifyYes;
      document.getElementById('gomoV240VerifyEnter').textContent=txx.verifyEnter;document.getElementById('gomoV240ActualSave').textContent=txx.verifySave;
      const input=document.getElementById('gomoV240ActualScore');if(input&&document.activeElement!==input)input.value=Math.floor(Number(state.v240PendingVerification?.estimated||current||0));
    }

    renderManual();

    // Hide normal confirmation once done or while real-score verification is pending.
    const buttons=document.querySelector('#simplePointsPanel .plan-validation-buttons');
    if(buttons)buttons.style.display=(s.kind==='done'||s.kind==='verify')?'none':'';
    const apply=document.getElementById('simpleApplyBtn');
    if(apply)apply.disabled=!(s.kind==='ready');

    // Correct the ambiguous original result badge.
    const badge=document.getElementById('simplePointsStatus');
    if(badge){
      if(s.kind==='done'){badge.textContent=txx.alreadyReachedBadge;badge.classList.remove('warning');}
      else if(s.kind==='ready'){badge.textContent=txx.planReadyBadge;badge.classList.remove('warning');}
      else if(s.kind==='verify'){badge.textContent=txx.verify;badge.classList.add('warning');}
      else if(!plan.reached){badge.textContent=apt('targetMissing',{points:fmt(Math.ceil(Math.max(0,recommended-plan.finalPoints)))});badge.classList.add('warning');}
    }

    const helpBtn=document.getElementById('smartHelpBtn');if(helpBtn)helpBtn.textContent=txx.lostButton;

    // Target already achieved: never show "add screenshots" as the empty-plan message.
    if(s.kind==='done'){
      const empty=document.querySelector('#simplePlanList .ultra-empty-plan p');if(empty)empty.textContent=txx.doneBody;
      const footer=document.querySelector('.ultra-plan-footer [data-ultra-i18n="usedHelp"]');if(footer)footer.textContent=txx.doneBody;
    }

    const extra=document.getElementById('gomoV240ExtraNote');
    if(extra){
      const over=Math.max(0,Number(plan.finalPoints||0)-recommended);
      if(s.kind==='ready'&&over>HIGH_MARGIN_WARNING){extra.textContent=fill(txx.highMargin,{points:fmt(Math.floor(over))});extra.classList.remove('hidden');}
      else extra.classList.add('hidden');
    }

    // Add safety notes to proposed pack/loss actions.
    document.querySelectorAll('#simplePlanList .ultra-plan-action').forEach(card=>{
      card.querySelectorAll('.gomo-v240-safety-note').forEach(n=>n.remove());
      const title=card.querySelector('h3')?.textContent?.trim(),i=day().items.find(x=>itemLabel(x)===title);
      const note=i?qualificationNote(i):'';if(!note)return;
      const n=document.createElement('small');n.className='gomo-v240-safety-note';n.textContent=`⚠️ ${note}`;card.querySelector('div')?.appendChild(n);
    });
  }

  let refreshTimer=0;
  function scheduleFinalRefresh(delay=110){clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>{try{refreshAutopilot();}catch(err){console.error('GoMo v2.40 refresh',err);}},delay);}

  // Wrap renderers after v2.31/v2.32 so the final status always wins.
  const prevRenderAll=renderAll;
  renderAll=function(){prevRenderAll();scheduleFinalRefresh(20);};
  const prevRenderSimplePoints=renderSimplePoints;
  renderSimplePoints=function(){prevRenderSimplePoints();scheduleFinalRefresh(20);};
  const prevRenderUltraPlanList=renderUltraPlanList;
  renderUltraPlanList=function(plan){prevRenderUltraPlanList(plan);scheduleFinalRefresh(20);};

  // Manual-entry fallback.
  document.addEventListener('input',e=>{
    const input=e.target.closest?.('.gomo-v240-manual-input');if(!input)return;
    state.inventory[input.dataset.v240Stock]=Math.max(0,Number(input.value||0));
    invalidatePlan();saveState();renderSummary();renderSimplePoints();scheduleFinalRefresh();
  });

  // Calibration.
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('#gomoV240ChangeCal');if(!b)return;
    e.preventDefault();const panel=ensureCalibrationPanel();if(panel){panel.dataset.forceOpen='1';panel.classList.remove('hidden');panel.scrollIntoView({behavior:'smooth',block:'start'});}
  });
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('[data-v240-cal]');if(!b)return;
    e.preventDefault();saveCalibration(Number(b.dataset.v240Cal));
  });
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('#gomoV240CalSave');if(!b)return;
    e.preventDefault();const input=document.getElementById('gomoV240CalOther'),v=Number(input?.value||0);
    if(v<=0){input?.focus();return;}saveCalibration(v);
  });

  // Explicit advanced-profile changes also update the calibration value.
  document.addEventListener('change',e=>{
    if(!e.target.closest?.('#pointProfileSelect'))return;
    const p=String(state.profile.pointProfile||'');
    const v=p==='base'?50:p==='standard'?125:p==='advanced'?150:50*(1+Math.max(0,Number(state.profile.bonusPct||0))/100);
    state.v240Calibration={confirmed:true,speedupPoints:v,confirmedAt:new Date().toISOString()};
    saveState();scheduleFinalRefresh();
  });
  document.addEventListener('input',e=>{
    if(!e.target.closest?.('#bonusPct')||String(state.profile.pointProfile)!=='custom')return;
    const v=50*(1+Math.max(0,Number(state.profile.bonusPct||0))/100);
    state.v240Calibration={confirmed:true,speedupPoints:v,confirmedAt:new Date().toISOString()};
    saveState();scheduleFinalRefresh();
  });

  // Remember an explicit opt-in before ever using troop-loss rows automatically.
  document.addEventListener('change',e=>{
    const toggle=e.target.closest?.('[data-simple-resource-toggle]');if(!toggle)return;
    const id=toggle.closest?.('[data-simple-point-item]')?.dataset.simplePointItem;if(!/^lostT\d+$/.test(String(id||'')))return;
    if(!state.v240LossOptIn)state.v240LossOptIn={};state.v240LossOptIn[id]=Boolean(toggle.checked);saveState();scheduleFinalRefresh();
  });
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('[data-simple-choice]');if(!b)return;
    const id=b.closest?.('[data-simple-point-item]')?.dataset.simplePointItem;if(!/^lostT\d+$/.test(String(id||'')))return;
    if(!state.v240LossOptIn)state.v240LossOptIn={};state.v240LossOptIn[id]=b.dataset.simpleChoice!=='exclude';saveState();scheduleFinalRefresh();
  });

  // Safe final apply: intercept original "apply" listener and require real-score verification afterwards.
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('#simpleApplyBtn');if(!b)return;
    const s=finalStatus(),plan=s.plan;
    if(s.kind!=='ready'){
      e.preventDefault();e.stopImmediatePropagation();
      const m=s.kind==='calibrate'?ft().needCalibration:s.kind==='wrongDay'?ft().needDay:s.kind==='review'?ft().needReview:s.kind==='verify'?ft().needVerify:s.kind==='done'?ft().allDone:ft().needMore;
      showToast(m);scheduleFinalRefresh();return;
    }
    e.preventDefault();e.stopImmediatePropagation();
    confirmAction(ft().confirmUseTitle,ft().confirmUseBody,()=>{
      for(const step of plan.steps)state.inventory[step.stockKey]=Math.max(0,Number(state.inventory[step.stockKey]||0)-Number(step.qty||0));
      state.currentPoints[plan.dayId]=Math.floor(plan.finalPoints);
      try{syncSnapshotAfterPlan(plan);}catch{}
      state.planAdjustments[String(plan.dayId)]={fixed:{},excluded:{}};
      setSaturdayLossDefaults();
      state.v240PendingVerification={dayId:Number(plan.dayId),estimated:Math.floor(plan.finalPoints),minimum:minimumGoal(),usedAt:new Date().toISOString()};
      invalidatePlan();saveState();renderAll();showToast(ft().appliedVerify);
      setTimeout(()=>document.getElementById('gomoV240Verify')?.scrollIntoView({behavior:'smooth',block:'start'}),80);
    });
  },true);

  // Verification after real game action.
  document.addEventListener('click',e=>{
    const yes=e.target.closest?.('#gomoV240VerifyYes');if(!yes)return;
    e.preventDefault();
    const p=state.v240PendingVerification;if(!p)return;
    state.currentPoints[Number(p.dayId)]=Math.max(minimumGoal(),Number(p.estimated||0));
    delete state.v240PendingVerification;invalidatePlan();saveState();renderAll();showToast(ft().actualSaved);
  });
  document.addEventListener('click',e=>{
    const save=e.target.closest?.('#gomoV240ActualSave');if(!save)return;
    e.preventDefault();const p=state.v240PendingVerification,input=document.getElementById('gomoV240ActualScore');if(!p||!input)return;
    state.currentPoints[Number(p.dayId)]=Math.max(0,Number(input.value||0));
    delete state.v240PendingVerification;invalidatePlan();saveState();renderAll();showToast(ft().actualSaved);
  });

  // If the user edits today's score through the existing editor, that real value supersedes a pending estimate.
  document.addEventListener('click',e=>{
    if(!e.target.closest?.('#simpleSavePointsBtn'))return;
    setTimeout(()=>{
      if(state.v240PendingVerification&&Number(state.v240PendingVerification.dayId)===Number(state.selectedDay)){
        delete state.v240PendingVerification;saveState();renderAll();
      }
    },30);
  });

  // Deterministic "I am lost" next action (final override).
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('#smartHelpBtn');if(!b)return;
    e.preventDefault();e.stopImmediatePropagation();
    const s=finalStatus(),t=ft();let msg=t.needPhoto,target='simplePhotoStep';
    if(s.kind==='done'){msg=t.allDone;target='gomoAutopilotPanel';}
    else if(s.kind==='verify'){msg=t.needVerify;target='gomoV240Verify';}
    else if(s.kind==='calibrate'){msg=t.needCalibration;target='gomoV240Calibration';}
    else if(s.kind==='wrongDay'){msg=t.needDay;target='simpleDayStep';}
    else if(s.kind==='review'){msg=t.needReview;target='simplePhotoStep';}
    else if(s.kind==='ready'){msg=t.needPlan;target='simplePointsPanel';}
    else if(usefulPotential()>0){msg=t.needMore;target='gomoV240Manual';}
    const modal=document.getElementById('smartHelpModal');if(!modal)return;
    document.getElementById('smartHelpTitle').textContent=t.nextTitle;document.getElementById('smartHelpMessage').textContent=msg;
    const action=document.getElementById('smartHelpAction');action.textContent=t.gotIt;action.dataset.v240Target=target;
    document.getElementById('smartHelpClose').textContent=t.gotIt;modal.classList.remove('hidden');
  },true);
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('#smartHelpAction[data-v240-target]');if(!b)return;
    e.preventDefault();e.stopImmediatePropagation();document.getElementById('smartHelpModal')?.classList.add('hidden');
    document.getElementById(b.dataset.v240Target)?.scrollIntoView({behavior:'smooth',block:'start'});delete b.dataset.v240Target;
  },true);

  // Re-check the VS week whenever the app comes back to the foreground.
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)return;
    if(migrateAndRollWeek()){try{renderAll();}catch{}}
    scheduleFinalRefresh(120);
  });
  if(typeof window!=='undefined')window.addEventListener('focus',()=>{
    if(migrateAndRollWeek()){try{renderAll();}catch{}}
    scheduleFinalRefresh(120);
  });

  // Reapply final UI after older delayed handlers.
  document.addEventListener('change',()=>scheduleFinalRefresh(140));
  document.addEventListener('input',e=>{if(!e.target.closest?.('.gomo-v240-manual-input'))scheduleFinalRefresh(160);});
  document.addEventListener('click',()=>scheduleFinalRefresh(170));

  ensureStyles();ensureVersion();ensureCalibrationPanel();ensureCalibrationSettingsButton();ensureManualPanel();ensureVerifyPanel();
  scheduleFinalRefresh(220);
})();
