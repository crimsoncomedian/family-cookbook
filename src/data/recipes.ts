import { dict, type Lang } from '../i18n/strings'
import { CONTRIBUTORS, type CategoryId, type Recipe, type RecipeFile } from './types'

/*
 * The only place that knows where recipes are stored.
 * Real recipes live in src/recipes/<slug>/recipe.json (+ optional photo.*).
 * Pages call the functions below and never read files themselves.
 *
 * Every function that returns recipes takes the visitor's language and hands back
 * the recipe's text in that language. A recipe with no Spanish section falls back
 * to English and is marked translated: false.
 */

const files = import.meta.glob<RecipeFile>('/src/recipes/*/recipe.json', {
  eager: true,
  import: 'default',
})
const photos = import.meta.glob<string>('/src/recipes/*/photo.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

// Sample recipes for design testing. They exist only while developing
// (npm run dev) and are removed from the published site.
const sampleFiles = import.meta.env.DEV
  ? import.meta.glob<RecipeFile>('/src/dev-samples/*.json', { eager: true, import: 'default' })
  : {}

function slugOf(path: string) {
  const parts = path.split('/')
  return parts[parts.length - 2]
}

function fileSlug(path: string) {
  return (path.split('/').pop() ?? '').replace(/\.json$/, '')
}

const real: Recipe[] = Object.entries(files).map(([path, data]) => {
  const slug = slugOf(path)
  const photoPath = Object.keys(photos).find((p) => slugOf(p) === slug)
  return { ...data, slug, photo: photoPath ? photos[photoPath] : undefined }
})

const samples: Recipe[] = Object.entries(sampleFiles).map(([path, data]) => ({
  ...data,
  slug: fileSlug(path),
}))

const all: Recipe[] = [...real, ...samples].sort((a, b) =>
  b.updatedAt.localeCompare(a.updatedAt),
)

/** The recipe's text in the requested language (English if there is no Spanish yet). */
function localize(recipe: Recipe, lang: Lang): Recipe {
  if (lang === 'es' && recipe.es) {
    const es = recipe.es
    return {
      ...recipe,
      title: es.title,
      description: es.description,
      servings: es.servings ?? recipe.servings,
      ingredients: es.ingredients,
      steps: es.steps,
      notes: es.notes,
      translated: true,
    }
  }
  return { ...recipe, translated: lang === 'en' }
}

export function getAllRecipes(lang: Lang): Recipe[] {
  return all.map((r) => localize(r, lang))
}

export function getRecipe(slug: string, lang: Lang): Recipe | undefined {
  const found = all.find((r) => r.slug === slug)
  return found ? localize(found, lang) : undefined
}

/**
 * A random pick for the homepage, different on each visit.
 * Chooses from recipes marked featured; if none are marked, from all recipes.
 */
export function getFeaturedRecipes(lang: Lang, limit = 5): Recipe[] {
  const featured = all.filter((r) => r.featured)
  const pool = [...(featured.length > 0 ? featured : all)]
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, limit).map((r) => localize(r, lang))
}

export function getRecipesByContributor(name: string, lang: Lang): Recipe[] {
  return all.filter((r) => r.contributor === name).map((r) => localize(r, lang))
}

export function contributorSlug(name: string): string | undefined {
  return CONTRIBUTORS.find((c) => c.name === name)?.slug
}

export function categoryLabel(id: CategoryId, lang: Lang): string {
  return dict[lang].cat[id]
}

/** Strip accents and lowercase so "Valentin" finds "Valentín" and "huevo" finds "huevo". */
function norm(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/** Searches the recipe's English and Spanish text together, whichever language the site is in. */
export function searchRecipes(query: string, categoryId: string | undefined, lang: Lang): Recipe[] {
  const words = norm(query).split(/\s+/).filter(Boolean)
  return all
    .filter((r) => {
      if (categoryId && !r.categories.includes(categoryId as CategoryId)) return false
      if (words.length === 0) return true
      const haystack = norm(
        [
          r.title,
          r.description ?? '',
          r.contributor,
          ...(r.cuisine ?? []),
          ...r.categories.flatMap((c) => [categoryLabel(c, 'en'), categoryLabel(c, 'es')]),
          ...r.ingredients.map((i) => i.item),
          r.es?.title ?? '',
          r.es?.description ?? '',
          ...(r.es?.ingredients.map((i) => i.item) ?? []),
        ].join(' '),
      )
      return words.every((w) => haystack.includes(w))
    })
    .map((r) => localize(r, lang))
}
