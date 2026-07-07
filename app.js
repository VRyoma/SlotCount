const STORAGE_KEY = "slotcount-state-v1";

const YAKU = [
  { key: "c", label: "C", color: "#4fc3f7" },
  { key: "cherry", label: "チェリー", color: "#ef4444" },
  { key: "grape", label: "ブドウ", color: "#a855f7" },
  { key: "bell", label: "ベル", color: "#fde047" },
  { key: "bar", label: "BAR", color: "#ffa726" },
  { key: "seven", label: "7", color: "#dc2626" },
];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("no state");
    const parsed = JSON.parse(raw);
    const counts = {};
    for (const y of YAKU) {
      counts[y.key] = Number.isFinite(parsed.counts?.[y.key]) ? parsed.counts[y.key] : 0;
    }
    return { spins: Number.isFinite(parsed.spins) ? parsed.spins : 0, counts };
  } catch {
    const counts = {};
    for (const y of YAKU) counts[y.key] = 0;
    return { spins: 0, counts };
  }
}

let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatProb(spins, count) {
  if (count <= 0 || spins <= 0) return "-";
  return `1/${(spins / count).toFixed(1)}`;
}

const spinCountEl = document.getElementById("spinCount");
const boardEl = document.getElementById("board");

function render() {
  spinCountEl.textContent = state.spins;

  for (const y of YAKU) {
    const countEl = document.getElementById(`count-${y.key}`);
    const probEl = document.getElementById(`prob-${y.key}`);
    countEl.textContent = state.counts[y.key];
    probEl.textContent = formatProb(state.spins, state.counts[y.key]);
  }
}

function buildBoard() {
  boardEl.innerHTML = "";
  for (const y of YAKU) {
    const card = document.createElement("div");
    card.className = "card";
    card.style.setProperty("--card-color", y.color);
    card.innerHTML = `
      <div class="card__label">${y.label}</div>
      <button class="card__count" id="count-${y.key}" data-yaku="${y.key}" data-delta="1" aria-label="${y.label}を1増やす（タップ）">0</button>
      <div class="card__prob" id="prob-${y.key}">-</div>
      <div class="card__buttons">
        <button class="btn btn--minus" data-yaku="${y.key}" data-delta="-1" aria-label="${y.label}を1減らす">−1</button>
        <button class="btn btn--plus" data-yaku="${y.key}" data-delta="1" aria-label="${y.label}を1増やす">+1</button>
      </div>
    `;
    boardEl.appendChild(card);
  }
}

buildBoard();
render();

document.querySelectorAll("[data-spin]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const delta = Number(btn.dataset.spin);
    state.spins = Math.max(0, state.spins + delta);
    saveState();
    render();
  });
});

boardEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-yaku]");
  if (!btn) return;
  const key = btn.dataset.yaku;
  const delta = Number(btn.dataset.delta);
  state.counts[key] = Math.max(0, state.counts[key] + delta);
  saveState();
  render();
});

const resetBtn = document.getElementById("resetBtn");
const confirmOverlay = document.getElementById("confirmOverlay");
const cancelReset = document.getElementById("cancelReset");
const okReset = document.getElementById("okReset");

resetBtn.addEventListener("click", () => {
  confirmOverlay.classList.add("show");
});

cancelReset.addEventListener("click", () => {
  confirmOverlay.classList.remove("show");
});

okReset.addEventListener("click", () => {
  const counts = {};
  for (const y of YAKU) counts[y.key] = 0;
  state = { spins: 0, counts };
  saveState();
  render();
  confirmOverlay.classList.remove("show");
});
