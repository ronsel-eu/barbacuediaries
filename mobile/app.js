const STORAGE_KEY = "barbacue-diaries.mobile.entries.v1";
const SETTINGS_KEY = "barbacue-diaries.mobile.settings.v1";

// Reference temperatures (°C) for each hand-test heat level, for comparison
// against a thermometer reading. Source: David's own reference, Escuela
// Argentina de Parrilleros ("El Libro") — fitted specifically for an open
// parrilla, not a generic/US-style hand test.
const LEVEL_TEMPERATURES_C = { high: 220, medium: 180, "medium-low": 160, low: 140 };

const COOKER_TYPES = [
  { value: "parrilla", label: "Parrilla argentina" },
  { value: "kamado", label: "Kamado" },
  { value: "barbacoa-carbon", label: "Barbacoa de carbón" },
  { value: "barbacoa-gas", label: "Barbacoa de gas" },
  { value: "barbacoa-electrica", label: "Barbacoa eléctrica" },
  { value: "barril-ahumador", label: "Barril ahumador" },
  { value: "ahumador", label: "Ahumador" }
];
const DEFAULT_ENABLED_COOKER_TYPES = ["barbacoa-carbon"];

// Seconds you can hold a hand over the fire for each heat level.
const LEVEL_SECONDS = { high: "<5s", medium: "6–8s", "medium-low": "8–10s", low: ">10s" };

function cookerTypeLabel(value) {
  const key = `cooker.${value}`;
  const translated = t(key);
  if (translated !== key) return translated;
  const match = COOKER_TYPES.find((cooker) => cooker.value === value);
  return match ? match.label : value;
}

// Cooker values sorted alphabetically by their label in the current language.
function sortCookerValues(values) {
  return [...values].sort((a, b) => cookerTypeLabel(a).localeCompare(cookerTypeLabel(b), currentSettings.language));
}

const TRANSLATIONS = {
  en: {
    "header.eyebrow": "Private cook log",
    "archive.colCook": "Cook",
    "archive.colTime": "Time",
    "archive.colResult": "Result",
    "archive.noMatchTitle": "Nothing here",
    "archive.noMatchBody": "No cooks for this search or cooker. Try all cookers.",
    "import.title": "Import backup",
    "import.statFile": "cooks in this file",
    "import.statNew": "new",
    "import.statExisting": "already in your archive",
    "import.explainKeepMine": "Adds the new cooks. If a cook is in both, yours stays.",
    "import.explainUseFile": "Adds the new cooks. If a cook is in both, the file's version wins.",
    "import.explainReplace": "Deletes everything on this phone and uses only the file.",
    "import.explainCancel": "Nothing changes.",
    "cooker.parrilla": "Parrilla",
    "cooker.kamado": "Kamado",
    "cooker.barbacoa-carbon": "Charcoal BBQ",
    "cooker.barbacoa-gas": "Gas BBQ",
    "cooker.barbacoa-electrica": "Electric BBQ",
    "cooker.barril-ahumador": "Smoker barrel",
    "cooker.ahumador": "Smoker",
    "archive.eyebrow": "Your fire history",
    "archive.title": "Archive",
    "archive.searchLabel": "Search",
    "archive.searchPlaceholder": "Meat or recipe",
    "archive.filterAriaLabel": "Filter by cooker",
    "archive.filterAll": "All cookers",
    "archive.emptyAddAria": "Add first cook",
    "archive.emptyTitle": "No cooks yet",
    "archive.emptyBody": "Capture the next fire while the details are still fresh.",
    "archive.emptyButton": "Add first cook",
    "count.cook": "cook",
    "count.cooks": "cooks",
    "new.eyebrow": "Write it down",
    "new.title": "New cook",
    "form.meatLabel": "Meat",
    "form.meatPlaceholder": "e.g. Picanha",
    "form.cookerLabel": "Cooker",
    "form.cookerChoose": "Choose one",
    "form.anverseLabel": "Anverse minutes",
    "form.reverseLabel": "Reverse minutes",
    "form.temperatureLabel": "Temperature",
    "form.tempModeAriaLabel": "Temperature input mode",
    "form.modeDegrees": "Degrees",
    "form.modeLevel": "Hand test",
    "form.levelGroupAriaLabel": "Heat level (hand test over the fire)",
    "level.high": "High",
    "level.medium": "Medium",
    "level.medium-low": "Medium-low",
    "level.low": "Low",
    "form.levelCaption": "Seconds you can hold your hand above the fire, with an approximate temperature for comparison.",
    "form.smokedLabel": "Smoked",
    "form.smokedNo": "No",
    "form.smokedYes": "Yes",
    "form.woodLabel": "Wood",
    "form.woodPlaceholder": "e.g. Encina",
    "form.finalResultLegend": "Final result",
    "form.starRatingAriaLabel": "Final result rating",
    "star.title5": "5 stars",
    "star.title4": "4 stars",
    "star.title3": "3 stars",
    "star.title2": "2 stars",
    "star.title1": "1 star",
    "form.recipeLabel": "Recipe",
    "form.recipePlaceholder": "Ingredients or method you followed",
    "form.tipsLabel": "Tips for next time",
    "form.tipsPlaceholder": "What would you repeat or change?",
    "form.saveButton": "Save cook",
    "feedback.changesSaved": "Changes saved on this phone.",
    "feedback.saved": "Saved on this phone.",
    "feedback.editing": "Editing cook. Save to update it.",
    "settings.eyebrow": "On this phone",
    "settings.title": "Settings",
    "settings.languageTitle": "Language",
    "settings.languageDesc": "Choose the app's display language.",
    "settings.languageAriaLabel": "Language",
    "settings.tempUnitTitle": "Temperature unit",
    "settings.tempUnitDesc": "Used when saving new cooks and to display existing ones.",
    "settings.tempUnitAriaLabel": "Temperature unit",
    "settings.cookerTypesTitle": "Cooker types",
    "settings.cookerTypesDesc": "Choose which cookers you use — only these show up when adding or filtering a cook.",
    "settings.cookerTypesAriaLabel": "Cooker types you use",
    "settings.storageTitle": "Local storage",
    "settings.storageDesc": "Your entries stay in this browser on this phone. Nothing is uploaded.",
    "settings.backupTitle": "Backup",
    "settings.backupDesc": "CSV files, readable in Excel, Numbers, or Google Sheets. You choose to merge or replace when importing.",
    "settings.exportButton": "Export backup",
    "settings.importButton": "Import backup",
    "import.noEntries": "That file has no cooks in it.",
    "import.summaryWithDuplicates": "{total} cooks in this file: {newCount} {newWord}, {duplicateCount} already in your archive.",
    "import.summaryAllNew": "{total} cooks in this file, all new.",
    "import.newSingular": "new",
    "import.newPlural": "new",
    "import.couldNotRead": "Could not read that backup.",
    "import.mergeKeepMine": "Merge, keep mine",
    "import.merge": "Merge",
    "import.mergeUseFile": "Merge, use file",
    "import.replaceAll": "Replace all",
    "import.cancel": "Cancel",
    "settings.feedbackExported": "Backup exported.",
    "settings.feedbackExportFailed": "Couldn't share the backup file. Try again.",
    "settings.feedbackMergedKeepMine": "Merged. Kept your existing cooks where the file overlapped.",
    "settings.feedbackMergedUseFile": "Merged. Used the file's version where it overlapped.",
    "settings.feedbackReplaced": "{count} cooks imported (replaced everything on this phone).",
    "settings.feedbackImportCancelled": "Import cancelled.",
    "nav.archive": "Archive",
    "nav.new": "New cook",
    "nav.settings": "Settings",
    "modal.eyebrow": "Cook detail",
    "modal.close": "Close",
    "modal.edit": "Edit",
    "modal.delete": "Delete",
    "modal.deleteConfirm": "Delete this cook from this phone?",
    "detail.cooker": "Cooker",
    "detail.result": "Result",
    "detail.time": "Time",
    "detail.anverseTime": "Anverse",
    "detail.reverseTime": "Reverse",
    "detail.temperature": "Temperature",
    "detail.smoked": "Smoked",
    "detail.wood": "Wood",
    "detail.recipe": "Recipe",
    "detail.tips": "Tips",
    "detail.smokedYes": "yes",
    "detail.smokedNo": "no",
    "misc.na": "n/a",
    "misc.starsAriaLabel": "{stars} out of 5 stars"
  },
  es: {
    "header.eyebrow": "Diario privado de asados",
    "archive.colCook": "Asado",
    "archive.colTime": "Tiempo",
    "archive.colResult": "Resultado",
    "archive.noMatchTitle": "Nada por aquí",
    "archive.noMatchBody": "No hay asados para esta búsqueda o método. Prueba con todos.",
    "import.title": "Importar copia",
    "import.statFile": "asados en este archivo",
    "import.statNew": "nuevos",
    "import.statExisting": "ya en tu archivo",
    "import.explainKeepMine": "Añade los asados nuevos. Si un asado está en ambos, se queda el tuyo.",
    "import.explainUseFile": "Añade los asados nuevos. Si un asado está en ambos, gana el del archivo.",
    "import.explainReplace": "Borra todo lo de este teléfono y usa solo el archivo.",
    "import.explainCancel": "No cambia nada.",
    "cooker.parrilla": "Parrilla argentina",
    "cooker.kamado": "Kamado",
    "cooker.barbacoa-carbon": "Barbacoa de carbón",
    "cooker.barbacoa-gas": "Barbacoa de gas",
    "cooker.barbacoa-electrica": "Barbacoa eléctrica",
    "cooker.barril-ahumador": "Barril ahumador",
    "cooker.ahumador": "Ahumador",
    "archive.eyebrow": "Tu historial de fuego",
    "archive.title": "Archivo",
    "archive.searchLabel": "Buscar",
    "archive.searchPlaceholder": "Carne o receta",
    "archive.filterAriaLabel": "Filtrar por método",
    "archive.filterAll": "Todos los tipos",
    "archive.emptyAddAria": "Añadir primer asado",
    "archive.emptyTitle": "Aún no hay asados",
    "archive.emptyBody": "Registra el próximo fuego mientras los detalles están frescos.",
    "archive.emptyButton": "Añadir primer asado",
    "count.cook": "asado",
    "count.cooks": "asados",
    "new.eyebrow": "Anótalo",
    "new.title": "Nuevo asado",
    "form.meatLabel": "Carne",
    "form.meatPlaceholder": "p. ej. Picanha",
    "form.cookerLabel": "Método",
    "form.cookerChoose": "Elige uno",
    "form.anverseLabel": "Minutos de anverso",
    "form.reverseLabel": "Minutos de reverso",
    "form.temperatureLabel": "Temperatura",
    "form.tempModeAriaLabel": "Modo de temperatura",
    "form.modeDegrees": "Grados",
    "form.modeLevel": "Prueba de la mano",
    "form.levelGroupAriaLabel": "Nivel de calor (prueba de la mano sobre el fuego)",
    "level.high": "Alto",
    "level.medium": "Medio",
    "level.medium-low": "Medio-bajo",
    "level.low": "Bajo",
    "form.levelCaption": "Segundos que aguantas la mano sobre el fuego, con una temperatura aproximada para comparar.",
    "form.smokedLabel": "Ahumado",
    "form.smokedNo": "No",
    "form.smokedYes": "Sí",
    "form.woodLabel": "Leña",
    "form.woodPlaceholder": "p. ej. Encina",
    "form.finalResultLegend": "Resultado final",
    "form.starRatingAriaLabel": "Calificación del resultado final",
    "star.title5": "5 estrellas",
    "star.title4": "4 estrellas",
    "star.title3": "3 estrellas",
    "star.title2": "2 estrellas",
    "star.title1": "1 estrella",
    "form.recipeLabel": "Receta",
    "form.recipePlaceholder": "Ingredientes o método que seguiste",
    "form.tipsLabel": "Consejos para la próxima",
    "form.tipsPlaceholder": "¿Qué repetirías o cambiarías?",
    "form.saveButton": "Guardar asado",
    "feedback.changesSaved": "Cambios guardados en este teléfono.",
    "feedback.saved": "Guardado en este teléfono.",
    "feedback.editing": "Editando asado. Guarda para actualizarlo.",
    "settings.eyebrow": "En este teléfono",
    "settings.title": "Ajustes",
    "settings.languageTitle": "Idioma",
    "settings.languageDesc": "Elige el idioma de la app.",
    "settings.languageAriaLabel": "Idioma",
    "settings.tempUnitTitle": "Unidad de temperatura",
    "settings.tempUnitDesc": "Se usa al guardar nuevos asados y para mostrar los existentes.",
    "settings.tempUnitAriaLabel": "Unidad de temperatura",
    "settings.cookerTypesTitle": "Tipos de barbacoa",
    "settings.cookerTypesDesc": "Elige qué barbacoas usas: solo estas aparecerán al añadir o filtrar un asado.",
    "settings.cookerTypesAriaLabel": "Barbacoas que usas",
    "settings.storageTitle": "Almacenamiento local",
    "settings.storageDesc": "Tus asados se guardan en este navegador, en este teléfono. No se sube nada.",
    "settings.backupTitle": "Copia de seguridad",
    "settings.backupDesc": "Archivos CSV, legibles en Excel, Numbers o Google Sheets. Al importar, eliges combinar o reemplazar.",
    "settings.exportButton": "Exportar copia",
    "settings.importButton": "Importar copia",
    "import.noEntries": "Ese archivo no tiene asados.",
    "import.summaryWithDuplicates": "{total} asados en este archivo: {newCount} {newWord}, {duplicateCount} ya en tu archivo.",
    "import.summaryAllNew": "{total} asados en este archivo, todos nuevos.",
    "import.newSingular": "nuevo",
    "import.newPlural": "nuevos",
    "import.couldNotRead": "No se pudo leer esa copia de seguridad.",
    "import.mergeKeepMine": "Combinar, quedarme con los míos",
    "import.merge": "Combinar",
    "import.mergeUseFile": "Combinar, usar el archivo",
    "import.replaceAll": "Reemplazar todo",
    "import.cancel": "Cancelar",
    "settings.feedbackExported": "Copia exportada.",
    "settings.feedbackExportFailed": "No se pudo compartir la copia de seguridad. Intenta de nuevo.",
    "settings.feedbackMergedKeepMine": "Combinado. Se mantuvieron tus asados donde el archivo coincidía.",
    "settings.feedbackMergedUseFile": "Combinado. Se usó la versión del archivo donde coincidía.",
    "settings.feedbackReplaced": "{count} asados importados (se reemplazó todo en este teléfono).",
    "settings.feedbackImportCancelled": "Importación cancelada.",
    "nav.archive": "Archivo",
    "nav.new": "Nuevo asado",
    "nav.settings": "Ajustes",
    "modal.eyebrow": "Detalle del asado",
    "modal.close": "Cerrar",
    "modal.edit": "Editar",
    "modal.delete": "Eliminar",
    "modal.deleteConfirm": "¿Eliminar este asado de este teléfono?",
    "detail.cooker": "Método",
    "detail.result": "Resultado",
    "detail.time": "Tiempo",
    "detail.anverseTime": "Anverso (minutos)",
    "detail.reverseTime": "Reverso (minutos)",
    "detail.temperature": "Temperatura",
    "detail.smoked": "Ahumado",
    "detail.wood": "Leña",
    "detail.recipe": "Receta",
    "detail.tips": "Consejos",
    "detail.smokedYes": "sí",
    "detail.smokedNo": "no",
    "misc.na": "n/d",
    "misc.starsAriaLabel": "{stars} de 5 estrellas"
  }
};

function t(key) {
  const dict = TRANSLATIONS[currentSettings.language] || TRANSLATIONS.en;
  return dict[key] ?? TRANSLATIONS.en[key] ?? key;
}

function tf(key, replacements) {
  let text = t(key);
  for (const [placeholder, value] of Object.entries(replacements)) {
    text = text.replace(`{${placeholder}}`, value);
  }
  return text;
}

const entryForm = document.getElementById("entry-form");
const filtersForm = document.getElementById("filters-form");
const entriesList = document.getElementById("entries-list");
const emptyState = document.getElementById("empty-state");
const entryCount = document.getElementById("entry-count");
const entriesHead = document.getElementById("entries-head");
const formFeedback = document.getElementById("form-feedback");
const detailModal = document.getElementById("detail-modal");
const detailContent = document.getElementById("detail-content");
const modalTitle = document.getElementById("modal-title");
const tempDegreesField = document.getElementById("temp-degrees-field");
const tempLevelField = document.getElementById("temp-level-field");
const tempUnitLabel = document.getElementById("temp-unit-label");
const importReview = document.getElementById("import-review");
const importSummary = document.getElementById("import-summary");
const importMergeKeepMineButton = document.getElementById("import-merge-keep-mine");
const importMergeUseFileButton = document.getElementById("import-merge-use-file");
const importReplaceAllButton = document.getElementById("import-replace-all");
const importCancelButton = document.getElementById("import-cancel");
const importInput = document.getElementById("import-input");
let pendingImportEntries = null;
let selectedEntryId = null;

function loadSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    const enabledCookerTypes = Array.isArray(parsed.enabledCookerTypes)
      ? parsed.enabledCookerTypes.filter((value) => COOKER_TYPES.some((cooker) => cooker.value === value))
      : [];
    return {
      unit: parsed.unit === "F" ? "F" : "C",
      language: parsed.language === "es" ? "es" : "en",
      enabledCookerTypes: enabledCookerTypes.length ? enabledCookerTypes : [...DEFAULT_ENABLED_COOKER_TYPES]
    };
  } catch (_error) {
    return { unit: "C", language: "en", enabledCookerTypes: [...DEFAULT_ENABLED_COOKER_TYPES] };
  }
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

let currentSettings = loadSettings();

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

// --- Temperature helpers ---------------------------------------------

function celsiusToFahrenheit(value) {
  return Math.round((value * 9) / 5 + 32);
}

function fahrenheitToCelsius(value) {
  return Math.round(((value - 32) * 5) / 9);
}

function convertTemperature(value, fromUnit, toUnit) {
  if (!Number.isFinite(value)) return null;
  if (fromUnit === toUnit) return Math.round(value);
  return fromUnit === "C" ? celsiusToFahrenheit(value) : fahrenheitToCelsius(value);
}

function getTemperatureMode(entry) {
  if (entry.temperatureMode === "level" || entry.temperatureMode === "degrees") {
    return entry.temperatureMode;
  }
  // Legacy entries only ever had a plain numeric `temperature` field.
  return "degrees";
}

// Compact form for archive rows: always degrees (hand-test levels show their reference temperature).
function formatTemperature(entry, displayUnit) {
  if (getTemperatureMode(entry) === "level") {
    const celsius = LEVEL_TEMPERATURES_C[entry.temperatureLevel];
    if (!Number.isFinite(celsius)) return t("misc.na");
    return `${convertTemperature(celsius, "C", displayUnit)}°${displayUnit}`;
  }
  const rawValue = Number(entry.temperatureValue ?? entry.temperature);
  if (!Number.isFinite(rawValue)) return t("misc.na");
  const converted = convertTemperature(rawValue, entry.temperatureUnit || "C", displayUnit);
  return `${converted}°${displayUnit}`;
}

// Full form for the detail view: "High <5s · 260°C" for the hand test, "120°C" for degrees.
function formatTemperatureLong(entry, displayUnit) {
  if (getTemperatureMode(entry) === "level") {
    if (!entry.temperatureLevel) return t("misc.na");
    return `${t(`level.${entry.temperatureLevel}`)} ${LEVEL_SECONDS[entry.temperatureLevel] || ""} · ${formatTemperature(entry, displayUnit)}`.replace("  ", " ");
  }
  return formatTemperature(entry, displayUnit);
}

function setTemperatureMode(mode, opts = {}) {
  const normalizedMode = mode === "level" ? "level" : "degrees";

  entryForm.querySelectorAll('.temp-block .mode-button[data-mode]').forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === normalizedMode);
  });

  tempDegreesField.classList.toggle("hidden", normalizedMode !== "degrees");
  tempLevelField.classList.toggle("hidden", normalizedMode !== "level");

  const degreesInput = entryForm.elements.namedItem("temperatureValue");
  degreesInput.disabled = normalizedMode !== "degrees";
  degreesInput.required = normalizedMode === "degrees";

  entryForm.querySelectorAll('input[name="temperatureLevel"]').forEach((input) => {
    input.disabled = normalizedMode !== "level";
    input.required = normalizedMode === "level";
  });

  entryForm.elements.namedItem("temperatureMode").value = normalizedMode;

  if (!opts.auto) {
    entryForm.dataset.temperatureModeTouched = "true";
  }
}

function applyUnitSettingToForm() {
  tempUnitLabel.textContent = `°${currentSettings.unit}`;
}

function applyLevelTemps() {
  Object.entries(LEVEL_TEMPERATURES_C).forEach(([level, celsius]) => {
    const temp = document.querySelector(`#level-${level} + label .level-temp`);
    const hint = document.querySelector(`#level-${level} + label .level-hint`);
    if (hint) hint.textContent = LEVEL_SECONDS[level] || "";
    if (temp) temp.textContent = `${convertTemperature(celsius, "C", currentSettings.unit)}°${currentSettings.unit}`;
  });
}

function applyUnitButtons() {
  document.querySelectorAll('.unit-toggle .mode-button[data-unit]').forEach((button) => {
    button.classList.toggle("active", button.dataset.unit === currentSettings.unit);
  });
}

function applyLanguageButtons() {
  document.querySelectorAll('.language-toggle .mode-button[data-lang]').forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === currentSettings.language);
  });
}

function applyCookerTypeCheckboxes() {
  const container = document.getElementById("cooker-type-options");
  container.innerHTML = sortCookerValues(COOKER_TYPES.map((cooker) => cooker.value)).map((value) => `
    <div class="cooker-type-option">
      <input id="cooker-type-${escapeHtml(value)}" type="checkbox" name="enabledCookerTypes" value="${escapeHtml(value)}"${currentSettings.enabledCookerTypes.includes(value) ? " checked" : ""} />
      <label for="cooker-type-${escapeHtml(value)}">${escapeHtml(cookerTypeLabel(value))}</label>
    </div>`).join("");
}

let filterInitialized = false;

// --- Custom dropdown (replaces the phone's native picker) -------------
function closeDropdowns(except) {
  document.querySelectorAll(".dropdown").forEach((wrap) => {
    if (wrap === except) return;
    wrap.querySelector(".dropdown-menu").classList.add("hidden");
    wrap.querySelector(".dropdown-button").setAttribute("aria-expanded", "false");
  });
}

function refreshDropdown(select) {
  const wrap = select.closest(".dropdown");
  if (!wrap) return;
  const button = wrap.querySelector(".dropdown-button");
  const menu = wrap.querySelector(".dropdown-menu");
  const selected = select.options[select.selectedIndex];
  button.textContent = selected ? selected.textContent : "";
  button.setAttribute("aria-label", select.getAttribute("aria-label") || "");
  menu.innerHTML = Array.from(select.options).map((option) =>
    `<li role="option" data-value="${escapeHtml(option.value)}" aria-selected="${option.value === select.value}">${escapeHtml(option.textContent)}</li>`
  ).join("");
}

function enhanceSelect(select) {
  if (!select.closest(".dropdown")) {
    const wrap = document.createElement("div");
    wrap.className = "dropdown";
    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);
    select.classList.add("native-select");
    select.tabIndex = -1;
    select.setAttribute("aria-hidden", "true");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dropdown-button";
    button.setAttribute("aria-haspopup", "listbox");
    button.setAttribute("aria-expanded", "false");
    const menu = document.createElement("ul");
    menu.className = "dropdown-menu hidden";
    menu.setAttribute("role", "listbox");
    wrap.append(button, menu);
    button.addEventListener("click", () => {
      const opening = menu.classList.contains("hidden");
      closeDropdowns(opening ? wrap : null);
      menu.classList.toggle("hidden", !opening);
      button.setAttribute("aria-expanded", String(opening));
      if (opening) {
        const room = window.innerHeight - button.getBoundingClientRect().bottom - 140;
        wrap.classList.toggle("up", room < menu.offsetHeight);
      }
    });
    menu.addEventListener("click", (event) => {
      const item = event.target.closest("[data-value]");
      if (!item) return;
      select.value = item.dataset.value;
      closeDropdowns(null);
      select.dispatchEvent(new Event("change", { bubbles: true }));
      button.focus();
    });
    select.addEventListener("change", () => refreshDropdown(select));
  }
  refreshDropdown(select);
}

document.addEventListener("click", (event) => { if (!event.target.closest(".dropdown")) closeDropdowns(null); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeDropdowns(null); });

function syncCookerButtons() {
  const select = entryForm.elements.namedItem("cookerType");
  document.querySelectorAll("#cooker-buttons .mode-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.cooker === select.value);
  });
}

function syncSmokedButtons() {
  const value = entryForm.elements.namedItem("smoked").value === "yes" ? "yes" : "no";
  document.querySelectorAll(".smoked-toggle .mode-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.smoked === value);
  });
}

function renderCookerOptions(extraFormValue) {
  const enabled = currentSettings.enabledCookerTypes;
  const usedValues = Array.from(new Set(loadEntries().map((entry) => entry.cookerType).filter(Boolean)));

  // New-cook form: up to two cookers become buttons, more become a select.
  const cookerSelect = entryForm.elements.namedItem("cookerType");
  const cookerButtons = document.getElementById("cooker-buttons");
  const previousFormValue = cookerSelect.value;
  const formValues = sortCookerValues(new Set([...enabled, previousFormValue, extraFormValue].filter(Boolean)));
  const useButtons = formValues.length <= 2;
  cookerSelect.innerHTML = `<option value="">${escapeHtml(t("form.cookerChoose"))}</option>` +
    formValues.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(cookerTypeLabel(value))}</option>`).join("");
  cookerSelect.value = formValues.includes(previousFormValue) ? previousFormValue : "";
  if (useButtons && !cookerSelect.value) cookerSelect.value = formValues[0] || "";
  enhanceSelect(cookerSelect);
  cookerSelect.closest(".dropdown").classList.toggle("hidden", useButtons);
  cookerButtons.classList.toggle("hidden", !useButtons);
  cookerButtons.innerHTML = useButtons
    ? formValues.map((value) => `<button type="button" class="mode-button" data-cooker="${escapeHtml(value)}">${escapeHtml(cookerTypeLabel(value))}</button>`).join("")
    : "";
  syncCookerButtons();

  // Archive filter: "all cookers" plus the cookers in use; pre-filtered to the first enabled cooker.
  const filterSelect = filtersForm.elements.namedItem("cookerType");
  const previousFilterValue = filterSelect.value;
  const filterValues = sortCookerValues(new Set([...enabled, ...usedValues]));
  filterSelect.innerHTML = `<option value="">${escapeHtml(t("archive.filterAll"))}</option>` +
    filterValues.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(cookerTypeLabel(value))}</option>`).join("");
  // Default: the enabled cooker with the most cooks (ties go alphabetical).
  const counts = {};
  loadEntries().forEach((entry) => { counts[entry.cookerType] = (counts[entry.cookerType] || 0) + 1; });
  const sortedEnabled = sortCookerValues(enabled);
  const defaultFilter = sortedEnabled.reduce((best, value) => ((counts[value] || 0) > (counts[best] || 0) ? value : best), sortedEnabled[0]) || "";
  if (!filterInitialized) {
    filterSelect.value = defaultFilter;
    filterInitialized = true;
  } else {
    filterSelect.value = previousFilterValue === "" || filterValues.includes(previousFilterValue) ? previousFilterValue : defaultFilter;
  }
  enhanceSelect(filterSelect);
}

// --- Translation application ---------------------------------------------

function applyStaticTranslations() {
  document.documentElement.lang = currentSettings.language;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder));
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel));
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.setAttribute("title", t(el.dataset.i18nTitle));
  });
}

// --- Rendering ----------------------------------------------------------

// Result as five squares: filled up to the rating.
function squares(value, large = false) {
  const rating = Math.max(0, Math.min(5, Number(value) || 0));
  const cells = Array.from({ length: 5 }, (_, index) => `<i class="${index < rating ? "on" : ""}"></i>`).join("");
  return `<span class="squares${large ? " lg" : ""}" role="img" aria-label="${escapeHtml(tf("misc.starsAriaLabel", { stars: rating }))}">${cells}</span>`;
}

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function translateSmoked(value) {
  return value === "yes" ? t("detail.smokedYes") : t("detail.smokedNo");
}

function getFilteredEntries() {
  const filters = readForm(filtersForm);
  const query = String(filters.query || "").trim().toLowerCase();
  return loadEntries()
    .filter((entry) => {
      const searchable = `${entry.meat} ${entry.recipe || ""} ${entry.cookerType} ${cookerTypeLabel(entry.cookerType)}`.toLowerCase();
      return (!query || searchable.includes(query)) && (!filters.cookerType || entry.cookerType === filters.cookerType);
    })
    .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));
}

function renderEntries() {
  renderCookerOptions();
  const allEntries = loadEntries();
  const entries = getFilteredEntries();
  const showCooker = !filtersForm.elements.namedItem("cookerType").value;
  entryCount.textContent = `${entries.length} ${t(entries.length === 1 ? "count.cook" : "count.cooks")}`;
  entriesList.innerHTML = "";
  const isEmpty = entries.length === 0;
  const noMatches = isEmpty && allEntries.length > 0;
  emptyState.classList.toggle("hidden", !isEmpty);
  entriesHead.classList.toggle("hidden", isEmpty);
  document.getElementById("empty-title").textContent = t(noMatches ? "archive.noMatchTitle" : "archive.emptyTitle");
  document.getElementById("empty-body").textContent = t(noMatches ? "archive.noMatchBody" : "archive.emptyBody");
  document.getElementById("empty-add-button").classList.toggle("hidden", noMatches);
  if (isEmpty) return;

  for (const entry of entries) {
    const item = document.createElement("li");
    item.className = "entry-card";
    const meta = [showCooker ? cookerTypeLabel(entry.cookerType) : "", entry.wood, formatTemperature(entry, currentSettings.unit)].filter(Boolean).join(" · ");
    item.innerHTML = `<button type="button" class="entry-row" data-entry-id="${escapeHtml(entry.id)}"><span><span class="entry-name">${escapeHtml(entry.meat)}</span><span class="entry-meta">${escapeHtml(meta)}</span></span><span class="entry-time">${escapeHtml(String(entry.totalCookTimeMinutes))} min</span>${squares(entry.resultStars)}</button>`;
    entriesList.appendChild(item);
  }
}

function openDetails(id) {
  const entry = loadEntries().find((item) => item.id === id);
  if (!entry) return;
  selectedEntryId = id;
  modalTitle.textContent = entry.meat;
  const hasSplit = entry.cookTimeAnverseMinutes && entry.cookTimeReverseMinutes;
  const time = hasSplit
    ? `${entry.totalCookTimeMinutes} min (${entry.cookTimeAnverseMinutes} + ${entry.cookTimeReverseMinutes})`
    : `${entry.totalCookTimeMinutes} min`;
  const wood = [entry.wood, entry.smoked === "yes" ? t("detail.smoked").toLowerCase() : ""].filter(Boolean).join(" · ");
  const fact = (label, value) => `<div><dt>${escapeHtml(label)}</dt><dd>${value}</dd></div>`;
  const text = (label, value) => value ? `<div class="detail-tips"><strong>${escapeHtml(label)}</strong><p>${escapeHtml(value)}</p></div>` : "";
  detailContent.innerHTML = `<dl class="facts">${[
    fact(t("detail.cooker"), escapeHtml(cookerTypeLabel(entry.cookerType))),
    fact(t("detail.wood"), escapeHtml(wood || t("misc.na"))),
    fact(t("detail.time"), escapeHtml(time)),
    fact(t("detail.temperature"), escapeHtml(formatTemperatureLong(entry, currentSettings.unit))),
    fact(t("detail.result"), squares(entry.resultStars, true))
  ].join("")}</dl>${text(t("detail.recipe"), entry.recipe)}${text(t("detail.tips"), entry.tips)}`;
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

// --- Entry construction ---------------------------------------------------

function makeEntry(payload, existing = {}) {
  const anverse = Number(payload.cookTimeAnverseMinutes);
  const reverse = Number(payload.cookTimeReverseMinutes);
  const temperatureMode = payload.temperatureMode === "level" ? "level" : "degrees";

  const entry = {
    ...existing,
    id: existing.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    meat: String(payload.meat).trim(),
    cookerType: payload.cookerType,
    cookTimeAnverseMinutes: anverse,
    cookTimeReverseMinutes: reverse,
    totalCookTimeMinutes: anverse + reverse,
    smoked: payload.smoked,
    wood: String(payload.wood).trim(),
    resultStars: Number(payload.resultStars),
    recipe: String(payload.recipe || "").trim(),
    tips: String(payload.tips || "").trim(),
    createdAt: existing.createdAt || new Date().toISOString(),
    temperatureMode
  };

  if (temperatureMode === "level") {
    entry.temperatureLevel = payload.temperatureLevel || null;
    entry.temperatureValue = null;
    entry.temperatureUnit = null;
  } else {
    entry.temperatureValue = Number(payload.temperatureValue);
    entry.temperatureUnit = currentSettings.unit;
    entry.temperatureLevel = null;
  }

  delete entry.temperature;
  return entry;
}

function recommendTemperatureMode() {
  if (entryForm.dataset.temperatureModeTouched === "true") return;
  const recommended = entryForm.elements.namedItem("cookerType").value === "parrilla" ? "level" : "degrees";
  setTemperatureMode(recommended, { auto: true });
}

function resetEntryForm() {
  entryForm.reset();
  delete entryForm.dataset.editingId;
  delete entryForm.dataset.temperatureModeTouched;
  entryForm.elements.namedItem("smoked").value = "no";
  syncSmokedButtons();
  renderCookerOptions();
  recommendTemperatureMode();
}

function populateFormForEdit(entry) {
  entryForm.elements.namedItem("meat").value = entry.meat || "";
  renderCookerOptions(entry.cookerType);
  entryForm.elements.namedItem("cookerType").value = entry.cookerType || "";
  syncCookerButtons();
  entryForm.elements.namedItem("cookTimeAnverseMinutes").value = entry.cookTimeAnverseMinutes ?? "";
  entryForm.elements.namedItem("cookTimeReverseMinutes").value = entry.cookTimeReverseMinutes ?? "";
  entryForm.elements.namedItem("smoked").value = entry.smoked === "yes" ? "yes" : "no";
  syncSmokedButtons();
  entryForm.elements.namedItem("wood").value = entry.wood || "";
  entryForm.elements.namedItem("recipe").value = entry.recipe || "";
  entryForm.elements.namedItem("tips").value = entry.tips || "";

  const resultStarsInput = entryForm.querySelector(`input[name="resultStars"][value="${entry.resultStars}"]`);
  if (resultStarsInput) resultStarsInput.checked = true;

  const mode = getTemperatureMode(entry);
  setTemperatureMode(mode, { auto: false });

  if (mode === "degrees") {
    entryForm.elements.namedItem("temperatureValue").value = entry.temperatureValue ?? entry.temperature ?? "";
  } else {
    const levelInput = entryForm.querySelector(`input[name="temperatureLevel"][value="${entry.temperatureLevel}"]`);
    if (levelInput) levelInput.checked = true;
  }
}

// --- CSV import/export ---------------------------------------------------
// Column headers are always written/read in English, regardless of the UI
// language, so a backup stays importable no matter which language it was
// exported or re-imported under, and so it stays consistent in a spreadsheet.

const CSV_COLUMNS = [
  { header: "ID", key: "id" },
  { header: "Created", key: "createdAt" },
  { header: "Meat", key: "meat" },
  { header: "Cooker", key: "cookerType" },
  { header: "Temperature Mode", key: "temperatureMode" },
  { header: "Temperature Value", key: "temperatureValue" },
  { header: "Temperature Unit", key: "temperatureUnit" },
  { header: "Heat Level", key: "temperatureLevel" },
  { header: "Anverse Minutes", key: "cookTimeAnverseMinutes" },
  { header: "Reverse Minutes", key: "cookTimeReverseMinutes" },
  { header: "Total Minutes", key: "totalCookTimeMinutes" },
  { header: "Smoked", key: "smoked" },
  { header: "Wood", key: "wood" },
  { header: "Result Stars", key: "resultStars" },
  { header: "Recipe", key: "recipe" },
  { header: "Tips", key: "tips" }
];

function csvEscape(value) {
  const stringValue = String(value ?? "");
  if (/[",\r\n]/.test(stringValue)) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }
  return stringValue;
}

function entriesToCsv(entries) {
  const headerRow = CSV_COLUMNS.map((column) => csvEscape(column.header)).join(",");
  const dataRows = entries.map((entry) => CSV_COLUMNS.map((column) => csvEscape(entry[column.key])).join(","));
  return [headerRow, ...dataRows].join("\r\n");
}

// Small RFC4180-ish parser: handles quoted fields, embedded commas/newlines,
// and doubled quotes, so a backup edited and re-saved from Excel/Numbers/Sheets
// still imports correctly.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += char;
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }

    if (char === "\r") {
      i += 1;
      continue;
    }

    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i += 1;
      continue;
    }

    field += char;
    i += 1;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((candidateRow) => !(candidateRow.length === 1 && candidateRow[0].trim() === ""));
}

function normalizeImportedRow(raw) {
  const anverse = Number(raw.cookTimeAnverseMinutes);
  const reverse = Number(raw.cookTimeReverseMinutes);
  const hasSplitTimes = Number.isFinite(anverse) && Number.isFinite(reverse);
  const totalFromColumn = Number(raw.totalCookTimeMinutes);
  const level = String(raw.temperatureLevel || "").trim().toLowerCase();
  const mode = raw.temperatureMode === "level" || (!raw.temperatureMode && level) ? "level" : "degrees";
  const createdAt = raw.createdAt && !Number.isNaN(new Date(raw.createdAt).getTime()) ? new Date(raw.createdAt).toISOString() : new Date().toISOString();

  const entry = {
    id: raw.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt,
    meat: raw.meat || "",
    cookerType: raw.cookerType || "",
    cookTimeAnverseMinutes: hasSplitTimes ? anverse : 0,
    cookTimeReverseMinutes: hasSplitTimes ? reverse : 0,
    totalCookTimeMinutes: hasSplitTimes ? anverse + reverse : Number.isFinite(totalFromColumn) ? totalFromColumn : 0,
    smoked: raw.smoked === "yes" ? "yes" : "no",
    wood: raw.wood || "",
    resultStars: Number.isFinite(Number(raw.resultStars)) ? Number(raw.resultStars) : 0,
    recipe: raw.recipe || "",
    tips: raw.tips || "",
    temperatureMode: mode
  };

  if (mode === "level") {
    entry.temperatureLevel = level || null;
    entry.temperatureValue = null;
    entry.temperatureUnit = null;
  } else {
    const value = Number(raw.temperatureValue);
    entry.temperatureValue = Number.isFinite(value) ? value : null;
    entry.temperatureUnit = raw.temperatureUnit === "F" ? "F" : "C";
    entry.temperatureLevel = null;
  }

  return entry;
}

function csvToEntries(csvText) {
  const rows = parseCsv(csvText);
  if (!rows.length) return [];

  const headerRow = rows[0].map((header) => header.trim().toLowerCase());
  const keyByColumnIndex = headerRow.map((header) => {
    const match = CSV_COLUMNS.find((column) => column.header.toLowerCase() === header);
    return match ? match.key : null;
  });

  return rows.slice(1).map((row) => {
    const raw = {};
    keyByColumnIndex.forEach((key, index) => {
      if (key) raw[key] = row[index] !== undefined ? row[index].trim() : "";
    });
    return normalizeImportedRow(raw);
  });
}

function entryFingerprint(entry) {
  return [entry.meat, entry.cookerType, entry.wood, entry.createdAt]
    .map((value) => String(value || "").trim().toLowerCase())
    .join("|");
}

function isSameEntry(a, b) {
  if (a.id && b.id && a.id === b.id) return true;
  if (!String(a.meat || "").trim() || !String(b.meat || "").trim()) return false;
  return entryFingerprint(a) === entryFingerprint(b);
}

function summarizeImport(existingEntries, importedEntries) {
  let duplicateCount = 0;
  for (const importedEntry of importedEntries) {
    if (existingEntries.some((entry) => isSameEntry(entry, importedEntry))) duplicateCount += 1;
  }
  return { total: importedEntries.length, duplicateCount, newCount: importedEntries.length - duplicateCount };
}

// conflictResolution: "keep-mine" keeps the existing entry on a match, "use-file" overwrites
// it with the imported version (preserving the existing entry's id so it stays the same record).
function mergeEntries(existingEntries, importedEntries, conflictResolution) {
  const merged = existingEntries.map((entry) => ({ ...entry }));
  for (const importedEntry of importedEntries) {
    const matchIndex = merged.findIndex((entry) => isSameEntry(entry, importedEntry));
    if (matchIndex === -1) {
      merged.push(importedEntry);
      continue;
    }
    if (conflictResolution === "use-file") {
      merged[matchIndex] = { ...importedEntry, id: merged[matchIndex].id || importedEntry.id };
    }
  }
  return merged;
}

function resetImportReview() {
  pendingImportEntries = null;
  importReview.classList.add("hidden");
  importInput.value = "";
}

// --- Event wiring -----------------------------------------------------

entryForm.querySelectorAll('.temp-block .mode-button[data-mode]').forEach((button) => {
  button.addEventListener("click", () => setTemperatureMode(button.dataset.mode));
});

entryForm.elements.namedItem("cookerType").addEventListener("change", () => {
  syncCookerButtons();
  recommendTemperatureMode();
});

document.getElementById("cooker-buttons").addEventListener("click", (event) => {
  const button = event.target.closest("[data-cooker]");
  if (!button) return;
  const select = entryForm.elements.namedItem("cookerType");
  select.value = button.dataset.cooker;
  select.dispatchEvent(new Event("change"));
});

document.querySelectorAll(".smoked-toggle .mode-button").forEach((button) => {
  button.addEventListener("click", () => {
    entryForm.elements.namedItem("smoked").value = button.dataset.smoked;
    syncSmokedButtons();
  });
});

document.querySelectorAll('.unit-toggle .mode-button[data-unit]').forEach((button) => {
  button.addEventListener("click", () => {
    currentSettings = { ...currentSettings, unit: button.dataset.unit };
    saveSettings(currentSettings);
    applyUnitButtons();
    applyUnitSettingToForm();
    applyLevelTemps();
    renderEntries();
  });
});

document.querySelectorAll('.language-toggle .mode-button[data-lang]').forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.lang === currentSettings.language) return;
    currentSettings = { ...currentSettings, language: button.dataset.lang };
    saveSettings(currentSettings);
    applyLanguageButtons();
    applyStaticTranslations();
    applyCookerTypeCheckboxes();
    applyUnitSettingToForm();
    applyLevelTemps();
    renderEntries();
    if (!detailModal.classList.contains("hidden") && selectedEntryId) openDetails(selectedEntryId);
  });
});

document.getElementById("cooker-type-options").addEventListener("change", (event) => {
  const checkbox = event.target;
  if (!checkbox.matches('input[name="enabledCookerTypes"]')) return;
  {
    const stillEnabled = COOKER_TYPES
      .filter((cooker) => document.getElementById(`cooker-type-${cooker.value}`)?.checked)
      .map((cooker) => cooker.value);
    if (stillEnabled.length === 0) {
      checkbox.checked = true;
      return;
    }
    currentSettings = { ...currentSettings, enabledCookerTypes: stillEnabled };
    saveSettings(currentSettings);
    renderEntries();
  }
});

entryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!entryForm.reportValidity()) return;

  const editingId = entryForm.dataset.editingId;
  const entries = loadEntries();

  if (editingId) {
    const index = entries.findIndex((entry) => entry.id === editingId);
    if (index === -1) return;
    entries[index] = makeEntry(readForm(entryForm), entries[index]);
    saveEntries(entries);
    resetEntryForm();
    formFeedback.textContent = t("feedback.changesSaved");
  } else {
    entries.push(makeEntry(readForm(entryForm)));
    saveEntries(entries);
    resetEntryForm();
    formFeedback.textContent = t("feedback.saved");
  }

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
  if (!selectedEntryId || !confirm(t("modal.deleteConfirm"))) return;
  saveEntries(loadEntries().filter((entry) => entry.id !== selectedEntryId));
  closeDetails();
  renderEntries();
});
document.getElementById("edit-button").addEventListener("click", () => {
  const entry = loadEntries().find((item) => item.id === selectedEntryId);
  if (!entry) return;
  closeDetails();
  showView("new-view");
  populateFormForEdit(entry);
  entryForm.dataset.editingId = entry.id;
  formFeedback.textContent = t("feedback.editing");
});

let snackbarTimeoutId;
function showSnackbar(message) {
  const el = document.getElementById("settings-feedback");
  el.textContent = message;
  el.classList.add("visible");
  clearTimeout(snackbarTimeoutId);
  snackbarTimeoutId = setTimeout(() => el.classList.remove("visible"), 2600);
}
function hideSnackbar() {
  clearTimeout(snackbarTimeoutId);
  document.getElementById("settings-feedback").classList.remove("visible");
}

document.getElementById("export-button").addEventListener("click", async () => {
  const csv = entriesToCsv(loadEntries());
  const fileName = `rescoldo-${new Date().toISOString().slice(0, 10)}.csv`;
  const isNative = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();

  if (isNative) {
    // Plain <a download> blob links are silently ignored inside the Android app's
    // WebView (there's no browser download manager to catch them), so on-device we
    // write the CSV to the app's cache dir and hand it off via the native share
    // sheet instead, letting the user save it to Files, Drive, email, etc.
    try {
      const { Filesystem, Share } = window.Capacitor.Plugins;
      const written = await Filesystem.writeFile({
        path: fileName,
        data: csv,
        directory: "CACHE",
        encoding: "utf8",
      });
      await Share.share({
        title: fileName,
        dialogTitle: t("settings.exportButton"),
        url: written.uri,
      });
      showSnackbar(t("settings.feedbackExported"));
    } catch (err) {
      showSnackbar(t("settings.feedbackExportFailed"));
    }
    return;
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
  showSnackbar(t("settings.feedbackExported"));
});
importInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = csvToEntries(await file.text());

    if (!imported.length) {
      showSnackbar(t("import.noEntries"));
      importInput.value = "";
      return;
    }

    pendingImportEntries = imported;
    const { total, duplicateCount, newCount } = summarizeImport(loadEntries(), imported);

    const stat = (value, label) => `<div class="import-stat"><b>${value}</b><span>${escapeHtml(label)}</span></div>`;
    importSummary.innerHTML = stat(total, t("import.statFile")) + stat(newCount, t("import.statNew")) + stat(duplicateCount, t("import.statExisting"));
    document.getElementById("import-use-file-choice").classList.toggle("hidden", duplicateCount === 0);
    importMergeKeepMineButton.textContent = duplicateCount > 0 ? t("import.mergeKeepMine") : t("import.merge");
    importReview.classList.remove("hidden");
    hideSnackbar();
  } catch (_error) {
    showSnackbar(t("import.couldNotRead"));
    importInput.value = "";
  }
});

importMergeKeepMineButton.addEventListener("click", () => {
  if (!pendingImportEntries) return;
  saveEntries(mergeEntries(loadEntries(), pendingImportEntries, "keep-mine"));
  renderEntries();
  showSnackbar(t("settings.feedbackMergedKeepMine"));
  resetImportReview();
});

importMergeUseFileButton.addEventListener("click", () => {
  if (!pendingImportEntries) return;
  saveEntries(mergeEntries(loadEntries(), pendingImportEntries, "use-file"));
  renderEntries();
  showSnackbar(t("settings.feedbackMergedUseFile"));
  resetImportReview();
});

importReplaceAllButton.addEventListener("click", () => {
  if (!pendingImportEntries) return;
  saveEntries(pendingImportEntries);
  renderEntries();
  showSnackbar(tf("settings.feedbackReplaced", { count: pendingImportEntries.length }));
  resetImportReview();
});

importCancelButton.addEventListener("click", () => {
  resetImportReview();
  showSnackbar(t("settings.feedbackImportCancelled"));
});

if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});

setTemperatureMode("degrees", { auto: true });
applyUnitButtons();
applyUnitSettingToForm();
applyLanguageButtons();
applyCookerTypeCheckboxes();
applyLevelTemps();
applyStaticTranslations();
syncSmokedButtons();
renderEntries();
recommendTemperatureMode();
