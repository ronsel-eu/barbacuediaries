const STORAGE_KEY = "barbacue-diaries.mobile.entries.v1";
const entryForm = document.getElementById("entry-form");
const filtersForm = document.getElementById("filters-form");
const entriesList = document.getElementById("entries-list");
const emptyState = document.getElementById("empty-state");
const entryCount = document.getElementById("entry-count");
const formFeedback = document.getElementById("form-feedback");
const detailModal = document.getElementById("detail-modal");
const detailContent = document.getElementById("detail-content");
const modalTitle = document.getElementById("modal-title");
let selectedEntryId = null;

function loadEntries() {
  try {
    const entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(entries) ? entries : [];
  } catch (_error) {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function readForm(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function makeEntry(payload, existing = {}) {
  const anverse = Number(payload.cookTimeAnverseMinutes);
  const reverse = Number(payload.cookTimeReverseMinutes);
  return {
    ...existing,
    id: existing.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    meat: String(payload.meat).trim(),
    cookerType: payload.cookerType,
    cookTimeAnverseMinutes: anverse,
    cookTimeReverseMinutes: reverse,
    totalCookTimeMinutes: anverse + reverse,
    temperature: Number(payload.temperature),
    smoked: payload.smoked,
    wood: String(payload.wood).trim(),
    resultStars: Number(payload.resultStars),
    tips: String(payload.tips || "").trim(),
    createdAt: existing.createdAt || new Date().toISOString()
  };
}

function getFilteredEntries() {
  const filters = readForm(filtersForm);
  const query = String(filters.query || "").trim().toLowerCase();
  return loadEntries()
    .filter((entry) => {
      const searchable = `${entry.meat} ${entry.wood} ${entry.cookerType}`.toLowerCase();
      return (!query || searchable.includes(query)) && (!filters.cookerType || entry.cookerType === filters.cookerType);
    })
    .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));
}

function stars(value) {
  const rating = Number(value);
  return `${"★".repeat(rating)}${"☆".repeat(Math.max(0, 5 - rating))}`;
}

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown date" : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function renderEntries() {
  const allEntries = loadEntries();
  const entries = getFilteredEntries();
  entryCount.textContent = `${allEntries.length} ${allEntries.length === 1 ? "cook" : "cooks"}`;
  entriesList.innerHTML = "";
  emptyState.classList.toggle("hidden", entries.length > 0);
  if (!entries.length) return;

  for (const entry of entries) {
    const item = document.createElement("li");
    item.className = "entry-card";
    item.innerHTML = `<button type="button" data-entry-id="${escapeHtml(entry.id)}"><span class="entry-name">${escapeHtml(entry.meat)}</span><span class="entry-meta">${escapeHtml(entry.cookerType)} · ${entry.totalCookTimeMinutes} min · ${entry.temperature}° · ${escapeHtml(entry.wood)}</span>${entry.tips ? `<p class="entry-tip">${escapeHtml(entry.tips)}</p>` : ""}</button><span class="entry-rating" aria-label="${entry.resultStars} out of 5 stars">${stars(entry.resultStars)}</span>`;
    entriesList.appendChild(item);
  }
}

function openDetails(id) {
  const entry = loadEntries().find((item) => item.id === id);
  if (!entry) return;
  selectedEntryId = id;
  modalTitle.textContent = entry.meat;
  detailContent.innerHTML = `<div class="detail-grid"><div class="detail-item"><span>Cooker</span>${escapeHtml(entry.cookerType)}</div><div class="detail-item"><span>Result</span><strong class="entry-rating">${stars(entry.resultStars)}</strong></div><div class="detail-item"><span>Time</span>${entry.totalCookTimeMinutes} min</div><div class="detail-item"><span>Temperature</span>${entry.temperature}°</div><div class="detail-item"><span>Smoked</span>${escapeHtml(entry.smoked)}</div><div class="detail-item"><span>Wood</span>${escapeHtml(entry.wood)}</div><div class="detail-item"><span>Cooked</span>${formatDate(entry.createdAt)}</div></div>${entry.tips ? `<p class="detail-tips">${escapeHtml(entry.tips)}</p>` : ""}`;
  detailModal.classList.remove("hidden");
}

function closeDetails() {
  detailModal.classList.add("hidden");
  selectedEntryId = null;
}

function showView(viewId) {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  document.querySelectorAll(".nav-button").forEach((button) => button.classList.toggle("active", button.dataset.view === viewId));
  if (viewId === "new-view") entryForm.querySelector("input")?.focus();
}

entryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!entryForm.reportValidity()) return;
  const entries = loadEntries();
  entries.push(makeEntry(readForm(entryForm)));
  saveEntries(entries);
  entryForm.reset();
  formFeedback.textContent = "Saved on this phone.";
  showView("archive-view");
  renderEntries();
});

filtersForm.addEventListener("input", renderEntries);
filtersForm.addEventListener("change", renderEntries);
entriesList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-entry-id]");
  if (button) openDetails(button.dataset.entryId);
});
document.querySelectorAll(".nav-button").forEach((button) => button.addEventListener("click", () => showView(button.dataset.view)));
document.getElementById("empty-add-button").addEventListener("click", () => showView("new-view"));
document.getElementById("close-modal").addEventListener("click", closeDetails);
detailModal.addEventListener("click", (event) => { if (event.target === detailModal) closeDetails(); });
document.getElementById("delete-button").addEventListener("click", () => {
  if (!selectedEntryId || !confirm("Delete this cook from this phone?")) return;
  saveEntries(loadEntries().filter((entry) => entry.id !== selectedEntryId));
  closeDetails();
  renderEntries();
});
document.getElementById("edit-button").addEventListener("click", () => {
  const entry = loadEntries().find((item) => item.id === selectedEntryId);
  if (!entry) return;
  closeDetails();
  showView("new-view");
  for (const [key, value] of Object.entries(entry)) {
    const field = entryForm.elements.namedItem(key);
    if (field && field.type !== "radio") field.value = value;
  }
  const rating = entryForm.querySelector(`input[name="resultStars"][value="${entry.resultStars}"]`);
  if (rating) rating.checked = true;
  entryForm.dataset.editingId = entry.id;
  formFeedback.textContent = "Editing cook. Save to update it.";
});

const originalSubmit = entryForm.onsubmit;
entryForm.addEventListener("submit", (event) => {
  const editingId = entryForm.dataset.editingId;
  if (!editingId) return;
  event.stopImmediatePropagation();
  const entries = loadEntries();
  const index = entries.findIndex((entry) => entry.id === editingId);
  if (index === -1) return;
  entries[index] = makeEntry(readForm(entryForm), entries[index]);
  saveEntries(entries);
  delete entryForm.dataset.editingId;
  entryForm.reset();
  formFeedback.textContent = "Changes saved on this phone.";
  showView("archive-view");
  renderEntries();
}, true);

document.getElementById("export-button").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(loadEntries(), null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `barbacue-diaries-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  document.getElementById("settings-feedback").textContent = "Backup exported.";
});
document.getElementById("import-input").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    if (!Array.isArray(imported)) throw new Error("Backup must be an array");
    saveEntries(imported);
    renderEntries();
    document.getElementById("settings-feedback").textContent = `${imported.length} cooks imported.`;
  } catch (_error) {
    document.getElementById("settings-feedback").textContent = "Could not read that backup.";
  }
});

if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
renderEntries();
