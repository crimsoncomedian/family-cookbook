import { Beef, CakeSlice, CookingPot, Globe, Martini, Salad, Soup, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const ITEMS: { id: string; label: string; Icon: LucideIcon; color: string }[] = [
  { id: '', label: 'All Recipes', Icon: CookingPot, color: '#c8102e' },
  { id: 'main', label: 'Main Dishes', Icon: Beef, color: '#b5532f' },
  { id: 'sides', label: 'Sides & Salads', Icon: Salad, color: '#4f7a3a' },
  { id: 'soups', label: 'Soups & Stews', Icon: Soup, color: '#d98a1f' },
  { id: 'desserts', label: 'Desserts', Icon: CakeSlice, color: '#c2457a' },
  { id: 'drinks', label: 'Drinks', Icon: Martini, color: '#3f8f6a' },
  { id: 'fusion', label: 'Fusion Favorites', Icon: Globe, color: '#14305a' },
]

export default function CategoryRow() {
  return (
    <nav className="categories" aria-label="Recipe categories">
      {ITEMS.map(({ id, label, Icon, color }) => (
        <Link key={label} to={id ? `/recipes?category=${id}` : '/recipes'} className="category">
          <Icon size={44} strokeWidth={1.5} color={color} aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  )
}
