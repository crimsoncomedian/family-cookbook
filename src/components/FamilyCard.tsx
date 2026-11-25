import { Heart } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import { ChileFlag, Mountains, UsFlag } from './Flags'

export default function FamilyCard() {
  const { t } = useLang()
  return (
    <aside className="family-card">
      <h2 className="script">{t.familyTitle}</h2>
      <div className="rule">
        <span />
        <Heart size={14} fill="#c8102e" color="#c8102e" aria-hidden="true" />
        <span />
      </div>
      <p>{t.familyText}</p>
      <Mountains />
      <div className="flags">
        <span />
        <UsFlag />
        <Heart size={12} fill="#14305a" color="#14305a" aria-hidden="true" />
        <ChileFlag />
        <span />
      </div>
      <p className="tagline">{t.familyTagline}</p>
    </aside>
  )
}
