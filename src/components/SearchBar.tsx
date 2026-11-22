import { useState, type FormEvent } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    navigate(q.trim() ? `/recipes?q=${encodeURIComponent(q.trim())}` : '/recipes')
  }

  return (
    <form className="big-search" onSubmit={submit} role="search">
      <Search size={22} aria-hidden="true" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search for a recipe, ingredient, or dish..."
        aria-label="Search for a recipe, ingredient, or dish"
      />
      <button type="submit">Search</button>
    </form>
  )
}
