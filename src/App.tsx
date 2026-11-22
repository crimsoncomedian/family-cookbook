import bannerDesktop from './assets/banner-desktop.webp'
import bannerMobile from './assets/banner-mobile.webp'
import './App.css'

export default function App() {
  return (
    <main>
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
      <p className="soon">The cookbook is being built. Recipes are coming soon.</p>
    </main>
  )
}
