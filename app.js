'use strict';

const STORAGE_KEY = 'gomo_vs_planner_v1';
const VERSION = '1.0.0';
const fmt = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

const days = [
  {
    id: 1, short: 'Lun.', title: 'Lundi · Entraînement radar', label: 'Radar',
    description: 'Jour idéal pour les radars, l’endurance, les ressources récoltées et les améliorations du drone.',
    use: 'Radars préparés dimanche, endurance, données et pièces de drone, coffres de puces, récoltes.',
    save: 'Accélérateurs de construction/recherche/entraînement, badges de bravoure, fragments et tickets héros.',
    items: [
      item('stamina', 'Endurance utilisée', 'point(s) d’endurance', 150, { scarcity: 1, progression: 1, eco: 1 }),
      item('radarTasks', 'Missions radar terminées', 'mission(s)', 10000, { scarcity: 1, progression: 1, eco: 1 }),
      item('heroExp', 'EXP de héros utilisée', 'EXP', 1 / 660, { scarcity: 3, progression: 5, eco: 4, quick: [660000, 6600000, 66000000] }),
      item('droneData', 'Données de combat drone', 'donnée(s)', 3, { scarcity: 2, progression: 5, eco: 2, quick: [1000, 10000, 100000] }),
      item('droneParts', 'Pièces de drone', 'pièce(s)', 2500, { scarcity: 4, progression: 5, eco: 4 }),
      item('foodLots', 'Nourriture récoltée', 'lot(s) de 100', 20, { scarcity: 1, progression: 1, eco: 1, quick: [100, 1000, 10000] }),
      item('ironLots', 'Fer récolté', 'lot(s) de 100', 20, { scarcity: 1, progression: 1, eco: 1, quick: [100, 1000, 10000] }),
      item('coinLots', 'Pièces récoltées', 'lot(s) de 60', 20, { scarcity: 1, progression: 1, eco: 1, quick: [100, 1000, 10000] }),
      item('skillChipPoints', 'Points de puce drone gagnés', 'point(s) de puce', 1000, { scarcity: 3, progression: 5, eco: 3 })
    ]
  },
  {
    id: 2, short: 'Mar.', title: 'Mardi · Expansion de la base', label: 'Base',
    description: 'Jour de la construction, des bâtiments terminés, des camions UR, missions secrètes et survivants.',
    use: 'Grosses constructions, accélérateurs construction, puissance bâtiment, camions UR, missions légendaires, survivants.',
    save: 'Recherche pour mercredi, ressources héros pour jeudi, entraînement et universels pour vendredi.',
    items: [
      speedItem('constructionSpeed', 'Accélérateurs de construction', 50, { scarcity: 2, progression: 4, eco: 2 }),
      speedItem('universalSpeed', 'Accélérateurs universels', 50, { scarcity: 4, progression: 4, eco: 5 }),
      item('buildingPower', 'Puissance bâtiment prévue', 'point(s) de puissance', 10, { scarcity: 1, progression: 5, eco: 1, quick: [1000, 10000, 100000] }),
      item('urTrucks', 'Camions commerciaux UR', 'camion(s)', 100000, { scarcity: 2, progression: 1, eco: 1 }),
      item('legendTasks', 'Missions secrètes légendaires', 'mission(s)', 75000, { scarcity: 2, progression: 1, eco: 1 }),
      item('survivorRecruit', 'Recrutements de survivants', 'recrutement(s)', 1500, { scarcity: 3, progression: 2, eco: 3, defaultReserve: 50 })
    ]
  },
  {
    id: 3, short: 'Mer.', title: 'Mercredi · Âge de la science', label: 'Science',
    description: 'Jour de la recherche, des badges de bravoure et des coffres de composants de drone.',
    use: 'Recherche longue, accélérateurs recherche, puissance technologie, badges de bravoure, composants drone.',
    save: 'Fragments, EXP, médailles et tickets héros pour jeudi; entraînement et universels pour vendredi.',
    items: [
      speedItem('researchSpeed', 'Accélérateurs de recherche', 50, { scarcity: 2, progression: 5, eco: 2 }),
      speedItem('universalSpeed', 'Accélérateurs universels', 50, { scarcity: 4, progression: 5, eco: 5 }),
      item('techPower', 'Puissance technologie prévue', 'point(s) de puissance', 10, { scarcity: 1, progression: 5, eco: 1, quick: [1000, 10000, 100000] }),
      item('valorBadges', 'Badges de bravoure', 'badge(s)', 300, { scarcity: 3, progression: 5, eco: 3, quick: [100, 1000, 10000] }),
      item('radarTasks', 'Missions radar terminées', 'mission(s)', 10000, { scarcity: 1, progression: 1, eco: 1 }),
      item('droneChest1', 'Coffres composant drone niveau 1', 'coffre(s)', 1100, { scarcity: 2, progression: 4, eco: 2 }),
      item('droneChest2', 'Coffres composant drone niveau 2', 'coffre(s)', 3300, { scarcity: 2, progression: 4, eco: 2 }),
      item('droneChest3', 'Coffres composant drone niveau 3', 'coffre(s)', 10000, { scarcity: 3, progression: 4, eco: 3 }),
      item('droneChest4', 'Coffres composant drone niveau 4', 'coffre(s)', 30000, { scarcity: 3, progression: 4, eco: 3 }),
      item('droneChest5', 'Coffres composant drone niveau 5', 'coffre(s)', 90000, { scarcity: 4, progression: 5, eco: 4 }),
      item('droneChest6', 'Coffres composant drone niveau 6', 'coffre(s)', 270000, { scarcity: 4, progression: 5, eco: 4 }),
      item('droneChest7', 'Coffres composant drone niveau 7', 'coffre(s)', 810000, { scarcity: 5, progression: 5, eco: 5 })
    ]
  },
  {
    id: 4, short: 'Jeu.', title: 'Jeudi · Entraîner les héros', label: 'Héros',
    description: 'Jour réservé aux recrutements, EXP, fragments, médailles de compétence et armes exclusives.',
    use: 'Tickets héros, EXP, fragments UR/SSR/R, médailles de compétence et fragments d’arme exclusive.',
    save: 'Accélérateurs d’entraînement, de construction, de recherche et universels pour vendredi.',
    items: [
      item('eliteTickets', 'Tickets de recrutement héros', 'ticket(s)', 1500, { scarcity: 3, progression: 4, eco: 3, defaultReserve: 500 }),
      item('heroExp', 'EXP de héros utilisée', 'EXP', 1 / 660, { scarcity: 2, progression: 5, eco: 2, quick: [660000, 6600000, 66000000] }),
      item('urShards', 'Fragments de héros UR', 'fragment(s)', 10000, { scarcity: 5, progression: 5, eco: 5, defaultReserve: 200 }),
      item('ssrShards', 'Fragments de héros SSR', 'fragment(s)', 3500, { scarcity: 3, progression: 4, eco: 3 }),
      item('rareShards', 'Fragments de héros R', 'fragment(s)', 1000, { scarcity: 1, progression: 2, eco: 1 }),
      item('skillMedals', 'Médailles de compétence', 'médaille(s)', 10, { scarcity: 3, progression: 5, eco: 3, quick: [1000, 10000, 100000] }),
      item('weaponShards', 'Fragments d’arme exclusive', 'fragment(s)', 10000, { scarcity: 5, progression: 5, eco: 5 })
    ]
  },
  {
    id: 5, short: 'Ven.', title: 'Vendredi · Mobilisation totale', label: 'Mobilisation',
    description: 'Le grand jour des accélérateurs et de l’entraînement. Garde les universels pour compléter précisément.',
    use: 'Tous les accélérateurs utiles, puissance bâtiment/technologie, entraînement des troupes, radars restants.',
    save: 'Garde seulement ce que tes réserves imposent. Prépare boucliers et soins pour samedi.',
    items: [
      item('radarTasks', 'Missions radar terminées', 'mission(s)', 10000, { scarcity: 1, progression: 1, eco: 1 }),
      speedItem('constructionSpeed', 'Accélérateurs de construction', 50, { scarcity: 2, progression: 4, eco: 2 }),
      speedItem('researchSpeed', 'Accélérateurs de recherche', 50, { scarcity: 2, progression: 5, eco: 2 }),
      speedItem('trainingSpeed', 'Accélérateurs d’entraînement', 50, { scarcity: 2, progression: 5, eco: 1 }),
      speedItem('universalSpeed', 'Accélérateurs universels', 50, { scarcity: 4, progression: 5, eco: 5 }),
      item('buildingPower', 'Puissance bâtiment prévue', 'point(s) de puissance', 10, { scarcity: 1, progression: 5, eco: 1, quick: [1000, 10000, 100000] }),
      item('techPower', 'Puissance technologie prévue', 'point(s) de puissance', 10, { scarcity: 1, progression: 5, eco: 1, quick: [1000, 10000, 100000] }),
      ...Array.from({ length: 10 }, (_, i) => item(`trainT${i + 1}`, `Troupes niveau ${i + 1} entraînées`, 'troupe(s)', 20 + (i * 10), { scarcity: 1, progression: 4, eco: 2, quick: [100, 1000, 10000], advanced: i < 8 }))
    ]
  },
  {
    id: 6, short: 'Sam.', title: 'Samedi · Destruction ennemie', label: 'Combat',
    description: 'Jour de combat. Les cibles de l’alliance adverse rapportent beaucoup plus. Le calcul reste une estimation.',
    use: 'Camions UR, missions légendaires, soins, accélérateurs restants et combats coordonnés contre l’adversaire VS.',
    save: 'Plus rien après samedi, sauf les réserves personnelles que tu as fixées.',
    items: [
      item('urTrucks', 'Camions commerciaux UR', 'camion(s)', 100000, { scarcity: 2, progression: 1, eco: 1 }),
      item('legendTasks', 'Missions secrètes légendaires', 'mission(s)', 75000, { scarcity: 2, progression: 1, eco: 1 }),
      speedItem('constructionSpeed', 'Accélérateurs de construction', 50, { scarcity: 2, progression: 4, eco: 2 }),
      speedItem('researchSpeed', 'Accélérateurs de recherche', 50, { scarcity: 2, progression: 5, eco: 2 }),
      speedItem('trainingSpeed', 'Accélérateurs d’entraînement', 50, { scarcity: 2, progression: 5, eco: 2 }),
      speedItem('healingSpeed', 'Accélérateurs de soins', 50, { scarcity: 2, progression: 3, eco: 1 }),
      speedItem('universalSpeed', 'Accélérateurs universels', 50, { scarcity: 4, progression: 4, eco: 5 }),
      ...Array.from({ length: 10 }, (_, i) => item(`rivalKillT${i + 1}`, `Troupes adversaires VS niveau ${i + 1} éliminées`, 'troupe(s)', 10 + (i * 5), { scarcity: 1, progression: 1, eco: 1, quick: [100, 1000, 10000], advanced: i < 8 })),
      ...Array.from({ length: 10 }, (_, i) => item(`otherKillT${i + 1}`, `Autres troupes niveau ${i + 1} éliminées`, 'troupe(s)', 2 + i, { scarcity: 2, progression: 1, eco: 3, quick: [100, 1000, 10000], advanced: true })),
      ...Array.from({ length: 10 }, (_, i) => item(`lostT${i + 1}`, `Tes troupes niveau ${i + 1} perdues`, 'troupe(s)', 2 + i, { scarcity: 5, progression: 0, eco: 5, quick: [100, 1000, 10000], advanced: true }))
    ]
  }
];

function item(stockKey, label, unit, points, options = {}) {
  return {
    id: `${stockKey}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20)}`,
    stockKey, label, unit, points,
    scarcity: options.scarcity ?? 2,
    progression: options.progression ?? 2,
    eco: options.eco ?? 2,
    quick: options.quick ?? [1, 10, 100],
    defaultReserve: options.defaultReserve ?? 0,
    speedup: false,
    advanced: options.advanced ?? false
  };
}

function speedItem(stockKey, label, points, options = {}) {
  return { ...item(stockKey, label, 'minute(s)', points, { ...options, quick: [60, 480, 1440] }), speedup: true };
}

const defaultState = () => ({
  version: VERSION,
  selectedDay: 1,
  view: 'planner',
  profile: {
    playerName: '',
    target: 7200000,
    margin: 150000,
    bonusPct: 0,
    strategy: 'economy',
    speedupLimitDays: 10
  },
  currentPoints: {},
  inventory: {},
  reserves: {},
  pointOverrides: {},
  lastPlan: null
});

let state = loadState();
let pendingConfirm = null;
let toastTimer = null;

const el = id => document.getElementById(id);
const dayById = id => days.find(day => day.id === Number(id)) || days[0];
const activeDay = () => dayById(state.selectedDay);
const pointKey = (dayId, itemId) => `${dayId}:${itemId}`;

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return deepMerge(defaultState(), parsed || {});
  } catch {
    return defaultState();
  }
}

function deepMerge(base, extra) {
  if (!extra || typeof extra !== 'object') return base;
  for (const [key, value] of Object.entries(extra)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && base[key] && typeof base[key] === 'object') {
      base[key] = deepMerge(base[key], value);
    } else {
      base[key] = value;
    }
  }
  return base;
}

function saveState(message = 'Enregistré') {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  el('saveState').textContent = message;
  window.clearTimeout(saveState.timer);
  saveState.timer = window.setTimeout(() => { el('saveState').textContent = 'Sauvegarde automatique active'; }, 1200);
}

function getInventory(itemDef) { return Number(state.inventory[itemDef.stockKey] || 0); }
function getReserve(itemDef) {
  const stored = state.reserves[itemDef.stockKey];
  return stored === undefined ? Number(itemDef.defaultReserve || 0) : Number(stored || 0);
}
function getBasePoints(dayId, itemDef) {
  const override = state.pointOverrides[pointKey(dayId, itemDef.id)];
  return override === undefined ? itemDef.points : Number(override || 0);
}
function multiplier() { return 1 + Math.max(0, Number(state.profile.bonusPct || 0)) / 100; }
function effectivePoints(dayId, itemDef) { return getBasePoints(dayId, itemDef) * multiplier(); }
function recommendedTarget() { return Math.max(0, Number(state.profile.target || 0)) + Math.max(0, Number(state.profile.margin || 0)); }
function usableQuantity(itemDef) { return Math.max(0, getInventory(itemDef) - getReserve(itemDef)); }

function invalidatePlan() {
  state.lastPlan = null;
  el('resultPanel')?.classList.add('hidden');
}

function renderAll() {
  renderView();
  renderProfile();
  renderDayStrip();
  renderDayInfo();
  renderResources();
  renderSummary();
  renderWeeklyGuide();
  renderStrategyHelp();
  renderLastPlan();
}

function renderView() {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === state.view));
  el(`${state.view}View`).classList.add('active');
}

function renderProfile() {
  el('playerName').value = state.profile.playerName || '';
  el('targetPoints').value = Number(state.profile.target || 0);
  el('marginPoints').value = Number(state.profile.margin || 0);
  el('bonusPct').value = Number(state.profile.bonusPct || 0);
  el('strategy').value = state.profile.strategy || 'economy';
  el('speedupLimitDays').value = Number(state.profile.speedupLimitDays ?? 10);
  el('currentPoints').value = Number(state.currentPoints[state.selectedDay] || 0);
}

function renderDayStrip() {
  el('dayStrip').innerHTML = days.map(day => `
    <button class="day-btn ${day.id === state.selectedDay ? 'active' : ''}" data-day="${day.id}">
      ${day.short}<small>${day.label}</small>
    </button>`).join('');
}

function renderDayInfo() {
  const day = activeDay();
  el('dayEyebrow').textContent = `JOUR ${day.id}`;
  el('dayTitle').textContent = day.title;
  el('dayDescription').textContent = day.description;
  el('useToday').textContent = day.use;
  el('saveForLater').textContent = day.save;
}

function renderResources() {
  const day = activeDay();
  const renderCard = itemDef => {
    const inv = getInventory(itemDef);
    const reserve = getReserve(itemDef);
    const basePts = getBasePoints(day.id, itemDef);
    const potential = usableQuantity(itemDef) * effectivePoints(day.id, itemDef);
    const quickButtons = itemDef.quick.map(amount => `<button class="quick-btn" data-add="${amount}" data-stock="${escapeAttr(itemDef.stockKey)}">+${formatQuick(amount, itemDef)}</button>`).join('');
    return `
      <article class="resource-card" data-item-id="${escapeAttr(itemDef.id)}">
        <div class="resource-head">
          <div>
            <h3>${escapeHtml(itemDef.label)}</h3>
            <p class="resource-meta">Unité : ${escapeHtml(itemDef.unit)}${itemDef.speedup ? ' · saisie en minutes' : ''}</p>
          </div>
          <span class="point-pill">${formatPointsPerUnit(basePts, itemDef)} pts base</span>
        </div>
        <div class="resource-fields">
          <label>Disponible<input class="inventory-input" type="number" inputmode="decimal" min="0" step="1" data-stock="${escapeAttr(itemDef.stockKey)}" value="${safeNumber(inv)}"></label>
          <label>Réserve à garder<input class="reserve-input" type="number" inputmode="decimal" min="0" step="1" data-stock="${escapeAttr(itemDef.stockKey)}" value="${safeNumber(reserve)}"></label>
          <label>Points par unité<input class="points-input" type="number" inputmode="decimal" min="0" step="0.0001" data-point-key="${escapeAttr(pointKey(day.id, itemDef.id))}" value="${safeNumber(basePts)}"></label>
        </div>
        <div class="quick-buttons">${quickButtons}<button class="quick-btn" data-clear-stock="${escapeAttr(itemDef.stockKey)}">Effacer</button></div>
        <div class="resource-foot">
          <span>Utilisable : <strong>${fmt.format(usableQuantity(itemDef))}</strong></span>
          <span>Potentiel avec bonus : <strong>${fmt.format(Math.floor(potential))} pts</strong></span>
        </div>
      </article>`;
  };

  const basic = day.items.filter(itemDef => !itemDef.advanced).map(renderCard).join('');
  const advancedItems = day.items.filter(itemDef => itemDef.advanced);
  const advanced = advancedItems.length ? `
    <details class="advanced-block">
      <summary>Afficher les niveaux et actions avancés (${advancedItems.length})</summary>
      <div class="advanced-list">${advancedItems.map(renderCard).join('')}</div>
    </details>` : '';
  el('resourceList').innerHTML = basic + advanced;
}

function formatQuick(amount, itemDef) {
  if (itemDef.speedup) {
    if (amount === 60) return '1 h';
    if (amount === 480) return '8 h';
    if (amount === 1440) return '1 j';
  }
  if (amount >= 1000000) return `${amount / 1000000} M`;
  if (amount >= 1000) return `${amount / 1000} k`;
  return fmt.format(amount);
}

function formatPointsPerUnit(points, itemDef) {
  if (itemDef.stockKey === 'heroExp') return '1 / 660 EXP';
  if (points < 1) return points.toFixed(4).replace('.', ',');
  return fmt.format(points);
}

function renderSummary() {
  const day = activeDay();
  const target = recommendedTarget();
  const current = Number(state.currentPoints[day.id] || 0);
  const speedLimitMinutes = Math.max(0, Number(state.profile.speedupLimitDays || 0) * 1440);
  let speedMinutesLeft = speedLimitMinutes;
  let potential = day.items.filter(itemDef => !itemDef.speedup)
    .reduce((sum, itemDef) => sum + usableQuantity(itemDef) * effectivePoints(day.id, itemDef), 0);
  const speedItems = day.items.filter(itemDef => itemDef.speedup)
    .sort((a, b) => effectivePoints(day.id, b) - effectivePoints(day.id, a));
  for (const itemDef of speedItems) {
    const used = Math.min(usableQuantity(itemDef), speedMinutesLeft);
    potential += used * effectivePoints(day.id, itemDef);
    speedMinutesLeft -= used;
    if (speedMinutesLeft <= 0) break;
  }
  el('recommendedTarget').textContent = fmt.format(target);
  el('currentPointsSummary').textContent = fmt.format(current);
  el('missingPointsSummary').textContent = fmt.format(Math.max(0, target - current));
  el('potentialPointsSummary').textContent = fmt.format(Math.floor(potential));
}

function renderWeeklyGuide() {
  el('weeklyGuide').innerHTML = days.map(day => `
    <article class="guide-card">
      <span class="day-number">JOUR ${day.id}</span>
      <h3>${escapeHtml(day.title)}</h3>
      <p>${escapeHtml(day.description)}</p>
      <ul><li><strong>Utiliser :</strong> ${escapeHtml(day.use)}</li><li><strong>Garder :</strong> ${escapeHtml(day.save)}</li></ul>
    </article>`).join('');
}

const strategyTexts = {
  economy: 'Priorise les actions courantes et les ressources les moins rares, puis ajuste pour dépasser l’objectif le moins possible.',
  progress: 'Priorise les dépenses qui améliorent directement la puissance du compte, tout en respectant les réserves.',
  score: 'Priorise les plus gros gains de points par action. Le calcul s’arrête quand l’objectif avec marge est atteint.',
  prudent: 'Protège au maximum les ressources rares, respecte les réserves et applique strictement la limite d’accélérateurs.'
};
function renderStrategyHelp() { el('strategyHelp').textContent = strategyTexts[state.profile.strategy] || strategyTexts.economy; }

function calculatePlan() {
  const day = activeDay();
  const current = Number(state.currentPoints[day.id] || 0);
  const goal = recommendedTarget();
  const needed = Math.max(0, goal - current);
  const speedLimitMinutes = Math.max(0, Number(state.profile.speedupLimitDays || 0) * 1440);
  let speedUsed = 0;

  if (needed <= 0) {
    return { dayId: day.id, goal, current, needed: 0, totalPoints: 0, finalPoints: current, steps: [], reached: true, overshoot: current - goal, missing: 0, strategy: state.profile.strategy };
  }

  const candidates = day.items.map(itemDef => ({
    item: itemDef,
    available: Math.floor(usableQuantity(itemDef)),
    ppu: effectivePoints(day.id, itemDef),
    basePpu: getBasePoints(day.id, itemDef)
  })).filter(c => c.available > 0 && c.ppu > 0);

  candidates.sort(strategyComparator(state.profile.strategy));
  const usage = new Map();
  let remaining = needed;

  for (const c of candidates) {
    let maxQty = c.available;
    if (c.item.speedup) maxQty = Math.min(maxQty, Math.max(0, Math.floor(speedLimitMinutes - speedUsed)));
    if (maxQty <= 0) continue;
    const qty = Math.min(maxQty, Math.floor(remaining / c.ppu));
    if (qty > 0) {
      usage.set(c.item.id, qty);
      remaining -= qty * c.ppu;
      if (c.item.speedup) speedUsed += qty;
    }
    if (remaining <= 0.0001) break;
  }

  if (remaining > 0.0001) {
    let best = null;
    for (const c of candidates) {
      const already = usage.get(c.item.id) || 0;
      let left = c.available - already;
      if (c.item.speedup) left = Math.min(left, Math.max(0, Math.floor(speedLimitMinutes - speedUsed)));
      if (left <= 0) continue;
      const requiredQty = Math.min(left, Math.ceil(remaining / c.ppu));
      if (requiredQty <= 0) continue;
      const gained = requiredQty * c.ppu;
      const overshoot = Math.max(0, gained - remaining);
      const cost = strategyCost(c, state.profile.strategy, requiredQty);
      const rank = overshoot + cost;
      if (!best || rank < best.rank) best = { c, requiredQty, gained, rank };
    }
    if (best) {
      usage.set(best.c.item.id, (usage.get(best.c.item.id) || 0) + best.requiredQty);
      remaining -= best.gained;
      if (best.c.item.speedup) speedUsed += best.requiredQty;
    }
  }

  if (remaining > 0.0001) {
    for (const c of candidates) {
      const already = usage.get(c.item.id) || 0;
      let left = c.available - already;
      if (c.item.speedup) left = Math.min(left, Math.max(0, Math.floor(speedLimitMinutes - speedUsed)));
      if (left <= 0) continue;
      usage.set(c.item.id, already + left);
      remaining -= left * c.ppu;
      if (c.item.speedup) speedUsed += left;
      if (remaining <= 0.0001) break;
    }
  }

  const steps = candidates.map(c => {
    const qty = usage.get(c.item.id) || 0;
    if (!qty) return null;
    const points = qty * c.ppu;
    return {
      itemId: c.item.id,
      stockKey: c.item.stockKey,
      label: c.item.label,
      unit: c.item.unit,
      qty,
      points,
      remainingStock: Math.max(0, getInventory(c.item) - qty),
      reserve: getReserve(c.item),
      speedup: c.item.speedup
    };
  }).filter(Boolean);

  const totalPoints = steps.reduce((sum, step) => sum + step.points, 0);
  const finalPoints = current + totalPoints;
  return {
    dayId: day.id,
    goal, current, needed,
    totalPoints,
    finalPoints,
    steps,
    reached: finalPoints >= goal,
    overshoot: Math.max(0, finalPoints - goal),
    missing: Math.max(0, goal - finalPoints),
    strategy: state.profile.strategy,
    speedUsed
  };
}

function strategyComparator(strategy) {
  return (a, b) => {
    if (strategy === 'score') return (b.ppu - a.ppu) || (a.item.scarcity - b.item.scarcity);
    if (strategy === 'progress') return (b.item.progression - a.item.progression) || (a.item.scarcity - b.item.scarcity) || (b.ppu - a.ppu);
    if (strategy === 'prudent') return (a.item.scarcity - b.item.scarcity) || (a.item.eco - b.item.eco) || (a.ppu - b.ppu);
    return (a.item.eco - b.item.eco) || (a.item.scarcity - b.item.scarcity) || (a.ppu - b.ppu);
  };
}

function strategyCost(candidate, strategy, qty) {
  const scarcity = candidate.item.scarcity * 5000;
  const actionCost = Math.min(qty, 100000) * 0.01;
  if (strategy === 'score') return candidate.item.scarcity * 100;
  if (strategy === 'progress') return (6 - candidate.item.progression) * 4000 + candidate.item.scarcity * 1000;
  if (strategy === 'prudent') return scarcity * 2 + candidate.item.eco * 2500 + actionCost;
  return scarcity + candidate.item.eco * 1500 + actionCost;
}

function renderPlan(plan) {
  state.lastPlan = plan;
  saveState('Plan calculé');
  el('resultPanel').classList.remove('hidden');
  const strategyName = el('strategy').selectedOptions[0]?.textContent || 'Plan';
  el('resultTitle').textContent = `${activeDay().title} · ${strategyName}`;
  el('resultBadge').textContent = plan.reached ? 'Objectif atteint' : 'Stock insuffisant';
  el('resultBadge').classList.toggle('warning', !plan.reached);
  el('resultMetrics').innerHTML = `
    <div class="metric"><span>Points ajoutés</span><strong>${fmt.format(Math.floor(plan.totalPoints))}</strong></div>
    <div class="metric"><span>Total estimé</span><strong>${fmt.format(Math.floor(plan.finalPoints))}</strong></div>
    <div class="metric"><span>${plan.reached ? 'Marge réelle' : 'Points manquants'}</span><strong>${fmt.format(Math.floor(plan.reached ? plan.overshoot : plan.missing))}</strong></div>`;

  el('planSteps').innerHTML = plan.steps.length
    ? plan.steps.map(step => `<li>Utiliser <strong>${formatQty(step.qty, step)}</strong> de ${escapeHtml(step.label)} → environ <strong>${fmt.format(Math.floor(step.points))} points</strong>. Stock restant : ${fmt.format(Math.floor(step.remainingStock))}.</li>`).join('')
    : '<li>Aucune ressource supplémentaire n’est nécessaire. L’objectif est déjà atteint.</li>';

  el('resultNote').textContent = plan.reached
    ? `Le calcul s’arrête à ${fmt.format(Math.floor(plan.finalPoints))} points. Garde le reste du stock et les réserves pour la prochaine semaine, sauf ordre contraire de l’alliance.`
    : `Avec les quantités saisies et les réserves protégées, il manque encore environ ${fmt.format(Math.ceil(plan.missing))} points. Ajoute du stock, baisse une réserve ou complète avec une autre action du jour.`;
  el('applyPlanBtn').disabled = plan.steps.length === 0;
  setTimeout(() => el('resultPanel').scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
}

function renderLastPlan() {
  const plan = state.lastPlan;
  if (!plan || plan.dayId !== state.selectedDay) {
    el('resultPanel').classList.add('hidden');
    return;
  }
  renderPlanWithoutSave(plan);
}
function renderPlanWithoutSave(plan) {
  el('resultPanel').classList.remove('hidden');
  const names = { economy: 'Économie maximale', progress: 'Progression maximale', score: 'Gros score VS', prudent: 'Mode prudent' };
  el('resultTitle').textContent = `${activeDay().title} · ${names[plan.strategy] || 'Plan conseillé'}`;
  el('resultBadge').textContent = plan.reached ? 'Objectif atteint' : 'Stock insuffisant';
  el('resultBadge').classList.toggle('warning', !plan.reached);
  el('resultMetrics').innerHTML = `
    <div class="metric"><span>Points ajoutés</span><strong>${fmt.format(Math.floor(plan.totalPoints))}</strong></div>
    <div class="metric"><span>Total estimé</span><strong>${fmt.format(Math.floor(plan.finalPoints))}</strong></div>
    <div class="metric"><span>${plan.reached ? 'Marge réelle' : 'Points manquants'}</span><strong>${fmt.format(Math.floor(plan.reached ? plan.overshoot : plan.missing))}</strong></div>`;
  el('planSteps').innerHTML = plan.steps.length
    ? plan.steps.map(step => `<li>Utiliser <strong>${formatQty(step.qty, step)}</strong> de ${escapeHtml(step.label)} → environ <strong>${fmt.format(Math.floor(step.points))} points</strong>. Stock restant : ${fmt.format(Math.floor(step.remainingStock))}.</li>`).join('')
    : '<li>Aucune ressource supplémentaire n’est nécessaire. L’objectif est déjà atteint.</li>';
  el('resultNote').textContent = plan.reached
    ? `Le calcul s’arrête à ${fmt.format(Math.floor(plan.finalPoints))} points. Garde le reste du stock et les réserves pour la prochaine semaine, sauf ordre contraire de l’alliance.`
    : `Il manque encore environ ${fmt.format(Math.ceil(plan.missing))} points avec les données actuelles.`;
  el('applyPlanBtn').disabled = plan.steps.length === 0;
}

function formatQty(qty, step) {
  if (step.speedup) {
    const days = Math.floor(qty / 1440);
    const hours = Math.floor((qty % 1440) / 60);
    const mins = Math.floor(qty % 60);
    const parts = [];
    if (days) parts.push(`${days} j`);
    if (hours) parts.push(`${hours} h`);
    if (mins) parts.push(`${mins} min`);
    return `${parts.join(' ') || '0 min'} (${fmt.format(qty)} min)`;
  }
  if (step.stockKey === 'heroExp') return `${fmt.format(qty)} EXP`;
  return `${fmt.format(qty)} ${step.unit}`;
}

function buildDebrief(plan) {
  const player = state.profile.playerName ? `Joueur : ${state.profile.playerName}\n` : '';
  const lines = plan.steps.map((step, index) => `${index + 1}. Utiliser ${formatQty(step.qty, step)} de ${step.label} : environ ${fmt.format(Math.floor(step.points))} points.`);
  return `${player}${activeDay().title}\nObjectif : ${fmt.format(plan.goal)} points\nPoints déjà obtenus : ${fmt.format(plan.current)}\n\n${lines.length ? lines.join('\n') : 'Aucune ressource supplémentaire nécessaire.'}\n\nTotal estimé : ${fmt.format(Math.floor(plan.finalPoints))} points\n${plan.reached ? `Marge : ${fmt.format(Math.floor(plan.overshoot))} points.` : `Il manque encore : ${fmt.format(Math.ceil(plan.missing))} points.`}\n\nConseil : garder le reste du stock et les réserves pour la prochaine semaine, sauf consigne contraire de l’alliance.`;
}

function fillDemo() {
  const day = activeDay();
  const demo = {
    1: { radarTasks: 35, stamina: 5000, droneData: 700000, droneParts: 1700 },
    2: { constructionSpeed: 50000, buildingPower: 700000, urTrucks: 4, legendTasks: 5, survivorRecruit: 120 },
    3: { researchSpeed: 30000, techPower: 430000, valorBadges: 5000, droneChest3: 40, droneChest4: 15 },
    4: { eliteTickets: 720, heroExp: 900000000, urShards: 320, ssrShards: 500, rareShards: 700, skillMedals: 180000, weaponShards: 30 },
    5: { trainingSpeed: 80000, constructionSpeed: 10000, researchSpeed: 10000, universalSpeed: 10000, trainT10: 70000 },
    6: { urTrucks: 4, legendTasks: 5, healingSpeed: 6000, rivalKillT10: 115000 }
  }[day.id];
  Object.assign(state.inventory, demo);
  invalidatePlan();
  saveState('Exemple ajouté');
  renderResources();
  renderSummary();
  showToast('Exemple ajouté. Tu peux lancer le calcul.');
}

function applyPlan() {
  const plan = state.lastPlan;
  if (!plan || !plan.steps.length) return;
  confirmAction(
    'Marquer ce plan comme utilisé ?',
    'Les quantités seront retirées du stock et les points estimés seront ajoutés au total du jour.',
    () => {
      for (const step of plan.steps) state.inventory[step.stockKey] = Math.max(0, Number(state.inventory[step.stockKey] || 0) - step.qty);
      state.currentPoints[plan.dayId] = Math.floor(plan.finalPoints);
      invalidatePlan();
      saveState('Plan appliqué');
      renderAll();
      showToast('Stock et points mis à jour.');
    }
  );
}

function clearDayQuantities() {
  const uniqueKeys = [...new Set(activeDay().items.map(i => i.stockKey))];
  confirmAction('Effacer les quantités du jour ?', 'Les réserves et valeurs de points seront conservées.', () => {
    uniqueKeys.forEach(key => { state.inventory[key] = 0; });
    invalidatePlan();
    saveState('Quantités effacées');
    renderResources(); renderSummary(); renderLastPlan();
  });
}

function restoreBasePoints() {
  confirmAction('Restaurer les valeurs de base ?', 'Toutes les modifications manuelles des points par unité seront supprimées.', () => {
    state.pointOverrides = {};
    invalidatePlan();
    saveState('Valeurs restaurées');
    renderResources(); renderSummary(); renderLastPlan();
  });
}

function resetAll() {
  confirmAction('Réinitialiser complètement ?', 'Toutes les données enregistrées dans ce calculateur seront supprimées. Cette action est irréversible sans sauvegarde exportée.', () => {
    state = defaultState();
    saveState('Réinitialisation terminée');
    renderAll();
    showToast('Toutes les données ont été effacées.');
  });
}

function exportBackup() {
  const blob = new Blob([JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (state.profile.playerName || 'joueur').replace(/[^a-z0-9_-]+/gi, '-');
  a.href = url;
  a.download = `VS-Planner-${safeName}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('Sauvegarde exportée.');
}

async function importBackup(file) {
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    confirmAction('Importer cette sauvegarde ?', 'Les données actuelles seront remplacées par celles du fichier choisi.', () => {
      state = deepMerge(defaultState(), parsed);
      invalidatePlan();
      saveState('Sauvegarde importée');
      renderAll();
      showToast('Sauvegarde importée.');
    });
  } catch {
    showToast('Le fichier choisi n’est pas une sauvegarde valide.');
  } finally {
    el('importInput').value = '';
  }
}

function confirmAction(title, message, callback) {
  pendingConfirm = callback;
  el('confirmTitle').textContent = title;
  el('confirmMessage').textContent = message;
  el('confirmModal').classList.remove('hidden');
}
function closeConfirm() { pendingConfirm = null; el('confirmModal').classList.add('hidden'); }
function showToast(message) {
  window.clearTimeout(toastTimer);
  el('toast').textContent = message;
  el('toast').classList.remove('hidden');
  toastTimer = window.setTimeout(() => el('toast').classList.add('hidden'), 2300);
}

function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch])); }
function escapeAttr(value) { return escapeHtml(value); }
function safeNumber(value) { return Number.isFinite(Number(value)) ? Number(value) : 0; }

function bindEvents() {
  document.addEventListener('click', event => {
    const nav = event.target.closest('.nav-btn');
    if (nav) { state.view = nav.dataset.view; saveState(); renderView(); return; }
    const dayBtn = event.target.closest('.day-btn');
    if (dayBtn) { state.selectedDay = Number(dayBtn.dataset.day); invalidatePlan(); saveState(); renderAll(); return; }
    const addBtn = event.target.closest('[data-add]');
    if (addBtn) {
      const key = addBtn.dataset.stock;
      state.inventory[key] = Number(state.inventory[key] || 0) + Number(addBtn.dataset.add || 0);
      invalidatePlan(); saveState(); renderResources(); renderSummary(); return;
    }
    const clearBtn = event.target.closest('[data-clear-stock]');
    if (clearBtn) {
      state.inventory[clearBtn.dataset.clearStock] = 0;
      invalidatePlan(); saveState(); renderResources(); renderSummary(); return;
    }
  });

  document.addEventListener('input', event => {
    const t = event.target;
    if (t.matches('.inventory-input')) { state.inventory[t.dataset.stock] = Math.max(0, Number(t.value || 0)); invalidatePlan(); saveState(); renderSummary(); updateResourceFoot(t); }
    if (t.matches('.reserve-input')) { state.reserves[t.dataset.stock] = Math.max(0, Number(t.value || 0)); invalidatePlan(); saveState(); renderSummary(); updateResourceFoot(t); }
    if (t.matches('.points-input')) { state.pointOverrides[t.dataset.pointKey] = Math.max(0, Number(t.value || 0)); invalidatePlan(); saveState(); renderSummary(); updateResourceFoot(t); }
  });

  el('playerName').addEventListener('input', e => { state.profile.playerName = e.target.value; saveState(); });
  el('targetPoints').addEventListener('input', e => { state.profile.target = Math.max(0, Number(e.target.value || 0)); invalidatePlan(); saveState(); renderSummary(); });
  el('marginPoints').addEventListener('input', e => { state.profile.margin = Math.max(0, Number(e.target.value || 0)); invalidatePlan(); saveState(); renderSummary(); });
  el('bonusPct').addEventListener('input', e => { state.profile.bonusPct = Math.max(0, Number(e.target.value || 0)); invalidatePlan(); saveState(); renderResources(); renderSummary(); });
  el('currentPoints').addEventListener('input', e => { state.currentPoints[state.selectedDay] = Math.max(0, Number(e.target.value || 0)); invalidatePlan(); saveState(); renderSummary(); });
  el('strategy').addEventListener('change', e => { state.profile.strategy = e.target.value; invalidatePlan(); saveState(); renderStrategyHelp(); renderLastPlan(); });
  el('speedupLimitDays').addEventListener('input', e => { state.profile.speedupLimitDays = Math.max(0, Number(e.target.value || 0)); invalidatePlan(); saveState(); });

  el('analyzeBtn').addEventListener('click', () => renderPlan(calculatePlan()));
  el('demoBtn').addEventListener('click', fillDemo);
  el('applyPlanBtn').addEventListener('click', applyPlan);
  el('clearDayBtn').addEventListener('click', clearDayQuantities);
  el('restorePointsBtn').addEventListener('click', restoreBasePoints);
  el('resetAllBtn').addEventListener('click', resetAll);
  el('exportBtn').addEventListener('click', exportBackup);
  el('importInput').addEventListener('change', e => importBackup(e.target.files?.[0]));
  el('copyDebriefBtn').addEventListener('click', async () => {
    if (!state.lastPlan) return;
    try { await navigator.clipboard.writeText(buildDebrief(state.lastPlan)); showToast('Débrief copié.'); }
    catch { showToast('Copie impossible sur ce navigateur.'); }
  });
  el('confirmCancel').addEventListener('click', closeConfirm);
  el('confirmOk').addEventListener('click', () => { const cb = pendingConfirm; closeConfirm(); if (cb) cb(); });
  el('confirmModal').addEventListener('click', e => { if (e.target === el('confirmModal')) closeConfirm(); });
}

function updateResourceFoot(input) {
  const card = input.closest('.resource-card');
  if (!card) return;
  const itemDef = activeDay().items.find(i => i.id === card.dataset.itemId);
  if (!itemDef) return;
  const spans = card.querySelectorAll('.resource-foot strong');
  if (spans[0]) spans[0].textContent = fmt.format(usableQuantity(itemDef));
  if (spans[1]) spans[1].textContent = `${fmt.format(Math.floor(usableQuantity(itemDef) * effectivePoints(activeDay().id, itemDef)))} pts`;
}

bindEvents();
renderAll();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').catch(() => {}));
}
