const entryForm = document.getElementById("entry-form");
const entryFeedback = document.getElementById("entry-feedback");
const filtersForm = document.getElementById("filters-form");
const entriesList = document.getElementById("entries-list");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const detailContainer = document.getElementById("entry-detail");
const detailModal = document.getElementById("detail-modal");
const closeDetailModalButton = document.getElementById("close-detail-modal");
let selectedEntryId = null;

function openDetailModal() {
  detailModal.classList.remove("hidden");
}

function closeDetailModal() {
  detailModal.classList.add("hidden");
}

function getCookTimeMinutes(entry) {
  const totalCookTimeMinutes = Number(entry.totalCookTimeMinutes);

  if (Number.isFinite(totalCookTimeMinutes)) {
    return totalCookTimeMinutes;
  }

  const anverse = Number(entry.cookTimeAnverseMinutes);
  const reverse = Number(entry.cookTimeReverseMinutes);

  if (Number.isFinite(anverse) && Number.isFinite(reverse)) {
    return anverse + reverse;
  }

  const legacyCookTime = Number(entry.cookTimeMinutes);
  return Number.isFinite(legacyCookTime) ? legacyCookTime : 0;
}

function getResultStars(entry) {
  const stars = Number(entry.resultStars);
  return Number.isInteger(stars) && stars >= 1 && stars <= 5 ? stars : null;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(isoValue) {
  const date = new Date(isoValue);
  return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleString();
}

function readForm(formElement) {
  const formData = new FormData(formElement);
  return Object.fromEntries(formData.entries());
}

function showEntryFeedback(message, isError = false) {
  entryFeedback.textContent = message;
  entryFeedback.style.color = isError ? "#a8211a" : "#475b40";
}

function renderEntryList(entries) {
  entriesList.innerHTML = "";

  if (!entries.length) {
    const item = document.createElement("li");
    item.textContent = "No entries found.";
    entriesList.appendChild(item);
    return;
  }

  for (const entry of entries) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    const resultStars = getResultStars(entry);
    const resultLabel = resultStars ? `${resultStars}/5` : "n/a";

    button.type = "button";
    button.dataset.id = entry.id;
    button.innerHTML = `<strong>${entry.meat}</strong> - ${entry.cookerType} - ${getCookTimeMinutes(entry)} min - ${entry.temperature} deg - ${resultLabel}`;
    button.addEventListener("click", () => {
      loadEntryDetail(entry.id);
    });

    item.appendChild(button);
    entriesList.appendChild(item);
  }
}

function renderEntryDetail(entry) {
  detailContainer.classList.remove("empty");
  const anverse = Number(entry.cookTimeAnverseMinutes);
  const reverse = Number(entry.cookTimeReverseMinutes);
  const hasSplitTimes = Number.isFinite(anverse) && Number.isFinite(reverse);
  const resultStars = getResultStars(entry);
  const tips = String(entry.tips || "").trim();
  const legacyResult = String(entry.result || "").trim();
  const resultLabel = resultStars ? `${resultStars}/5` : (legacyResult || "n/a");

  detailContainer.innerHTML = `
    <p class="detail-row"><strong>Meat:</strong> ${entry.meat}</p>
    <p class="detail-row"><strong>Cooker:</strong> ${entry.cookerType}</p>
    <p class="detail-row"><strong>Cook time anverse:</strong> ${hasSplitTimes ? anverse : "n/a"} min</p>
    <p class="detail-row"><strong>Cook time reverse:</strong> ${hasSplitTimes ? reverse : "n/a"} min</p>
    <p class="detail-row"><strong>Total cook time:</strong> ${getCookTimeMinutes(entry)} min</p>
    <p class="detail-row"><strong>Temperature:</strong> ${entry.temperature}</p>
    <p class="detail-row"><strong>Smoked:</strong> ${entry.smoked}</p>
    <p class="detail-row"><strong>Wood:</strong> ${entry.wood}</p>
    <p class="detail-row"><strong>Final result:</strong> ${resultLabel}</p>
    <p class="detail-row"><strong>Tips:</strong> ${tips || "-"}</p>
    <p class="detail-row"><strong>Created:</strong> ${formatDate(entry.createdAt)}</p>
    <div class="actions detail-actions detail-read-actions">
      <button id="edit-entry-button" type="button">Edit Entry</button>
    </div>
  `;
}

function getEditableSplitTimes(entry) {
  const anverse = Number(entry.cookTimeAnverseMinutes);
  const reverse = Number(entry.cookTimeReverseMinutes);

  if (Number.isFinite(anverse) && Number.isFinite(reverse)) {
    return { anverse, reverse };
  }

  const total = Math.max(1, getCookTimeMinutes(entry));
  return {
    anverse: Math.max(1, total - 1),
    reverse: 1
  };
}

function renderDetailEditForm(entry) {
  const { anverse, reverse } = getEditableSplitTimes(entry);
  const resultStars = getResultStars(entry) || 3;
  const tips = escapeHtml(entry.tips || "");

  detailContainer.classList.remove("empty");
  detailContainer.innerHTML = `
    <form id="detail-edit-form" class="grid-form">
      <label>
        Meat
        <input name="meat" type="text" maxlength="60" required value="${escapeHtml(entry.meat)}" />
      </label>

      <label>
        Cooker
        <select name="cookerType" required>
          <option value="parrilla" ${entry.cookerType === "parrilla" ? "selected" : ""}>Parrilla</option>
          <option value="kamado" ${entry.cookerType === "kamado" ? "selected" : ""}>Kamado</option>
        </select>
      </label>

      <label>
        Cook Time Anverse (min)
        <input name="cookTimeAnverseMinutes" type="number" min="1" step="1" required value="${anverse}" />
      </label>

      <label>
        Cook Time Reverse (min)
        <input name="cookTimeReverseMinutes" type="number" min="1" step="1" required value="${reverse}" />
      </label>

      <label>
        Temperature
        <input name="temperature" type="number" step="1" required value="${escapeHtml(entry.temperature)}" />
      </label>

      <label>
        Smoked
        <select name="smoked" required>
          <option value="yes" ${entry.smoked === "yes" ? "selected" : ""}>Yes</option>
          <option value="no" ${entry.smoked === "no" ? "selected" : ""}>No</option>
        </select>
      </label>

      <label>
        Wood
        <input name="wood" type="text" maxlength="50" required value="${escapeHtml(entry.wood)}" />
      </label>

      <label class="full-width">
        Final Result
        <fieldset class="star-rating" aria-label="Edit final result rating">
          <input id="edit-rating-5" type="radio" name="resultStars" value="5" ${resultStars === 5 ? "checked" : ""} required />
          <label for="edit-rating-5" title="5 stars"></label>
          <input id="edit-rating-4" type="radio" name="resultStars" value="4" ${resultStars === 4 ? "checked" : ""} />
          <label for="edit-rating-4" title="4 stars"></label>
          <input id="edit-rating-3" type="radio" name="resultStars" value="3" ${resultStars === 3 ? "checked" : ""} />
          <label for="edit-rating-3" title="3 stars"></label>
          <input id="edit-rating-2" type="radio" name="resultStars" value="2" ${resultStars === 2 ? "checked" : ""} />
          <label for="edit-rating-2" title="2 stars"></label>
          <input id="edit-rating-1" type="radio" name="resultStars" value="1" ${resultStars === 1 ? "checked" : ""} />
          <label for="edit-rating-1" title="1 star"></label>
        </fieldset>
      </label>

      <label class="full-width">
        Tips
        <textarea name="tips" rows="3" maxlength="280">${tips}</textarea>
      </label>

      <div class="actions full-width detail-actions">
        <button type="submit">Save Changes</button>
        <button id="cancel-edit-button" type="button" class="secondary">Cancel</button>
      </div>
      <p id="detail-feedback" class="feedback" aria-live="polite"></p>
    </form>
  `;
}

function activateTab(panelId) {
  for (const tabButton of tabButtons) {
    const isActive = tabButton.dataset.tab === panelId;
    tabButton.classList.toggle("active", isActive);
    tabButton.setAttribute("aria-selected", String(isActive));
  }

  for (const tabPanel of tabPanels) {
    const shouldShow = tabPanel.id === panelId;
    tabPanel.classList.toggle("hidden", !shouldShow);
  }
}

async function loadAllEntries() {
  const filters = readForm(filtersForm);
  const response = await window.barbacueApi.searchEntries(filters);

  if (!response.ok) {
    renderEntryList([]);
    return;
  }

  renderEntryList(response.data);
}

async function loadEntryDetail(id) {
  selectedEntryId = id;
  const response = await window.barbacueApi.getEntryById(id);

  if (!response.ok) {
    detailContainer.classList.add("empty");
    detailContainer.textContent = response.error || "Entry not found.";
    openDetailModal();
    return;
  }

  renderEntryDetail(response.data);
  openDetailModal();
}

entryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  showEntryFeedback("Saving entry...");

  const payload = readForm(entryForm);
  const anverse = Number(payload.cookTimeAnverseMinutes);
  const reverse = Number(payload.cookTimeReverseMinutes);

  // Compatibility for older running main-process validation expecting legacy field.
  if (Number.isFinite(anverse) && Number.isFinite(reverse)) {
    payload.cookTimeMinutes = anverse + reverse;
  }

  const response = await window.barbacueApi.createEntry(payload);

  if (!response.ok) {
    showEntryFeedback(response.error || "Could not save entry", true);
    return;
  }

  entryForm.reset();
  showEntryFeedback("Entry saved.");
  await loadAllEntries();
});

filtersForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const filters = readForm(filtersForm);
  const response = await window.barbacueApi.searchEntries(filters);

  if (!response.ok) {
    renderEntryList([]);
    return;
  }

  renderEntryList(response.data);
});

detailContainer.addEventListener("click", async (event) => {
  if (event.target.id === "edit-entry-button") {
    if (!selectedEntryId) {
      return;
    }

    const response = await window.barbacueApi.getEntryById(selectedEntryId);

    if (!response.ok) {
      detailContainer.classList.add("empty");
      detailContainer.textContent = response.error || "Entry not found.";
      return;
    }

    renderDetailEditForm(response.data);
    return;
  }

  if (event.target.id === "cancel-edit-button") {
    if (!selectedEntryId) {
      return;
    }

    await loadEntryDetail(selectedEntryId);
  }
});

detailContainer.addEventListener("submit", async (event) => {
  if (event.target.id !== "detail-edit-form") {
    return;
  }

  event.preventDefault();

  if (!selectedEntryId) {
    return;
  }

  const payload = readForm(event.target);
  const anverse = Number(payload.cookTimeAnverseMinutes);
  const reverse = Number(payload.cookTimeReverseMinutes);

  if (Number.isFinite(anverse) && Number.isFinite(reverse)) {
    payload.cookTimeMinutes = anverse + reverse;
  }

  const feedback = detailContainer.querySelector("#detail-feedback");
  if (feedback) {
    feedback.textContent = "Saving changes...";
    feedback.style.color = "#475b40";
  }

  const response = await window.barbacueApi.updateEntry(selectedEntryId, payload);

  if (!response.ok) {
    if (feedback) {
      feedback.textContent = response.error || "Could not update entry";
      feedback.style.color = "#a8211a";
    }
    return;
  }

  renderEntryDetail(response.data);
  await loadAllEntries();
});

for (const tabButton of tabButtons) {
  tabButton.addEventListener("click", () => {
    activateTab(tabButton.dataset.tab);
  });
}

closeDetailModalButton.addEventListener("click", () => {
  closeDetailModal();
});

detailModal.addEventListener("click", (event) => {
  if (event.target === detailModal) {
    closeDetailModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !detailModal.classList.contains("hidden")) {
    closeDetailModal();
  }
});

activateTab("archive-panel");
loadAllEntries();
