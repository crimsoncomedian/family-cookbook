import { createContext, useContext } from 'react'
import { dict, type Lang } from './strings'

export const LangContext = createContext<Lang>('en')

/** The current language, its words, and a helper that builds links like /es/recipes. */
export function useLang() {
  const lang = useContext(LangContext)
  return {
    lang,
    t: dict[lang],
    to: (path: string) => (path === '/' ? `/${lang}` : `/${lang}${path}`),
  }
}
