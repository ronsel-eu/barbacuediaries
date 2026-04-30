const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("barbacueApi", {
  createEntry: (payload) => ipcRenderer.invoke("entries:create", payload),
  updateEntry: (id, payload) => ipcRenderer.invoke("entries:update", id, payload),
  listEntries: () => ipcRenderer.invoke("entries:list"),
  searchEntries: (filters) => ipcRenderer.invoke("entries:search", filters),
  getEntryById: (id) => ipcRenderer.invoke("entries:getById", id)
});
