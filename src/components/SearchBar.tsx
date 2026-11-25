import { useState, type FormEvent } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n/LangContext'

export default function SearchBar() {
  const navigate = useNavigate()
  const { t, to } = useLang()
  const [q, setQ] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    const query = q.trim()
    navigate(query ? `${to('/recipes')}?q=${encodeURIComponent(query)}` : to('/recipes'))
  }

  return (
    <form className="big-search" onSubmit={submit} role="search">
      <Search size={22} aria-hidden="true" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t.bigSearchPlaceholder}
        aria-label={t.bigSearchLabel}
      />
      <button type="submit">{t.searchButton}</button>
    </form>
  )
}
