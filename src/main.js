const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs/promises");

const DATA_FILE_NAME = "entries.json";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 980,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
}

async function getDataFilePath() {
  const userDataPath = app.getPath("userData");
  return path.join(userDataPath, DATA_FILE_NAME);
}

async function readEntries() {
  const filePath = await getDataFilePath();

  try {
    const file = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(file);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw new Error("Could not read local entries file.");
  }
}

async function writeEntries(entries) {
  const filePath = await getDataFilePath();
  const tempFilePath = `${filePath}.tmp`;
  const body = JSON.stringify(entries, null, 2);

  await fs.writeFile(tempFilePath, body, "utf-8");
  await fs.rename(tempFilePath, filePath);
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function getEntryCookTimeMinutes(entry) {
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

function validateEntry(payload) {
  const requiredFields = ["meat", "cookerType", "cookTimeAnverseMinutes", "cookTimeReverseMinutes", "temperature", "smoked", "wood", "resultStars"];

  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
      return `${field} is required`;
    }
  }

  const cookTimeAnverseMinutes = Number(payload.cookTimeAnverseMinutes);
  const cookTimeReverseMinutes = Number(payload.cookTimeReverseMinutes);
  const temperature = Number(payload.temperature);
  const resultStars = Number(payload.resultStars);

  if (!Number.isFinite(cookTimeAnverseMinutes) || cookTimeAnverseMinutes <= 0) {
    return "cookTimeAnverseMinutes must be a positive number";
  }

  if (!Number.isFinite(cookTimeReverseMinutes) || cookTimeReverseMinutes <= 0) {
    return "cookTimeReverseMinutes must be a positive number";
  }

  if (!Number.isFinite(temperature)) {
    return "temperature must be a number";
  }

  if (!Number.isInteger(resultStars) || resultStars < 1 || resultStars > 5) {
    return "resultStars must be an integer between 1 and 5";
  }

  if (!["parrilla", "kamado"].includes(payload.cookerType)) {
    return "cookerType must be parrilla or kamado";
  }

  if (!["yes", "no"].includes(payload.smoked)) {
    return "smoked must be yes or no";
  }

  return null;
}

function filterEntries(entries, filters) {
  const meat = normalizeText(filters.meat);
  const cookerType = normalizeText(filters.cookerType);
  const smoked = normalizeText(filters.smoked);
  const wood = normalizeText(filters.wood);
  const minTemperature = filters.minTemperature === "" ? null : Number(filters.minTemperature);
  const maxTemperature = filters.maxTemperature === "" ? null : Number(filters.maxTemperature);
  const minCookTime = filters.minCookTime === "" ? null : Number(filters.minCookTime);
  const maxCookTime = filters.maxCookTime === "" ? null : Number(filters.maxCookTime);

  return entries
    .filter((entry) => {
      if (meat && !normalizeText(entry.meat).includes(meat)) {
        return false;
      }

      if (cookerType && normalizeText(entry.cookerType) !== cookerType) {
        return false;
      }

      if (smoked && normalizeText(entry.smoked) !== smoked) {
        return false;
      }

      if (wood && !normalizeText(entry.wood).includes(wood)) {
        return false;
      }

      if (Number.isFinite(minTemperature) && Number(entry.temperature) < minTemperature) {
        return false;
      }

      if (Number.isFinite(maxTemperature) && Number(entry.temperature) > maxTemperature) {
        return false;
      }

      const cookTimeMinutes = getEntryCookTimeMinutes(entry);

      if (Number.isFinite(minCookTime) && cookTimeMinutes < minCookTime) {
        return false;
      }

      if (Number.isFinite(maxCookTime) && cookTimeMinutes > maxCookTime) {
        return false;
      }

      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

ipcMain.handle("entries:create", async (_event, payload) => {
  const validationError = validateEntry(payload);

  if (validationError) {
    return { ok: false, error: validationError };
  }

  const entries = await readEntries();
  const cookTimeAnverseMinutes = Number(payload.cookTimeAnverseMinutes);
  const cookTimeReverseMinutes = Number(payload.cookTimeReverseMinutes);

  const entry = {
    id: createId(),
    meat: String(payload.meat).trim(),
    cookerType: payload.cookerType,
    cookTimeAnverseMinutes,
    cookTimeReverseMinutes,
    totalCookTimeMinutes: cookTimeAnverseMinutes + cookTimeReverseMinutes,
    temperature: Number(payload.temperature),
    smoked: payload.smoked,
    wood: String(payload.wood).trim(),
    resultStars: Number(payload.resultStars),
    tips: String(payload.tips || "").trim(),
    createdAt: new Date().toISOString()
  };

  entries.push(entry);
  await writeEntries(entries);

  return { ok: true, data: entry };
});

ipcMain.handle("entries:update", async (_event, id, payload) => {
  const validationError = validateEntry(payload);

  if (validationError) {
    return { ok: false, error: validationError };
  }

  const entries = await readEntries();
  const index = entries.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return { ok: false, error: "Entry not found" };
  }

  const cookTimeAnverseMinutes = Number(payload.cookTimeAnverseMinutes);
  const cookTimeReverseMinutes = Number(payload.cookTimeReverseMinutes);
  const updatedEntry = {
    ...entries[index],
    meat: String(payload.meat).trim(),
    cookerType: payload.cookerType,
    cookTimeAnverseMinutes,
    cookTimeReverseMinutes,
    totalCookTimeMinutes: cookTimeAnverseMinutes + cookTimeReverseMinutes,
    temperature: Number(payload.temperature),
    smoked: payload.smoked,
    wood: String(payload.wood).trim(),
    resultStars: Number(payload.resultStars),
    tips: String(payload.tips || "").trim()
  };

  entries[index] = updatedEntry;
  await writeEntries(entries);

  return { ok: true, data: updatedEntry };
});

ipcMain.handle("entries:list", async () => {
  const entries = await readEntries();
  const sorted = entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return { ok: true, data: sorted };
});

ipcMain.handle("entries:search", async (_event, filters = {}) => {
  const entries = await readEntries();
  const filtered = filterEntries(entries, filters);
  return { ok: true, data: filtered };
});

ipcMain.handle("entries:getById", async (_event, id) => {
  const entries = await readEntries();
  const match = entries.find((entry) => entry.id === id);

  if (!match) {
    return { ok: false, error: "Entry not found" };
  }

  return { ok: true, data: match };
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
