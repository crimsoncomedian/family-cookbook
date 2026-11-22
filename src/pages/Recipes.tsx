import { useSearchParams } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import { searchRecipes } from '../data/recipes'
import { CATEGORIES } from '../data/types'

export default function Recipes() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const category = params.get('category') ?? ''
  const results = searchRecipes(q, category || undefined)

  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  return (
    <div className="wrap page">
      <h1 className="script section-title">Recipes</h1>
      <div className="filters">
        <input
          type="search"
          value={q}
          onChange={(e) => update('q', e.target.value)}
          placeholder="Search by name, ingredient, cuisine, or person..."
          aria-label="Search recipes"
        />
        <select
          value={category}
          onChange={(e) => update('category', e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      {results.length > 0 ? (
        <div className="cards grid">
          {results.map((r) => (
            <RecipeCard key={r.slug} recipe={r} />
          ))}
        </div>
      ) : (
        <p className="empty">
          {q || category ? 'No recipes match that search.' : 'No recipes have been added yet.'}
        </p>
      )}
    </div>
  )
}
