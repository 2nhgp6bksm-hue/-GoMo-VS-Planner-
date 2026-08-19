'use strict';

/* GoMo VS Planner v3.20.6 — OCR ressources supplémentaires.
   Correctif ciblé : lecture des fragments héros UR/SSR/R lorsqu'ils sont sélectionnés.
   Les coffres de puce de compétence restent volontairement hors calcul VS.
   Aucun calcul de points, stock, réserve, historique ou traduction n'est modifié. */
(() => {
  const VERSION='3.20.6-ocr1';

  function norm(value){
    return String(value||'')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .toLowerCase()
      .replace(/[^a-z0-9가-힣а-яіїє]+/gi,' ')
      .replace(/\s+/g,' ')
      .trim();
  }

  const CHIP_CHEST_PHRASES=[
    'coffre de puce de competence','coffres de puce de competence',
    'skill chip chest','skill chip chests',
    'truhe mit fahigkeitschip','truhen mit fahigkeitschip',
    'cufar cip de abilitate','cufere cip de abilitate',
    'скриня чипа навичок','скрині чипа навичок',
    '스킬 칩 상자','skill chip chest',
    'skrinja cipa vjestine','skrinje cipa vjestine',
    'bau de chip de habilidade','baus de chip de habilidade'
  ].map(norm);

  const SHARD_RULES=[
    ['urShards',[
      'fragment de heros ur','fragments de heros ur','fragment heros ur','fragments heros ur',
      'ur hero shard','ur hero shards','ur heldenfragment','ur heldenfragmente',
      'fragment erou ur','fragmente erou ur','фрагмент героїв ur','фрагменти героїв ur',
      'ur 영웅 조각','ur fragment heroja','ur fragmenti heroja','fragmento de heroi ur','fragmentos de heroi ur'
    ]],
    ['ssrShards',[
      'fragment de heros ssr','fragments de heros ssr','fragment heros ssr','fragments heros ssr',
      'ssr hero shard','ssr hero shards','ssr heldenfragment','ssr heldenfragmente',
      'fragment erou ssr','fragmente erou ssr','фрагмент героїв ssr','фрагменти героїв ssr',
      'ssr 영웅 조각','ssr fragment heroja','ssr fragmenti heroja','fragmento de heroi ssr','fragmentos de heroi ssr'
    ]],
    ['rareShards',[
      'fragment de heros r','fragments de heros r','fragment heros r','fragments heros r',
      'r hero shard','r hero shards','r heldenfragment','r heldenfragmente',
      'fragment erou r','fragmente erou r','фрагмент героїв r','фрагменти героїв r',
      'r 영웅 조각','r fragment heroja','r fragmenti heroja','fragmento de heroi r','fragmentos de heroi r'
    ]]
  ].map(([target,names])=>[target,names.map(norm)]);

  function isSkillChipChest(text){
    const n=norm(text);
    return CHIP_CHEST_PHRASES.some(p=>p&&n.includes(p));
  }

  function install(){
    if(document.documentElement.hasAttribute('data-gomo-v3206-ocr-resources'))return true;
    if(typeof window.selectedLastWarTarget!=='function'||typeof window.shouldIgnoreOcrLine!=='function')return false;

    const baseSelected=window.selectedLastWarTarget;
    const baseIgnore=window.shouldIgnoreOcrLine;

    window.selectedLastWarTarget=function(text){
      if(isSkillChipChest(text))return'';
      const n=norm(text);
      for(const [target,names] of SHARD_RULES){
        if(names.some(name=>name&&n.includes(name)))return target;
      }
      return baseSelected(text);
    };

    window.shouldIgnoreOcrLine=function(line){
      if(isSkillChipChest(line))return true;
      return baseIgnore(line);
    };

    document.documentElement.setAttribute('data-gomo-v3206-ocr-resources',VERSION);
    console.info('GoMo VS Planner OCR resources patch',VERSION);
    return true;
  }

  if(!install()){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(install()||tries>=40)clearInterval(timer);
    },50);
  }
})();
