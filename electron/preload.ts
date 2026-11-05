import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('blaze', {
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings: unknown) => ipcRenderer.invoke('settings:save', settings),
  chooseGameFolder: () => ipcRenderer.invoke('game:choose-folder'),
  launchGame: () => ipcRenderer.invoke('game:launch'),
  openExternal: (url: string) => ipcRenderer.invoke('external:open', url)
})