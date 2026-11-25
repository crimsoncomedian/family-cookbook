import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import { LangContext } from './i18n/LangContext'
import { detectLang, type Lang } from './i18n/strings'
import Contributors from './pages/Contributors'
import Home from './pages/Home'
import RecipePage from './pages/RecipePage'
import Recipes from './pages/Recipes'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/** Everything the visitor sees, in one language. Addresses look like #/es/recipes. */
function Localized({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <LangContext.Provider value={lang}>
      <NavBar />
      <ScrollToTop />
      <main>
        <Routes>
          <Route index element={<Home />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="recipe/:slug" element={<RecipePage />} />
          <Route path="contributors" element={<Contributors />} />
          <Route path="*" element={<Navigate to={`/${lang}`} replace />} />
        </Routes>
      </main>
      <div className="textile" aria-hidden="true" />
    </LangContext.Provider>
  )
}

/** Old links with no language (like #/recipe/x) go to the visitor's language. */
function RedirectToLanguage() {
  const { pathname, search, hash } = useLocation()
  const rest = pathname === '/' ? '' : pathname
  return <Navigate to={`/${detectLang()}${rest}${search}${hash}`} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/en/*" element={<Localized lang="en" />} />
      <Route path="/es/*" element={<Localized lang="es" />} />
      <Route path="*" element={<RedirectToLanguage />} />
    </Routes>
  )
}
