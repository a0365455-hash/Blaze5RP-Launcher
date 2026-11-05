export {}

declare global {
  interface Window {
    blaze: {
      getSettings: () => Promise<{ gamePath: string; fullscreen: boolean; resolution: string; launchArgs: string }>
      saveSettings: (settings: { gamePath: string; fullscreen: boolean; resolution: string; launchArgs: string }) => Promise<boolean>
      chooseGameFolder: () => Promise<string | null>
      launchGame: () => Promise<{ ok: boolean; message: string }>
      openExternal: (url: string) => Promise<unknown>
    }
  }
}