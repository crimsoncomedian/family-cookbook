import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { banners } from '../assets/banners'
import CategoryRow from '../components/CategoryRow'
import FamilyCard from '../components/FamilyCard'
import RecipeCard from '../components/RecipeCard'
import SearchBar from '../components/SearchBar'
import { getFeaturedRecipes } from '../data/recipes'
import { useLang } from '../i18n/LangContext'

export default function Home() {
  const { lang, t, to } = useLang()
  // Picked once per visit to the page, so the cards don't reshuffle while you use it.
  const featured = useMemo(() => getFeaturedRecipes(lang), [lang])

  return (
    <>
      <picture>
        {/* The title text is part of the artwork, so it is shown as an image only. */}
        <source media="(max-width: 700px)" srcSet={banners[lang].mobile} />
        <img
          className="banner"
          src={banners[lang].desktop}
          width={2000}
          height={594}
          alt={t.bannerAlt}
        />
      </picture>

      <div className="wrap">
        <SearchBar />
        <CategoryRow />

        <div className="home-grid">
          <section aria-labelledby="featured-h">
            <h2 id="featured-h" className="script section-title">
              {t.featured}
            </h2>
            {featured.length > 0 ? (
              <div className="cards">
                {featured.map((r) => (
                  <RecipeCard key={r.slug} recipe={r} />
                ))}
              </div>
            ) : (
              <p className="empty">{t.noRecipesHome}</p>
            )}
            {featured.length > 0 && (
              <p className="more">
                <Link to={to('/recipes')}>{t.seeAll}</Link>
              </p>
            )}
          </section>
          <FamilyCard />
        </div>
      </div>
    </>
  )
}
