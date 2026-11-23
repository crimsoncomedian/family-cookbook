import { useState, type FormEvent } from 'react'
import { Home, Search, Users, Utensils } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Home', Icon: Home, end: true },
  { to: '/recipes', label: 'Recipes', Icon: Utensils },
  { to: '/contributors', label: 'Contributors', Icon: Users },
]

export default function NavBar() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    navigate(q.trim() ? `/recipes?q=${encodeURIComponent(q.trim())}` : '/recipes')
  }

  return (
    <header className="nav">
      <nav className="nav-links" aria-label="Main">
        {LINKS.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end} className="nav-link">
            <Icon size={20} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <form className="nav-search" onSubmit={submit} role="search">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search recipes..."
          aria-label="Search recipes"
        />
      </form>
    </header>
  )
}
