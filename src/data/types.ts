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

/** A step is plain text, or text with a section heading such as "Night before". */
export type Step = string | { group?: string; text: string }

export interface Ingredient {
  /** Optional section heading, e.g. "Dough" or "Toppings" */
  group?: string
  quantity?: string
  unit?: string
  item: string
  note?: string
}

/** The words of a recipe in one language. Used for the Spanish version. */
export interface RecipeText {
  title: string
  description?: string
  servings?: string
  /** Translated and converted to metric (g, ml, °C) */
  ingredients: Ingredient[]
  steps: Step[]
  notes?: string
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
  steps: Step[]
  notes?: string
  featured?: boolean
  /** Spanish version of the text. Everything else (times, categories, photo) is shared. */
  es?: RecipeText
  createdAt: string
  updatedAt: string
}

export interface Recipe extends RecipeFile {
  /** False when the visitor asked for Spanish but this recipe has no Spanish version yet */
  translated?: boolean
  /** The recipe's folder name, used in its web address */
  slug: string
  /** Web address of src/recipes/<slug>/photo.* if one exists */
  photo?: string
}
