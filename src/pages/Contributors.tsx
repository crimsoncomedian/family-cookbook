import RecipeCard from '../components/RecipeCard'
import { getRecipesByContributor } from '../data/recipes'
import { CONTRIBUTORS } from '../data/types'

export default function Contributors() {
  return (
    <div className="wrap page">
      <h1 className="script section-title">Contributors</h1>
      {CONTRIBUTORS.map((c) => {
        const recipes = getRecipesByContributor(c.name)
        return (
          <section key={c.slug} id={c.slug} className="contributor">
            <h2 className="script">{c.name}</h2>
            {recipes.length > 0 ? (
              <div className="cards grid">
                {recipes.map((r) => (
                  <RecipeCard key={r.slug} recipe={r} />
                ))}
              </div>
            ) : (
              <p className="empty">No recipes shared yet.</p>
            )}
          </section>
        )
      })}
    </div>
  )
}
