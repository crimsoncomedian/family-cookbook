import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import bannerDesktop from '../assets/banner-desktop.webp'
import bannerMobile from '../assets/banner-mobile.webp'
import CategoryRow from '../components/CategoryRow'
import FamilyCard from '../components/FamilyCard'
import RecipeCard from '../components/RecipeCard'
import SearchBar from '../components/SearchBar'
import { getFeaturedRecipes } from '../data/recipes'

export default function Home() {
  // Picked once per visit to the page, so the cards don't reshuffle while you use it.
  const featured = useMemo(() => getFeaturedRecipes(), [])

  return (
    <>
      <picture>
        {/* The title text is part of the artwork, so it is shown as an image only. */}
        <source media="(max-width: 700px)" srcSet={bannerMobile} />
        <img
          className="banner"
          src={bannerDesktop}
          width={2000}
          height={594}
          alt="Donna, Olivia, Valentín, Kata, and Sean's Chilean American World Fusion Cookbook. Two Countries, Five Hearts, One Table."
        />
      </picture>

      <div className="wrap">
        <SearchBar />
        <CategoryRow />

        <div className="home-grid">
          <section aria-labelledby="featured-h">
            <h2 id="featured-h" className="script section-title">
              Featured Recipes
            </h2>
            {featured.length > 0 ? (
              <div className="cards">
                {featured.map((r) => (
                  <RecipeCard key={r.slug} recipe={r} />
                ))}
              </div>
            ) : (
              <p className="empty">
                No recipes have been added yet. The first family favorites will show up here soon.
              </p>
            )}
            {featured.length > 0 && (
              <p className="more">
                <Link to="/recipes">See all recipes →</Link>
              </p>
            )}
          </section>
          <FamilyCard />
        </div>
      </div>
    </>
  )
}
