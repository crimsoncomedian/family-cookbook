import { Clock, Heart, Users, Utensils } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { categoryLabel, contributorSlug, getRecipe } from '../data/recipes'

function minutes(n?: number) {
  if (!n) return null
  const h = Math.floor(n / 60)
  const m = n % 60
  return h ? (m ? `${h} hr ${m} min` : `${h} hr`) : `${m} min`
}

export default function RecipePage() {
  const { slug = '' } = useParams()
  const recipe = getRecipe(slug)

  if (!recipe) {
    return (
      <div className="wrap page">
        <h1 className="script section-title">Recipe not found</h1>
        <p className="empty">
          We couldn't find that recipe. <Link to="/recipes">Browse all recipes</Link>
        </p>
      </div>
    )
  }

  const who = contributorSlug(recipe.contributor)
  const prep = minutes(recipe.prepMinutes)
  const cook = minutes(recipe.cookMinutes)

  return (
    <article className="wrap page recipe">
      <p className="crumbs">
        <Link to="/recipes">← All recipes</Link>
      </p>
      <div className="recipe-photo">
        {recipe.photo ? (
          <img src={recipe.photo} alt={recipe.title} />
        ) : (
          <Utensils size={56} strokeWidth={1.2} aria-hidden="true" />
        )}
      </div>
      <h1 className="script recipe-title">{recipe.title}</h1>
      <p className="by">
        <Heart size={15} fill="currentColor" aria-hidden="true" />{' '}
        {who ? <Link to={`/contributors#${who}`}>{recipe.contributor}</Link> : recipe.contributor}
      </p>
      {recipe.description && <p className="lede">{recipe.description}</p>}

      <ul className="meta">
        {prep && (
          <li>
            <Clock size={16} aria-hidden="true" /> Prep {prep}
          </li>
        )}
        {cook && (
          <li>
            <Clock size={16} aria-hidden="true" /> Cook {cook}
          </li>
        )}
        {recipe.servings && (
          <li>
            <Users size={16} aria-hidden="true" /> Serves {recipe.servings}
          </li>
        )}
        {recipe.cuisine?.map((c) => (
          <li key={c} className="tag">
            {c}
          </li>
        ))}
        {recipe.categories.map((c) => (
          <li key={c} className="tag">
            {categoryLabel(c)}
          </li>
        ))}
      </ul>

      <div className="recipe-cols">
        <section>
          <h2 className="script">Ingredients</h2>
          <ul className="ingredients">
            {recipe.ingredients.map((i, idx) => (
              <li key={idx}>
                <strong>{[i.quantity, i.unit].filter(Boolean).join(' ')}</strong> {i.item}
                {i.note && <em>, {i.note}</em>}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="script">Instructions</h2>
          <ol className="steps">
            {recipe.steps.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ol>
        </section>
      </div>

      {recipe.notes && (
        <section className="notes">
          <h2 className="script">Family notes</h2>
          <p>{recipe.notes}</p>
        </section>
      )}
    </article>
  )
}
