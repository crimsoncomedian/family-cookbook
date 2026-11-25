#!/usr/bin/env node
/*
 * Recipe safety check.
 *
 * Reads every recipe in src/recipes/<slug>/recipe.json and stops the build if
 * anything would break the site or leave a recipe half finished. It runs
 * automatically before every build (and so before every deploy):
 *
 *   npm run validate
 *
 * Optional: pass another folder to check, e.g. node scripts/validate-recipes.mjs some/folder
 *
 * Errors stop the build. Warnings are shown but do not.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Set to true to make a missing Spanish version stop the build instead of warning.
const REQUIRE_SPANISH = false

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const recipesDir = path.resolve(process.argv[2] ?? path.join(root, 'src/recipes'))

// The lists of people and categories live in one place (src/data/types.ts); read them from there.
const typesSource = fs.readFileSync(path.join(root, 'src/data/types.ts'), 'utf8')
function listFrom(constName, field) {
  const block = typesSource.match(new RegExp(`export const ${constName} = \\[([\\s\\S]*?)\\] as const`))
  if (!block) throw new Error(`Could not find ${constName} in src/data/types.ts`)
  return [...block[1].matchAll(new RegExp(`${field}:\\s*'([^']+)'`, 'g'))].map((m) => m[1])
}
const CONTRIBUTORS = listFrom('CONTRIBUTORS', 'name')
const CATEGORY_IDS = listFrom('CATEGORIES', 'id')

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/
const DATE = /^\d{4}-\d{2}-\d{2}$/
const NON_METRIC = /\b(cups?|tazas?|oz|ounces?|onzas?|lbs?|pounds?|inch(es)?|pulgadas?)\b|°\s?F\b/i
const TOP_KEYS = [
  'title', 'description', 'contributor', 'cuisine', 'categories', 'prepMinutes', 'cookMinutes',
  'servings', 'ingredients', 'steps', 'notes', 'featured', 'es', 'createdAt', 'updatedAt',
]
const ES_KEYS = ['title', 'description', 'servings', 'ingredients', 'steps', 'notes']
const PHOTO_WARN_BYTES = 1_000_000
const PHOTO_MAX_BYTES = 3_000_000

const isText = (v) => typeof v === 'string' && v.trim().length > 0
const isObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v)

function checkIngredients(list, where, errors) {
  if (!Array.isArray(list) || list.length === 0) return errors.push(`${where}: needs at least one ingredient`)
  list.forEach((ing, i) => {
    const at = `${where}[${i + 1}]`
    if (!isObject(ing)) return errors.push(`${at}: must be an object with an "item"`)
    if (!isText(ing.item)) errors.push(`${at}: "item" is missing or empty`)
    for (const k of ['group', 'quantity', 'unit', 'note'])
      if (k in ing && typeof ing[k] !== 'string') errors.push(`${at}: "${k}" must be text (in quotes)`)
    const extra = Object.keys(ing).filter((k) => !['group', 'quantity', 'unit', 'item', 'note'].includes(k))
    if (extra.length) errors.push(`${at}: unknown field ${extra.map((k) => `"${k}"`).join(', ')}`)
  })
}

function checkSteps(list, where, errors) {
  if (!Array.isArray(list) || list.length === 0) return errors.push(`${where}: needs at least one step`)
  list.forEach((s, i) => {
    const at = `${where}[${i + 1}]`
    if (typeof s === 'string') {
      if (!isText(s)) errors.push(`${at}: step is empty`)
    } else if (isObject(s)) {
      if (!isText(s.text)) errors.push(`${at}: "text" is missing or empty`)
      if ('group' in s && typeof s.group !== 'string') errors.push(`${at}: "group" must be text`)
      const extra = Object.keys(s).filter((k) => !['group', 'text'].includes(k))
      if (extra.length) errors.push(`${at}: unknown field ${extra.map((k) => `"${k}"`).join(', ')}`)
    } else errors.push(`${at}: step must be text or { "text": ... }`)
  })
}

/** Sizes of consecutive runs of the same section heading, e.g. [4, 3, 5, 3]. */
function sectionShape(list) {
  const shape = []
  let prev
  for (const item of list) {
    const group = isObject(item) ? item.group : undefined
    if (shape.length && group === prev) shape[shape.length - 1]++
    else shape.push(1)
    prev = group
  }
  return shape
}

function allText(es) {
  const out = [es.title, es.description, es.servings, es.notes]
  for (const i of es.ingredients ?? []) if (isObject(i)) out.push(i.group, i.quantity, i.unit, i.item, i.note)
  for (const s of es.steps ?? []) out.push(typeof s === 'string' ? s : s?.group, s?.text)
  return out.filter((t) => typeof t === 'string')
}

function checkRecipe(slug, dir) {
  const errors = []
  const warnings = []
  const file = path.join(dir, 'recipe.json')

  if (!SLUG.test(slug)) errors.push(`folder name "${slug}" should be lowercase letters, numbers and hyphens only`)
  if (!fs.existsSync(file)) return { errors: ['recipe.json is missing from this folder'], warnings }

  let data
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (e) {
    return { errors: [`recipe.json is not valid JSON (${e.message})`], warnings }
  }
  if (!isObject(data)) return { errors: ['recipe.json must contain one { ... } object'], warnings }

  const unknown = Object.keys(data).filter((k) => !TOP_KEYS.includes(k))
  if (unknown.length) errors.push(`unknown field ${unknown.map((k) => `"${k}"`).join(', ')} (typo?)`)

  if (!isText(data.title)) errors.push('"title" is missing or empty')
  if (!CONTRIBUTORS.includes(data.contributor))
    errors.push(`"contributor" must be one of: ${CONTRIBUTORS.join(', ')} (got ${JSON.stringify(data.contributor)})`)

  if (!Array.isArray(data.categories) || data.categories.length === 0) errors.push('"categories" needs at least one category')
  else {
    for (const c of data.categories) if (!CATEGORY_IDS.includes(c)) errors.push(`unknown category ${JSON.stringify(c)} (use: ${CATEGORY_IDS.join(', ')})`)
    if (new Set(data.categories).size !== data.categories.length) errors.push('"categories" lists the same category twice')
  }
  if ('cuisine' in data && !(Array.isArray(data.cuisine) && data.cuisine.every(isText))) errors.push('"cuisine" must be a list of text, e.g. ["Chilean"]')
  for (const k of ['description', 'servings', 'notes']) if (k in data && typeof data[k] !== 'string') errors.push(`"${k}" must be text`)
  for (const k of ['prepMinutes', 'cookMinutes']) if (k in data && !(Number.isInteger(data[k]) && data[k] > 0)) errors.push(`"${k}" must be a whole number of minutes`)
  if ('featured' in data && typeof data.featured !== 'boolean') errors.push('"featured" must be true or false')

  for (const k of ['createdAt', 'updatedAt']) {
    if (!DATE.test(data[k] ?? '') || Number.isNaN(Date.parse(data[k]))) errors.push(`"${k}" must be a real date like 2026-11-22`)
  }
  if (DATE.test(data.createdAt ?? '') && DATE.test(data.updatedAt ?? '') && data.updatedAt < data.createdAt)
    errors.push('"updatedAt" is earlier than "createdAt"')

  checkIngredients(data.ingredients, 'ingredients', errors)
  checkSteps(data.steps, 'steps', errors)

  // Photo (optional): at most one, and small enough to load quickly on a phone.
  const photos = fs.readdirSync(dir).filter((f) => /^photo\.(jpg|jpeg|png|webp)$/i.test(f))
  if (photos.length > 1) errors.push(`more than one photo file (${photos.join(', ')}); keep just one`)
  for (const p of photos) {
    const size = fs.statSync(path.join(dir, p)).size
    if (size > PHOTO_MAX_BYTES) errors.push(`${p} is ${(size / 1e6).toFixed(1)} MB; resize it under 3 MB (about 1600 px wide is plenty)`)
    else if (size > PHOTO_WARN_BYTES) warnings.push(`${p} is ${(size / 1e6).toFixed(1)} MB; resizing it would make the site faster on phones`)
  }

  // Spanish version
  if (!('es' in data)) {
    const msg = 'no Spanish version yet ("es" section)'
    if (REQUIRE_SPANISH) errors.push(msg)
    else warnings.push(msg)
  } else if (!isObject(data.es)) {
    errors.push('"es" must be an object with the Spanish text')
  } else {
    const es = data.es
    const esUnknown = Object.keys(es).filter((k) => !ES_KEYS.includes(k))
    if (esUnknown.length) errors.push(`es: unknown field ${esUnknown.map((k) => `"${k}"`).join(', ')} (typo?)`)
    if (!isText(es.title)) errors.push('es: "title" is missing or empty')
    for (const k of ['description', 'servings', 'notes']) if (k in es && typeof es[k] !== 'string') errors.push(`es: "${k}" must be text`)
    const before = errors.length
    checkIngredients(es.ingredients, 'es.ingredients', errors)
    checkSteps(es.steps, 'es.steps', errors)

    // The two languages must describe the same recipe.
    if (errors.length === before && Array.isArray(data.ingredients) && Array.isArray(data.steps)) {
      if (es.ingredients.length !== data.ingredients.length)
        errors.push(`English has ${data.ingredients.length} ingredients but Spanish has ${es.ingredients.length}`)
      if (es.steps.length !== data.steps.length)
        errors.push(`English has ${data.steps.length} steps but Spanish has ${es.steps.length}`)
      if (JSON.stringify(sectionShape(es.ingredients)) !== JSON.stringify(sectionShape(data.ingredients)))
        errors.push('ingredient sections (Dough, Toppings...) are grouped differently in English and Spanish')
      if (JSON.stringify(sectionShape(es.steps)) !== JSON.stringify(sectionShape(data.steps)))
        errors.push('step sections are grouped differently in English and Spanish')
    }
    if (Boolean(es.description) !== Boolean(data.description)) errors.push('description exists in only one language')
    if (Boolean(es.notes) !== Boolean(data.notes)) errors.push('notes exist in only one language')
    for (const t of allText(es)) {
      const m = t.match(NON_METRIC)
      if (m) errors.push(`Spanish still uses a non-metric unit: "${m[0]}" (use g, ml, °C)`)
    }
  }

  return { errors: [...new Set(errors)], warnings }
}

// ---- run ----
if (!fs.existsSync(recipesDir)) {
  console.log(`No recipes folder at ${recipesDir}; nothing to check.`)
  process.exit(0)
}
const folders = fs.readdirSync(recipesDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()

let failed = 0
let warned = 0
for (const slug of folders) {
  const { errors, warnings } = checkRecipe(slug, path.join(recipesDir, slug))
  if (errors.length) failed++
  if (warnings.length) warned++
  console.log(`${errors.length ? '✗' : '✓'} ${slug}`)
  for (const e of errors) console.log(`    ERROR   ${e}`)
  for (const w of warnings) console.log(`    warning ${w}`)
}

console.log(
  `\nChecked ${folders.length} recipe${folders.length === 1 ? '' : 's'}: ${folders.length - failed} ok, ${failed} with errors` +
    (warned ? `, ${warned} with warnings` : '') + '.',
)
if (failed) {
  console.log('Fix the errors above. The site was not updated.')
  process.exit(1)
}
