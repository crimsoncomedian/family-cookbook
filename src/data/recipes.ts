import { CATEGORIES, CONTRIBUTORS, type Recipe, type RecipeFile } from './types'

/*
 * The only place that knows where recipes are stored.
 * Real recipes live in src/recipes/<slug>/recipe.json (+ optional photo.*).
 * Pages call the functions below and never read files themselves.
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

export function getAllRecipes(): Recipe[] {
  return all
}

export function getRecipe(slug: string): Recipe | undefined {
  return all.find((r) => r.slug === slug)
}

/** Recipes marked featured; if none are marked yet, the newest few. */
export function getFeaturedRecipes(limit = 5): Recipe[] {
  const featured = all.filter((r) => r.featured)
  return (featured.length > 0 ? featured : all).slice(0, limit)
}

export function getRecipesByContributor(name: string): Recipe[] {
  return all.filter((r) => r.contributor === name)
}

export function contributorSlug(name: string): string | undefined {
  return CONTRIBUTORS.find((c) => c.name === name)?.slug
}

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id
}

/** Strip accents and lowercase so "Valentin" finds "Valentín". */
function norm(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export function searchRecipes(query: string, categoryId?: string): Recipe[] {
  const words = norm(query).split(/\s+/).filter(Boolean)
  return all.filter((r) => {
    if (categoryId && !r.categories.includes(categoryId as never)) return false
    if (words.length === 0) return true
    const haystack = norm(
      [
        r.title,
        r.description ?? '',
        r.contributor,
        ...(r.cuisine ?? []),
        ...r.categories.map(categoryLabel),
        ...r.ingredients.map((i) => i.item),
      ].join(' '),
    )
    return words.every((w) => haystack.includes(w))
  })
}
