import { Clock, Heart, Users, Utensils } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { categoryLabel, contributorSlug, getRecipe } from '../data/recipes'

function minutes(n?: number) {
  if (!n) return null
  const h = Math.floor(n / 60)
  const m = n % 60
  return h ? (m ? `${h} hr ${m} min` : `${h} hr`) : `${m} min`
}

/** Split a list into runs that share the same section heading. */
function sections<T>(items: T[], groupOf: (item: T) => string | undefined) {
  const out: { group?: string; items: T[] }[] = []
  for (const item of items) {
    const group = groupOf(item)
    const last = out[out.length - 1]
    if (last && last.group === group) last.items.push(item)
    else out.push({ group, items: [item] })
  }
  return out
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
          {sections(recipe.ingredients, (i) => i.group).map((sec, n) => (
            <div key={n}>
              {sec.group && <h3 className="group-title">{sec.group}</h3>}
              <ul className="ingredients">
                {sec.items.map((i, idx) => (
                  <li key={idx}>
                    {(i.quantity || i.unit) && (
                      <strong>{[i.quantity, i.unit].filter(Boolean).join(' ')} </strong>
                    )}
                    {i.item}
                    {i.note && <em>, {i.note}</em>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
        <section>
          <h2 className="script">Instructions</h2>
          {sections(recipe.steps, (s) => (typeof s === 'string' ? undefined : s.group)).map((sec, n) => (
            <div key={n}>
              {sec.group && <h3 className="group-title">{sec.group}</h3>}
              <ol className="steps">
                {sec.items.map((s, idx) => (
                  <li key={idx}>{typeof s === 'string' ? s : s.text}</li>
                ))}
              </ol>
            </div>
          ))}
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
