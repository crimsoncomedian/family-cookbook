import { Heart, Utensils } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Recipe } from '../data/types'

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link to={`/recipe/${recipe.slug}`} className="card">
      <div className="card-photo">
        {recipe.photo ? (
          <img src={recipe.photo} alt="" loading="lazy" />
        ) : (
          <Utensils size={40} strokeWidth={1.3} aria-hidden="true" />
        )}
      </div>
      <div className="card-body">
        <h3>{recipe.title}</h3>
        <p className="by">
          <Heart size={14} fill="currentColor" aria-hidden="true" /> {recipe.contributor}
        </p>
      </div>
    </Link>
  )
}
