const ROUTES = window.ROUTES || [];

const STORAGE_KEYS = {
  drawn: "jrg_drawnRouteIds",
  unlocked: "jrg_unlockedRouteIds",
  favorites: "jrg_favoriteRouteIds",
  last: "jrg_lastDrawnRouteId"
};

const state = {
  spinning: false
};

const SAMPLE_UNLOCKED_PREFECTURES = new Set(["Tokyo"]);

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function readArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function writeArray(key, value) {
  localStorage.setItem(key, JSON.stringify([...new Set(value)]));
}

function getDrawn() {
  return readArray(STORAGE_KEYS.drawn);
}

function getUnlocked() {
  return readArray(STORAGE_KEYS.unlocked);
}

function getFavorites() {
  return readArray(STORAGE_KEYS.favorites);
}

function isSampleUnlocked(route) {
  return SAMPLE_UNLOCKED_PREFECTURES.has(route.prefecture);
}

function paidRoutes() {
  return ROUTES.filter(route => !isSampleUnlocked(route));
}

function setLastDrawn(id) {
  localStorage.setItem(STORAGE_KEYS.last, id);
}

function getLastDrawn() {
  return localStorage.getItem(STORAGE_KEYS.last);
}

function filteredRoutes() {
  return paidRoutes();
}

function availableRoutes() {
  const drawn = new Set(getDrawn());
  const filtered = filteredRoutes();
  const notDrawn = filtered.filter(route => !drawn.has(route.id));
  return notDrawn.length ? notDrawn : filtered;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value;
}

function updateCounts() {
  const drawn = getDrawn();
  const paid = paidRoutes();
  const paidIds = new Set(paid.map(route => route.id));
  const paidDrawn = drawn.filter(id => paidIds.has(id));
  const remaining = Math.max(paid.length - paidDrawn.length, 0);

  setText("#routeCount", paid.length);
  setText("#drawnCount", paidDrawn.length);
  setText("#remainingCount", remaining);
}

function renderResult(route) {
  const template = $("#resultTemplate");
  const node = template.content.cloneNode(true);
  const card = $(".pulled-card", node);

  $(".js-region", node).textContent = route.region;
  $(".js-type", node).textContent = route.routeType;
  $(".js-prefecture", node).textContent = route.prefecture;
  $(".js-name", node).textContent = route.routeName;
  $(".js-preview", node).textContent = route.previewText;
  $(".js-days", node).textContent = route.days;
  $(".js-start", node).textContent = `Best add-on from ${route.startFrom.join(" or ")}`;
  $(".js-difficulty", node).textContent = `${route.transportDifficulty} transport`;

  const tags = $(".js-tags", node);
  route.moods.forEach(mood => {
    const span = document.createElement("span");
    span.textContent = mood;
    tags.appendChild(span);
  });

  const unlockButton = $(".js-unlock", node);
  const finePrint = $(".fine-print", node);
  if (isSampleUnlocked(route)) {
    unlockButton.textContent = "Sample unlocked";
    unlockButton.disabled = true;
    unlockButton.classList.add("is-sample-unlocked");
    finePrint.textContent = "Tokyo sample route. This preview is unlocked for free.";
  } else {
    unlockButton.addEventListener("click", () => checkout("single", route.id));
  }
  $(".js-spin-again", node).addEventListener("click", spinRoute);

  const result = $("#result");
  result.classList.remove("empty");
  result.innerHTML = "";
  result.appendChild(node);
  card.scrollIntoView({ behavior: "smooth", block: "center" });
}

function renderDeck() {
  const drawn = getDrawn();
  const unlocked = new Set(getUnlocked());
  const favorites = new Set(getFavorites());
  const list = $("#deckList");
  list.innerHTML = "";

  if (!drawn.length) {
    list.innerHTML = `<article class="route-mini-card"><p>No routes drawn yet. Spin the gacha to start your route history.</p></article>`;
    return;
  }

  drawn.slice().reverse().forEach(id => {
    const route = ROUTES.find(item => item.id === id);
    if (!route) return;
    const isUnlocked = unlocked.has(route.id) || isSampleUnlocked(route);
    const card = document.createElement("article");
    card.className = "route-mini-card";
    card.innerHTML = `
      <p class="small-label">${route.prefecture}</p>
      <h3>${route.routeName}</h3>
      <p>${route.previewText}</p>
      <div class="mini-meta">
        <span>${route.routeType}</span>
        <span>${isUnlocked ? "Unlocked" : "Preview"}</span>
        <span>${favorites.has(route.id) ? "Favorite" : ""}</span>
      </div>
    `;
    list.appendChild(card);
  });
}

function renderPrefectureGrid() {
  const drawn = getDrawn();
  const counts = {};
  paidRoutes().forEach(route => {
    counts[route.prefecture] = counts[route.prefecture] || { total: 0, drawn: 0 };
    counts[route.prefecture].total += 1;
  });
  drawn.forEach(id => {
    const route = paidRoutes().find(item => item.id === id);
    if (route) counts[route.prefecture].drawn += 1;
  });

  const grid = $("#prefectureGrid");
  grid.innerHTML = "";
  Object.keys(counts).forEach(prefecture => {
    const count = counts[prefecture];
    const chip = document.createElement("div");
    chip.className = "pref-chip";
    if (count.drawn > 0) chip.classList.add("started");
    if (count.drawn === count.total) chip.classList.add("completed");
    chip.innerHTML = `<strong>${prefecture}</strong><span>${count.drawn} / ${count.total} discovered</span>`;
    grid.appendChild(chip);
  });
}

function refreshAll() {
  updateCounts();
}

async function spinRoute() {
  if (state.spinning) return;
  const candidates = availableRoutes();
  if (!candidates.length) {
    alert("No routes are available right now. Please try again later.");
    return;
  }

  state.spinning = true;
  $("#spinButton").disabled = true;
  $(".machine").classList.add("spinning");

  const slotText = $("#slotText");
  const names = candidates.map(route => route.prefecture);
  let tick = 0;
  const interval = setInterval(() => {
    slotText.textContent = names[tick % names.length].toUpperCase();
    tick += 1;
  }, 70);

  await new Promise(resolve => setTimeout(resolve, 1250));
  clearInterval(interval);

  const route = pickRandom(candidates);
  const drawn = getDrawn();
  if (!drawn.includes(route.id)) {
    drawn.push(route.id);
    writeArray(STORAGE_KEYS.drawn, drawn);
  }
  setLastDrawn(route.id);

  slotText.textContent = route.prefecture.toUpperCase();
  $(".machine").classList.remove("spinning");
  $("#spinButton").disabled = false;
  state.spinning = false;

  renderResult(route);
  refreshAll();
}

function resetDeck() {
  const ok = confirm("Reset your pulled routes?");
  if (!ok) return;
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  $("#result").className = "result-area empty";
  $("#result").innerHTML = `<p class="small-label">Your route card will appear here.</p>`;
  $("#slotText").textContent = "READY";
  refreshAll();
}

function toggleFavorite(routeId) {
  const favorites = getFavorites();
  if (favorites.includes(routeId)) {
    writeArray(STORAGE_KEYS.favorites, favorites.filter(id => id !== routeId));
  } else {
    favorites.push(routeId);
    writeArray(STORAGE_KEYS.favorites, favorites);
  }
  refreshAll();
}

async function checkout(plan, routeId = null) {
  const lastRoute = routeId || getLastDrawn();
  const payload = {
    plan,
    routeId: lastRoute,
    successUrl: `${window.location.origin}${window.location.pathname}?checkout=success`,
    cancelUrl: `${window.location.origin}${window.location.pathname}?checkout=cancel`
  };

  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Checkout session could not be created.");

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    throw new Error("No Checkout URL returned.");
  } catch (error) {
    console.error(error);
    alert("Checkout is temporarily unavailable. Please try again later.");
  }
}



function setupPricingButtons() {
  $$(".checkout-plan").forEach(button => {
    button.addEventListener("click", () => checkout(button.dataset.plan));
  });
}

function restoreLastResult() {
  const last = getLastDrawn();
  const route = ROUTES.find(item => item.id === last);
  if (route) renderResult(route);
}

function handleCheckoutReturn() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("checkout") === "success") {
    const last = getLastDrawn();
    if (last) {
      const unlocked = getUnlocked();
      if (!unlocked.includes(last)) {
        unlocked.push(last);
        writeArray(STORAGE_KEYS.unlocked, unlocked);
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {

  setupPricingButtons();
  $("#spinButton").addEventListener("click", spinRoute);

  handleCheckoutReturn();
  refreshAll();
});
