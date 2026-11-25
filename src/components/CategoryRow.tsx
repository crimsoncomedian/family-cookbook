import { Beef, CakeSlice, CookingPot, CupSoda, Globe, Salad, Soup, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LangContext'
import type { Dict } from '../i18n/strings'

const ITEMS: { id: string; key: keyof Dict['cat']; Icon: LucideIcon; color: string }[] = [
  { id: '', key: 'all', Icon: CookingPot, color: '#c8102e' },
  { id: 'main', key: 'main', Icon: Beef, color: '#b5532f' },
  { id: 'sides', key: 'sides', Icon: Salad, color: '#4f7a3a' },
  { id: 'soups', key: 'soups', Icon: Soup, color: '#d98a1f' },
  { id: 'desserts', key: 'desserts', Icon: CakeSlice, color: '#c2457a' },
  { id: 'drinks', key: 'drinks', Icon: CupSoda, color: '#3f8f6a' },
  { id: 'fusion', key: 'fusion', Icon: Globe, color: '#14305a' },
]

export default function CategoryRow() {
  const { t, to } = useLang()
  return (
    <nav className="categories" aria-label={t.categoriesLabel}>
      {ITEMS.map(({ id, key, Icon, color }) => (
        <Link
          key={key}
          to={id ? `${to('/recipes')}?category=${id}` : to('/recipes')}
          className="category"
        >
          <Icon size={44} strokeWidth={1.5} color={color} aria-hidden="true" />
          <span>{t.cat[key]}</span>
        </Link>
      ))}
    </nav>
  )
}
