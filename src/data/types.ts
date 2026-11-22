export const CONTRIBUTORS = [
  { slug: 'donna', name: 'Donna' },
  { slug: 'olivia', name: 'Olivia' },
  { slug: 'valentin', name: 'Valentín' },
  { slug: 'kata', name: 'Kata' },
  { slug: 'sean', name: 'Sean' },
] as const

export const CATEGORIES = [
  { id: 'main', label: 'Main Dishes' },
  { id: 'sides', label: 'Sides & Salads' },
  { id: 'soups', label: 'Soups & Stews' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'fusion', label: 'Fusion Favorites' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

export interface Ingredient {
  quantity?: string
  unit?: string
  item: string
  note?: string
}

/** The shape of recipe.json inside src/recipes/<slug>/ */
export interface RecipeFile {
  title: string
  description?: string
  /** Must match a contributor name exactly, e.g. "Valentín" */
  contributor: string
  cuisine?: string[]
  categories: CategoryId[]
  prepMinutes?: number
  cookMinutes?: number
  servings?: string
  ingredients: Ingredient[]
  steps: string[]
  notes?: string
  featured?: boolean
  createdAt: string
  updatedAt: string
}

export interface Recipe extends RecipeFile {
  /** The recipe's folder name, used in its web address */
  slug: string
  /** Web address of src/recipes/<slug>/photo.* if one exists */
  photo?: string
}
