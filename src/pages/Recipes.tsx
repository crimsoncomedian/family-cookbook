import { useSearchParams } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import { searchRecipes } from '../data/recipes'
import { CATEGORIES } from '../data/types'
import { useLang } from '../i18n/LangContext'

export default function Recipes() {
  const { lang, t } = useLang()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const category = params.get('category') ?? ''
  const results = searchRecipes(q, category || undefined, lang)

  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  return (
    <div className="wrap page">
      <h1 className="script section-title">{t.recipesTitle}</h1>
      <div className="filters">
        <input
          type="search"
          value={q}
          onChange={(e) => update('q', e.target.value)}
          placeholder={t.filterPlaceholder}
          aria-label={t.filterLabel}
        />
        <select
          value={category}
          onChange={(e) => update('category', e.target.value)}
          aria-label={t.categoryFilterLabel}
        >
          <option value="">{t.allCategories}</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {t.cat[c.id]}
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
        <p className="empty">{q || category ? t.noMatch : t.noRecipes}</p>
      )}
    </div>
  )
}
