import enDesktop from './banner-desktop.webp'
import enMobile from './banner-mobile.webp'
import type { Lang } from '../i18n/strings'

/*
 * One banner per language. Spanish uses the English artwork until the Spanish
 * banner is added: put the new files in this folder and point `es` at them.
 */
export const banners: Record<Lang, { desktop: string; mobile: string }> = {
  en: { desktop: enDesktop, mobile: enMobile },
  es: { desktop: enDesktop, mobile: enMobile },
}
