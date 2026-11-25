import { useState, type FormEvent } from 'react'
import { Home, Search, Users, Utensils } from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useLang } from '../i18n/LangContext'
import { LANGS, saveLang, type Lang } from '../i18n/strings'

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang, t, to } = useLang()
  const [q, setQ] = useState('')

  const links = [
    { path: '/', label: t.navHome, Icon: Home, end: true },
    { path: '/recipes', label: t.navRecipes, Icon: Utensils, end: false },
    { path: '/contributors', label: t.navContributors, Icon: Users, end: false },
  ]

  function submit(e: FormEvent) {
    e.preventDefault()
    const query = q.trim()
    navigate(query ? `${to('/recipes')}?q=${encodeURIComponent(query)}` : to('/recipes'))
  }

  /** The same page in the other language: /en/recipes?q=x becomes /es/recipes?q=x */
  function otherLanguage(target: Lang) {
    const path = location.pathname.replace(/^\/(en|es)/, `/${target}`)
    return `${path}${location.search}${location.hash}`
  }

  return (
    <header className="nav">
      <nav className="nav-links" aria-label={t.navLabel}>
        {links.map(({ path, label, Icon, end }) => (
          <NavLink key={path} to={to(path)} end={end} className="nav-link">
            <Icon size={20} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
        <div className="lang-switch" role="group" aria-label={t.langLabel}>
          {LANGS.map((l) => (
            <Link
              key={l}
              to={otherLanguage(l)}
              onClick={() => saveLang(l)}
              className={l === lang ? 'active' : ''}
              aria-current={l === lang ? 'true' : undefined}
              lang={l}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </div>
      </nav>
      <form className="nav-search" onSubmit={submit} role="search">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.navSearchPlaceholder}
          aria-label={t.navSearchLabel}
        />
      </form>
    </header>
  )
}
