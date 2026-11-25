/*
 * All the words the site itself uses (menus, labels, headings), in both languages.
 * Recipe text lives in each recipe's file, not here.
 * Spanish is Chilean Spanish, informal "tú".
 */

export type Lang = 'en' | 'es'
export const LANGS: Lang[] = ['en', 'es']

const en = {
  navLabel: 'Main',
  navHome: 'Home',
  navRecipes: 'Recipes',
  navContributors: 'Contributors',
  navSearchPlaceholder: 'Search recipes...',
  navSearchLabel: 'Search recipes',
  langLabel: 'Language',

  bigSearchPlaceholder: 'Search for a recipe, ingredient, or dish...',
  bigSearchLabel: 'Search for a recipe, ingredient, or dish',
  searchButton: 'Search',

  categoriesLabel: 'Recipe categories',
  cat: {
    all: 'All Recipes',
    main: 'Main Dishes',
    sides: 'Sides & Salads',
    soups: 'Soups & Stews',
    desserts: 'Desserts',
    drinks: 'Drinks',
    fusion: 'Fusion Favorites',
  },

  featured: 'Featured Recipes',
  seeAll: 'See all recipes →',
  noRecipesHome: 'No recipes have been added yet. The first family favorites will show up here soon.',

  familyTitle: 'Good Food Brings Us Together',
  familyText:
    'A family cookbook for our Chilean and American roots, our shared adventures, and all the delicious places in between.',
  familyTagline: 'Real recipes • Family • Always',

  recipesTitle: 'Recipes',
  filterPlaceholder: 'Search by name, ingredient, cuisine, or person...',
  filterLabel: 'Search recipes',
  categoryFilterLabel: 'Filter by category',
  allCategories: 'All categories',
  noMatch: 'No recipes match that search.',
  noRecipes: 'No recipes have been added yet.',

  backToAll: '← All recipes',
  prep: 'Prep',
  cook: 'Cook',
  serves: 'Serves',
  ingredients: 'Ingredients',
  instructions: 'Instructions',
  familyNotes: 'Family notes',
  notFound: 'Recipe not found',
  notFoundText: "We couldn't find that recipe.",
  browseAll: 'Browse all recipes',
  notTranslated: '',
  hr: 'hr',
  min: 'min',

  contributorsTitle: 'Contributors',
  noneShared: 'No recipes shared yet.',

  bannerAlt:
    "Donna, Olivia, Valentín, Kata, and Sean's Chilean American World Fusion Cookbook. Two Countries, Five Hearts, One Table.",
}

export type Dict = typeof en

const es: Dict = {
  navLabel: 'Principal',
  navHome: 'Inicio',
  navRecipes: 'Recetas',
  navContributors: 'Colaboradores',
  navSearchPlaceholder: 'Buscar recetas...',
  navSearchLabel: 'Buscar recetas',
  langLabel: 'Idioma',

  bigSearchPlaceholder: 'Busca una receta, ingrediente o plato...',
  bigSearchLabel: 'Busca una receta, ingrediente o plato',
  searchButton: 'Buscar',

  categoriesLabel: 'Categorías de recetas',
  cat: {
    all: 'Todas las recetas',
    main: 'Platos de fondo',
    sides: 'Acompañamientos y ensaladas',
    soups: 'Sopas y guisos',
    desserts: 'Postres',
    drinks: 'Bebidas',
    fusion: 'Favoritos fusión',
  },

  featured: 'Recetas destacadas',
  seeAll: 'Ver todas las recetas →',
  noRecipesHome: 'Aún no se han agregado recetas. Los primeros favoritos de la familia aparecerán aquí pronto.',

  familyTitle: 'La buena comida nos une',
  familyText:
    'Un recetario familiar para nuestras raíces chilenas y estadounidenses, nuestras aventuras compartidas y todos los lugares deliciosos que hay en el medio.',
  familyTagline: 'Recetas reales • Familia • Siempre',

  recipesTitle: 'Recetas',
  filterPlaceholder: 'Busca por nombre, ingrediente, cocina o persona...',
  filterLabel: 'Buscar recetas',
  categoryFilterLabel: 'Filtrar por categoría',
  allCategories: 'Todas las categorías',
  noMatch: 'Ninguna receta coincide con esa búsqueda.',
  noRecipes: 'Aún no se han agregado recetas.',

  backToAll: '← Todas las recetas',
  prep: 'Preparación',
  cook: 'Cocción',
  serves: 'Rinde',
  ingredients: 'Ingredientes',
  instructions: 'Instrucciones',
  familyNotes: 'Notas de la familia',
  notFound: 'Receta no encontrada',
  notFoundText: 'No pudimos encontrar esa receta.',
  browseAll: 'Ver todas las recetas',
  notTranslated: 'Esta receta aún no está traducida al español, así que por ahora se muestra en inglés.',
  hr: 'h',
  min: 'min',

  contributorsTitle: 'Colaboradores',
  noneShared: 'Aún no hay recetas compartidas.',

  // Describes the banner image. Update the image itself when the Spanish banner is added.
  bannerAlt:
    'Recetario fusión mundial chileno-americano de Donna, Olivia, Valentín, Kata y Sean. Dos países, cinco corazones, una mesa.',
}

export const dict: Record<Lang, Dict> = { en, es }

/** The visitor's language: their saved choice, otherwise their browser's first language. */
export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'en' || saved === 'es') return saved
  } catch {
    // Storage can be blocked (private windows); fall through to the browser setting.
  }
  const first = (navigator.languages?.[0] ?? navigator.language ?? 'en').toLowerCase()
  return first.startsWith('es') ? 'es' : 'en'
}

export function saveLang(lang: Lang) {
  try {
    localStorage.setItem('lang', lang)
  } catch {
    // Not saving is fine; the choice still applies to this visit.
  }
}
