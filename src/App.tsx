import { useEffect, useState } from 'react'
import { Activity, Bell, ChevronDown, Gamepad2, Globe2, Home, Monitor, Newspaper, Play, Settings, Users, Wallet, X, ExternalLink, SlidersHorizontal } from 'lucide-react'

type SettingsData = { gamePath: string; fullscreen: boolean; resolution: string; launchArgs: string }
type Page = 'home' | 'settings'
const defaults: SettingsData = { gamePath: '', fullscreen: false, resolution: '1920x1080', launchArgs: '' }

const news = [
  { tag: 'НОВОСТИ ПРОЕКТА', title: 'Добро пожаловать в Blaze5RP', date: 'НОВОСТИ', art: 'news-art-one', mark: 'B5' },
  { tag: 'ОБНОВЛЕНИЯ', title: 'Мир Blaze5RP становится ближе', date: 'ОБНОВЛЕНИЯ', art: 'news-art-two', mark: 'UPDATE' },
  { tag: 'СООБЩЕСТВО', title: 'Стань частью нашей истории', date: 'СООБЩЕСТВО', art: 'news-art-three', mark: 'RP' },
]

const watch = [
  { title: 'ЖИЗНЬ ГОРОДА', subtitle: 'Истории и события', art: 'watch-one', mark: 'CITY LIFE' },
  { title: 'СООБЩЕСТВО', subtitle: 'Игроки Blaze5RP', art: 'watch-two', mark: 'PEOPLE' },
  { title: 'РОЛЕВАЯ ИГРА', subtitle: 'Твой новый путь', art: 'watch-three', mark: 'ROLEPLAY' },
  { title: 'НОВЫЕ ВОЗМОЖНОСТИ', subtitle: 'Открой для себя мир', art: 'watch-four', mark: 'EXPLORE' },
]

export default function App() {
  const [page, setPage] = useState<Page>('home')
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
  const openCommunity = (url: string) => window.blaze.openExternal(url)
  const goHome = () => { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const scrollTo = (id: string) => {
    setPage('home')
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  return <div className="launcher">
    <aside className="sidebar">
      <button className="brand" onClick={goHome} aria-label="Blaze5RP — главная">
        <span className="brand-symbol"><i/><b>B</b></span>
        <span className="brand-word">BLAZE<span>5</span>RP<small>ROLEPLAY LAUNCHER</small></span>
      </button>
      <nav className="side-nav">
        <button className={page === 'home' ? 'nav-link selected' : 'nav-link'} onClick={goHome}><Home/>Главная</button>
        <button className="nav-link" onClick={() => setNotice('На проекте доступен один сервер — Rainbow.')}><Gamepad2/>Сервера</button>
        <button className="nav-link" onClick={() => scrollTo('news')}><Newspaper/>Новости</button>
        <button className="nav-link" onClick={() => scrollTo('community')}><Users/>Сообщества</button>
      </nav>
      <div className="sidebar-spacer"/>
      <button className="login-link" onClick={() => setNotice('Авторизация и регистрация будут подключены через сайт Blaze5RP.')}>Войти в аккаунт <ExternalLink size={13}/></button>
      <div className="sidebar-foot">BLAZE5RP <span>LAUNCHER</span></div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <div className="topbar-left"><span className="live-indicator"/>Сейчас играет: <b>—</b></div>
        <div className="topbar-right">
          <button className="top-icon" onClick={() => setPage('settings')} aria-label="Настройки"><Settings/></button>
          <button className="window-control" onClick={() => setNotice('Управление окном доступно через системные кнопки.')}>—</button>
          <button className="window-control close-control" onClick={() => setNotice('Закройте лаунчер обычным способом.')}>×</button>
        </div>
      </header>

      {page === 'home' ? <div className="home-content">
        <section className="server-banner">
          <div className="server-banner-art"><span className="banner-kicker">BLAZE5RP ROLEPLAY</span><div className="banner-title">RAINBOW</div><span className="banner-subtitle">ТВОЯ ИСТОРИЯ НАЧИНАЕТСЯ ЗДЕСЬ</span></div>
          <div className="server-online"><span className="online-light"/> <span>онлайн<br/><b>—</b></span></div>
          <button className="play-button" onClick={launch}><Play size={18} fill="currentColor"/> Играть</button>
        </section>

        <section className="news-section" id="news">
          <div className="news-grid">
            {news.map((item, index) => <article className="news-card" key={item.title}>
              <div className={`news-image ${item.art}`}><span className="image-mark">{item.mark}</span><span className="image-index">0{index + 1}</span></div>
              <div className="news-meta">{item.tag}</div>
              <h3>{item.title}</h3>
              <div className="news-date">{item.date}<span>↗</span></div>
            </article>)}
          </div>
          <button className="more-link" onClick={() => setNotice('Раздел новостей скоро появится.')}>БОЛЬШЕ НОВОСТЕЙ <span>⟶</span></button>
        </section>

        <section className="watch-section" id="community">
          <div className="section-title"><h2>ИГРАЙ И СМОТРИ</h2><span>МИР BLAZE5RP</span></div>
          <div className="watch-tabs"><button className="tab-active">Все</button><button onClick={() => setNotice('Подборка стримов скоро появится.')}>Стримы</button><button onClick={() => setNotice('Видео скоро появятся.')}>Видео</button></div>
          <div className="watch-grid">
            {watch.map(item => <article className="watch-card" key={item.title} onClick={() => setNotice('Материалы сообщества скоро появятся.')} role="button" tabIndex={0}>
              <div className={`watch-image ${item.art}`}><span>{item.mark}</span><b>{item.title}</b></div>
              <div className="watch-caption"><b>{item.title}</b><small>{item.subtitle}</small></div>
            </article>)}
          </div>
        </section>

        <section className="community-strip">
          <div><b>ПРИСОЕДИНЯЙСЯ К СООБЩЕСТВУ</b><span>Следи за новостями и общайся с игроками</span></div>
          <button onClick={() => openCommunity('https://t.me/')}><Globe2 size={16}/> Telegram</button>
          <button onClick={() => openCommunity('https://discord.com/')}><Users size={16}/> Discord</button>
        </section>
      </div> : <section className="settings-content">
        <div className="settings-heading"><span>ПАРАМЕТРЫ КЛИЕНТА</span><h1>НАСТРОЙКИ</h1><p>Настройте папку игры и параметры запуска.</p></div>
        <div className="settings-panel">
          <div className="settings-title"><SlidersHorizontal size={19}/><div><b>Параметры игры</b><small>Путь и режим отображения</small></div></div>
          <label className="field-label">ПАПКА RAGE MULTIPLAYER</label>
          <div className="path-row"><input value={settings.gamePath} readOnly placeholder="Выберите папку установки RAGE MP"/><button className="outline-button" onClick={chooseFolder}>ОБЗОР</button></div>
          <label className="field-label">РАЗРЕШЕНИЕ ЭКРАНА</label>
          <select value={settings.resolution} onChange={e => update({ resolution: e.target.value })}><option>1920x1080</option><option>1600x900</option><option>1366x768</option><option>1280x720</option></select>
          <label className="toggle-row"><span><b>Полноэкранный режим</b><small>Запуск игры в полноэкранном режиме (если поддерживается RAGE MP).</small></span><input type="checkbox" checked={settings.fullscreen} onChange={e => update({ fullscreen: e.target.checked })}/></label>
          <label className="field-label">ДОПОЛНИТЕЛЬНЫЕ АРГУМЕНТЫ</label>
          <input value={settings.launchArgs} onChange={e => update({ launchArgs: e.target.value })} placeholder="Необязательно"/>
          <div className="settings-footer"><span>Изменения сохраняются на этом компьютере.</span><button className="play-button save-button" onClick={save}>СОХРАНИТЬ</button></div>
        </div>
      </section>}
      <footer className="statusbar"><span><Activity size={13}/> МУЛЬТИПЛЕЕР НЕ ЗАПУЩЕН</span><span>BLAZE5RP © 2026</span></footer>
      {notice && <div className="toast" onClick={() => setNotice('')}>{notice}<button aria-label="Закрыть"><X size={14}/></button></div>}
    </main>
  </div>
}
