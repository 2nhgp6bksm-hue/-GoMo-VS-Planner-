'use strict';

/* GoMo VS Planner v2.30 add-on
   - Portuguese (pt-PT) across the full UI
   - Portuguese OCR language/aliases and duration parsing
   - Smaller default safety margin (100k) for brand-new installs only
   - Saving-week warning when the plan must consume protected resources
*/
(() => {
  const hadSavedState = Boolean(localStorage.getItem(STORAGE_KEY));

  LANGS.pt = 'Português';
  LOCALES.pt = 'pt-PT';

  COVER_TEXT.pt = {
    goal:'OBJETIVO', value:'7,2 M',
    days:['SEGUNDA — RADAR','TERÇA — BASE','QUARTA — CIÊNCIA','QUINTA — HERÓIS','SEXTA — MOBILIZAÇÃO','SÁBADO — INIMIGO']
  };

  EXP_ONLY_TEXT.pt = {
    title:'O plano utiliza apenas a tua EXP de Herói',
    question:'Isso é adequado para ti?',
    yes:'Sim, usar a EXP',
    no:'Não, propor outros recursos'
  };

  MULTI_RESOURCE_TEXT.pt = {
    title:'Escolhe os recursos a utilizar',
    help:'Seleciona vários recursos e ajusta as quantidades com − e +.',
    selected:'Utilizar', minus:'Diminuir', plus:'Aumentar'
  };

  WORKFLOW_TEXT.pt = {
    flowResources:'Recursos', stepThree:'ETAPA 3',
    chooseTitle:'Escolhe os recursos a utilizar',
    chooseHelp:'Seleciona vários recursos e ajusta as quantidades com − e +.',
    stepFour:'ETAPA 4', validate:'Confirmar', reject:'Não, alterar'
  };

  SMART_HELP_TEXT.pt = {
    button:'🤔 Não sei o que fazer', title:'Aqui está o próximo passo',
    noInventory:'Primeiro adiciona capturas nítidas do teu inventário. O site lê automaticamente as quantidades.',
    missing:'O plano ainda não atinge o objetivo. Na etapa 3, seleciona outros recursos ou aumenta uma quantidade com +.',
    ready:'O teu plano está pronto. Na etapa 4, usa no jogo os recursos indicados e depois carrega em « Confirmar ».',
    reached:'O teu objetivo já foi atingido. Não precisas de utilizar mais recursos.',
    photos:'Ir para as capturas', resources:'Escolher recursos', plan:'Ver o plano', close:'Fechar'
  };

  MINI_INFO_TEXT.pt = {
    close:'Entendi', dayTitle:'Escolher o dia',
    day:'Confirma o dia VS apresentado. Se estiver errado, carrega em « Alterar o dia » e escolhe o dia correto.',
    photosTitle:'Adicionar capturas',
    photos:'Adiciona capturas nítidas do inventário, com os nomes e as quantidades visíveis. O site tentará lê-las automaticamente.',
    resourcesTitle:'Escolher recursos',
    resources:'Seleciona os recursos que aceitas utilizar. Ajusta cada quantidade com − e +. Mantém o botão premido para fazer os números avançarem.',
    planTitle:'Confirmar o plano',
    plan:'Utiliza no Last War as quantidades indicadas e depois carrega em « Confirmar ». O inventário e os pontos serão atualizados.'
  };

  ECONOMY_WEEK_TEXT.pt = {
    title:'Semana de economia',
    help:'Guardar os recursos importantes e atingir 7,2 M.',
    on:'Ativada', off:'Desativada',
    toastOn:'Semana de economia ativada: os recursos importantes estão protegidos.',
    toastOff:'Semana de economia desativada.'
  };

  PROFILE_TEXT.pt = {
    label:'Perfil de pontos VS',
    base:'Valores base do jogo',
    standard:'Árvore VS principal concluída',
    advanced:'Valores verificados nas tuas capturas',
    custom:'Bónus personalizado',
    baseHelp:'Valores sem bónus de investigação.',
    standardHelp:'Aplica o bónus global do Duelo de Alianças e os bónus de categoria. Recomendado para uma árvore VS principal concluída.',
    advancedHelp:'Utiliza os valores exatos apresentados nas tuas capturas do Duelo de Alianças.',
    customHelp:'Aplica apenas a percentagem indicada nas definições avançadas.'
  };

  OCR_TEXT.pt = {
    scanner:'Capturas', scannerEyebrow:'LEITURA AUTOMÁTICA', scannerTitle:'Importar as capturas do jogador',
    scannerIntro:'Escolhe uma ou mais capturas do Last War. O site lê os números, propõe os recursos correspondentes e permite verificar tudo antes do cálculo.',
    scanDay:'Dia analisado', importScreenshots:'Escolher capturas', takePhoto:'Tirar uma fotografia', startReading:'Repetir a leitura', clearScreenshots:'Apagar capturas',
    firstScanNote:'A primeira leitura precisa de Internet para carregar o motor OCR livre. As leituras seguintes ficam em cache no navegador.',
    privacyTitle:'PRIVACIDADE', privacyText:'As imagens são analisadas no navegador. O site não as envia para uma base de dados e não as guarda depois de fechar ou atualizar a página.',
    reviewEyebrow:'VERIFICAÇÃO', reviewTitle:'Valores reconhecidos', reviewIntro:'Verifica cada linha. Corrige o valor ou escolhe o recurso certo quando o reconhecimento não for seguro.',
    replaceValues:'Substituir os stocks atuais', addValues:'Adicionar aos stocks atuais', applyValues:'Confirmar e calcular os meus 7,2 M', rawText:'Ver o texto bruto reconhecido',
    currentScore:'Pontos já obtidos hoje', ignore:'Não utilizar', targetField:'Recurso', detectedValue:'Valor', source:'Captura e texto reconhecido', confidence:'Confiança',
    reading:'Leitura em curso', preparing:'Preparação das imagens', loadingEngine:'A carregar o motor OCR', readingImage:'Leitura da captura {current}/{total}', done:'Leitura concluída',
    filesSelected:'{count} captura(s) pronta(s)', noScreenshot:'Escolhe pelo menos uma captura.', ocrUnavailable:'Não foi possível carregar o motor OCR. Verifica a ligação à Internet e tenta novamente.',
    ocrFailed:'Não foi possível ler esta captura.', noDetectedValue:'Não foi reconhecido nenhum valor utilizável. Tenta uma captura mais nítida ou recortada.', detectedCount:'{count} valor(es) proposto(s)',
    high:'Alta', medium:'Média', low:'Baixa', confirmApplyScanTitle:'Aplicar os valores reconhecidos?',
    confirmApplyScanMessage:'As linhas selecionadas vão alterar os stocks do dia escolhido. Ainda poderás corrigi-los depois.',
    scanApplied:'Plano calculado automaticamente', scanCleared:'Capturas apagadas', applyNothing:'Nenhuma linha válida está selecionada.', screenshot:'Captura'
  };

  SIMPLE_TEXT.pt = {
    assistantNav:'Modo simples', step1:'Escolhe o dia', step1Text:'O dia VS correto é sugerido automaticamente.',
    step2:'Adiciona capturas', step2Text:'Sem introdução manual demorada.', step3:'Recebe o teu plano', step3Text:'O site procura 7,2 M com uma pequena margem.',
    chooseDay:'DIA VS', simpleMode:'MODO SIMPLES', assistantTitle:'Adiciona as capturas e o site faz o resto',
    assistantIntro:'Escolhe capturas do teu inventário. O site lê os valores e prepara diretamente uma proposta automática para atingir 7,2 M.',
    targetWithMargin:'Objetivo com margem', photoHelp:'Adiciona capturas onde as quantidades estejam bem visíveis. A leitura começa automaticamente.',
    quickReviewTitle:'Detalhes da leitura', quickReviewIntro:'Esta parte fica escondida no modo simples. Usa a introdução manual apenas se um valor reconhecido parecer incorreto.',
    yourPlan:'PLANO RECOMENDADO', privacyAndInternet:'Privacidade e primeira leitura', manualMode:'MODO MANUAL',
    manualTitle:'Introdução manual e definições avançadas', manualIntro:'Esta secção continua disponível para corrigir com precisão os stocks, reservas, valores de pontos ou bónus.'
  };

  ULTRA_TEXT.pt = {
    modeLabel:'MODO ULTRA SIMPLES', welcomeTitle:'Apenas 3 etapas', welcomeText:'Escolhe o dia, adiciona as capturas e segue o plano. Todo o resto é automático.',
    flowDay:'Dia', flowPhotos:'Capturas', flowPlan:'Plano', stepOne:'ETAPA 1', chooseDayTitle:'Confirma o dia VS', changeDay:'Alterar o dia',
    stepTwo:'ETAPA 2', addPhotosTitle:'Adiciona as capturas do teu inventário', addPhotosText:'Assim que adicionares as imagens, a leitura e o cálculo começam automaticamente.',
    addScreenshots:'Adicionar as minhas capturas', photoTip:'Dica: usa capturas nítidas com as quantidades totalmente visíveis. Para a EXP, se não tiveres cofre, adiciona o ecrã de um herói onde apareça a EXP disponível.',
    optionalSettings:'Opções facultativas', stepThree:'ETAPA 3', planTitle:'Segue simplesmente este plano', planText:'Escolhe os recursos para atingir o objetivo.',
    emptyPlan:'Adiciona capturas para receber automaticamente a lista exata dos recursos a utilizar.', actionNumber:'Ação {number}', pointsAdded:'{points} pontos',
    usedHelp:'Depois de utilizares toda a lista no jogo, carrega no botão abaixo.', usedButton:'Utilizei estes recursos', adjustPlanOptional:'Alterar o plano (facultativo)'
  };

  ADJUST_TEXT.pt = {
    title:'AJUSTAR O PLANO', intro:'Altera uma quantidade com – / + ou introduz diretamente o valor. O resto é recalculado automaticamente para ficar acima de 7,2 M com a margem incluída.',
    planned:'Quantidade prevista', pointsValue:'Valor no jogo', resourcePoints:'Pontos previstos', available:'Máximo disponível', automatic:'Automático', manual:'Definido manualmente',
    disabled:'Não utilizado', exclude:'Não utilizar', include:'Voltar a utilizar', reset:'Voltar ao cálculo automático', noAvailable:'Nenhum recurso disponível para este dia.',
    adjusted:'Plano recalculado', baseValues:'Valores base do jogo · bónus VS aplicado automaticamente'
  };

  AUTO_PLAN_TEXT.pt = {
    eyebrow:'PROPOSTA AUTOMÁTICA', title:'O programa escolhe por ti',
    intro:'A partir do teu inventário, o site escolhe automaticamente os recursos e as quantidades necessários para atingir 7,2 M com a margem. Para cada proposta, escolhe apenas: não utilizar, diminuir, manter ou aumentar.',
    alreadyDone:'Já obtido', proposedPoints:'Pontos propostos', finalTotal:'Total final', maximumToday:'Máximo possível', recalculate:'Refazer a proposta automática', showRecap:'Ver resumo',
    acceptHelp:'Quando o total estiver bom para ti, aceita o plano. Os recursos serão então retirados do inventário.', acceptPlan:'Aceito este plano', targetReached:'Objetivo atingido', targetMissing:'Faltam {points} pontos',
    proposedQty:'Quantidade escolhida', baseQty:'Proposta inicial: {qty}', resourcePoints:'Pontos obtidos', available:'Disponível: {qty}', doNotUse:'Não utilizar', decrease:'Diminuir', keep:'Manter', increase:'Aumentar',
    statusAutomatic:'Proposta', statusLower:'Diminuído', statusHigher:'Aumentado', statusOff:'Recusado', noPlan:'Nenhum recurso é necessário ou nenhum stock foi reconhecido para este dia.',
    scanComplete:'LEITURA CONCLUÍDA', proposalReady:'A tua proposta está pronta', scanSummary:'{count} recurso(s) reconhecido(s). O site escolheu automaticamente o que utilizar para atingir o objetivo.',
    scanSummaryPoints:' Também foram detetados {points} pontos utilizados desde a fotografia anterior.', scanBadge:'Automático', automaticReady:'Nova proposta automática calculada.',
    choiceUpdated:'O resto do plano foi recalculado automaticamente.', confirmTitle:'Aceitar esta proposta?', confirmMessage:'Serão adicionados {points} pontos e as quantidades escolhidas serão retiradas do stock.',
    applied:'Plano aceite: {points} pontos adicionados.', recapPlayer:'Jogador', recapDay:'Dia VS', recapGoal:'Objetivo com margem', recapCurrent:'Já obtido', recapSelected:'Recursos propostos',
    recapFinal:'Total final', recapResource:'Recurso', recapQuantity:'Quantidade', recapPoints:'Pontos', recapMargin:'Margem acima do objetivo', recapMissing:'Pontos ainda em falta', recapNoSelection:'Nenhum recurso proposto.'
  };

  SCORE_EDIT_TEXT.pt = {edit:'✏️ Alterar', save:'Confirmar', input:'Pontos já obtidos'};

  INVENTORY_TEXT.pt = {
    trackingEyebrow:'INVENTÁRIO INTELIGENTE', trackingTitle:'Pontos disponíveis no teu inventário', trackingIntro:'O VS Planner atribui os pontos do dia a cada recurso e compara a próxima fotografia com a última referência.',
    totalInventory:'Total possuído', usableInventory:'Utilizável após reservas', lastReference:'Última fotografia de referência', noReference:'Nenhuma referência guardada', lastDetected:'Última utilização detetada',
    saveReference:'Guardar o stock atual como referência', clearReference:'Apagar a referência do dia', firstReferenceSaved:'Primeira referência guardada. A próxima fotografia será comparada automaticamente.',
    firstReferenceConfirm:'Ainda não existe referência para este dia. Os valores verificados tornar-se-ão a primeira referência de comparação.', referenceSaved:'Inventário atual guardado como nova referência.',
    clearReferenceTitle:'Apagar a referência deste dia?', clearReferenceMessage:'A próxima fotografia tornar-se-á uma nova primeira referência. O stock e os pontos já obtidos não serão apagados.', referenceCleared:'Referência do dia apagada.',
    compareEyebrow:'COMPARAÇÃO AUTOMÁTICA', compareTitle:'Recursos utilizados desde a última fotografia', compareIntro:'Verifica as diferenças detetadas. Podes corrigir a quantidade utilizada antes de confirmar.',
    detectedPoints:'Pontos detetados', oldStock:'Stock anterior', newStock:'Novo stock', usedQty:'Quantidade utilizada', resourcePoints:'Pontos correspondentes', confirmConsumption:'Confirmar e adicionar pontos',
    referenceOnly:'Atualizar sem adicionar pontos', cancelComparison:'Cancelar', comparisonApplied:'Utilização confirmada: {points} pontos adicionados.', referenceUpdated:'Nova referência guardada sem adicionar pontos.',
    historyTitle:'Últimas atualizações', noHistory:'Nenhuma utilização registada para este dia.', baselineEntry:'Referência do inventário', comparisonEntry:'Fotografia comparada', planEntry:'Plano marcado como utilizado',
    resourcesChanged:'{count} recurso(s)', restocked:'Recursos recebidos ou aumentos de stock não são contados como gastos.', partialScanNote:'Apenas os recursos reconhecidos na nova fotografia são comparados.',
    photoScoreUsed:'A pontuação reconhecida na fotografia torna-se o total do dia para evitar contar os mesmos pontos duas vezes.', manualPointsUsed:'Sem uma pontuação total reconhecida, os pontos dos recursos consumidos são adicionados automaticamente.',
    noConsumption:'Não foi detetada nenhuma diminuição de stock. Ainda assim podes guardar esta fotografia como nova referência.', referenceNow:'Agora'
  };

  POINT_BOX_TEXT.pt = {
    eyebrow:'CÁLCULO MUITO SIMPLES', title:'Escolhe os recursos com − e +', intro:'Cada cartão mostra o valor total do recurso. O plano automático prepara 7,2 M com a margem e depois podes diminuir ou aumentar as quantidades.',
    resourceTotal:'Pontos de todos os teus recursos', maximumToday:'Máximo possível hoje', selectedPoints:'Pontos escolhidos', finalTotal:'Vais chegar a', autoPlan:'Preparar automaticamente 7,2 M', zero:'Voltar tudo a zero',
    stockTotal:'Total deste recurso', usableTotal:'Disponível após a reserva', quantityToUse:'Quantidade a utilizar', chosenResourcePoints:'Pontos adicionados', keptResourcePoints:'Pontos guardados', apply:'Confirmar os recursos utilizados',
    noStock:'Primeiro adiciona uma captura ou introduz os recursos em « Introdução manual ».', targetReached:'Objetivo atingido', targetMissing:'Ainda faltam {points} pontos', currentIncluded:'Os pontos já obtidos hoje estão incluídos no total.',
    confirmTitle:'Confirmar esta utilização?', confirmMessage:'Os recursos selecionados serão retirados do stock e {points} pontos serão adicionados ao resultado de hoje.', applied:'Recursos utilizados: {points} pontos adicionados.',
    automaticReady:'Plano automático preparado.', zeroed:'Todas as quantidades voltaram a zero.', availableQty:'Disponível: {qty}', reservedQty:'Reserva protegida: {qty}', showRecap:'Ver o resumo dos 7,2 M',
    recapEyebrow:'PLANO A UTILIZAR', recapTitle:'Resumo para atingir 7,2 M', recapHelp:'Esta página não cria uma fotografia. Mostra o plano completo para poderes fazer uma captura de ecrã no telemóvel.',
    recapPlayer:'Jogador', recapDay:'Dia VS', recapGoal:'Objetivo com margem', recapCurrent:'Já obtido', recapResource:'Recurso a utilizar', recapQuantity:'Quantidade', recapUnitPoints:'Pontos por unidade', recapPoints:'Pontos obtidos',
    recapSelected:'Total dos recursos', recapFinal:'Total após utilização', recapMargin:'Margem acima do objetivo', recapMissing:'Pontos ainda em falta', recapNoSelection:'Nenhum recurso selecionado. Primeiro prepara o plano automático.', closeRecap:'Fechar o resumo'
  };

  TEXT.pt = {
    heroCopy:'Calcula o que utilizar para atingir pelo menos 7,2 M com uma pequena margem, sem desperdiçar recursos.', language:'Idioma', autoSave:'Gravação automática ativa', saved:'Guardado',
    calculator:'Introdução manual', weekGuide:'Guia semanal', settings:'Definições', player:'Jogador', playerPlaceholder:'Nome do jogador', minimumTarget:'Objetivo mínimo', safetyMargin:'Margem de segurança',
    vsBonus:'Bónus de investigação VS', automaticDay:'Escolher automaticamente o dia VS', nextDay:'Dia seguinte', recommendedTarget:'Objetivo recomendado', alreadyEarned:'Já obtido', stillNeeded:'Ainda necessário',
    availablePotential:'Potencial disponível', useToday:'Utilizar hoje', saveForLater:'Guardar para mais tarde', pointsToday:'Pontos já obtidos hoje', strategy:'Estratégia', speedLimit:'Limite de aceleradores por cálculo', daysUnit:'dias',
    playerStock:'STOCK DO JOGADOR', availableResources:'Recursos disponíveis', clearDay:'Apagar as quantidades do dia', editablePointsWarning:'Os valores dos pontos podem ser alterados. Confirma-os no jogo se as regras ou os bónus mudarem.',
    calculatePlan:'Calcular o meu plano', automaticExample:'Exemplo automático', automaticDebrief:'RESUMO AUTOMÁTICO', markUsed:'Marcar este plano como utilizado', copyDebrief:'Copiar o resumo',
    mainRule:'REGRA PRINCIPAL', rightResourceRightDay:'Utilizar cada recurso no dia certo', guideIntro:'O site procura o objetivo escolhido, adiciona a margem de segurança e protege as reservas. Depois de atingir o objetivo, recomenda guardar o resto.',
    backup:'CÓPIA DE SEGURANÇA', savedOnDevice:'Dados guardados neste dispositivo', storageInfo:'Stocks, reservas, valores de pontos e definições ficam no navegador. Não é necessária conta, créditos ou base de dados externa.',
    exportBackup:'Exportar cópia', importBackup:'Importar cópia', pointValues:'VALORES DOS PONTOS', editableValues:'Valores alteráveis', pointInfo:'O bónus VS é aplicado automaticamente. Altera um valor se o jogo apresentar outro número.',
    restoreBaseValues:'Restaurar valores base', addHomeScreen:'Adicionar ao ecrã principal', iphoneInfo:'No Safari: Partilhar e depois « Adicionar ao ecrã principal ». O site abrirá como uma aplicação e poderá funcionar offline.',
    reset:'REINICIALIZAÇÃO', eraseAllData:'Apagar todos os dados', resetInfo:'Apaga os stocks, reservas, resultados e definições guardados neste dispositivo.', fullReset:'Reinicializar completamente', cancel:'Cancelar', confirm:'Confirmar',
    day:'DIA', stock:'Stock', reserve:'Reserva', pointsPerUnit:'Pontos por unidade', unit:'Unidade', usable:'Utilizável', potential:'Potencial', strategyEconomy:'Economia máxima', strategyPrudent:'Modo prudente',
    strategyProgress:'Progressão máxima', strategyScore:'Pontuação VS elevada', helpEconomy:'Protege os recursos raros e utiliza primeiro os recursos eficazes e fáceis de substituir.', helpPrudent:'Reforça a proteção do stock e evita aproximar-se demasiado das reservas.',
    helpProgress:'Dá prioridade às ações que melhoram realmente a conta.', helpScore:'Dá prioridade às ações que dão mais pontos rapidamente.', goalReached:'Objetivo atingido', stockInsufficient:'Stock insuficiente', pointsAdded:'Pontos adicionados',
    estimatedTotal:'Total estimado', realMargin:'Margem real', missingPoints:'Pontos em falta', use:'Utilizar', about:'cerca de', points:'pontos', remainingStock:'Stock restante', noResourceNeeded:'Não é necessário nenhum recurso adicional. O objetivo já foi atingido.',
    reachedNote:'Objetivo atingido. Para de gastar e guarda o resto para a próxima semana, salvo indicação contrária da aliança.', missingNote:'Com o stock introduzido e as reservas protegidas, ainda faltam {points} pontos.', planCalculated:'Plano calculado',
    demoAdded:'Exemplo adicionado. Podes iniciar o cálculo.', confirmApplyTitle:'Marcar este plano como utilizado?', confirmApplyMessage:'As quantidades serão retiradas do stock e os pontos estimados serão adicionados ao total do dia.', planApplied:'Stock e pontos atualizados.',
    confirmClearTitle:'Apagar as quantidades do dia?', confirmClearMessage:'As reservas e os valores dos pontos serão mantidos.', cleared:'Quantidades apagadas.', confirmRestoreTitle:'Restaurar os valores base?', confirmRestoreMessage:'Todas as alterações manuais dos pontos serão eliminadas.',
    restored:'Valores restaurados.', confirmResetTitle:'Reinicializar tudo?', confirmResetMessage:'Todos os dados guardados serão apagados. Sem uma cópia exportada, esta ação é irreversível.', resetDone:'Todos os dados foram apagados.', backupExported:'Cópia exportada.',
    confirmImportTitle:'Importar esta cópia?', confirmImportMessage:'Os dados atuais serão substituídos pelos dados do ficheiro escolhido.', backupImported:'Cópia importada.', invalidBackup:'O ficheiro escolhido não é uma cópia válida.', debriefCopied:'Resumo copiado.',
    copyFailed:'Não é possível copiar neste navegador.', plan:'Plano recomendado', advice:'Conselho', currentPointsLabel:'Pontos já obtidos', objectiveLabel:'Objetivo', estimatedTotalLabel:'Total estimado', keepAdvice:'Guarda o stock restante e as reservas para a próxima semana.',
    hours:'h', minutes:'min', noAction:'Não é necessária nenhuma ação adicional.'
  };

  DAY_TEXT.pt = [
    {short:'Seg.',label:'Radar',title:'Segunda · Treino de radar',description:'Dia ideal para radares, energia, recursos recolhidos e melhorias do drone.',use:'Radares preparados no domingo, energia, dados e peças de drone, cofres de chips e recolha.',save:'Aceleradores de construção, investigação e treino, medalhas de bravura, fragmentos e bilhetes de heróis.'},
    {short:'Ter.',label:'Base',title:'Terça · Expansão da base',description:'Dia para construção, edifícios concluídos, camiões UR, missões secretas e sobreviventes.',use:'Grandes construções, aceleradores de construção, poder de edifício, camiões UR, missões lendárias e bilhetes de sobreviventes.',save:'Investigação para quarta, recursos de heróis para quinta, treino e aceleradores universais para sexta.'},
    {short:'Qua.',label:'Ciência',title:'Quarta · Era da ciência',description:'Dia de investigação, medalhas de bravura e componentes do drone.',use:'Investigações longas, aceleradores de investigação, poder tecnológico, medalhas e componentes do drone.',save:'Fragmentos, EXP, medalhas e bilhetes de heróis para quinta; treino e universais para sexta.'},
    {short:'Qui.',label:'Heróis',title:'Quinta · Treinar heróis',description:'Dia de recrutamento, EXP, fragmentos, medalhas de habilidade e armas exclusivas.',use:'Bilhetes de heróis, EXP, fragmentos UR/SSR/R, medalhas e fragmentos de arma exclusiva.',save:'Aceleradores de treino, construção, investigação e universais para sexta.'},
    {short:'Sex.',label:'Mobilização',title:'Sexta · Mobilização total',description:'Principal dia de aceleradores e treino. Guarda os universais para completar com precisão.',use:'Aceleradores úteis, poder de edifício/tecnologia, treino de tropas e radares restantes.',save:'Guarda as reservas protegidas. Prepara escudos e cura para sábado.'},
    {short:'Sáb.',label:'Combate',title:'Sábado · Destruição do inimigo',description:'Dia de combate. Os alvos da aliança rival valem mais pontos. O cálculo continua a ser uma estimativa.',use:'Camiões UR, missões lendárias, cura, aceleradores restantes e combates coordenados.',save:'Apenas as reservas pessoais que definiste.'}
  ];

  LABELS.pt = {
    staminaUsed:'Energia utilizada', radarTasks:'Missões de radar concluídas', heroExp:'EXP de Herói utilizada', droneData:'Dados de combate do drone', droneParts:'Peças de drone',
    foodHarvest:'Alimentos recolhidos', ironHarvest:'Ferro recolhido', coinHarvest:'Moedas recolhidas', skillChipPoints:'Pontos de chip de habilidade do drone obtidos', skillChipPremium:'Cofres premium de chip abertos',
    packDiamonds:'Diamantes obtidos em pacotes', constructionSpeed:'Aceleradores de construção', universalSpeed:'Aceleradores universais', buildingPower:'Poder de edifício previsto', urTrucks:'Camiões comerciais UR',
    legendTasks:'Missões secretas UR', survivorRecruit:'Bilhetes de recrutamento de sobreviventes', researchSpeed:'Aceleradores de investigação', techPower:'Poder tecnológico previsto', valorBadges:'Medalhas de bravura',
    droneChest:'Cofres de componente de drone nível {n}', eliteTickets:'Bilhetes de recrutamento de heróis', urShards:'Fragmentos de herói UR', ssrShards:'Fragmentos de herói SSR', rareShards:'Fragmentos de herói R',
    skillMedals:'Medalhas de habilidade', weaponShards:'Fragmentos de arma exclusiva', trainingSpeed:'Aceleradores de treino', healingSpeed:'Aceleradores de cura', trainedTroops:'Tropas nível {n} treinadas',
    rivalKilled:'Tropas VS rivais nível {n} eliminadas', otherKilled:'Outras tropas nível {n} eliminadas', lostTroops:'As tuas tropas nível {n} perdidas'
  };

  UNITS.pt = {
    stamina:'ponto(s) de energia', mission:'missão(ões)', exp:'EXP', data:'dados', part:'peça(s)', lot100:'lote(s) de 100', lot60:'lote(s) de 60', chip:'ponto(s) de chip',
    minute:'minuto(s)', power:'ponto(s) de poder', truck:'camião(ões)', recruit:'recrutamento(s)', badge:'medalha(s)', chest:'cofre(s)', ticket:'bilhete(s)', shard:'fragmento(s)',
    medal:'medalha(s)', troop:'tropa(s)', diamond:'diamante(s)'
  };

  QUALIFICATION_TEXT.pt = {
    urTrucks:'Conta apenas os camiões comerciais UR realmente enviados. Camiões de outra qualidade dão 0 pontos aqui.',
    legendTasks:'Conta apenas as missões secretas UR realmente aceites. Missões de outra qualidade dão 0 pontos aqui.'
  };

  OCR_LANGUAGE_CODES.pt = ['por','eng'];
  Object.assign(OCR_EXTRA_ALIASES, {
    urTrucks:[...(OCR_EXTRA_ALIASES.urTrucks||[]),'camiao comercial ur','camioes comerciais ur','caminhao comercial ur','caminhoes comerciais ur'],
    legendTasks:[...(OCR_EXTRA_ALIASES.legendTasks||[]),'missao secreta ur','missoes secretas ur','missao lendaria','missoes lendarias'],
    universalSpeed:[...(OCR_EXTRA_ALIASES.universalSpeed||[]),'acelerador universal','aceleradores universais'],
    constructionSpeed:[...(OCR_EXTRA_ALIASES.constructionSpeed||[]),'acelerador de construcao','aceleradores de construcao'],
    researchSpeed:[...(OCR_EXTRA_ALIASES.researchSpeed||[]),'acelerador de investigacao','aceleradores de investigacao','acelerador de pesquisa','aceleradores de pesquisa'],
    trainingSpeed:[...(OCR_EXTRA_ALIASES.trainingSpeed||[]),'acelerador de treino','aceleradores de treino','acelerador de treinamento','aceleradores de treinamento'],
    healingSpeed:[...(OCR_EXTRA_ALIASES.healingSpeed||[]),'acelerador de cura','aceleradores de cura'],
    heroExp:[...(OCR_EXTRA_ALIASES.heroExp||[]),'exp de heroi','exp de herois'],
    droneData:[...(OCR_EXTRA_ALIASES.droneData||[]),'dados de combate do drone','dados do drone'],
    droneParts:[...(OCR_EXTRA_ALIASES.droneParts||[]),'pecas de drone','peca de drone'],
    valorBadges:[...(OCR_EXTRA_ALIASES.valorBadges||[]),'medalha de bravura','medalhas de bravura'],
    skillMedals:[...(OCR_EXTRA_ALIASES.skillMedals||[]),'medalha de habilidade','medalhas de habilidade'],
    eliteTickets:[...(OCR_EXTRA_ALIASES.eliteTickets||[]),'bilhete de recrutamento de heroi','bilhetes de recrutamento de herois'],
    survivorRecruit:[...(OCR_EXTRA_ALIASES.survivorRecruit||[]),'bilhete de recrutamento de sobrevivente','bilhetes de recrutamento de sobreviventes'],
    weaponShards:[...(OCR_EXTRA_ALIASES.weaponShards||[]),'fragmento de arma exclusiva','fragmentos de arma exclusiva']
  });

  const originalParseDurationMinutes = parseDurationMinutes;
  parseDurationMinutes = function(value){
    const text=String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[,]/g,'.');
    let total=0,found=false;
    const collect=(regex,multiplier)=>{for(const match of text.matchAll(regex)){const n=Number(String(match[1]).replace(',','.'));if(Number.isFinite(n)){total+=n*multiplier;found=true;}}};
    collect(/(\d+(?:\.\d+)?)\s*dias?(?=\s|$|[^a-z])/gi,1440);
    collect(/(\d+(?:\.\d+)?)\s*horas?(?=\s|$|[^a-z])/gi,60);
    collect(/(\d+(?:\.\d+)?)\s*minutos?(?=\s|$|[^a-z])/gi,1);
    return found?Math.max(0,Math.round(total)):originalParseDurationMinutes(value);
  };

  const originalFindOcrTarget = findOcrTarget;
  findOcrTarget = function(line){
    const norm=normalizeOcrText(line);
    const scoreAliases=['pontos vs','pontuacao vs','pontos de vs','duelo de alianca','duelo da alianca'];
    if(scoreAliases.some(a=>norm===a||norm.startsWith(`${a} `)||norm.endsWith(` ${a}`)||norm.includes(` ${a} `)))return{target:'__currentPoints',score:.82};
    return originalFindOcrTarget(line);
  };

  // A 100k default margin is enough to avoid stopping just below 7.2M while wasting less.
  // Existing players keep their own saved margin untouched.
  if(!hadSavedState && Number(state.profile?.margin)===300000){
    state.profile.margin=100000;
  }

  const SAVING_WARNING = {
    fr:'⚠️ Les ressources économiques seules ne suffisent pas : ce plan utilise au moins une ressource importante.',
    en:'⚠️ Saving resources alone are not enough: this plan needs at least one important resource.',
    de:'⚠️ Die Sparressourcen allein reichen nicht: Dieser Plan benötigt mindestens eine wichtige Ressource.',
    ro:'⚠️ Resursele economice nu sunt suficiente: planul trebuie să folosească cel puțin o resursă importantă.',
    uk:'⚠️ Економних ресурсів недостатньо: план має використати щонайменше один важливий ресурс.',
    ko:'⚠️ 절약 자원만으로는 부족하여 중요한 자원을 하나 이상 사용해야 합니다.',
    hr:'⚠️ Resursi za štednju nisu dovoljni: plan mora upotrijebiti barem jedan važan resurs.',
    pt:'⚠️ Os recursos económicos não são suficientes: este plano precisa de utilizar pelo menos um recurso importante.'
  };

  const originalRenderUltraPlanList = renderUltraPlanList;
  renderUltraPlanList = function(plan){
    originalRenderUltraPlanList(plan);
    const box=el('simplePlanList');
    if(!box)return;
    box.querySelector('.gomo-v230-saving-warning')?.remove();
    if(!state.profile.economyWeek || !(plan?.steps||[]).length)return;
    const important=(plan.steps||[]).some(s=>{const i=findItem(s.itemId,plan.dayId);return i&&(Number(i.scarcity)>=4||Number(i.eco)>=5);});
    if(!important)return;
    const note=document.createElement('p');
    note.className='gomo-v230-saving-warning';
    note.style.cssText='margin:10px 0 0;padding:10px 12px;border-radius:12px;background:rgba(255,184,77,.12);border:1px solid rgba(255,184,77,.32);font-size:13px;line-height:1.35';
    note.textContent=SAVING_WARNING[state.language]||SAVING_WARNING.fr;
    box.appendChild(note);
  };

  // One missing edge-case string in the original automatic-scan banner.
  const originalRenderAutoScanStatus = renderAutoScanStatus;
  renderAutoScanStatus = function(){
    originalRenderAutoScanStatus();
    if(state.language!=='pt'||!lastAutoScanSummary||lastAutoScanSummary.relevantCount!==0||lastAutoScanSummary.count<=0)return;
    const node=el('autoScanSummary');
    if(node)node.textContent=`${lastAutoScanSummary.count} recurso(s) reconhecido(s) e guardado(s), mas nenhum dá pontos no dia VS selecionado.`+(lastAutoScanSummary.addedPoints>0?` ${fmt(Math.floor(lastAutoScanSummary.addedPoints))} pontos utilizados desde a fotografia anterior também foram detetados.`:'');
  };

  if(state.language==='pt') document.documentElement.lang='pt';
  renderAll();
})();
