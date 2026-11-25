import enDesktop from './banner-desktop.webp'
import enMobile from './banner-mobile.webp'
import esDesktop from './banner-es-desktop.webp'
import esMobile from './banner-es-mobile.webp'
import type { Lang } from '../i18n/strings'

/* One banner per language: a wide one for computers and a tighter crop for phones. */
export const banners: Record<Lang, { desktop: string; mobile: string }> = {
  en: { desktop: enDesktop, mobile: enMobile },
  es: { desktop: esDesktop, mobile: esMobile },
}
