import { Utensils } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Recipe } from '../data/types'
import { useLang } from '../i18n/LangContext'

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { to } = useLang()
  return (
    <Link to={to(`/recipe/${recipe.slug}`)} className="card">
      <div className="card-photo">
        {recipe.photo ? (
          <img src={recipe.photo} alt="" loading="lazy" />
        ) : (
          <Utensils size={40} strokeWidth={1.3} aria-hidden="true" />
        )}
      </div>
      <div className="card-body">
        <h3>{recipe.title}</h3>
      </div>
    </Link>
  )
}
