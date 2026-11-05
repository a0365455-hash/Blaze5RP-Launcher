import { useEffect, useState } from 'react'
import { Activity, Bell, ChevronDown, CircleHelp, Download, Gamepad2, Globe2, Monitor, Play, Settings, ShieldCheck, SlidersHorizontal, Users, Wallet, X } from 'lucide-react'

type SettingsData = { gamePath: string; fullscreen: boolean; resolution: string; launchArgs: string }
const defaults: SettingsData = { gamePath: '', fullscreen: false, resolution: '1920x1080', launchArgs: '' }

export default function App() {
  const [page, setPage] = useState<'home' | 'settings'>('home')
  const [settings, setSettings] = useState<SettingsData>(defaults)
  const [notice, setNotice] = useState('')

  useEffect(() => { window.blaze.getSettings().then(setSettings).catch(() => setSettings(defaults)) }, [])

  const update = (patch: Partial<SettingsData>) => setSettings(current => ({ ...current, ...patch }))
  const save = async () => {
    await window.blaze.saveSettings(settings)
    setNotice('Настройки сохранены')
  }
  const chooseFolder = async () => {
    const folder = await window.blaze.chooseGameFolder()
    if (folder) update({ gamePath: folder })
  }
  const launch = async () => {
    const result = await window.blaze.launchGame()
    setNotice(result.message)
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">B</div><div><strong>BLAZE<span>5RP</span></strong><small>GAME LAUNCHER</small></div></div>
      <div className="side-label">МЕНЮ</div>
      <button className={page === 'home' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('home')}><Gamepad2 size={18}/> Играть</button>
      <button className={page === 'settings' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('settings')}><Settings size={18}/> Настройки</button>
      <div className="sidebar-bottom">
        <div className="side-label">СООБЩЕСТВО</div>
        <button className="nav-item" onClick={() => window.blaze.openExternal('https://t.me/')}><Globe2 size={18}/> Telegram <span className="external">↗</span></button>
        <button className="nav-item" onClick={() => window.blaze.openExternal('https://discord.com/')}><Users size={18}/> Discord <span className="external">↗</span></button>
        <div className="sidebar-version">BLAZE5RP LAUNCHER <span>v1.0.0</span></div>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="breadcrumb">BLAZE5RP <span>/</span> {page === 'home' ? 'ИГРОВОЙ ЦЕНТР' : 'НАСТРОЙКИ'}</div><div className="top-actions"><span className="online-dot"/> Система готова <button className="icon-button"><Bell size={17}/></button><div className="profile"><div className="avatar">Г</div><div><b>Гость</b><small>Не авторизован</small></div><ChevronDown size={15}/></div></div></header>

      {page === 'home' ? <section className="content">
        <div className="welcome-row"><div><div className="eyebrow">ДОБРО ПОЖАЛОВАТЬ В BLAZE5RP</div><h1>ТВОЯ ИГРА.<br/><span>ТВОИ ПРАВИЛА.</span></h1><p>Подключайся к серверу и стань частью нашего мира.</p></div><div className="hero-emblem"><div className="emblem-ring"><span>B</span></div><div className="emblem-caption">BLAZE ROLEPLAY</div></div></div>
        <div className="server-card"><div className="server-art"><div className="art-grid"/><div className="server-number">01</div><div className="server-name"><span>ЕДИНСТВЕННЫЙ СЕРВЕР</span><h2>RAINBOW</h2><p><i/> Сервер выбран</p></div><div className="server-tag">RAGE MP</div></div><div className="server-info"><div className="server-state"><span className="state-dot"/> <div><b>Rainbow</b><small>Сервер готов к подключению</small></div></div><div className="server-stat"><Activity size={17}/><div><small>СТАТУС</small><b>Не проверен</b></div></div><div className="server-stat"><Wallet size={17}/><div><small>БАЛАНС DPO</small><b>— DPO</b></div></div><button className="play-button" onClick={launch}><Play size={18} fill="currentColor"/> ИГРАТЬ</button></div></div>
        <div className="section-heading"><div><span className="eyebrow">ВАШ ПРОФИЛЬ</span><h3>Игровой аккаунт</h3></div><span className="muted">Данные аккаунта появятся после подключения сайта</span></div>
        <div className="account-card"><div className="account-icon"><ShieldCheck size={22}/></div><div className="account-copy"><b>Вы играете как гость</b><span>Войдите через сайт Blaze5RP, чтобы синхронизировать профиль и баланс DPO.</span></div><button className="outline-button" onClick={() => setNotice('Ссылка на регистрацию будет подключена после настройки сайта.')}>РЕГИСТРАЦИЯ <Download size={15}/></button></div>
        <div className="bottom-grid"><div className="info-tile"><div className="tile-icon"><Monitor size={19}/></div><div><b>Готов к запуску</b><span>Настройте путь к RAGE MP в настройках лаунчера.</span></div></div><div className="info-tile"><div className="tile-icon"><CircleHelp size={19}/></div><div><b>Нужна помощь?</b><span>Присоединяйтесь к нашему сообществу.</span></div></div></div>
      </section> : <section className="content settings-content">
        <div className="eyebrow">ПЕРСОНАЛИЗАЦИЯ</div><h1 className="page-title">НАСТРОЙКИ</h1><p className="page-subtitle">Настройте лаунчер и параметры запуска игры.</p>
        <div className="settings-panel"><div className="settings-title"><SlidersHorizontal size={19}/><div><b>Параметры игры</b><small>Путь и режим отображения</small></div></div>
          <label className="field-label">ПАПКА RAGE MULTIPLAYER</label><div className="path-row"><input value={settings.gamePath} readOnly placeholder="Выберите папку установки RAGE MP"/><button className="outline-button" onClick={chooseFolder}>ОБЗОР</button></div>
          <label className="field-label">РАЗРЕШЕНИЕ ЭКРАНА</label><select value={settings.resolution} onChange={e => update({ resolution: e.target.value })}><option>1920x1080</option><option>1600x900</option><option>1366x768</option><option>1280x720</option></select>
          <label className="toggle-row"><span><b>Полноэкранный режим</b><small>Запуск игры в полноэкранном режиме (если поддерживается RAGE MP).</small></span><input type="checkbox" checked={settings.fullscreen} onChange={e => update({ fullscreen: e.target.checked })}/></label>
          <label className="field-label">ДОПОЛНИТЕЛЬНЫЕ АРГУМЕНТЫ</label><input value={settings.launchArgs} onChange={e => update({ launchArgs: e.target.value })} placeholder="Необязательно"/>
          <div className="settings-footer"><span>Изменения сохраняются локально на этом компьютере.</span><button className="play-button save-button" onClick={save}>СОХРАНИТЬ</button></div>
        </div>
      </section>}
      {notice && <div className="toast" onClick={() => setNotice('')}>{notice}<button><X size={14}/></button></div>}
    </main>
  </div>
}