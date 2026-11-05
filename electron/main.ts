import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import { spawn } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

type LauncherSettings = {
  gamePath: string
  fullscreen: boolean
  resolution: string
  launchArgs: string
}

const defaults: LauncherSettings = {
  gamePath: '',
  fullscreen: false,
  resolution: '1920x1080',
  launchArgs: ''
}

const settingsFile = () => path.join(app.getPath('userData'), 'settings.json')
function readSettings(): LauncherSettings {
  try {
    const file = settingsFile()
    if (existsSync(file)) return { ...defaults, ...JSON.parse(readFileSync(file, 'utf8')) }
  } catch (error) {
    console.error('Не удалось прочитать настройки:', error)
  }
  return defaults
}
function saveSettings(settings: LauncherSettings) {
  writeFileSync(settingsFile(), JSON.stringify(settings, null, 2), 'utf8')
}

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1050,
    minHeight: 700,
    backgroundColor: '#090b10',
    autoHideMenuBar: true,
    title: 'Blaze5RP Launcher',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  ipcMain.handle('settings:get', () => readSettings())
  ipcMain.handle('settings:save', (_event, settings: LauncherSettings) => {
    saveSettings({ ...defaults, ...settings })
    return true
  })
  ipcMain.handle('game:choose-folder', async () => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'], title: 'Выберите папку GTA 5 / RAGE MP' })
    return result.canceled ? null : result.filePaths[0]
  })
  ipcMain.handle('game:launch', () => {
    const settings = readSettings()
    if (!settings.gamePath) return { ok: false, message: 'Сначала укажите путь к RAGE MP.' }
    const candidates = [
      path.join(settings.gamePath, 'ragemp_v.exe'),
      path.join(settings.gamePath, 'RAGE Multiplayer.exe'),
      path.join(settings.gamePath, 'ragemp.exe')
    ]
    const executable = candidates.find(existsSync)
    if (!executable) return { ok: false, message: 'В выбранной папке не найден исполняемый файл RAGE MP. Выберите папку установки RAGE MP.' }
    try {
      const args = settings.launchArgs.trim() ? settings.launchArgs.trim().split(/\s+/) : []
      const child = spawn(executable, args, { cwd: path.dirname(executable), detached: true, stdio: 'ignore' })
      child.unref()
      return { ok: true, message: 'Запуск RAGE MP выполнен.' }
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : 'Не удалось запустить игру.' }
    }
  })
  ipcMain.handle('external:open', (_event, url: string) => {
    if (url === 'https://t.me/' || url === 'https://discord.com/') return shell.openExternal(url)
    return false
  })

  createWindow()
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
})

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })